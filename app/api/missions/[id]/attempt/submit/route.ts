import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getStepMissionDef, isStepComplete, logAttemptAction } from "@/lib/mission-engine";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";

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
        const existing = attempt?.stepResponses.find((r) => r.stepId === step.id);
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

    // Vérifier que toutes les étapes requises sont complètes
    const responses = await prisma.missionStepResponse.findMany({
      where: { attemptId },
    });
    const responseByStepId = new Map(responses.map((r) => [r.stepId, r.data as Record<string, unknown>]));
    const stepDefById = new Map(def.steps.map((s) => [s.key, s]));
    const incomplete: string[] = [];
    for (const step of steps) {
      const stepDef = stepDefById.get(step.key);
      if (!stepDef) continue;
      const data = responseByStepId.get(step.id) ?? {};
      if (!isStepComplete(stepDef, data)) incomplete.push(step.title);
    }

    if (incomplete.length > 0) {
      return NextResponse.json(
        { error: "Étapes incomplètes", incomplete },
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

    return NextResponse.json({ ok: true, status: "SUBMITTED" });
  } catch (error: unknown) {
    console.error("[ATTEMPT_SUBMIT]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
