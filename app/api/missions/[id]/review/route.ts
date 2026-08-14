export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { safeAfter as after } from "@/lib/after";
import { z } from "zod";
import {
  getCriteriaForMission,
  computeQualityLevel,
  computeXp,
  getMissingRequiredCriteria,
} from "@/lib/acceptance-criteria";
import { triggerNotification } from "@/lib/qstash";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { BehavioralVitality } from "@/lib/types";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { awardXp } from "@/lib/experience";
import { reviewLimiter, checkRateLimit } from "@/lib/ratelimit";

const reviewSchema = z.object({
  criteria: z.record(z.boolean()),
  feedback: z.string().min(20),
  forceApprove: z.boolean().optional().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });

    const { limited } = await checkRateLimit(reviewLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de reviews. Réessaie dans une heure." }, { status: 429 });

    const { id: submissionId } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: "Données invalides. Vérifie les champs et réessaie." }, { status: 400 });

    const { criteria, feedback, forceApprove } = parsed.data;

    // Fix SEC-015: forceApprove is restricted to ADMIN only
    if (forceApprove) {
      const me = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      if (me?.role !== "ADMIN") {
        return NextResponse.json({ message: "forceApprove réservé aux administrateurs." }, { status: 403 });
      }
    }

    const submission = await prisma.missionSubmission.findUnique({
      where: { id: submissionId },
      include: { mission: true, user: { select: { level: true, name: true, email: true } } },
    });

    if (!submission) return NextResponse.json({ message: "Soumission introuvable." }, { status: 404 });
    if (submission.reviewerId !== session.user.id) {
      return NextResponse.json({ message: "Tu n'es pas le reviewer assigné à cette soumission." }, { status: 403 });
    }
    if (submission.status !== "IN_REVIEW") {
      return NextResponse.json({ message: "Cette soumission n'est pas en cours de revue." }, { status: 400 });
    }

    const missionCriteria = getCriteriaForMission(submission.mission.category);
    const missingRequired = getMissingRequiredCriteria(missionCriteria, criteria);
    const allRequiredPassed = missingRequired.length === 0;

    const reviewerXpReward = Math.round(submission.mission.xp * 0.15);
    const missionTier = submission.mission.missionLevel ?? "INIT";

    if (allRequiredPassed || forceApprove) {
      const qualityLevel = computeQualityLevel(missionCriteria, criteria);
      const xpAwarded = computeXp(submission.mission.xp, qualityLevel);

      // CORE missions: peer validation → pending admin confirmation (XP deferred)
      if (missionTier === "CORE") {
        await prisma.$transaction(async (tx) => {
          await tx.missionReview.create({
            data: { submissionId, reviewerId: session.user.id, criteria, qualityLevel, feedback },
          });
          // Store computed quality/xp but defer awarding — admin confirms
          await tx.missionSubmission.update({
            where: { id: submissionId },
            data: { status: "PENDING_ADMIN", xpAwarded, qualityLevel },
          });
          await awardXp(session.user.id, reviewerXpReward, "MISSION_REVIEWED", submissionId, tx);
          await tx.user.update({
            where: { id: session.user.id },
            data: { reviewsCompleted: { increment: 1 } },
          });
        });

        // Notify all admins (in-app + email)
        const admins = await prisma.user.findMany({
          where: { role: { in: ["ADMIN", "MODERATOR"] } },
          select: { id: true, email: true, name: true },
        });

        if (admins.length > 0) {
          try {
            await prisma.notification.createMany({
              data: admins.map((admin) => ({
                userId: admin.id,
                type: "SYSTEM",
                title: `Confirmation requise : ${submission.mission.title}`,
                message: `Mission CORE validée par pair (${submission.user.name}). Confirmation admin nécessaire.`,
                link: `/admin/submissions`,
              })),
              skipDuplicates: true,
            });
          } catch (dbErr) {
            console.error("🔴 [Review API] Failed to bulk write admin notifications:", dbErr);
          }

          admins.forEach((admin) => {
            emailService.sendAdminCoreMissionPending({
              adminEmail: admin.email,
              adminName: admin.name,
              submitterName: submission.user.name,
              missionTitle: submission.mission.title,
            }).catch((err: unknown) => console.error("[EMAIL_ERROR] sendAdminCoreMissionPending", err));
          });
        }

        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Revue pair complétée : ${submission.mission.title}`,
            message: `Ton pair a validé ta soumission. Confirmation admin en cours, tu seras notifié(e).`,
            link: `/missions/${submission.missionId}`,
          });
        } catch (error: unknown) {
          console.error("[NOTIFICATION_ERROR]", error);
        }
        logActivity({
          userId: session.user.id,
          action: "MISSION_APPROVED",
          entity: "mission_submission",
          entityId: submissionId,
          metadata: { qualityLevel, xpAwarded, tier: "CORE", status: "PENDING_ADMIN" },
          request: req,
        });

        return NextResponse.json({ success: true, qualityLevel, status: "PENDING_ADMIN" });
      }

      const missionWeights: BehavioralVitality = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      // 1. Transaction ultra-rapide (les verrous sont libérés immédiatement)
      await prisma.$transaction(async (tx) => {
        await tx.missionReview.create({
          data: { submissionId, reviewerId: session.user.id, criteria, qualityLevel, feedback },
        });
        await tx.missionSubmission.update({
          where: { id: submissionId },
          data: { status: "APPROVED", xpAwarded, qualityLevel },
        });
        await tx.user.update({
          where: { id: session.user.id },
          data: { reviewsCompleted: { increment: 1 } },
        });
      });

      // 2. Traitements post-réponse asynchrones via Next.js 15 'after'
      await after(async () => {
        try {
          // Attribution XP & progression pour le submitter
          const updatedSubmitterUser = await awardXp(submission.userId, xpAwarded, "MISSION_COMPLETED", submissionId);
          
          await prisma.user.update({
            where: { id: submission.userId },
            data: { missionsCompletedCount: { increment: 1 } },
          });

          // Attribution XP pour le reviewer
          await awardXp(session.user.id, reviewerXpReward, "MISSION_REVIEWED", submissionId);

          // Évolution du profil comportemental
          await updateUserEvolution(submission.userId, missionWeights);

          // Cohésion d'escouade
          const userMember = await prisma.member.findFirst({
            where: { userId: submission.userId },
            select: { organizationId: true }
          });
          if (userMember?.organizationId) {
            await updateSquadCohesion(userMember.organizationId, 0.1);
          }

          // Notifications
          const submitterLevel = submission.user.level ?? 1;
          const newLevel = updatedSubmitterUser?.level ?? submitterLevel;
          const didLevelUp = newLevel > submitterLevel;

          await triggerNotification({
            userId: submission.userId,
            type: "MISSION_APPROVED",
            title: `Mission validée : ${submission.mission.title}`,
            message: `Félicitations ! +${xpAwarded} XP. Niveau : ${qualityLevel}.`,
            link: `/missions/${submission.missionId}`,
            xp: xpAwarded,
          });

          if (didLevelUp) {
            await triggerNotification({
              userId: submission.userId,
              type: "LEVEL_UP",
              title: `Niveau ${newLevel} atteint !`,
              message: `Tu es maintenant niveau ${newLevel}. De nouvelles missions s'ouvrent à toi.`,
              link: "/dashboard",
              newLevel,
            });
          }
        } catch (error) {
          console.error("🔴 [Review API Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: session.user.id,
        action: "MISSION_APPROVED",
        entity: "mission_submission",
        entityId: submissionId,
        metadata: { qualityLevel, xpAwarded, tier: missionTier },
        request: req,
      });

      return NextResponse.json({ success: true, qualityLevel, xpAwarded });
    }

    const revisionNotes = missingRequired.join("\n");

    const updatedSubmission = await prisma.$transaction(async (tx) => {
      await tx.missionReview.create({
        data: {
          submissionId,
          reviewerId: session.user.id,
          criteria,
          qualityLevel: "STANDARD",
          feedback,
          revisionNotes,
        },
      });
      const updated = await tx.missionSubmission.update({
        where: { id: submissionId },
        data: { status: "NEEDS_REVISION", revisionNotes, revisionCount: { increment: 1 }, adminFeedback: feedback },
      });
      // REMOVED: reviewer XP reward here to prevent spamming 'needs revision' for XP
      return updated;
    });

    try {
      await triggerNotification({
        userId: submission.userId,
        type: "SYSTEM",
        title: `Révision requise : ${submission.mission.title}`,
        message: feedback,
        link: `/missions/${submission.missionId}`,
      });
    } catch (error: unknown) {
      console.error("[NOTIFICATION_ERROR]", error);
    }
    emailService.sendMissionNeedsRevision({
      email: submission.user.email,
      name: submission.user.name,
      missionTitle: submission.mission.title,
      feedback,
      revisionCount: updatedSubmission.revisionCount,
    }).catch((err: unknown) => console.error("[EMAIL_ERROR] sendMissionNeedsRevision", err));

    // Escalate to admin after 3 failed revisions
    if (updatedSubmission.revisionCount >= 3) {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { id: true },
      });
      for (const admin of admins) {
        try {
          await triggerNotification({
            userId: admin.id,
            type: "SYSTEM",
            title: `Escalade requise : ${submission.mission.title}`,
            message: `La soumission de ${submission.user.name} a atteint ${updatedSubmission.revisionCount} révisions sans validation. Intervention admin nécessaire.`,
            link: `/admin/submissions`,
          });
        } catch (error: unknown) {
          console.error("[NOTIFICATION_ERROR]", error);
        }

      }
    }

    return NextResponse.json({ success: true, status: "NEEDS_REVISION", missingRequired });
  } catch (error: unknown) {
    console.error("[SUBMIT_REVIEW]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
