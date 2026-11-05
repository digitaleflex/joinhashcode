export type AuthErrorContext = "send" | "verify" | "magic";

/**
 * Turn Better Auth errors into explicit, non-leaky messages.
 *
 * Better Auth exposes both a human message and a stable machine code
 * (`OTP_EXPIRED`, `INVALID_OTP`, `TOO_MANY_ATTEMPTS`). We check the code first
 * so the UI stays correct even if the provider wording changes or is localized.
 */
export function describeAuthError(
  error: unknown,
  context: AuthErrorContext,
): string {
  const err = error as
    | { status?: number; message?: string; code?: string }
    | undefined;
  const status = err?.status;
  const code = (err?.code ?? "").toUpperCase();
  const message = (err?.message ?? "").toLowerCase();

  if (
    status === 429 ||
    code === "TOO_MANY_ATTEMPTS" ||
    message.includes("too many") ||
    message.includes("429")
  ) {
    return "Trop de tentatives. Réessaie dans une minute.";
  }

  if (code === "OTP_EXPIRED" || message.includes("expired")) {
    return "Ce code a expiré. Demande-en un nouveau.";
  }

  if (
    code === "OTP_NOT_FOUND" ||
    (context === "verify" &&
      (code === "INVALID_OTP" ||
        message.includes("invalid") ||
        message.includes("incorrect")))
  ) {
    return "Code incorrect. Vérifie les 8 caractères reçus.";
  }

  if (context === "magic") {
    return "Le lien n'a pas pu être envoyé. Réessaie dans quelques instants.";
  }

  if (context === "send") {
    return "Le code n'a pas pu être envoyé. Vérifie ton adresse email et réessaie.";
  }

  return "La vérification a échoué. Réessaie dans quelques instants.";
}
