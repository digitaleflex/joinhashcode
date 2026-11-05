import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Consentement email et désabonnement des communications opérationnelles.
 *
 * Le lien de désabonnement porte deux éléments : l'identifiant utilisateur et
 * une signature HMAC dérivée de `BETTER_AUTH_SECRET`. La signature empêche de
 * désabonner un tiers en devinant un identifiant. Le token stocké en base
 * (`emailOptOutToken`) sert à révoquer un lien déjà émis.
 */

const SIGNATURE_LENGTH = 32;

function secret(): string {
  return process.env.BETTER_AUTH_SECRET || "hashcode-dev-secret";
}

function sign(userId: string): string {
  return createHmac("sha256", secret())
    .update(userId)
    .digest("hex")
    .slice(0, SIGNATURE_LENGTH);
}

/** Vérifie une signature de désabonnement en temps constant. */
export function verifyUnsubscribeSignature(
  userId: string,
  signature: string,
): boolean {
  if (!userId || !signature) return false;
  const expected = sign(userId);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Génère le lien de désabonnement absolu pour un utilisateur. */
export function buildUnsubscribeUrl(
  baseUrl: string,
  userId: string,
  token: string,
): string {
  const url = new URL("/unsubscribe", baseUrl);
  url.searchParams.set("u", userId);
  url.searchParams.set("t", token);
  url.searchParams.set("s", sign(userId));
  return url.toString();
}

/** Génère un token de désabonnement opaque (stocké en base). */
export function generateUnsubscribeToken(): string {
  return randomBytes(24).toString("hex");
}

export interface OptOutState {
  emailOptOutAt: Date | null;
}

/**
 * Un utilisateur est exclu des relances opérationnelles dès qu'il s'est
 * désabonné. Les relances transactionnelles liées au compte (magic link, OTP,
 * réinitialisation) restent autorisées : elles ne passent pas par ce garde.
 */
export function isOptedOut(user: OptOutState | null | undefined): boolean {
  return Boolean(user?.emailOptOutAt);
}
