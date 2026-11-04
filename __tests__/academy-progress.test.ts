import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findContent: vi.fn(),
  upsert: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: mocks.getSession } } }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    content: { findUnique: mocks.findContent },
    progress: { upsert: mocks.upsert },
  },
}));
vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: mocks.checkRateLimit,
  mutationLimiter: {},
}));

import { POST } from "@/app/api/academy/progress/route";

function request(body: unknown) {
  return new NextRequest("http://localhost:3000/api/academy/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.checkRateLimit.mockResolvedValue({ limited: false });
  mocks.findContent.mockResolvedValue({ id: "c1" });
  mocks.upsert.mockResolvedValue({
    isCompleted: true,
    note: "note",
    checklist: { "0-0": true },
    updatedAt: new Date(),
  });
});

describe("POST /api/academy/progress", () => {
  it("renvoie 401 sans session", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await POST(request({ contentId: "c1" }));
    expect(res.status).toBe(401);
  });

  it("renvoie 400 sans contentId", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    const res = await POST(request({}));
    expect(res.status).toBe(400);
  });

  it("enregistre la complétion, la note et la checklist", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    const res = await POST(
      request({
        contentId: "c1",
        isCompleted: true,
        note: "Mes notes",
        checklist: { "0-0": true },
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.progress.isCompleted).toBe(true);
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_contentId: { userId: "u1", contentId: "c1" } },
        update: {
          isCompleted: true,
          note: "Mes notes",
          checklist: { "0-0": true },
        },
      }),
    );
  });
});
