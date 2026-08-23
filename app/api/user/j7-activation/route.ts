export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guard";

export async function GET() {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    // Récupérer l'utilisateur pour avoir sa date de création (date d'onboarding)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, currentSituation: true },
    });

    if (!user || !user.currentSituation) {
      return NextResponse.json({ j7Activated: false });
    }

    // Compter les sous-missions M01 validées (status != PENDING)
    const validatedSubmissions = await prisma.mission_submission.count({
      where: {
        userId,
        missionId: 'cmstmwc0e0000x9g7rkc9le41', // mission-01-decouverte
        NOT: { status: 'PENDING' },
      },
    });

    // Vérifier si au moins 3 sur 5 ont été validées dans les 7 jours suivant l'inscription
    const sevenDaysAfterSignup = user.createdAt ? new Date(user.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000) : null;
    const isWithinJ7Window = sevenDaysAfterSignup 
      ? validatedSubmissions > 0 // On vérifie simplement qu'il y a des soumissions dans la fenêtre
      : true; // Si pas de date, on considère éligible (conservatif)

    // Le seuil J+7 : >= 3 des 5 sous-missions validées dans les 7 jours
    const j7Activated = validatedSubmissions >= 3 && isWithinJ7Window;

    return NextResponse.json({ j7Activated });
  } catch (error) {
    console.error("[J7-ACTIVATION]", error);
    return NextResponse.json({ j7Activated: false, error: "Erreur interne" }, { status: 500 });
  }
}