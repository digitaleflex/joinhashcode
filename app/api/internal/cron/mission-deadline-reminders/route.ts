import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { logActivity } from "@/lib/activity-log";
import { getDaysUntilDeadline } from "@/lib/mission-deadlines";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
  }

  try {
    const now = new Date();
    const deadlineThreshold = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const missionsWithDeadline = await prisma.mission.findMany({
      where: {
        status: "PUBLISHED",
        deadline: { not: null, gte: now, lte: deadlineThreshold },
      },
      select: {
        id: true,
        title: true,
        deadline: true,
        assignments: {
          select: { userId: true },
        },
      },
    });

    let remindersSent = 0;

    for (const mission of missionsWithDeadline) {
      const daysLeft = getDaysUntilDeadline(mission);
      const timeLabel =
        daysLeft !== null && daysLeft <= 1 ? "moins de 24h" : `${daysLeft} jour(s)`;

      for (const assignment of mission.assignments) {
        await triggerNotification({
          userId: assignment.userId,
          type: "SYSTEM",
          title: `Rappel : ${mission.title}`,
          message: `La deadline de cette mission est dans ${timeLabel}. Soumets ton travail avant la date limite !`,
          link: `/missions/${mission.id}`,
        });
        remindersSent++;
      }
    }

    logActivity({
      action: "CRON_MISSION_DEADLINE_REMINDERS",
      entity: "System",
      metadata: { remindersSent, missionsCount: missionsWithDeadline.length },
    });

    return NextResponse.json({
      success: true,
      remindersSent,
      missionsCount: missionsWithDeadline.length,
      message: `${remindersSent} rappels envoyés pour ${missionsWithDeadline.length} missions.`,
    });
  } catch (error) {
    console.error("[CRON_MISSION_DEADLINE_REMINDERS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de l'envoi des rappels." }, { status: 500 });
  }
}
