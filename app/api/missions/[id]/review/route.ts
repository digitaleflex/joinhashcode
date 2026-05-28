export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCriteriaForMission,
  computeQualityLevel,
  computeXp,
  getMissingRequiredCriteria,
} from "@/lib/acceptance-criteria";
import { triggerNotification } from "@/lib/qstash";
import { calculateAndSetLevel } from "@/lib/evolution-utils";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { BehavioralVibrancy } from "@/lib/evolution";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";

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
    if (!session) return new NextResponse("Non autorisé. Connecte-toi pour continuer.", { status: 401 });

    const { id: submissionId } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return new NextResponse("Données invalides. Vérifie les champs et réessaie.", { status: 400 });

    const { criteria, feedback, forceApprove } = parsed.data;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id: submissionId },
      include: { mission: true, user: true },
    });

    if (!submission) return new NextResponse("Soumission introuvable.", { status: 404 });
    if (submission.reviewerId !== session.user.id) {
      return new NextResponse("Tu n'es pas le reviewer assigné à cette soumission.", { status: 403 });
    }
    if (submission.status !== "IN_REVIEW") {
      return new NextResponse("Cette soumission n'est pas en cours de revue.", { status: 400 });
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
          await tx.user.update({
            where: { id: session.user.id },
            data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
          });
        });

        // Notify all admins (in-app + email)
        const admins = await prisma.user.findMany({
          where: { role: { in: ["ADMIN", "MODERATOR"] } },
          select: { id: true, email: true, name: true },
        });
        for (const admin of admins) {
          try {
            await triggerNotification({
              userId: admin.id,
              type: "SYSTEM",
              title: `Confirmation requise : ${submission.mission.title}`,
              message: `Mission CORE validée par pair (${submission.user.name}). Confirmation admin nécessaire.`,
              link: `/admin/submissions`,
            });
          } catch (err) {
            console.error("[NOTIFICATION_ERROR]", err);
          }
          emailService.sendAdminCoreMissionPending({
            adminEmail: admin.email,
            adminName: admin.name,
            submitterName: submission.user.name,
            missionTitle: submission.mission.title,
          }).catch((err: unknown) => console.error("[EMAIL_ERROR] sendAdminCoreMissionPending", err));
        }

        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Revue pair complétée : ${submission.mission.title}`,
            message: `Ton pair a validé ta soumission. Confirmation admin en cours, tu seras notifié(e).`,
            link: `/missions/${submission.missionId}`,
          });
        } catch (err) {
          console.error("[NOTIFICATION_ERROR]", err);
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

      // INIT missions: direct approval
      const newXp = (submission.user.experience || 0) + xpAwarded;

      const missionWeights: BehavioralVibrancy = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      await prisma.$transaction(async (tx) => {
        await tx.missionReview.create({
          data: { submissionId, reviewerId: session.user.id, criteria, qualityLevel, feedback },
        });
        await tx.missionSubmission.update({
          where: { id: submissionId },
          data: { status: "APPROVED", xpAwarded, qualityLevel },
        });
        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);
        await tx.user.update({
          where: { id: submission.userId },
          data: { experience: newXp, missionsCompletedCount: { increment: 1 } },
        });
        await tx.user.update({
          where: { id: session.user.id },
          data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
        });

        const userMember = await tx.member.findFirst({
          where: { userId: submission.userId },
          select: { organizationId: true }
        });
        if (userMember?.organizationId) {
          await updateSquadCohesion(userMember.organizationId, 0.1);
        }
      });

      const updatedUser = await calculateAndSetLevel(submission.userId, newXp, prisma);
      const newLevel = updatedUser?.level ?? submission.user.level;
      const didLevelUp = newLevel > (submission.user.level || 1);

      try {
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
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

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
      await tx.user.update({
        where: { id: session.user.id },
        data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
      });
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
    } catch (err) {
      console.error("[NOTIFICATION_ERROR]", err);
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
        } catch (err) {
          console.error("[NOTIFICATION_ERROR]", err);
        }
      }
    }

    return NextResponse.json({ success: true, status: "NEEDS_REVISION", missingRequired });
  } catch (error) {
    console.error("[SUBMIT_REVIEW]", error);
    return new NextResponse("Erreur système. Réessaie dans un instant.", { status: 500 });
  }
}
