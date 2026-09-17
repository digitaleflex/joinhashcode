import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/admin-auth";
import { z } from "zod";
import { getStepMissionDef, computeGlobalScore, logAttemptAction, logAttemptActivity } from "@/lib/mission-engine";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import { safeAfter as after } from "@/lib/after";
import { generateProfileV1 } from "@/lib/profile-v1";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(3000).optional(),
  score: z.number().min(0).max(100).optional(),
  gridScores: z.record(z.number()).optional(),
  stepScores: z.record(z.object({ score: z.number().min(0).max(5).optional(), feedback: z.string().max(1000).optional(), status: z.enum(["APPROVED", "REVISION_REQUIRED"]).optional() })).optional(),
  reviewerId: z.string().optional(),
});

export const GET = withAdminAuth(async (req) => {
  try {
    const attemptId = new URL(req.url).pathname.split("/").pop()!;
    const attempt = await prisma.missionAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: { id: true, name: true, pseudo: true, email: true, image: true, class: true, level: true, currentSituation: true } },
        mission: { select: { id: true, title: true, slug: true, xp: true, category: true, description: true, shortDesc: true } },
        reviewer: { select: { id: true, name: true, pseudo: true } },
        stepResponses: { orderBy: { stepOrder: "asc" } },
        reviewLogs: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!attempt) return NextResponse.json({ error: "Tentative introuvable" }, { status: 404 });

    const def = getStepMissionDef(attempt.mission.slug);
    const steps = await prisma.missionStep.findMany({
      where: { missionId: attempt.missionId },
      orderBy: { stepOrder: "asc" },
    });
    const responseByStepId = new Map(attempt.stepResponses.map((r) => [r.stepId, r]));
    const stepResponses = steps.map((step) => {
      const response = responseByStepId.get(step.id);
      const stepDef = def?.subMissions.find((d) => d.key === step.key);
      return {
        stepId: step.id,
        stepOrder: step.stepOrder,
        key: step.key,
        title: step.title,
        description: step.description,
        fields: step.fields,
        scoreMax: stepDef?.scoreMax ?? 0,
        data: response?.data ?? {},
        status: response?.status ?? "DRAFT",
        score: response?.score ?? null,
        feedback: response?.feedback ?? null,
        reviewedAt: response?.reviewedAt ?? null,
      };
    });

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        status: attempt.status,
        currentStep: attempt.currentStep,
        score: attempt.score,
        decision: attempt.decision,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
        submittedAt: attempt.submittedAt,
        user: attempt.user,
        mission: attempt.mission,
        reviewer: attempt.reviewer,
        scoringGrid: def?.scoringGrid ?? null,
        maxScore: def ? def.scoringGrid.reduce((s, c) => s + c.max, 0) : 0,
        stepResponses,
        timeline: attempt.reviewLogs.map((l) => ({
          action: l.action,
          message: l.message,
          actorId: l.actorId,
          createdAt: l.createdAt,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("[ADMIN_ATTEMPT_GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
});

export const PATCH = withAdminAuth(async (req, { userId: adminUserId }) => {
  try {
    const attemptId = new URL(req.url).pathname.split("/").pop()!;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides", data: parsed.error.flatten() }, { status: 400 });

    const { action, feedback, score, gridScores, stepScores, reviewerId } = parsed.data;

    const attempt = await prisma.missionAttempt.findUnique({
      where: { id: attemptId },
      include: {
        mission: { select: { id: true, slug: true, title: true, xp: true } },
        user: { select: { id: true, email: true, name: true } },
        stepResponses: true,
      },
    });
    if (!attempt) return NextResponse.json({ error: "Tentative introuvable" }, { status: 404 });

    const def = getStepMissionDef(attempt.mission.slug);
    const maxScore = def ? def.scoringGrid.reduce((s, c) => s + c.max, 0) : 0;
    const finalScore = score ?? (gridScores ? computeGlobalScore(def?.scoringGrid ?? [], gridScores) : attempt.score);

    if (action === "APPROVE") {
      await prisma.missionAttempt.update({
        where: { id: attemptId },
        data: {
          status: "APPROVED",
          decision: "APPROVED",
          score: finalScore,
          reviewerId: adminUserId,
        },
      });

      // Scores par étape
      if (stepScores) {
        for (const [stepId, s] of Object.entries(stepScores)) {
          await prisma.missionStepResponse.updateMany({
            where: { attemptId, stepId },
            data: {
              status: s.status ?? "APPROVED",
              score: s.score,
              feedback: s.feedback ?? null,
              reviewedById: adminUserId,
              reviewedAt: new Date(),
            },
          });
        }
      }

      await logAttemptAction({
        attemptId,
        actorId: adminUserId,
        action: "APPROVED",
        message: feedback || `Mission approuvée (score ${finalScore}/${maxScore}).`,
        metadata: { score: finalScore, maxScore },
      });

      await logAttemptActivity({
        userId: attempt.userId,
        action: "ATTEMPT_APPROVED",
        entityId: attemptId,
        metadata: { score: finalScore, maxScore, reviewerId: adminUserId },
        request: req,
      });

      // XP & missionsCompletedCount dans une transaction atomique
      const mission = attempt.mission;
      if (mission.xp > 0) {
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: attempt.userId },
            data: { missionsCompletedCount: { increment: 1 } },
          });
        });
      }

      after(async () => {
        if (def) {
          await generateProfileV1({
            userId: attempt.userId,
            attemptId: attempt.id,
            mission: { id: mission.id, slug: mission.slug },
            def,
          }).catch((e) => console.error("[ATTEMPT_APPROVE] ProfileV1 error:", e));
        }

        logActivity({
          userId: attempt.userId,
          action: "PROFILE_V1_CREATED",
          entity: "profile_v1",
          entityId: attemptId,
          metadata: { missionSlug: mission.slug },
        });

        await triggerNotification({
          userId: attempt.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${mission.title}`,
          message: `Ton profil HashCode v1 a été validé.`,
          link: "/missions",
        });
        emailService.sendMissionApproval({
          email: attempt.user.email,
          name: attempt.user.name,
          missionTitle: mission.title,
          xp: mission.xp,
        }).catch(() => undefined);
      });

      return NextResponse.json({ ok: true, status: "APPROVED", score: finalScore, maxScore });
    }

    if (action === "NEEDS_REVISION") {
      if (!feedback?.trim()) {
        return NextResponse.json({ error: "Une raison est obligatoire pour demander une révision" }, { status: 400 });
      }
      await prisma.missionAttempt.update({
        where: { id: attemptId },
        data: {
          status: "REVISION_REQUIRED",
          decision: "NEEDS_REVISION",
          score: finalScore,
          reviewerId: adminUserId,
        },
      });

      if (stepScores) {
        for (const [stepId, s] of Object.entries(stepScores)) {
          await prisma.missionStepResponse.updateMany({
            where: { attemptId, stepId },
            data: {
              status: s.status ?? "REVISION_REQUIRED",
              score: s.score,
              feedback: s.feedback ?? null,
              reviewedById: adminUserId,
              reviewedAt: new Date(),
            },
          });
        }
      }

      await logAttemptAction({
        attemptId,
        actorId: adminUserId,
        action: "REVISION_REQUIRED",
        message: feedback,
      });
      await logAttemptActivity({
        userId: attempt.userId,
        action: "ATTEMPT_REVISION_REQUESTED",
        entityId: attemptId,
        metadata: { reviewerId: adminUserId },
        request: req,
      });

      after(async () => {
        await triggerNotification({
          userId: attempt.userId,
          type: "SYSTEM",
          title: "Mission à corriger",
          message: feedback,
          link: `/missions/${attempt.mission.slug}`,
        });
        emailService.sendMissionNeedsRevision({
          email: attempt.user.email,
          name: attempt.user.name,
          missionTitle: attempt.mission.title,
          feedback: feedback ?? "",
        }).catch(() => undefined);
      });

      return NextResponse.json({ ok: true, status: "REVISION_REQUIRED" });
    }

    // REJECT
    if (!feedback?.trim()) {
      return NextResponse.json({ error: "Une justification est obligatoire pour rejeter" }, { status: 400 });
    }
    await prisma.missionAttempt.update({
      where: { id: attemptId },
      data: { status: "REJECTED", decision: "REJECTED", score: finalScore, reviewerId: adminUserId },
    });
    await logAttemptAction({
      attemptId,
      actorId: adminUserId,
      action: "REJECTED",
      message: feedback,
    });
    after(async () => {
      await triggerNotification({
        userId: attempt.userId,
        type: "SYSTEM",
        title: "Mission rejetée",
        message: feedback,
        link: `/missions/${attempt.mission.slug}`,
      });
    });
    return NextResponse.json({ ok: true, status: "REJECTED" });
  } catch (error: unknown) {
    console.error("[ADMIN_ATTEMPT_PATCH]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
});
