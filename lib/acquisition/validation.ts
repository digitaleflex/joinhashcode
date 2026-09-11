/**
 * HASHCODE — Acquisition funnel validation utilities.
 * Shared server-side validation for profiling submissions.
 */

import { EMAIL_RE, DISPOSABLE_DOMAINS } from "./engine";
import type { ProfileAnswers } from "./types";

/** Basic server-side validation of the full answer set. */
export function validateProfileAnswers(answers: ProfileAnswers): { ok: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!answers.firstName?.trim()) errors.firstName = "Le prénom est requis.";
  else if (answers.firstName.trim().length < 1 || answers.firstName.trim().length > 40)
    errors.firstName = "Le prénom doit faire 1–40 caractères.";

  if (!answers.lastName?.trim()) errors.lastName = "Le nom est requis.";

  if (!answers.email?.trim()) errors.email = "L'email est requis.";
  else if (!EMAIL_RE.test(answers.email.trim())) errors.email = "Format d'email invalide.";

  if (!answers.country?.trim()) errors.country = "Le pays est requis.";

  if (!answers.primaryDomain) errors.primaryDomain = "Choisis un domaine.";

  if (!answers.level) errors.level = "Choisis ton niveau.";

  if (!answers.availability) errors.availability = "Choisis ta disponibilité.";

  if (!answers.learningStyle) errors.learningStyle = "Choisis ton style d'apprentissage.";

  if (!answers.threeMonthGoal?.trim()) errors.threeMonthGoal = "L'objectif à 3 mois est requis.";
  else if (answers.threeMonthGoal.trim().length < 4)
    errors.threeMonthGoal = "Écris au moins 4 caractères.";

  // Disposable email check
  if (answers.email?.trim()) {
    const domain = answers.email.trim().split("@").pop()?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      errors.email = "Adresse email temporaire détectée. Utilise une adresse permanente.";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
