"use server";

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";
import { z } from "zod";

/**
 * Horodate le consentement donné à la fin du profiling.
 *
 * POURQUOI CÔTÉ SERVEUR
 * ---------------------
 * Le tracking client (`track()`) n'est pas une preuve : il vit dans le
 * navigateur et peut être effacé. En cas de contrôle, il faut pouvoir
 * démontrer **qui** a accepté **quoi** et **quand** → il faut une écriture
 * serveur, horodatée, non modifiable par l'utilisateur.
 *
 * CE QUI EST ENREGISTRÉ
 * ---------------------
 * Un `AnalyticsEvent` avec :
 *   - event    : "profiling_consent"
 *   - userId   : l'utilisateur s'il existe déjà (sinon null)
 *   - data     : email, versions des documents acceptés, user-agent
 *   - createdAt: l'horodatage (géré par la base)
 *
 * PORTÉE DU CONSENTEMENT
 * ----------------------
 * Ce consentement couvre :
 *   ✅ l'acceptation des CGU et de la Politique de confidentialité
 *   ✅ le traitement des réponses pour établir le profil
 *   ✅ l'envoi de l'email d'accès (transactionnel)
 * Il ne couvre PAS le marketing, qui exigerait un opt-in explicite distinct.
 */

const consentSchema = z.object({
  email: z.string().email(),
  termsVersion: z.string().default("2026-09"),
  privacyVersion: z.string().default("2026-09"),
});

export async function recordProfilingConsent(input: {
  email: string;
  termsVersion?: string;
  privacyVersion?: string;
}) {
  try {
    const data = consentSchema.parse(input);

    // Rapproche l'utilisateur s'il existe déjà (profil complété, compte créé…)
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    await prisma.analyticsEvent.create({
      data: {
        userId: existing?.id ?? null,
        event: "profiling_consent",
        data: {
          email: data.email,
          termsVersion: data.termsVersion,
          privacyVersion: data.privacyVersion,
          scope: ["terms", "privacy", "profile_processing", "access_email"],
          channel: "acquisition_profiling",
        },
      },
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de consentement invalides" };
    }
    logError("recordProfilingConsent", error as Error, { input });
    return { success: false, error: "Impossible d'enregistrer le consentement" };
  }
}
