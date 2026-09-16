// Génération du HashCode Profile v1 après validation de Mission 01.
// Distingue clairement : Déclaré (réponses du membre) / Observé (constats HashCode) / Démontré (validations).

import { prisma } from "./prisma";
import type { OnboardingMissionDef } from "./onboarding-mission";

export async function generateProfileV1(opts: {
  userId: string;
  attemptId: string;
  mission: { id: string; slug: string };
  def: OnboardingMissionDef;
}) {
  const { userId, attemptId, mission, def } = opts;

  const responses = await prisma.missionStepResponse.findMany({
    where: { attemptId },
    orderBy: { stepOrder: "asc" },
    include: { step: { select: { key: true } } },
  });

  const dataByStepKey: Record<string, Record<string, unknown>> = {};
  for (const r of responses) {
    const stepDef = def.subMissions.find((s) => s.key === r.step.key);
    if (stepDef) dataByStepKey[r.step.key] = (r.data as Record<string, unknown>) ?? {};
  }

  const presentation = dataByStepKey["presentation"] ?? {};
  const interets = dataByStepKey["interets"] ?? {};
  const competences = dataByStepKey["competences"] ?? {};
  const ambition = dataByStepKey["ambition"] ?? {};
  const apprentissage = dataByStepKey["apprentissage"] ?? {};
  const contribution = dataByStepKey["contribution"] ?? {};
  const attentes = dataByStepKey["attentes"] ?? {};
  const environnement = dataByStepKey["environnement"] ?? {};
  const objectif = dataByStepKey["objectif"] ?? {};
  const finale = dataByStepKey["presentation_finale"] ?? {};

  const declaredSkills: { name: string; level: string }[] = Array.isArray(competences["skills"])
    ? (competences["skills"] as { name?: string; level?: string }[])
        .filter((s): s is { name: string; level?: string } => Boolean(s && s.name))
        .map((s) => ({ name: s.name, level: s.level ?? "Découverte" }))
    : [];

  const profileData = {
    version: 1,
    sourceMission: mission.slug,
    attemptId,
    identite: {
      prenom: presentation["firstName"] ?? null,
      pseudo: presentation["pseudo"] ?? null,
      presentation: presentation["presentation"] ?? null,
    },
    parcours: {
      situation: null,
    },
    interets: {
      domains: interets["domains"] ?? [],
      pourquoi: interets["pourquoi"] ?? null,
    },
    competences: declaredSkills,
    ambition: {
      vision: ambition["vision"] ?? null,
      metier: ambition["metier"] ?? null,
      competence: ambition["competence"] ?? null,
      projet: ambition["projet"] ?? null,
      objectifPro: ambition["objectifPro"] ?? null,
    },
    apprentissage: {
      preferences: apprentissage["preferences"] ?? [],
      explique: apprentissage["explique"] ?? null,
    },
    contribution: {
      modes: contribution["modes"] ?? [],
      priorite: contribution["priorite"] ?? null,
    },
    attentes: {
      attentes: attentes["attentes"] ?? [],
      detail: attentes["detail"] ?? null,
      risque: attentes["risque"] ?? null,
    },
    environnement: environnement["env"] ?? {},
    objectif: {
      objectif: objectif["objectif"] ?? null,
      pourquoi: objectif["pourquoi"] ?? null,
    },
    presentationFinale: {
      format: finale["format"] ?? "texte",
      message: finale["message"] ?? null,
      lien: finale["lien"] ?? null,
    },
  };

  const profile = await prisma.profileV1.upsert({
    where: { userId },
    update: {
      attemptId,
      data: profileData as object,
      declaredSkills: declaredSkills as object,
    },
    create: {
      userId,
      attemptId,
      data: profileData as object,
      declaredSkills: declaredSkills as object,
    },
  });

  return profile;
}
