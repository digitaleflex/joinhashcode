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
