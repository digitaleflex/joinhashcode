import { describe, it, expect } from "vitest";
import { describeAuthError } from "@/lib/auth-errors";

describe("describeAuthError", () => {
  it("map le code OTP_EXPIRED sur un message explicite", () => {
    expect(
      describeAuthError({ code: "OTP_EXPIRED", message: "OTP expired" }, "verify"),
    ).toBe("Ce code a expiré. Demande-en un nouveau.");
  });

  it("map INVALID_OTP sur un message non sensible", () => {
    expect(
      describeAuthError({ code: "INVALID_OTP", message: "Invalid OTP" }, "verify"),
    ).toBe("Code incorrect. Vérifie les 8 caractères reçus.");
  });

  it("map TOO_MANY_ATTEMPTS et les 429 sur le rate limit", () => {
    expect(
      describeAuthError({ code: "TOO_MANY_ATTEMPTS" }, "verify"),
    ).toBe("Trop de tentatives. Réessaie dans une minute.");
    expect(describeAuthError({ status: 429 }, "send")).toBe(
      "Trop de tentatives. Réessaie dans une minute.",
    );
  });

  it("retombe sur le message d'envoi sans divulguer la cause technique", () => {
    const message = describeAuthError(new Error("Resend 500: secret"), "send");
    expect(message).toBe(
      "Le code n'a pas pu être envoyé. Vérifie ton adresse email et réessaie.",
    );
    expect(message).not.toContain("Resend");
    expect(message).not.toContain("secret");
  });

  it("gère un code inconnu sur la vérification", () => {
    expect(describeAuthError({ code: "SOMETHING_ELSE" }, "verify")).toBe(
      "La vérification a échoué. Réessaie dans quelques instants.",
    );
  });
});
