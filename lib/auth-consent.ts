import { logError } from "./logger";

/**
 * Preuve serveur du consentement affiché sur l'écran de connexion.
 *
 * L'écran `/signin` affiche « En continuant, tu acceptes nos Conditions et
 * notre Politique de confidentialité… ». Ce consentement est implicite : il
 * est matérialisé côté serveur au moment de la création du compte ou de la
 * première session, afin qu'il ne dépende pas d'un tracking navigateur.
 *
 * On réutilise `AnalyticsEvent` (déjà utilisé par le consentement du
 * profiling) plutôt que d'ajouter un modèle dédié.
 */

export const AUTH_CONSENT_TERMS_VERSION = "2026-09";
export const AUTH_CONSENT_PRIVACY_VERSION = "2026-09";

export type AuthConsentChannel = "account_created" | "session_created";

export interface AuthConsentDb {
  analyticsEvent: {
    findFirst(args: unknown): Promise<{ id: string } | null>;
    create(args: unknown): Promise<unknown>;
  };
}

export interface AuthConsentInput {
  userId: string;
  email?: string | null;
  channel: AuthConsentChannel;
}

/**
 * Idempotent : un seul événement `signin_consent` par utilisateur.
 * Ne bloque jamais la connexion en cas d'échec.
 */
export async function recordAuthConsent(
  db: AuthConsentDb,
  input: AuthConsentInput,
): Promise<boolean> {
  try {
    const existing = await db.analyticsEvent.findFirst({
      where: { userId: input.userId, event: "signin_consent" },
      select: { id: true },
    });
    if (existing) return true;

    await db.analyticsEvent.create({
      data: {
        userId: input.userId,
        event: "signin_consent",
        data: {
          email: input.email ?? null,
          termsVersion: AUTH_CONSENT_TERMS_VERSION,
          privacyVersion: AUTH_CONSENT_PRIVACY_VERSION,
          scope: ["terms", "privacy", "profile_processing", "access_email"],
          channel: input.channel,
        },
      },
    });

    return true;
  } catch (error) {
    logError("recordAuthConsent", error as Error, {
      userId: input.userId,
      channel: input.channel,
    });
    return false;
  }
}
