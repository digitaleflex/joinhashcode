import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getStepMissionDef, computeStepCompleteness } from "@/lib/mission-engine";
import { buildStepPrefill } from "@/lib/mission-prefill";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

const MAX_AUTOSAVE_BYTES = 100_000; // 100 KB

const autosaveSchema = z.object({
  stepKey: z.string().min(1),
  data: z.record(z.unknown()),
}).refine(
  (val) => Buffer.byteLength(JSON.stringify(val.data), "utf-8") <= MAX_AUTOSAVE_BYTES,
  { message: `Payload trop volumineux (max ${MAX_AUTOSAVE_BYTES / 1000} KB)` },
);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
    });
    if (!mission) return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });

    const def = getStepMissionDef(mission.slug);
    if (!def) return NextResponse.json({ error: "Mission sans workflow d'étapes" }, { status: 400 });

    const attempt = await prisma.missionAttempt.findUnique({
      where: { userId_missionId: { userId: session.user.id, missionId: mission.id } },
      include: {
        stepResponses: { orderBy: { stepOrder: "asc" } },
        reviewLogs: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    const steps = await prisma.missionStep.findMany({
      where: { missionId: mission.id },
      orderBy: { stepOrder: "asc" },
    });

    if (!attempt) {
      return NextResponse.json({
        missionId: mission.id,
        slug: mission.slug,
        title: mission.title,
        shortDesc: mission.shortDesc,
        duration: def.duration,
        category: def.category,
        missionLevel: def.missionLevel,
        xpReward: def.xpReward,
        steps: def.subMissions.map((s, i) => ({
          key: s.key,
          title: s.title,
          shortTitle: s.shortTitle,
          description: s.description,
          stepOrder: i,
          fields: s.fields,
          status: "DRAFT",
          completeness: 0,
        })),
        attempt: null,
        profile: null,
        maxScore: def.scoringGrid.reduce((s, c) => s + c.max, 0),
      });
    }

    const responseByStep = new Map(attempt.stepResponses.map((r) => [r.stepId, r]));
    const stepDefById = new Map(steps.map((s) => [s.id, def.subMissions.find((d) => d.key === s.key)]));

    // ── Pré-remplissage (endowed progress) ──────────────────────────────
    // Pour la mission d'onboarding : matérialiser les données déjà collectées
    // (onboarding, quiz, spécialisation) comme réponses DRAFT. L'utilisateur
    // n'a plus qu'à confirmer — la barre démarre donc élevée.
    if (mission.isOnboarding) {
      const missingSteps = steps.filter((s) => !responseByStep.has(s.id));
      if (missingSteps.length > 0) {
        const [userData, profileData] = await Promise.all([
          prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, pseudo: true, mainObjective: true, domains: true, tools: true, class: true },
          }),
          prisma.userProfile.findUnique({
            where: { userId: session.user.id },
            select: { dreamStatement: true },
          }),
        ]);
        const prefill = buildStepPrefill({
          name: userData?.name,
          pseudo: userData?.pseudo,
          mainObjective: userData?.mainObjective,
          domains: userData?.domains ?? [],
          tools: userData?.tools ?? [],
          class: userData?.class,
          dreamStatement: profileData?.dreamStatement,
        });
        for (const step of missingSteps) {
          const data = prefill[step.key];
          const hasValue = !!data && Object.values(data).some((v) =>
            Array.isArray(v) ? v.length > 0 : (typeof v === "string" ? v.trim().length > 0 : v != null)
          );
          if (!hasValue) continue;
          await prisma.missionStepResponse.upsert({
            where: { attemptId_stepId: { attemptId: attempt.id, stepId: step.id } },
            update: {},
            create: {
              attemptId: attempt.id,
              stepId: step.id,
              stepOrder: step.stepOrder,
              data: data as object,
              status: "DRAFT",
            },
          });
          responseByStep.set(step.id, {
            id: `prefill-${step.id}`,
            attemptId: attempt.id,
            stepId: step.id,
            stepOrder: step.stepOrder,
            data: data as object,
            status: "DRAFT",
            score: null,
            feedback: null,
            reviewedAt: null,
            reviewedById: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as typeof attempt.stepResponses[number]);
        }
      }
    }

    const serializedSteps = steps.map((step) => {
      const response = responseByStep.get(step.id);
      const stepDef = stepDefById.get(step.id);
      return {
        key: step.key,
        title: step.title,
        shortTitle: stepDef?.shortTitle ?? step.title,
        description: step.description,
        stepOrder: step.stepOrder,
        fields: step.fields,
        scoreMax: stepDef?.scoreMax ?? 0,
        status: response?.status ?? "DRAFT",
        completeness: stepDef ? computeStepCompleteness(stepDef, (response?.data as Record<string, unknown>) ?? {}) : 0,
      };
    });

    return NextResponse.json({
      missionId: mission.id,
      slug: mission.slug,
      title: mission.title,
      shortDesc: mission.shortDesc,
      duration: def.duration,
      category: def.category,
      missionLevel: def.missionLevel,
      xpReward: def.xpReward,
      steps: serializedSteps,
      attempt: {
        id: attempt.id,
        status: attempt.status,
        currentStep: attempt.currentStep,
        score: attempt.score,
        decision: attempt.decision,
        reviewerId: attempt.reviewerId,
        submittedAt: attempt.submittedAt,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
        stepResponses: attempt.stepResponses.map((r) => ({
          stepId: r.stepId,
          stepKey: steps.find((s) => s.id === r.stepId)?.key ?? r.stepId,
          status: r.status,
          data: r.data,
          score: r.score,
          feedback: r.feedback,
        })),
      },
      timeline: attempt.reviewLogs.map((l) => ({
        action: l.action,
        message: l.message,
        createdAt: l.createdAt,
      })),
      profile: null,
      maxScore: def.scoringGrid.reduce((s, c) => s + c.max, 0),
    });
  } catch (error: unknown) {
    console.error("[ATTEMPT_GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_AUTOSAVE_BYTES * 2) {
      return NextResponse.json({ error: "Payload trop volumineux" }, { status: 413 });
    }

    const body = await req.json();
    const parsed = autosaveSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Action trop rapide" }, { status: 429 });

    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
    });
    if (!mission) return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });

    const def = getStepMissionDef(mission.slug);
    if (!def) return NextResponse.json({ error: "Mission sans workflow d'étapes" }, { status: 400 });

    const step = await prisma.missionStep.findFirst({
      where: { missionId: mission.id, key: parsed.data.stepKey },
    });
    if (!step) return NextResponse.json({ error: "Étape introuvable" }, { status: 404 });

    // Brouillon seulement (une soumission en review verrouille les modifications)
    const attempt = await prisma.missionAttempt.upsert({
      where: { userId_missionId: { userId: session.user.id, missionId: mission.id } },
      update: {},
      create: {
        userId: session.user.id,
        missionId: mission.id,
        status: "DRAFT",
      },
    });

    if (attempt.status !== "DRAFT" && attempt.status !== "REVISION_REQUIRED") {
      return NextResponse.json({ error: "Soumission déjà envoyée — modification impossible" }, { status: 409 });
    }

    const stepDef = def.subMissions.find((d) => d.key === parsed.data.stepKey);
    const data = parsed.data.data;
    const completeness = stepDef ? computeStepCompleteness(stepDef, data as Record<string, unknown>) : 0;

    await prisma.missionStepResponse.upsert({
      where: { attemptId_stepId: { attemptId: attempt.id, stepId: step.id } },
      update: {
        data: data as object,
        status: completeness >= 1 ? "APPROVED" : "DRAFT",
        updatedAt: new Date(),
      },
      create: {
        attemptId: attempt.id,
        stepId: step.id,
        stepOrder: step.stepOrder,
        data: data as object,
        status: completeness >= 1 ? "APPROVED" : "DRAFT",
      },
    });

    return NextResponse.json({ ok: true, saved: true, completeness });
  } catch (error: unknown) {
    console.error("[ATTEMPT_PATCH]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
