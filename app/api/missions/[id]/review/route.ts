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
import { XP_THRESHOLDS } from "@/lib/missions";
import { triggerNotification } from "@/lib/qstash";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { BehavioralVibrancy } from "@/lib/evolution";

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
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id: submissionId } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return new NextResponse("Invalid data", { status: 400 });

    const { criteria, feedback, forceApprove } = parsed.data;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id: submissionId },
      include: { mission: true, user: true },
    });

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
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

    if (allRequiredPassed || forceApprove) {
      const qualityLevel = computeQualityLevel(missionCriteria, criteria);
      const xpAwarded = computeXp(submission.mission.xp, qualityLevel);
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
        await tx.missionReview.create({
          data: {
            submissionId,
            reviewerId: session.user.id,
            criteria,
            qualityLevel,
            feedback,
          },
        });
        await tx.missionSubmission.update({
          where: { id: submissionId },
          data: { status: "APPROVED", xpAwarded, qualityLevel },
        });
        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);
        await tx.user.update({
          where: { id: submission.userId },
          data: { experience: newXp, level: newLevel, missionsCompletedCount: { increment: 1 } },
        });
        await tx.user.update({
          where: { id: session.user.id },
          data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
        });
      });

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${submission.mission.title}`,
          message: `Félicitations ! +${xpAwarded} XP. Niveau : ${qualityLevel}.`,
          link: `/missions/${submission.missionId}`,
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true, qualityLevel, xpAwarded });
    }

    const revisionNotes = missingRequired.join("\n");

    await prisma.$transaction(async (tx) => {
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
      await tx.missionSubmission.update({
        where: { id: submissionId },
        data: { status: "NEEDS_REVISION", revisionNotes, revisionCount: { increment: 1 }, adminFeedback: feedback },
      });
      await tx.user.update({
        where: { id: session.user.id },
        data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
      });
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

    return NextResponse.json({ success: true, status: "NEEDS_REVISION", missingRequired });
  } catch (error) {
    console.error("[SUBMIT_REVIEW]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
