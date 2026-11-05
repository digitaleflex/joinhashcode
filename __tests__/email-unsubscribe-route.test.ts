import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/activity-log", () => ({ logActivity: vi.fn() }));

vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
  publicApiLimiter: {},
}));

import { POST } from "@/app/api/email/unsubscribe/route";
import { buildUnsubscribeUrl } from "@/lib/email-consent";

function request(body: unknown) {
  return new NextRequest("http://localhost:3000/api/email/unsubscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/email/unsubscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-value");
  });

  it("désabonne un utilisateur avec signature et token valides", async () => {
    const url = new URL(
      buildUnsubscribeUrl("http://localhost:3000", "user_1", "tok-12345678"),
    );
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user_1",
      emailOptOutToken: "tok-12345678",
      emailOptOutAt: null,
    });
    mockPrisma.user.update.mockResolvedValue({});

    const res = await POST(
      request({
        u: "user_1",
        t: "tok-12345678",
        s: url.searchParams.get("s"),
      }),
    );

    expect(res.status).toBe(200);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "user_1" } }),
    );
  });

  it("rejette une signature invalide", async () => {
    const res = await POST(
      request({ u: "user_1", t: "tok-12345678", s: "invalid-signature" }),
    );
    expect(res.status).toBe(403);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("rejette un token qui ne correspond pas", async () => {
    const url = new URL(
      buildUnsubscribeUrl("http://localhost:3000", "user_1", "tok-12345678"),
    );
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user_1",
      emailOptOutToken: "other-token",
      emailOptOutAt: null,
    });

    const res = await POST(
      request({
        u: "user_1",
        t: "tok-12345678",
        s: url.searchParams.get("s"),
      }),
    );
    expect(res.status).toBe(403);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("est idempotent : un utilisateur déjà désabonné reste à 200 sans réécriture", async () => {
    const url = new URL(
      buildUnsubscribeUrl("http://localhost:3000", "user_1", "tok-12345678"),
    );
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user_1",
      emailOptOutToken: "tok-12345678",
      emailOptOutAt: new Date(),
    });

    const res = await POST(
      request({
        u: "user_1",
        t: "tok-12345678",
        s: url.searchParams.get("s"),
      }),
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("rejette un corps invalide sans divulguer d'information", async () => {
    const res = await POST(request({ u: "" }));
    expect(res.status).toBe(400);
  });
});
