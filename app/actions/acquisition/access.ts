"use server";

import { auth } from "@/lib/auth";
import { logError, logInfo } from "@/lib/logger";
import { z } from "zod";

/**
 * Envoie le lien d'accès (magic link) au prospect issu du profiling.
 *
 * CONTEXTE — pourquoi un magic link et pas un mot de passe
 * -------------------------------------------------------
 * Le profiling collecte déjà l'email. Demander ensuite de créer un mot de
 * passe serait une friction inutile (et une ressaisie). Le magic link
 * transforme l'inscription en UN clic dans la boîte mail.
 *
 * ⚠️ EMAIL TRANSACTIONNEL UNIQUEMENT
 * ----------------------------------
 * Ce lien est nécessaire au service (exécution du contrat) : il n'a donc pas
 * besoin d'un opt-in marketing séparé. Il ne doit JAMAIS servir de prétexte
 * pour envoyer de la promotion — le marketing exigerait un consentement
 * explicite distinct.
 *
 * ⚠️ VECTEUR D'ABUS
 * -----------------
 * Tout appel envoie un email. L'endpoint better-auth est protégé par le rate
 * limit global (`lib/auth.ts` : 50 req/min, plus restrictif sur les envois
 * d'OTP). Ne pas exposer cette action sans vérification côté appelant.
 */

const schema = z.object({
  email: z.string().email(),
  callbackURL: z.string().optional(),
});

export async function sendAccessMagicLink(input: {
  email: string;
  callbackURL?: string;
}) {
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(input);
  } catch {
    return { success: false, error: "Adresse email invalide" };
  }

  try {
    await auth.api.signInMagicLink({
      body: {
        email: data.email,
        // Après clic, l'utilisateur arrive directement dans l'academy.
        callbackURL: data.callbackURL ?? "/academy",
      },
    });

    logInfo("Magic link envoyé", `email=${data.email}`, {
      source: "acquisition_profiling",
    });

    return { success: true };
  } catch (error: unknown) {
    logError("sendAccessMagicLink", error as Error, { email: data.email });
    // On ne révèle jamais si l'email existe ou non (énumération de comptes).
    return { success: false, error: "Impossible d'envoyer le lien d'accès" };
  }
}
