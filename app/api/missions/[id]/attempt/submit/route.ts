import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getStepMissionDef, logAttemptAction, logAttemptActivity } from "@/lib/mission-engine";
import { mutationLimiter, submitLimiter, checkRateLimit } from "@/lib/ratelimit";
import { safeAfter as after } from "@/lib/after";
import { generateProfileV1 } from "@/lib/profile-v1";
import { logActivity } from "@/lib/activity-log";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import { triggerWebhooks } from "@/lib/webhooks";

export const dynamic = "force-dynamic";

const submitSchema = z.object({
  stepKey: z.string().optional(),
  data: z.record(z.unknown()).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Action trop rapide" }, { status: 429 });

    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
    });
    if (!mission) return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });

    const { limited: submitLimited } = await checkRateLimit(submitLimiter, `${session.user.id}:${mission.id}`);
    if (submitLimited) return NextResponse.json({ error: "Trop de soumissions pour cette mission. Réessaie dans une heure." }, { status: 429 });

    const def = getStepMissionDef(mission.slug);
    if (!def) return NextResponse.json({ error: "Mission sans workflow d'étapes" }, { status: 400 });

    const attempt = await prisma.missionAttempt.findUnique({
      where: { userId_missionId: { userId: session.user.id, missionId: mission.id } },
      include: { stepResponses: true },
    });

    if (attempt && ["SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED"].includes(attempt.status)) {
      return NextResponse.json({ error: "Mission déjà soumise" }, { status: 409 });
    }

    const steps = await prisma.missionStep.findMany({
      where: { missionId: mission.id },
      orderBy: { stepOrder: "asc" },
    });

    // Sauvegarder la dernière étape si transmise (optionnel)
    let attemptId = attempt?.id;
    const attemptEntity = attempt ?? await prisma.missionAttempt.create({
      data: { userId: session.user.id, missionId: mission.id, status: "DRAFT" },
    });
    attemptId = attemptEntity.id;

    const body = submitSchema.safeParse(await req.json());
    const stepKey = body.success && body.data.stepKey ? body.data.stepKey : null;
    if (stepKey && body.success) {
      const step = steps.find((s) => s.key === stepKey);
      if (step) {
        await prisma.missionStepResponse.upsert({
          where: { attemptId_stepId: { attemptId, stepId: step.id } },
          update: { data: body.data.data as object, status: "DRAFT" },
          create: {
            attemptId,
            stepId: step.id,
            stepOrder: step.stepOrder,
            data: body.data.data as object,
            status: "DRAFT",
          },
        });
      }
    }

    // Relire les réponses après création/sauvegarde — sinon l'étape venant
    // d'être enregistrée serait comptée comme manquante.
    const savedResponses = await prisma.missionStepResponse.findMany({
      where: { attemptId },
    });
    const respondedStepIds = new Set(savedResponses.map((r) => r.stepId));

    const incompleteSteps = steps.filter((s) => !respondedStepIds.has(s.id));
    if (incompleteSteps.length > 0) {
      return NextResponse.json(
        { error: "Étapes incomplètes", incomplete: incompleteSteps.map((s) => s.title || s.key) },
        { status: 400 }
      );
    }

    // Verrouiller les réponses + soumettre
    await prisma.$transaction([
      prisma.missionStepResponse.updateMany({
        where: { attemptId },
        data: { status: "SUBMITTED" },
      }),
      prisma.missionAttempt.update({
        where: { id: attemptId },
        data: { status: "SUBMITTED", submittedAt: new Date(), currentStep: steps.length },
      }),
    ]);

    await logAttemptAction({
      attemptId,
      actorId: session.user.id,
      action: "SUBMITTED",
      message: "Le membre a soumis sa mission.",
    });

    // Admin notification + webhook for new submission
    after(async () => {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { id: true, email: true, name: true },
      });

      if (admins.length > 0) {
        try {
          await prisma.notification.createMany({
            data: admins.map((admin) => ({
              userId: admin.id,
              type: "SYSTEM",
              title: `Nouvelle soumission : ${mission.title}`,
              message: `${session.user.name} a soumis sa mission. En attente de revue.`,
              link: `/admin/submissions`,
            })),
            skipDuplicates: true,
          });
        } catch (dbErr) {
          console.error("[SUBMIT] Failed to bulk write admin notifications:", dbErr);
        }

        logActivity({
          userId: session.user.id,
          action: "ADMIN_SUBMISSION_ALERT",
          entity: "mission_attempt",
          entityId: attemptId,
          metadata: { missionSlug: mission.slug, submitterName: session.user.name },
          request: req,
        });
      }

      await triggerWebhooks(mission.id, "submission.created", {
        missionId: mission.id,
        missionTitle: mission.title,
        attemptId,
        submitterId: session.user.id,
        submitterName: session.user.name,
        submittedAt: new Date().toISOString(),
      });
    });

    // ── Auto-validation : les missions déclaratives (isOnboarding) ne
    // nécessitent pas de revue par les pairs. Voir evaluatorNotes de la M01 :
    // « Il ne s'agit PAS d'une évaluation de niveau. »
    if (mission.isOnboarding === true) {
      await prisma.$transaction(async (tx) => {
        await tx.missionAttempt.update({
          where: { id: attemptId },
          data: { status: "APPROVED", decision: "APPROVED" },
        });
        await tx.missionSubmission.upsert({
          where: {
            userId_missionId_cycleKey: {
              userId: session.user.id,
              missionId: mission.id,
              cycleKey: "PERMANENT",
            },
          },
          update: { status: "APPROVED", xpAwarded: mission.xp, reviewerType: "AUTO" },
          create: {
            userId: session.user.id,
            missionId: mission.id,
            status: "APPROVED",
            xpAwarded: mission.xp,
            reviewerType: "AUTO",
          },
        });
        if (mission.xp > 0) {
        }
        await tx.user.update({
          where: { id: session.user.id },
          data: { missionsCompletedCount: { increment: 1 } },
        });
      });

      await logAttemptAction({
        attemptId,
        actorId: session.user.id,
        action: "APPROVED",
        message: "Validation automatique — mission déclarative.",
        metadata: { autoApproved: true },
      });
      await logAttemptActivity({
        userId: session.user.id,
        action: "ATTEMPT_APPROVED",
        entityId: attemptId,
        metadata: { autoApproved: true },
        request: req,
      });

      after(async () => {
        if (def) {
          await generateProfileV1({
            userId: session.user.id,
            attemptId,
            mission: { id: mission.id, slug: mission.slug },
            def,
          }).catch((e) => console.error("[ATTEMPT_AUTO_APPROVE] ProfileV1 error:", e));
        }

        logActivity({
          userId: session.user.id,
          action: "MISSION_APPROVED",
          entity: "mission_attempt",
          entityId: attemptId,
          metadata: { missionSlug: mission.slug, autoApproved: true },
          request: req,
        });

        await triggerNotification({
          userId: session.user.id,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${mission.title}`,
          message: `Bienvenue officiellement. Ta prochaine mission t'attend.`,
          link: "/missions",
        }).catch(() => undefined);

        emailService.sendMissionApproval({
          email: session.user.email,
          name: session.user.name,
          missionTitle: mission.title,
          xp: mission.xp,
        }).catch(() => undefined);
      });

      return NextResponse.json({ ok: true, status: "APPROVED", autoApproved: true });
    }

    return NextResponse.json({ ok: true, status: "SUBMITTED" });
  } catch (error: unknown) {
    console.error("[ATTEMPT_SUBMIT]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
