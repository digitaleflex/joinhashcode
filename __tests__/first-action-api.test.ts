import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findUnique: vi.fn(),
  updateMany: vi.fn(),
  trackEvent: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUnique, updateMany: mocks.updateMany } },
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: mocks.trackEvent,
  EVENTS: {
    FIRST_ACTION_STARTED: "first_action_started",
    FIRST_ACTION_COMPLETED: "first_action_completed",
  },
}));

vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: mocks.checkRateLimit,
  mutationLimiter: {},
}));

import { GET, POST } from "@/app/api/me/first-action/route";

function request(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/me/first-action", {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function user(overrides: Record<string, unknown> = {}) {
  return {
    id: "u1",
    primaryDomain: "web",
    firstActionStartedAt: null,
    firstActionCompletedAt: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.checkRateLimit.mockResolvedValue({ limited: false });
  mocks.updateMany.mockResolvedValue({ count: 1 });
});

describe("GET /api/me/first-action", () => {
  it("renvoie 401 sans session", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await GET(request());
    expect(res.status).toBe(401);
  });

  it("renvoie l'action et le statut not_started", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue(user({ primaryDomain: "cybersecurity" }));

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.action.href).toBe("/ateliers/linux-cloud-basics");
    expect(body.status).toBe("not_started");
  });

  it("renvoie le statut completed", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue(
      user({ firstActionStartedAt: new Date(), firstActionCompletedAt: new Date() }),
    );

    const body = await (await GET(request())).json();
    expect(body.status).toBe("completed");
  });
});

describe("POST /api/me/first-action", () => {
  it("enregistre le démarrage (idempotent)", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique
      .mockResolvedValueOnce(user())
      .mockResolvedValueOnce(user({ firstActionStartedAt: new Date() }));

    const res = await POST(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.event).toBe("started");
    expect(body.status).toBe("started");
    expect(mocks.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u1", firstActionStartedAt: null },
      }),
    );
    expect(mocks.trackEvent).toHaveBeenCalledWith(
      "u1",
      "first_action_started",
      expect.objectContaining({ domain: "web" }),
    );
  });

  it("enregistre la complétion", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique
      .mockResolvedValueOnce(user({ firstActionStartedAt: new Date() }))
      .mockResolvedValueOnce(
        user({ firstActionStartedAt: new Date(), firstActionCompletedAt: new Date() }),
      );

    const res = await POST(request({ event: "completed" }));
    const body = await res.json();

    expect(body.event).toBe("completed");
    expect(body.status).toBe("completed");
    expect(mocks.trackEvent).toHaveBeenCalledWith(
      "u1",
      "first_action_completed",
      expect.any(Object),
    );
  });

  it("renvoie 429 si le rate limit est atteint", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findUnique.mockResolvedValue(user());
    mocks.checkRateLimit.mockResolvedValue({ limited: true });

    const res = await POST(request());
    expect(res.status).toBe(429);
    expect(mocks.trackEvent).not.toHaveBeenCalled();
  });
});
