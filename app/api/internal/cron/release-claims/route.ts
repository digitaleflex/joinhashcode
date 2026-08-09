import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

const BATCH_SIZE = 100;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000);
    let releasedCount = 0;
    let lastId: string | undefined;

    while (true) {
      const submissions = await prisma.missionSubmission.findMany({
        where: {
          status: "IN_REVIEW",
          reviewerId: { not: null },
          updatedAt: { lt: cutoff },
        },
        select: { id: true, userId: true, missionId: true },
        take: BATCH_SIZE,
        orderBy: { updatedAt: "asc" },
        ...(lastId ? { cursor: { id: lastId }, skip: 0 } : {}),
      });

      if (submissions.length === 0) break;

      const ids = submissions.map((s) => s.id);

      await prisma.missionSubmission.updateMany({
        where: { id: { in: ids } },
        data: { status: "PENDING", reviewerId: null },
      });

      releasedCount += submissions.length;

      for (const sub of submissions) {
        logActivity({
          action: "CLAIM_RELEASED",
          entity: "mission_submission",
          entityId: sub.id,
          metadata: { userId: sub.userId, missionId: sub.missionId },
        });
      }

      lastId = submissions[submissions.length - 1].id;
    }

    return NextResponse.json({
      released: releasedCount,
    });
  } catch (error: unknown) {
    console.error("[CRON_RELEASE_CLAIMS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la libération des claims." }, { status: 500 });
  }
}
