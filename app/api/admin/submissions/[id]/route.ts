export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { calculateAndSetLevel } from "@/lib/evolution-utils";
import { triggerNotification } from "@/lib/qstash";
import { BehavioralVibrancy } from "@/lib/evolution";
import { computeXp, type QualityLevel } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { z } from "zod";

const UpdateSubmissionSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(2000).optional(),
  qualityLevel: z.enum(["STANDARD", "GOOD", "EXEMPLARY"]).optional(),
  revisionNotes: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const result = UpdateSubmissionSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", issues: result.error.issues }, { status: 400 });
    }

    const { action, feedback, qualityLevel, revisionNotes } = result.data;
    const { id } = await params;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: {
        mission: true,
        user: {
          include: {
            stats: true
          }
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
      const userStreak = submission.user.stats?.currentStreak || 0;
      let multiplier = 1.0;
      if (userStreak >= 7) multiplier = 1.2;
      else if (userStreak >= 3) multiplier = 1.1;
      
      xpAwarded = Math.round(xpAwarded * multiplier);

      const newXp = (submission.user.experience || 0) + xpAwarded;

      const missionWeights: BehavioralVibrancy = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      await prisma.$transaction(async (tx) => {
        await tx.missionSubmission.update({
          where: { id },
          data: { status: "APPROVED", xpAwarded, qualityLevel: level, adminFeedback: feedback ?? null }
        });
        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);
        await tx.user.update({
          where: { id: submission.userId },
          data: { experience: newXp, missionsCompletedCount: { increment: 1 } }
        });
      });

      const updatedUser = await calculateAndSetLevel(submission.userId, newXp, prisma);
      const newLevel = updatedUser?.level ?? submission.user.level;
      const leveledUp = newLevel > (submission.user.level || 1);

      try {
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
        }
      } catch (_) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      logActivity({
        userId: session.user.id,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "APPROVE", qualityLevel: level, xpAwarded, targetUserId: submission.userId },
        request: req,
      });

      if (leveledUp) {
        emailService.sendLevelUp({ email: submission.user.email, name: submission.user.name, newLevel });
      }

      return NextResponse.json({ success: true, newLevel, leveledUp, xpAwarded });
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

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "SYSTEM",
          title: `Révision requise : ${submission.mission.title}`,
          message: feedback || "Ta soumission nécessite des améliorations. Consulte le feedback.",
          link: `/missions/${submission.missionId}`
        });
      } catch (_) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      emailService.sendMissionNeedsRevision({
        email: submission.user.email,
        name: submission.user.name,
        missionTitle: submission.mission.title,
        feedback: feedback || "Ta soumission nécessite des améliorations.",
        revisionCount: (submission.revisionCount ?? 0) + 1,
      });

      await logActivity({
        userId: session.user.id,
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

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "SYSTEM",
          title: `Mission refusée : ${submission.mission.title}`,
          message: feedback || "Ta soumission n'a pas été retenue.",
          link: "/missions"
        });
      } catch (_) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      emailService.sendMissionRejected({
        email: submission.user.email,
        name: submission.user.name,
        missionTitle: submission.mission.title,
        feedback: feedback,
      });

      await logActivity({
        userId: session.user.id,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "REJECT", targetUserId: submission.userId },
        request: req,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (_) {
    console.error("[ADMIN_SUBMISSION_PATCH]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
