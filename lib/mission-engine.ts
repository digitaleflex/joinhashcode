// Moteur de mission à étapes (onboarding).
// Générique : fonctionne pour Mission 01 et toutes les futures missions à étapes.

import { logActivity } from "./activity-log";
import { ONBOARDING_MISSION } from "./onboarding-mission";
import type { OnboardingMissionDef, MissionSubDef, StepField } from "./onboarding-mission";
import { PROJECT_MISSION } from "./project-mission";
import { SOLUTION_MISSION } from "./solution-mission";
import type { MediaFile } from "./mission-media";
import { Prisma } from "../generated/prisma/client";

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "REVISION_REQUIRED"
  | "APPROVED"
  | "REJECTED";

export type StepStatus = "DRAFT" | "APPROVED" | "REVISION_REQUIRED";

// Résolveur de définition : renvoie la config d'une mission à étapes par slug.
// Extensible : ajouter d'autres définitions ici pour les missions N.
export function getStepMissionDef(slug: string | null | undefined): OnboardingMissionDef | null {
  if (!slug) return null;
  if (slug === ONBOARDING_MISSION.slug) return ONBOARDING_MISSION;
  if (slug === PROJECT_MISSION.slug) return PROJECT_MISSION;
  if (slug === SOLUTION_MISSION.slug) return SOLUTION_MISSION;
  return null;
}

export function isStepMission(slug: string | null | undefined): boolean {
  return getStepMissionDef(slug) !== null;
}

// ── Progression ─────────────────────────────────────────────────────────────

export function computeStepCompleteness(
  step: MissionSubDef,
  data: Record<string, unknown>
): number {
  if (!step.fields || step.fields.length === 0) return data && Object.keys(data).length > 0 ? 1 : 0;
  const requiredFields = step.fields.filter((f) => f.required);
  if (requiredFields.length === 0) {
    if (step.fields.length === 0) return 1;
    const filled = step.fields.filter((f) => isFieldFilled(f, data?.[f.key])).length;
    // Étape 100% optionnelle : complète dès qu'au moins un champ est rempli.
    return filled > 0 ? 1 : 0;
  }
  const filledRequired = requiredFields.filter((f) => isFieldFilled(f, data?.[f.key])).length;
  return filledRequired / requiredFields.length;
}

export function isStepComplete(
  step: MissionSubDef,
  data: Record<string, unknown>
): boolean {
  return computeStepCompleteness(step, data) >= 1;
}

