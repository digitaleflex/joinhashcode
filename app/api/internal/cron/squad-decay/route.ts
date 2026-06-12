import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

/**
 * Squad Cohesion Decay Cron
 * 
 * Rules:
 * 1. Decreases cohesionScore by 0.1 for ALL squads.
 * 2. If cohesionScore < 0.9, reset streakCount to 0.
 * 3. Max score is 1.0, min is 0.0.
 * 
 * This cron should run once a day.
 */
export async function POST(req: Request) {
  try {
    // 1. Bearer Token Authentication
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    // 2. Perform global update via transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get all squads to process them
      const squads = await tx.organization.findMany({
        select: { id: true, cohesionScore: true, streakCount: true }
      });

      let updatedCount = 0;

      for (const squad of squads) {
        const newScore = Math.max(0.0, squad.cohesionScore - 0.1);
        const newStreak = newScore < 0.9 ? 0 : squad.streakCount;

        await tx.organization.update({
          where: { id: squad.id },
          data: {
            cohesionScore: newScore,
            streakCount: newStreak
          }
        });
        updatedCount++;
      }

      // 3. Log System Activity
      await logActivity({
        action: "SQUAD_DECAY",
        entity: "System",
        metadata: {
          squadsProcessed: updatedCount,
          decayAmount: 0.1
        }
      });

      return updatedCount;
    });

    return NextResponse.json({
      success: true,
      message: `Décomposition de la cohésion terminée pour ${result} escouades.`,
      decayAmount: 0.1
    });
  } catch (error) {
    console.error("[CRON_SQUAD_DECAY_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors du traitement de la décomposition." }, { status: 500 });
  }
}
