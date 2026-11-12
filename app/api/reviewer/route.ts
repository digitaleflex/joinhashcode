export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getClaimDecision } from "@/lib/review-access";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const reviewer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, missionsCompletedCount: true },
    });

    if (!reviewer) return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });

    const pendingSubmissions = await prisma.missionSubmission.findMany({
      where: { status: "PENDING" },
      include: {
        mission: { select: { id: true, title: true, category: true, xp: true, missionLevel: true, targetProfiles: true } },
        user: { select: { id: true, name: true, pseudo: true, level: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const eligible = pendingSubmissions.filter(sub => getClaimDecision({ reviewer, submission: sub }).ok);

    return NextResponse.json(eligible);
  } catch (error: unknown) {
    console.error("[REVIEWER_QUEUE]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
