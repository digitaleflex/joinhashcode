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

    // 2. Fix SEC-007: Use updateMany instead of per-squad loop — O(1) vs O(n) queries
    // Step A: decrement all scores (clamped to 0 via max check below)
    await prisma.organization.updateMany({
      data: { cohesionScore: { decrement: 0.1 } },
    });

    // Step B: clamp negative scores to 0
    await prisma.organization.updateMany({
      where: { cohesionScore: { lt: 0 } },
      data: { cohesionScore: 0 },
    });

    // Step C: reset streak for squads whose score dropped below 0.9
    await prisma.organization.updateMany({
      where: { cohesionScore: { lt: 0.9 } },
      data: { streakCount: 0 },
    });

    const result = await prisma.organization.count();

    logActivity({
      action: "SQUAD_DECAY",
      entity: "System",
      metadata: { squadsProcessed: result, decayAmount: 0.1 },
    });

    return NextResponse.json({
      success: true,
      message: `Décomposition de la cohésion terminée pour ${result} escouades.`,
      decayAmount: 0.1
    });
  } catch (error: unknown) {
    console.error("[CRON_SQUAD_DECAY_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors du traitement de la décomposition." }, { status: 500 });
  }
}
