import { NextRequest, NextResponse } from "next/server";
import { applySquadCohesionDecay } from "@/lib/squad-logic";

/**
 * Endpoint de maintenance pour la cohésion des escouades.
 * Ce endpoint doit être appelé toutes les 24h par une tâche cron (ex: Vercel Cron ou QStash).
 */
export async function GET(req: NextRequest) {
  // Protection simple par clé secrète (Header auth) pour éviter les appels abusifs
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.QSTASH_TOKEN}`) {
    // En développement, on laisse passer si le token n'est pas configuré, 
    // mais en prod c'est une sécurité.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    const result = await applySquadCohesionDecay();
    return NextResponse.json({
      success: true,
      message: "Squad cohesion decay applied.",
      processed: result?.processed || 0
    });
  } catch (error) {
    console.error("[CRON_SQUAD_DECAY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
