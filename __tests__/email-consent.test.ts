import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildUnsubscribeUrl,
  generateUnsubscribeToken,
  isOptedOut,
  verifyUnsubscribeSignature,
} from "@/lib/email-consent";

const ORIGINAL_SECRET = process.env.BETTER_AUTH_SECRET;

describe("email-consent", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-value");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    if (ORIGINAL_SECRET) process.env.BETTER_AUTH_SECRET = ORIGINAL_SECRET;
  });

  it("accepte une signature valide pour le bon utilisateur", () => {
    const url = buildUnsubscribeUrl("https://joinhashcode.com", "user_1", "tok");
    const params = new URL(url).searchParams;
    const s = params.get("s") as string;
    expect(verifyUnsubscribeSignature("user_1", s)).toBe(true);
  });

  it("rejette une signature pour un autre utilisateur", () => {
    const url = buildUnsubscribeUrl("https://joinhashcode.com", "user_1", "tok");
    const s = new URL(url).searchParams.get("s") as string;
    expect(verifyUnsubscribeSignature("user_2", s)).toBe(false);
  });

  it("rejette une signature vide ou malformée", () => {
    expect(verifyUnsubscribeSignature("user_1", "")).toBe(false);
    expect(verifyUnsubscribeSignature("", "abc")).toBe(false);
    expect(verifyUnsubscribeSignature("user_1", "deadbeef")).toBe(false);
  });

  it("génère un token opaque et unique", () => {
    const a = generateUnsubscribeToken();
    const b = generateUnsubscribeToken();
    expect(a).toMatch(/^[a-f0-9]{48}$/);
    expect(a).not.toBe(b);
  });

  it("construit une URL de désabonnement complète", () => {
    const url = new URL(
      buildUnsubscribeUrl("https://joinhashcode.com", "user_1", "tok"),
    );
    expect(url.pathname).toBe("/unsubscribe");
    expect(url.searchParams.get("u")).toBe("user_1");
    expect(url.searchParams.get("t")).toBe("tok");
    expect(url.searchParams.get("s")).toBeTruthy();
  });

  it("considère désabonné uniquement si emailOptOutAt est renseigné", () => {
    expect(isOptedOut({ emailOptOutAt: new Date() })).toBe(true);
    expect(isOptedOut({ emailOptOutAt: null })).toBe(false);
    expect(isOptedOut(null)).toBe(false);
  });
});
