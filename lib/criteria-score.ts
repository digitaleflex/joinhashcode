import type { StepField } from "./onboarding-mission";

// Score d'un champ à critères (ex. validation du problème) : somme des notes.
// Module pur (sans Prisma) pour être importable côté client.
export function computeCriteriaScore(
  field: StepField,
  value: unknown
): { total: number; max: number; details: Record<string, number> } {
  const details: Record<string, number> = {};
  const record = (value as Record<string, { score?: number }>) ?? {};
  for (const c of field.criteria ?? []) {
    const s = record[c.key]?.score;
    details[c.key] = typeof s === "number" ? Math.min(10, Math.max(0, s)) : 0;
  }
  const max = field.totalMax ?? (field.criteria?.length ?? 0) * 10;
  const total = Object.values(details).reduce((a, b) => a + b, 0);
  return { total: Math.min(total, max), max, details };
}
