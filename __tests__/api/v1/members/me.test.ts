import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireSession, findUnique } = vi.hoisted(() => ({
  requireSession: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/lib/auth-guard", async () => {
  class AuthError extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  }

  return { AuthError, requireSession };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique },
  },
}));

import { AuthError } from "@/lib/auth-guard";
import { GET } from "@/app/api/v1/members/me/route";

describe("GET /api/v1/members/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no authenticated session", async () => {
    requireSession.mockRejectedValue(new AuthError("Non autorisé", 401));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.code).toBe("UNAUTHENTICATED");
    expect(body.requestId).toMatch(/^req_/);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns 403 when the authenticated account is forbidden", async () => {
    requireSession.mockRejectedValue(new AuthError("Compte banni", 403));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.code).toBe("FORBIDDEN");
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 when the authenticated user has no profile", async () => {
    requireSession.mockResolvedValue({ user: { id: "user_123" } });
    findUnique.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe("MEMBER_NOT_FOUND");
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: "user_123" },
      select: expect.objectContaining({
        id: true,
        name: true,
        email: true,
        primaryDomain: true,
      }),
    });
  });

  it("returns the stable DTO without exposing private database fields", async () => {
    const createdAt = new Date("2026-10-01T10:00:00.000Z");
    const updatedAt = new Date("2026-10-20T10:00:00.000Z");

    requireSession.mockResolvedValue({ user: { id: "user_123" } });
    findUnique.mockResolvedValue({
      id: "user_123",
      name: "Ada Lovelace",
      email: "ada@example.com",
      image: null,
      pseudo: "ada",
      country: "Benin",
      city: "Cotonou",
      language: "fr",
      primaryDomain: "Cybersecurity",
      mainObjective: "Become a SOC analyst",
      createdAt,
      updatedAt,
      role: "ADMIN",
      twoFactorSecret: "must-never-leak",
      referralCode: "private-referral",
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      id: "user_123",
      displayName: "Ada Lovelace",
      email: "ada@example.com",
      avatarUrl: null,
      username: "ada",
      location: { country: "Benin", city: "Cotonou" },
      language: "fr",
      primaryDomain: "Cybersecurity",
      declaredObjective: "Become a SOC analyst",
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
    expect(JSON.stringify(body)).not.toContain("must-never-leak");
    expect(JSON.stringify(body)).not.toContain("private-referral");
    expect(body.meta.requestId).toMatch(/^req_/);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("returns a generic 500 response without leaking internal error details", async () => {
    requireSession.mockResolvedValue({ user: { id: "user_123" } });
    findUnique.mockRejectedValue(new Error("database password leaked"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(body.detail).not.toContain("database password");
    expect(JSON.stringify(body)).not.toContain("database password");
  });
});
