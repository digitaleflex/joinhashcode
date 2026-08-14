export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { safeAfter as after } from "@/lib/after";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { triggerNotification } from "@/lib/qstash";
import { BehavioralVitality } from "@/lib/types";
import { computeXp, type QualityLevel } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { awardXp } from "@/lib/experience";
import { z } from "zod";

const UpdateSubmissionSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(2000).optional(),
  qualityLevel: z.enum(["STANDARD", "GOOD", "EXEMPLARY"]).optional(),
  revisionNotes: z.string().max(2000).optional(),
});

export const PATCH = withAdminAuth(async (req: Request, { userId }: { userId: string }) => {
  try {

    const json = await req.json();
    const result = UpdateSubmissionSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", issues: result.error.issues }, { status: 400 });
    }

    const { action, feedback, qualityLevel, revisionNotes } = result.data;
    const id = new URL(req.url).pathname.split("/").pop()!;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: {
        mission: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            currentStreak: true,
            experience: true,
            level: true,
          },
        }
      }
    });

    if (!submission) return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return NextResponse.json({ message: "Submission already processed" }, { status: 400 });
    }

    if (action === "APPROVE") {
      // For PENDING_ADMIN (peer-reviewed CORE missions), preserve the peer's quality assessment
      // unless the admin explicitly overrides it
      const level: QualityLevel = qualityLevel ?? (submission.qualityLevel as QualityLevel) ?? "STANDARD";
      let xpAwarded = computeXp(submission.mission.xp, level);

      // Apply streak multiplier
      const userStreak = submission.user.currentStreak || 0;
      let multiplier = 1.0;
      if (userStreak >= 7) multiplier = 1.2;
      else if (userStreak >= 3) multiplier = 1.1;
      
      xpAwarded = Math.round(xpAwarded * multiplier);

      const newXp = (submission.user.experience ?? 0) + xpAwarded;

      const missionWeights: BehavioralVitality = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      // 1. Mise à jour de statut synchrone ultra-rapide
      await prisma.missionSubmission.update({
        where: { id },
        data: { status: "APPROVED", xpAwarded, qualityLevel: level, adminFeedback: feedback ?? null }
      });

      // 2. Traitements post-réponse asynchrones via Next.js 15 'after'
      await after(async () => {
        try {
          // Évolution du profil comportemental
          await updateUserEvolution(submission.userId, missionWeights);

          // Attribution XP & progression pour le submitter
          const updatedUser = await awardXp(submission.userId, xpAwarded, "MISSION_COMPLETED", submission.missionId);

          await prisma.user.update({
            where: { id: submission.userId },
            data: { missionsCompletedCount: { increment: 1 } },
          });

          // Validation du passage de niveau
          const submitterLevel = submission.user.level ?? 1;
          const newLevel = updatedUser?.level ?? submitterLevel;
          const leveledUp = newLevel > submitterLevel;

          // Notifications
          const qualityMsg = level === "EXEMPLARY" ? " Travail exemplaire !" : level === "GOOD" ? " Très bon travail !" : "";
          await triggerNotification({
            userId: submission.userId,
            type: "MISSION_APPROVED",
            title: `Mission validée : ${submission.mission.title}`,
            message: `Félicitations ! Tu as gagné +${xpAwarded} XP.${qualityMsg}`,
            link: "/missions",
            xp: xpAwarded,
          });

          if (leveledUp) {
            await triggerNotification({
              userId: submission.userId,
              type: "LEVEL_UP",
              title: `Niveau ${newLevel} atteint !`,
              message: `Tu es maintenant niveau ${newLevel}. De nouvelles missions s'ouvrent à toi.`,
              link: "/dashboard",
              newLevel,
            });

            // Envoi d'e-mail de montée de niveau
            emailService.sendLevelUp({
              email: submission.user.email,
              name: submission.user.name,
              newLevel
            }).catch(err => console.error("🔴 [Admin API Email Error] sendLevelUp:", err));
          }
        } catch (error) {
          console.error("🔴 [Admin Approve Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "APPROVE", qualityLevel: level, xpAwarded, targetUserId: submission.userId },
        request: req,
      });

      // Le client n'attend plus la résolution d'awardXp/emails pour obtenir la réponse
          const submitterLevel = submission.user.level ?? 1;
          const expectedNewXp = (submission.user.experience ?? 0) + xpAwarded;
      // Approximation simple pour la réponse immédiate (le background effectue le calcul exact et persistant)
      const leveledUpApprox = expectedNewXp >= 100; 

      return NextResponse.json({ success: true, newLevel: submitterLevel, leveledUp: leveledUpApprox, xpAwarded });
    }

    if (action === "NEEDS_REVISION") {
      await prisma.missionSubmission.update({
        where: { id },
        data: {
          status: "NEEDS_REVISION",
          adminFeedback: feedback ?? null,
          revisionNotes: revisionNotes ?? null,
          revisionCount: { increment: 1 }
        }
      });

      await after(async () => {
        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Révision requise : ${submission.mission.title}`,
            message: feedback || "Ta soumission nécessite des améliorations. Consulte le feedback.",
            link: `/missions/${submission.missionId}`
          });

          await emailService.sendMissionNeedsRevision({
            email: submission.user.email,
            name: submission.user.name,
            missionTitle: submission.mission.title,
            feedback: feedback || "Ta soumission nécessite des améliorations.",
            revisionCount: (submission.revisionCount ?? 0) + 1,
          });
        } catch (error) {
          console.error("🔴 [Admin NeedsRevision Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "NEEDS_REVISION", targetUserId: submission.userId },
        request: req,
      });

      return NextResponse.json({ success: true });
    }

    if (action === "REJECT") {
      await prisma.missionSubmission.update({
        where: { id },
        data: { status: "REJECTED", adminFeedback: feedback }
      });

      await after(async () => {
        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Mission refusée : ${submission.mission.title}`,
            message: feedback || "Ta soumission n'a pas été retenue.",
            link: "/missions"
          });

          await emailService.sendMissionRejected({
            email: submission.user.email,
            name: submission.user.name,
            missionTitle: submission.mission.title,
            feedback: feedback,
          });
        } catch (error) {
          console.error("🔴 [Admin Reject Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "REJECT", targetUserId: submission.userId },
        request: req,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN_SUBMISSION_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
});
