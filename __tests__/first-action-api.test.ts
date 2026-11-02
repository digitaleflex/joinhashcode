import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findUnique: vi.fn(),
  trackEvent: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUnique } },
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: mocks.trackEvent,
  EVENTS: { FIRST_ACTION_STARTED: "first_action_started" },
}));

vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: mocks.checkRateLimit,
  mutationLimiter: {},
}));

import { GET, POST } from "@/app/api/me/first-action/route";

function request() {
  return new NextRequest("http://localhost:3000/api/me/first-action");
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.checkRateLimit.mockResolvedValue({ limited: false });
});

describe("GET /api/me/first-action", () => {
  it("renvoie 401 sans session", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await GET(request());
    expect(res.status).toBe(401);
  });

  it("renvoie la première action du domaine de l'utilisateur", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue({ id: "u1", primaryDomain: "cybersecurity" });

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.action.domain).toBe("cybersecurity");
    expect(body.action.status).toBe("ready");
    expect(body.action.href).toBe("/ateliers/linux-cloud-basics");
  });
});

describe("POST /api/me/first-action", () => {
  it("enregistre l'événement d'activation", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue({ id: "u1", primaryDomain: "web" });

    const res = await POST(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(mocks.trackEvent).toHaveBeenCalledWith(
      "u1",
      "first_action_started",
      expect.objectContaining({ domain: "web", source: "atelier" }),
    );
  });

  it("renvoie 429 si le rate limit est atteint", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue({ id: "u1", primaryDomain: "web" });
    mocks.checkRateLimit.mockResolvedValue({ limited: true });

    const res = await POST(request());
    expect(res.status).toBe(429);
    expect(mocks.trackEvent).not.toHaveBeenCalled();
  });
});
