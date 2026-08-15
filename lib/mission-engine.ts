// Moteur de mission à étapes (onboarding).
// Générique : fonctionne pour Mission 01 et toutes les futures missions à étapes.

import { prisma } from "./prisma";
import { logActivity } from "./activity-log";
import { triggerNotification } from "./qstash";
import { ONBOARDING_MISSION } from "./onboarding-mission";
import type { OnboardingMissionDef, MissionStepDef } from "./onboarding-mission";
import type { Prisma } from "@/generated/prisma/client";

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
  return null;
}

export function getStepMissionDefByMission(mission?: { slug?: string | null } | null): OnboardingMissionDef | null {
  if (!mission) return null;
  return getStepMissionDef(mission.slug);
}

export function isStepMission(slug: string | null | undefined): boolean {
  return getStepMissionDef(slug) !== null;
}

// ── Progression ─────────────────────────────────────────────────────────────

export function computeStepCompleteness(
  step: MissionStepDef,
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
  step: MissionStepDef,
  data: Record<string, unknown>
): boolean {
  return computeStepCompleteness(step, data) >= 1;
}

function isFieldFilled(field: { type?: string; options?: { value: string; label: string }[] }, value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

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
  for (const step of def.steps) {
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
      } else {
        data[field.key] = "";
      }
    }
  }
  return data;
}

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumise",
  IN_REVIEW: "En revue",
  REVISION_REQUIRED: "Révision requise",
  APPROVED: "Validée",
  REJECTED: "Rejetée",
};

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  DRAFT: "Brouillon",
  APPROVED: "Validée",
  REVISION_REQUIRED: "Révision requise",
};

// ── Timeline ────────────────────────────────────────────────────────────────

export async function logAttemptAction(opts: {
  attemptId: string;
  actorId?: string | null;
  action: string;
  message?: string;
  metadata?: Record<string, unknown>;
}) {
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

export async function notifyAttempt(opts: {
  userId: string;
  title: string;
  message: string;
  link?: string;
}) {
  await triggerNotification({
    userId: opts.userId,
    type: "SYSTEM",
    title: opts.title,
    message: opts.message,
    link: opts.link,
  });
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
