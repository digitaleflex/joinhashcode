export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { XP_THRESHOLDS } from "@/lib/missions";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { triggerNotification } from "@/lib/qstash";
import { BehavioralVibrancy } from "@/lib/evolution";
import { computeXp, type QualityLevel } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";
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
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return new NextResponse("Forbidden", { status: 403 });
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
      include: { mission: true, user: true }
    });

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return new NextResponse("Submission already processed", { status: 400 });
    }

    if (action === "APPROVE") {
      const level: QualityLevel = qualityLevel ?? "STANDARD";
      let xpAwarded = computeXp(submission.mission.xp, level);

      // Apply streak multiplier
      const userStreak = submission.user.currentStreak || 0;
      let multiplier = 1.0;
      if (userStreak >= 7) multiplier = 1.2;
      else if (userStreak >= 3) multiplier = 1.1;
      
      xpAwarded = Math.round(xpAwarded * multiplier);

      const newXp = (submission.user.experience || 0) + xpAwarded;

      let newLevel = submission.user.level || 1;
      for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS)) {
        const levelNum = parseInt(levelStr);
        if (newXp >= threshold && levelNum > newLevel) newLevel = levelNum;
      }

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
          data: { experience: newXp, level: newLevel, missionsCompletedCount: { increment: 1 } }
        });
      });

      try {
        const qualityMsg = level === "EXEMPLARY" ? " Travail exemplaire !" : level === "GOOD" ? " Très bon travail !" : "";
        await triggerNotification({
          userId: submission.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${submission.mission.title}`,
          message: `Félicitations ! Tu as gagné +${xpAwarded} XP.${qualityMsg}`,
          link: "/missions"
        });
      } catch (err) {
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

      return NextResponse.json({ success: true, newLevel, leveledUp: newLevel > (submission.user.level || 1), xpAwarded });
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
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

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
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[ADMIN_SUBMISSION_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
