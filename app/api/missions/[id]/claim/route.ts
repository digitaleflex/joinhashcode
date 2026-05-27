export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isEligibleReviewer, LEVEL_REQUIREMENT } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Non autorisé. Connecte-toi pour continuer.", { status: 401 });

    const { id: submissionId } = await params;

    const [submission, reviewer] = await Promise.all([
      prisma.missionSubmission.findUnique({
        where: { id: submissionId },
        include: { mission: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, class: true, level: true, missionsCompletedCount: true },
      }),
    ]);

    if (!submission) return new NextResponse("Soumission introuvable.", { status: 404 });
    if (!reviewer) return new NextResponse("Utilisateur introuvable.", { status: 404 });

    if (submission.status !== "PENDING") {
      return new NextResponse("Cette soumission n'est plus disponible pour révision.", { status: 400 });
    }

    // PRO missions are admin-only — block peer review at claim stage
    if (submission.mission.missionLevel === "PRO") {
      return new NextResponse(
        "Cette mission est réservée à la validation admin. Elle ne peut pas être réclamée par un pair.",
        { status: 403 }
      );
    }

    const missionRequiredLevel = LEVEL_REQUIREMENT[submission.mission.missionLevel ?? "INIT"] ?? 1;

    const eligible = isEligibleReviewer({
      reviewerClass: reviewer.class,
      reviewerLevel: reviewer.level,
      reviewerMissionsCompleted: reviewer.missionsCompletedCount,
      reviewerId: reviewer.id,
      submissionUserId: submission.userId,
      missionTargetProfiles: submission.mission.targetProfiles,
      missionRequiredLevel,
    });

    if (!eligible) {
      return new NextResponse("Tu n'es pas éligible pour reviewer cette mission.", { status: 403 });
    }

    const updated = await prisma.missionSubmission.update({
      where: { id: submissionId },
      data: { status: "IN_REVIEW", reviewerId: reviewer.id, reviewerType: "PEER" },
    });

    logActivity({
      userId: reviewer.id,
      action: "MISSION_CLAIMED",
      entity: "mission_submission",
      entityId: submissionId,
      metadata: { missionId: submission.missionId, missionTitle: submission.mission.title },
      request: _req,
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("[CLAIM_REVIEW]", error);
    return new NextResponse("Erreur système. Réessaie dans un instant.", { status: 500 });
  }
}
