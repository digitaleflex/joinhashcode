import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { XP_THRESHOLDS } from "@/lib/missions";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { triggerNotification } from "@/lib/qstash";
import { BehavioralVibrancy } from "@/lib/evolution";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) return new NextResponse("Forbidden", { status: 403 });

    const body = await req.json();
    const { action, feedback } = body;
    const { id } = await params;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: { mission: true, user: true }
    });

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
    if (submission.status !== "PENDING") return new NextResponse("Submission already processed", { status: 400 });

    if (action === "APPROVE") {
      const newXp = (submission.user.experience || 0) + (submission.mission.xp || 0);
      let newLevel = submission.user.level || 1;
      
      for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS)) {
        const levelNum = parseInt(levelStr);
        if (newXp >= threshold && levelNum > newLevel) {
          newLevel = levelNum;
        }
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
          data: { status: "APPROVED", xpAwarded: submission.mission.xp }
        });

        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);

        await tx.user.update({
          where: { id: submission.userId },
          data: {
            experience: newXp,
            level: newLevel,
            missionsCompletedCount: { increment: 1 }
          }
        });
      });

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${submission.mission.title}`,
          message: `Félicitations ! Tu as gagné +${submission.mission.xp} XP.`,
          link: "/missions"
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true, newLevel, leveledUp: newLevel > (submission.user.level || 1) });
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
          message: feedback || "Ta soumission n'a pas été retenue. Regarde le feedback de l'admin.",
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
