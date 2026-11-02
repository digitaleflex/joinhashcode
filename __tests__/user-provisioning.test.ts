import { describe, it, expect, vi } from "vitest";
import {
  buildReferralCode,
  provisionNewUser,
} from "@/lib/user-provisioning";

describe("buildReferralCode", () => {
  it("utilise le pseudo en priorité", () => {
    const code = buildReferralCode("Awa_Diallo", "Awa Diallo", "abc123");
    expect(code).toBe("awadiallo-abc123");
  });

  it("retombe sur le premier mot du nom", () => {
    const code = buildReferralCode(null, "Moussa Traoré", "abc123");
    expect(code).toBe("moussa-abc123");
  });

  it("retombe sur 'member' si aucune donnée exploitable", () => {
    const code = buildReferralCode(undefined, undefined, "abc123");
    expect(code).toBe("member-abc123");
  });

  it("retire accents, espaces et caractères non-URL", () => {
    const code = buildReferralCode("Élève #1", "x", "abc");
    expect(code).toBe("eleve1-abc");
    expect(code).not.toMatch(/[^a-z0-9-]/);
  });

  it("génère un suffixe différent à chaque appel", () => {
    expect(buildReferralCode("awa", "Awa")).not.toBe(
      buildReferralCode("awa", "Awa"),
    );
  });
});

describe("provisionNewUser", () => {
  it("initialise le profil et renvoie true", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const ok = await provisionNewUser(
      { user: { updateMany } },
      { id: "u1", name: "Awa Diallo", pseudo: "awa" },
    );

    expect(ok).toBe(true);
    expect(updateMany).toHaveBeenCalledTimes(1);
    const args = updateMany.mock.calls[0][0];
    expect(args.where).toEqual({ id: "u1", referralCode: null });
    expect(args.data.referralCode).toMatch(/^awa-[a-z0-9]+$/);
    expect(args.data.level).toBe(1);
  });

  it("est idempotent : un profil déjà initialisé ne casse rien", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 });

    const ok = await provisionNewUser(
      { user: { updateMany } },
      { id: "u1", name: "Awa", pseudo: "awa" },
    );

    // Le filtre `referralCode: null` garantit qu'aucune ligne n'est réécrite.
    expect(ok).toBe(true);
    expect(updateMany.mock.calls[0][0].where).toEqual({
      id: "u1",
      referralCode: null,
    });
  });

  it("réessaie avec un nouveau code en cas de collision P2002", async () => {
    const updateMany = vi
      .fn()
      .mockRejectedValueOnce(
        Object.assign(new Error("duplicate"), {
          code: "P2002",
          meta: { target: ["referralCode"] },
        }),
      )
      .mockResolvedValueOnce({ count: 1 });

    const ok = await provisionNewUser(
      { user: { updateMany } },
      { id: "u1", name: "Awa", pseudo: "awa" },
    );

    expect(ok).toBe(true);
    expect(updateMany).toHaveBeenCalledTimes(2);
    const first = updateMany.mock.calls[0][0].data.referralCode;
    const second = updateMany.mock.calls[1][0].data.referralCode;
    expect(first).not.toBe(second);
  });

  it("renvoie false sans lever d'erreur après échec persistant", async () => {
    const updateMany = vi.fn().mockRejectedValue(
      Object.assign(new Error("duplicate"), {
        code: "P2002",
        meta: { target: ["referralCode"] },
      }),
    );

    await expect(
      provisionNewUser({ user: { updateMany } }, { id: "u1", name: "Awa" }, 3),
    ).resolves.toBe(false);
    expect(updateMany).toHaveBeenCalledTimes(3);
  });

  it("ne réessaie pas une erreur non liée au code de parrainage", async () => {
    const updateMany = vi.fn().mockRejectedValue(
      Object.assign(new Error("db down"), { code: "P1001" }),
    );

    const ok = await provisionNewUser(
      { user: { updateMany } },
      { id: "u1", name: "Awa" },
    );

    expect(ok).toBe(false);
    expect(updateMany).toHaveBeenCalledTimes(1);
  });
});
