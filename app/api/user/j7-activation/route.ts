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

    // Signal d'activation (D1) : première soumission de lab (statut SUBMITTED)
    // dans les 7 jours suivant l'inscription.
    const sevenDaysAfterSignup = user.createdAt
      ? new Date(user.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
      : null;

    const submittedCount = await prisma.missionSubmission.count({
      where: {
        userId,
        status: { in: ["SUBMITTED", "IN_REVIEW", "APPROVED", "NEEDS_REVISION"] },
        createdAt: sevenDaysAfterSignup ? { lte: sevenDaysAfterSignup } : undefined,
      },
    });

    // Le seuil J+7 : au moins 1 soumission de lab dans les 7 jours
    const j7Activated = submittedCount >= 1;

    if (j7Activated) {
      prisma.user.update({ where: { id: userId }, data: { j7Activated: true } }).catch(() => {});
    }

    return NextResponse.json({ j7Activated });
  } catch (error) {
    console.error("[J7-ACTIVATION]", error);
    return NextResponse.json({ j7Activated: false, error: "Erreur interne" }, { status: 500 });
  }
}