function isFieldFilled(field: StepField, value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (field.type === "SLIDER") {
    return typeof value === "number" && value >= (field.min ?? 0);
  }
  if (field.type === "SCORED_CRITERIA") {
    if (typeof value !== "object" || Array.isArray(value)) return false;
    const criteria = field.criteria ?? [];
    if (criteria.length === 0) return true;
    const record = value as Record<string, { score?: number; justification?: string }>;
    // Chaque critère doit avoir une note et une justification.
    return criteria.every((c) => {
      const entry = record[c.key];
      return !!entry && typeof entry.score === "number" && typeof entry.justification === "string" && entry.justification.trim().length > 0;
    });
  }
  if (field.type === "SOLUTIONS_TABLE" || field.type === "RISK_TABLE") {
    const arr = value as { nom?: string }[];
    if (!Array.isArray(arr)) return false;
    const min = field.minItems ?? 1;
    const filled = arr.filter((r) => (r.nom ?? "").trim().length > 0).length;
    return filled >= min;
  }
  if (field.type === "EISENHOWER") {
    if (typeof value !== "object" || Array.isArray(value)) return false;
    const quadrants = value as Record<string, string[]>;
    const hasActions = Object.values(quadrants).some((q) => Array.isArray(q) && q.length > 0);
    if (!hasActions) return false;
    // Action la plus importante exigée dans le même champ data["actionPrincipale"].
    return true;
  }
  if (field.type === "ROADMAP") {
    const arr = value as { objectif?: string }[];
    if (!Array.isArray(arr)) return false;
    const min = field.minItems ?? 6;
    const filled = arr.filter((m) => (m.objectif ?? "").trim().length > 0).length;
    return filled >= min;
  }
  if (field.type === "SMART_GOALS") {
    const arr = value as { objectif?: string; indicateur?: string; date?: string }[];
    if (!Array.isArray(arr)) return false;
    const min = field.minItems ?? 3;
    const filled = arr.filter((g) => (g.objectif ?? "").trim().length > 0 && (g.indicateur ?? "").trim().length > 0 && (g.date ?? "").trim().length > 0).length;
    return filled >= min;
  }
  if (field.type === "DYNAMIC_TABLE") {
    const arr = value as Record<string, unknown>[];
    if (!Array.isArray(arr)) return false;
    const min = field.minItems ?? 1;
    const filled = arr.filter((row) => {
      if (!row || typeof row !== "object") return false;
      return Object.values(row).some((v) => typeof v === "string" && v.trim().length > 0);
    }).length;
    return filled >= min;
  }
  if (field.type === "SYNTHESIS") {
    if (typeof value !== "object" || Array.isArray(value)) return false;
    const items = value as Record<string, number>;
    const keys = Object.keys(items);
    return keys.length > 0 && keys.some((k) => typeof items[k] === "number" && items[k] > 0);
  }
  if (field.type === "IMAGE" || field.type === "VIDEO" || field.type === "FILE") {
    const arr = value as MediaFile[];
    if (!Array.isArray(arr)) return false;
    return arr.length > 0;
  }
  if (field.type === "LINK") {
    const arr = value as MediaFile[];
    if (!Array.isArray(arr)) return false;
    return arr.length > 0;
  }
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

// Score d'un champ à critères (ex. validation du problème) : ré-export du module pur.
export { computeCriteriaScore } from "./criteria-score";

// Score global (grille /25) — utilisé côté review admin.
export function computeGlobalScore(
  grid: { key: string; label: string; max: number }[],
  scores: Record<string, number>
): number {
  return grid.reduce((sum, c) => sum + Math.min(c.max, Math.max(0, scores[c.key] ?? 0)), 0);
}

export function computeScorePercent(total: number, maxTotal: number): number {
  if (maxTotal <= 0) return 0;
  return Math.round((total / maxTotal) * 100);
}

// ── Autosave / soumission (helpers pur logique, le writer est dans la route) ──

export function createDefaultAttemptData(def: OnboardingMissionDef): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const steps = def.subMissions ?? [];
  for (const step of steps) {
    for (const field of step.fields) {
      if (field.type === "MULTI_SELECT" || field.type === "SKILLS") {
        data[field.key] = [];
      } else if (field.type === "ENV") {
        data[field.key] = {
          systeme: "",
          ide: "",
          connexion: "",
          machine: { cpu: "", ram: "", stockage: "" },
        };
      } else if (field.type === "SLIDER") {
        data[field.key] = 0;
      } else if (field.type === "SCORED_CRITERIA") {
        const rec: Record<string, { score: number; justification: string; preuves: string; confiance: string }> = {};
        for (const c of field.criteria ?? []) {
          rec[c.key] = { score: 0, justification: "", preuves: "", confiance: "Faible" };
        }
        data[field.key] = rec;
      } else if (field.type === "SOLUTIONS_TABLE") {
        data[field.key] = [{ nom: "", type: "Concurrent direct", public: "", forces: "", faiblesses: "" }];
      } else if (field.type === "EISENHOWER") {
        data[field.key] = {
          "important-urgent": [],
          "important-non-urgent": [],
          "non-important-urgent": [],
          "non-important-non-urgent": [],
        };
      } else if (field.type === "ROADMAP") {
        data[field.key] = Array.from({ length: 6 }, (_, i) => ({
          mois: `Mois ${i + 1}`,
          objectif: "",
          resultat: "",
        }));
      } else if (field.type === "RISK_TABLE") {
        data[field.key] = [{ nom: "", probabilite: 1, impact: 1, attenuation: "" }];
      } else if (field.type === "SMART_GOALS") {
        data[field.key] = [
          { type: "Projet", objectif: "", indicateur: "", date: "" },
          { type: "Personnel", objectif: "", indicateur: "", date: "" },
          { type: "Apprentissage", objectif: "", indicateur: "", date: "" },
        ];
      } else if (field.type === "SYNTHESIS") {
        data[field.key] = {};
      } else if (field.type === "DYNAMIC_TABLE") {
        const row: Record<string, string> = {};
        for (const col of field.columns ?? []) {
          row[col.key] = "";
        }
        data[field.key] = [row];
      } else if (field.type === "IMAGE" || field.type === "VIDEO" || field.type === "FILE" || field.type === "LINK") {
        data[field.key] = [];
      } else {
        data[field.key] = "";
      }
    }
  }
  return data;
}

// ── Timeline ────────────────────────────────────────────────────────────────

export async function logAttemptAction(opts: {
  attemptId: string;
  actorId?: string | null;
  action: string;
  message?: string;
  metadata?: Record<string, unknown>;
}) {
  const { prisma } = await import("./prisma");
  await prisma.missionReviewLog.create({
    data: {
      attemptId: opts.attemptId,
      actorId: opts.actorId ?? null,
      action: opts.action,
      message: opts.message,
      metadata: (opts.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  }).catch(() => undefined);
}

export function logAttemptActivity(opts: {
  userId?: string | null;
  action: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  request?: Request;
}) {
  logActivity({
    userId: opts.userId ?? null,
    action: opts.action,
    entity: "mission_attempt",
    entityId: opts.entityId,
    metadata: opts.metadata,
    request: opts.request,
  });
}
