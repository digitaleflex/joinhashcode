export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isEligibleReviewer } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";
import { claimLimiter, checkRateLimit } from "@/lib/ratelimit";
import { triggerWebhooks } from "@/lib/webhooks";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });

    const { limited } = await checkRateLimit(claimLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de claims. Réessaie dans une heure." }, { status: 429 });

    const { id: submissionId } = await params;

    const [submission, reviewer] = await Promise.all([
      prisma.missionSubmission.findUnique({
        where: { id: submissionId },
        include: { mission: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, class: true, role: true, level: true, missionsCompletedCount: true },
      }),
    ]);

    if (!submission) return NextResponse.json({ message: "Soumission introuvable." }, { status: 404 });
    if (!reviewer) return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });

    // Concierge Mode: Restrict to ADMIN or MODERATOR
    if (reviewer.role !== "ADMIN" && reviewer.role !== "MODERATOR") {
      return NextResponse.json({ message: "Le claim de mission est réservé à la modération." }, { status: 403 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json({ message: "Cette soumission n'est plus disponible pour révision." }, { status: 400 });
    }

    // PRO missions are admin-only — block peer review at claim stage
    if (submission.mission.missionLevel === "PRO") {
      return NextResponse.json({ message: "Cette mission est réservée à la validation admin. Elle ne peut pas être réclamée par un pair." }, { status: 403 });
    }

    const eligible = isEligibleReviewer({
      reviewerMissionsCompleted: reviewer.missionsCompletedCount ?? 0,
      reviewerId: reviewer.id,
      submissionUserId: submission.userId,
    });

    if (!eligible) {
      return NextResponse.json({ message: "Tu n'es pas éligible pour reviewer cette mission." }, { status: 403 });
    }

    try {
      const updated = await prisma.missionSubmission.update({
        where: { id: submissionId, status: "PENDING" },
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

      triggerWebhooks(submission.missionId, "review.started", {
        missionId: submission.missionId,
        missionTitle: submission.mission.title,
        submissionId,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name ?? reviewer.email,
        startedAt: new Date().toISOString(),
      }).catch(() => undefined);

      return NextResponse.json({ success: true, submission: updated });
    } catch (error: unknown) {
      if (error instanceof Error && (error as { code?: string }).code === "P2025") {
        return NextResponse.json({ message: "Cette soumission a déjà été réclamée ou n'est plus disponible." }, { status: 409 });
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error("[CLAIM_REVIEW]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
