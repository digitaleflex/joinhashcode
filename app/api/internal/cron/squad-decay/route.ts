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

    // 2. Fix SEC-007 & optimize: Execute a single atomic PostgreSQL update instead of 3 sequential writes
    const result = await prisma.$executeRaw`
      UPDATE "organization"
      SET 
        "cohesionScore" = GREATEST(0.0, "cohesionScore" - 0.1),
        "streakCount" = CASE 
          WHEN GREATEST(0.0, "cohesionScore" - 0.1) < 0.9 THEN 0 
          ELSE "streakCount" 
        END
    `;

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
