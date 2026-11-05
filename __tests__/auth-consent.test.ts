import { describe, expect, it, vi } from "vitest";
import {
  AUTH_CONSENT_PRIVACY_VERSION,
  AUTH_CONSENT_TERMS_VERSION,
  recordAuthConsent,
  type AuthConsentDb,
} from "@/lib/auth-consent";

function mockDb(existing: { id: string } | null = null) {
  const findFirst = vi.fn().mockResolvedValue(existing);
  const create = vi.fn().mockResolvedValue({ id: "consent-1" });
  const db: AuthConsentDb = {
    analyticsEvent: { findFirst, create },
  };
  return { db, findFirst, create };
}

describe("recordAuthConsent", () => {
  it("crée un événement signin_consent horodaté côté serveur", async () => {
    const { db, create } = mockDb();

    await expect(
      recordAuthConsent(db, {
        userId: "u1",
        email: "awa@example.com",
        channel: "account_created",
      }),
    ).resolves.toBe(true);

    expect(create).toHaveBeenCalledTimes(1);
    const args = create.mock.calls[0][0] as {
      data: {
        userId: string;
        event: string;
        data: Record<string, unknown>;
      };
    };
    expect(args.data.userId).toBe("u1");
    expect(args.data.event).toBe("signin_consent");
    expect(args.data.data.email).toBe("awa@example.com");
    expect(args.data.data.termsVersion).toBe(AUTH_CONSENT_TERMS_VERSION);
    expect(args.data.data.privacyVersion).toBe(AUTH_CONSENT_PRIVACY_VERSION);
    expect(args.data.data.scope).toEqual([
      "terms",
      "privacy",
      "profile_processing",
      "access_email",
    ]);
    expect(args.data.data.channel).toBe("account_created");
  });

  it("est idempotent : un consentement existant n'est pas dupliqué", async () => {
    const { db, create } = mockDb({ id: "existing" });

    await expect(
      recordAuthConsent(db, {
        userId: "u1",
        email: "awa@example.com",
        channel: "session_created",
      }),
    ).resolves.toBe(true);

    expect(create).not.toHaveBeenCalled();
  });

  it("ne bloque jamais la connexion si l'écriture échoue", async () => {
    const { db, create } = mockDb();
    create.mockRejectedValueOnce(new Error("db down"));

    await expect(
      recordAuthConsent(db, {
        userId: "u1",
        email: "awa@example.com",
        channel: "session_created",
      }),
    ).resolves.toBe(false);
  });
});
