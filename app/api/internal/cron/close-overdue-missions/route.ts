import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { autoCloseOverdue } from "@/lib/mission-deadlines";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
  }

  try {
    const now = new Date();
    const closedMissions = await prisma.mission.findMany({
      where: {
        status: "PUBLISHED",
        deadline: { not: null, lt: now },
      },
      select: { id: true, title: true },
    });

    const closedCount = await autoCloseOverdue();

    for (const mission of closedMissions) {
      logActivity({
        action: "ADMIN_MISSION_CLOSED",
        entity: "Mission",
        entityId: mission.id,
        metadata: { missionId: mission.id, missionTitle: mission.title, trigger: "CRON_AUTO_CLOSE" },
      });
    }

    return NextResponse.json({
      success: true,
      closedCount,
      message: `${closedCount} missions clôturées automatiquement.`,
    });
  } catch (error) {
    console.error("[CRON_CLOSE_OVERDUE_MISSIONS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la clôture des missions." }, { status: 500 });
  }
}
