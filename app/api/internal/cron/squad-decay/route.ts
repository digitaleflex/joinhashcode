import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

const BATCH_SIZE = 100;
const DECAY_RATE = 0.02;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let decayedCount = 0;
    let totalCohesionLost = 0;
    let lastId: string | undefined;

    while (true) {
      const orgs = await prisma.organization.findMany({
        where: {
          cohesionScore: { gt: 0 },
          lastStreakAt: { not: null, lt: cutoff },
        },
        select: { id: true, cohesionScore: true, lastStreakAt: true, name: true },
        take: BATCH_SIZE,
        orderBy: { id: "asc" },
        ...(lastId ? { cursor: { id: lastId }, skip: 0 } : {}),
      });

      if (orgs.length === 0) break;

      const highOrgs = orgs.filter((o) => o.cohesionScore > DECAY_RATE);
      const lowOrgs = orgs.filter((o) => o.cohesionScore > 0 && o.cohesionScore <= DECAY_RATE);

      if (highOrgs.length > 0) {
        await prisma.organization.updateMany({
          where: { id: { in: highOrgs.map((o) => o.id) } },
          data: { cohesionScore: { decrement: DECAY_RATE } },
        });
        decayedCount += highOrgs.length;
        totalCohesionLost += highOrgs.length * DECAY_RATE;
      }

      if (lowOrgs.length > 0) {
        const lost = lowOrgs.reduce((sum, o) => sum + o.cohesionScore, 0);
        await prisma.organization.updateMany({
          where: { id: { in: lowOrgs.map((o) => o.id) } },
          data: { cohesionScore: 0 },
        });
        decayedCount += lowOrgs.length;
        totalCohesionLost += lost;
      }

      for (const org of [...highOrgs, ...lowOrgs]) {
        logActivity({
          action: "SQUAD_DECAY",
          entity: "organization",
          entityId: org.id,
          metadata: {
            squadName: org.name,
            oldScore: org.cohesionScore,
            newScore: org.cohesionScore <= DECAY_RATE ? 0 : org.cohesionScore - DECAY_RATE,
            decay: org.cohesionScore <= DECAY_RATE ? org.cohesionScore : DECAY_RATE,
            streakBlocked: org.cohesionScore - DECAY_RATE < 0.9,
          },
        });
      }

      lastId = orgs[orgs.length - 1].id;
    }

    return NextResponse.json({
      decayed: decayedCount,
      totalCohesionLost,
    });
  } catch (error: unknown) {
    console.error("[CRON_SQUAD_DECAY_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la décroissance de cohésion." }, { status: 500 });
  }
}
