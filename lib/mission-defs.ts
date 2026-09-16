import { ONBOARDING_MISSION } from "./onboarding-mission";
import type { OnboardingMissionDef, MissionSubDef, StepField } from "./onboarding-mission";
import { PROJECT_MISSION } from "./project-mission";
import { SOLUTION_MISSION } from "./solution-mission";

export type { OnboardingMissionDef, MissionSubDef, StepField };

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "REVISION_REQUIRED"
  | "APPROVED"
  | "REJECTED";

export type StepStatus = "DRAFT" | "APPROVED" | "REVISION_REQUIRED";

export function getStepMissionDef(slug: string | null | undefined): OnboardingMissionDef | null {
  if (!slug) return null;
  if (slug === ONBOARDING_MISSION.slug) return ONBOARDING_MISSION;
  if (slug === PROJECT_MISSION.slug) return PROJECT_MISSION;
  if (slug === SOLUTION_MISSION.slug) return SOLUTION_MISSION;
  return null;
}

export function getStepMissionDefByMission(mission?: { slug?: string | null } | null): OnboardingMissionDef | null {
  if (!mission) return null;
  return getStepMissionDef(mission.slug);
}

export function isStepMission(slug: string | null | undefined): boolean {
  return getStepMissionDef(slug) !== null;
}

export function computeStepCompleteness(
  step: MissionSubDef,
  data: Record<string, unknown>
): number {
  if (!step.fields || step.fields.length === 0) return data && Object.keys(data).length > 0 ? 1 : 0;
  const requiredFields = step.fields.filter((f) => f.required);
  if (requiredFields.length === 0) {
    if (step.fields.length === 0) return 1;
    const filled = step.fields.filter((f) => isFieldFilled(f, data?.[f.key])).length;
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
    return hasActions;
  }
  if (field.type === "ROADMAP") {
    if (!Array.isArray(value)) return false;
    const min = field.minItems ?? 1;
    const filled = value.filter((r: Record<string, unknown>) => {
      const objectif = r?.objectif;
      return typeof objectif === "string" && objectif.trim().length > 0;
    }).length;
    return filled >= min;
  }
  if (field.type === "SMART_GOALS") {
    if (!Array.isArray(value)) return false;
    const min = field.minItems ?? 1;
    const filled = value.filter((r: Record<string, unknown>) => {
      const what = r?.what;
      return typeof what === "string" && what.trim().length > 0;
    }).length;
    return filled >= min;
  }
  if (field.type === "DYNAMIC_TABLE") {
    if (!Array.isArray(value)) return false;
    const min = field.minItems ?? 1;
    return value.length >= min;
  }
  if (field.type === "SKILLS") {
    return Array.isArray(value) && value.length > 0;
  }
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

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
        data[field.key] = Array.from({ length: 3 }, () => ({
          what: "",
          why: "",
          how: "",
          when: "",
          measurable: "",
        }));
      } else {
        data[field.key] = "";
      }
    }
  }
  return data;
}

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  IN_REVIEW: "En review",
  REVISION_REQUIRED: "Révision requise",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  DRAFT: "Brouillon",
  APPROVED: "Validé",
  REVISION_REQUIRED: "Révision requise",
};
