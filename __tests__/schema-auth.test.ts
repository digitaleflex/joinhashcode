import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Prisma models required by Better Auth", () => {
  it("expose le modèle twoFactor (sinon SCHEMA_MISMATCH)", () => {
    // Better Auth validates the Prisma client at runtime. If the TwoFactor
    // model is absent from schema.prisma, every 2FA/session call logs
    // "Prisma schema mismatch — Missing tables twoFactor".
    const client = prisma as unknown as {
      twoFactor?: { findUnique?: unknown };
    };
    expect(typeof client.twoFactor?.findUnique).toBe("function");
  });
});
