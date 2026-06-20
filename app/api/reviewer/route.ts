export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isEligibleReviewer, LEVEL_REQUIREMENT } from "@/lib/acceptance-criteria";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const reviewer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, class: true, progress: { select: { level: true, missionsCompletedCount: true } } },
    });

    if (!reviewer) return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });

    const pendingSubmissions = await prisma.missionSubmission.findMany({
      where: { status: "PENDING" },
      include: {
        mission: { select: { id: true, title: true, category: true, xp: true, missionLevel: true, targetProfiles: true } },
        user: { select: { id: true, name: true, pseudo: true, progress: { select: { level: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });

    const eligible = pendingSubmissions.filter(sub => {
      const missionRequiredLevel = LEVEL_REQUIREMENT[sub.mission.missionLevel ?? "INIT"] ?? 1;
      return isEligibleReviewer({
        reviewerClass: reviewer.class,
        reviewerLevel: reviewer.progress?.level ?? 1,
        reviewerMissionsCompleted: reviewer.progress?.missionsCompletedCount ?? 0,
        reviewerId: reviewer.id,
        submissionUserId: sub.userId,
        missionTargetProfiles: sub.mission.targetProfiles,
        missionRequiredLevel,
      });
    });

    return NextResponse.json(eligible);
  } catch (error: unknown) {
    console.error("[REVIEWER_QUEUE]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
