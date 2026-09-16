import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
  }

  try {
    const now = new Date();
    const scheduledMissions = await prisma.mission.findMany({
      where: {
        status: "DRAFT",
        publishAt: { not: null, lte: now },
        deletedAt: null,
      },
      select: { id: true, title: true },
    });

    if (scheduledMissions.length === 0) {
      return NextResponse.json({
        success: true,
        publishedCount: 0,
        message: "Aucune mission à publier.",
      });
    }

    await prisma.mission.updateMany({
      where: {
        id: { in: scheduledMissions.map((m) => m.id) },
      },
      data: {
        status: "PUBLISHED",
        publishAt: now,
      },
    });

    for (const mission of scheduledMissions) {
      logActivity({
        action: "ADMIN_MISSION_PUBLISHED",
        entity: "Mission",
        entityId: mission.id,
        metadata: { missionId: mission.id, missionTitle: mission.title, trigger: "CRON_AUTO_PUBLISH" },
      });
    }

    return NextResponse.json({
      success: true,
      publishedCount: scheduledMissions.length,
      message: `${scheduledMissions.length} missions publiées automatiquement.`,
    });
  } catch (error) {
    console.error("[CRON_PUBLISH_SCHEDULED_MISSIONS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la publication des missions." }, { status: 500 });
  }
}
