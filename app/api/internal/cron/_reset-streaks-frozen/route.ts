import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const BATCH_SIZE = 200;
    let totalReset = 0;
    let lastId: string | undefined = undefined;

    while (true) {
      const staleUsers: Array<{ id: string; lastCheckinAt: Date | null }> = await prisma.user.findMany({
        where: {
          lastCheckinAt: { not: null },
          currentStreak: { gt: 0 },
          ...(lastId ? { id: { gt: lastId } } : {}),
        },
        select: { id: true, lastCheckinAt: true },
        take: BATCH_SIZE,
        orderBy: { id: "asc" },
      });

      if (staleUsers.length === 0) break;

      const idsToReset: string[] = [];
      for (const user of staleUsers) {
        const lastDayStr = user.lastCheckinAt!.toISOString().slice(0, 10);
        const daysDiff = Math.round(
          (new Date(todayStr).getTime() - new Date(lastDayStr).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > 1) {
          idsToReset.push(user.id);
        }
      }

      if (idsToReset.length > 0) {
        await prisma.user.updateMany({
          where: { id: { in: idsToReset } },
          data: { currentStreak: 0 },
        });
        totalReset += idsToReset.length;
      }

      lastId = staleUsers[staleUsers.length - 1].id;
    }

    return NextResponse.json({
      success: true,
      message: `${totalReset} streak(s) réinitialisé(s).`,
      reset: totalReset,
    });
  } catch (error: unknown) {
    console.error("[CRON_RESET_STREAKS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la réinitialisation des streaks." }, { status: 500 });
  }
}
