import { z } from "zod";
import { PSEUDO_REGEX, countryField, secondaryObjectivesField } from "./common";

export const pseudoRegex = PSEUDO_REGEX;

export const onboardingSchema = z.object({
  pseudo: z.string().regex(PSEUDO_REGEX, "Pseudo invalide (3-20 caractères, lettres, chiffres, _)").optional(),
  technicalLevel: z.enum(["Débutant", "Intermédiaire", "Avancé"]).optional(),
  country: countryField,
  currentSituation: z.string().min(1).max(200).optional(),
  mainObjective: z.string().min(1).max(300).optional(),
  secondaryObjectives: secondaryObjectivesField,
  language: z.enum(["fr", "en"]).default("fr"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
