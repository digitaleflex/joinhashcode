import { z } from "zod";
import { imageSchema, safeUrl, countryField, cityField, languageField, secondaryObjectivesField } from "./common";

export const updateSchema = z.object({
  name: z.string().min(1).max(100).optional().nullable().transform(v => v || undefined),
  pseudo: z.string()
    .transform(v => v.replace(/<[^>]*>/g, ""))
    .pipe(z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement)."))
    .optional()
    .nullable()
    .transform(v => v || undefined),
  bio: z.string()
    .transform(v => v.replace(/<[^>]*>/g, ""))
    .pipe(z.string().max(500))
    .optional()
    .nullable()
    .transform(v => v || undefined),
  image: imageSchema,
  country: countryField,
  city: cityField,
  language: languageField,
  currentSituation: z.string().max(200).optional().nullable().transform(v => v || undefined),
  githubUrl: safeUrl,
  portfolioUrl: safeUrl,
  twitterUrl: safeUrl,
  linkedinUrl: safeUrl,
  domains: z.array(z.string().max(50)).max(10).optional().nullable().transform(v => v || undefined),
  tools: z.array(z.string().max(50)).max(20).optional().nullable().transform(v => v || undefined),
  mainObjective: z.string().max(300).optional().nullable().transform(v => v || undefined),
  secondaryObjectives: secondaryObjectivesField?.nullable().transform(v => v || undefined),
  talentVisible: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateSchema>;
