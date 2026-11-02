import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";
import { requireSession, AuthError, checkCsrfOrigin } from "@/lib/auth-guard";
import { accountLifecycleLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function DELETE(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();

    const { limited } = await checkRateLimit(accountLifecycleLimiter, session.user.id, { failClosed: true });
    if (limited) return NextResponse.json({ message: "Trop de tentatives. Réessaie demain." }, { status: 429 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, memberNumber: true, level: true, missionsCompletedCount: true },
    });

    // Log before deletion — no PII in metadata (userId becomes null after delete via SetNull)
    logActivity({
      userId: session.user.id,
      action: "ACCOUNT_DELETED",
      entity: "user",
      entityId: session.user.id,
      metadata: { memberNumber: user?.memberNumber, level: user?.level },
      request: req,
    });

    // RGPD purge: anonymize mission attempts and submissions
    await prisma.$transaction(async (tx) => {
      // Get user's mission attempts
      const attempts = await tx.missionAttempt.findMany({
        where: { userId: session.user.id },
        select: { id: true },
      });

      const attemptIds = attempts.map((a) => a.id);

      // Anonymize step responses: clear data, set userId to null via cascade
      if (attemptIds.length > 0) {
        await tx.missionStepResponse.updateMany({
          where: { attemptId: { in: attemptIds } },
          data: {
            data: {},
            status: "DRAFT",
            score: null,
            feedback: null,
            reviewedById: null,
            reviewedAt: null,
          },
        });

        // Update attempts: anonymize
        await tx.missionAttempt.updateMany({
          where: { id: { in: attemptIds } },
          data: {
            status: "DRAFT",
            currentStep: 0,
            submittedAt: null,
            reviewerId: null,
            score: null,
            decision: null,
          },
        });
      }

      // Anonymize mission submissions: clear PII, keep aggregated stats
      await tx.missionSubmission.updateMany({
        where: { userId: session.user.id },
        data: {
          content: null,
          projectDescription: null,
          reviewerFeedback: null,
          userDifficulty: null,
          userFeedback: null,
          userRating: null,
          improvementSuggestions: null,
          adminFeedback: null,
          qualityLevel: null,
          revisionNotes: null,
          reviewerType: null,
        },
      });

      // Anonymize mission reviews given by this user
      await tx.missionReview.updateMany({
        where: { reviewerId: session.user.id },
        data: {
          reviewerId: null,
          feedback: "[Anonymisé suite à suppression du compte]",
        },
      });

      // Anonymize review logs
      await tx.missionReviewLog.updateMany({
        where: { actorId: session.user.id },
        data: {
          actorId: null,
          message: "[Anonymisé suite à suppression du compte]",
        },
      });

      // Delete user (cascades to related records)
      await tx.user.delete({ where: { id: session.user.id } });
    });

    // Log RGPD purge activity
    logActivity({
      userId: null,
      action: "USER_DATA_PURGED",
      entity: "user",
      entityId: session.user.id,
      metadata: { memberNumber: user?.memberNumber, level: user?.level, missionsCompletedCount: user?.missionsCompletedCount },
      request: req,
    });

    if (user) {
      // Confirmation to the user
      emailService.sendAccountDeleted({ email: user.email, name: user.name });

      // Notify all admins
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { email: true, name: true },
      });
      for (const admin of admins) {
        emailService.sendAdminAccountDeleted({
          adminEmail: admin.email,
          adminName: admin.name,
          deletedName: user.name,
          deletedEmail: user.email,
          memberNumber: user.memberNumber,
          level: user.level ?? 1,
          missionsCount: user.missionsCompletedCount ?? 0,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[USER_DELETE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
