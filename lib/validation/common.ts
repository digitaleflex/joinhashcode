import { z } from "zod";

export const PSEUDO_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const safeUrl = z.string().max(500).optional().nullable().or(z.literal("")).transform(v => v || undefined);

export const TRUSTED_IMAGE_DOMAINS = [
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "api.qrserver.com",
];

export const imageSchema = z.union([
  z.string().url().max(500).refine((url) => {
    try {
      const { hostname } = new URL(url);
      return TRUSTED_IMAGE_DOMAINS.includes(hostname);
    } catch {
      return false;
    }
  }, "Domaine d'image non autorisé."),
  z.string().regex(/^\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)$/),
]).optional().nullable().or(z.literal("")).transform(v => v || undefined);

export const pseudoField = z.string()
  .regex(PSEUDO_REGEX, "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement).")
  .optional()
  .nullable()
  .transform(v => v || undefined);

export const countryField = z.string().min(1).max(100).optional();
export const cityField = z.string().max(100).optional().nullable().transform(v => v || undefined);
export const languageField = z.enum(["fr", "en"]).optional().nullable().transform(v => v || undefined);

export const secondaryObjectivesField = z.array(z.string().max(200)).max(5).optional();

export const difficultyField = z.number().min(1).max(5);
export const xpField = z.number().min(0);
export const weightField = z.number().min(0).max(1);
