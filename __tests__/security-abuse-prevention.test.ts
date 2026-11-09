import { expect, test, describe, vi, beforeEach } from "vitest";
import { PATCH as updatePATCH } from "../app/api/user/update/route";
import { NextRequest } from "next/server";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

vi.mock("../lib/prisma", () => {
  const mockPrisma = {
    dailyCheckin: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    missionSubmission: {
      count: vi.fn(),
    },
    missionReview: {
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    xpTransaction: {
      create: vi.fn(),
    },
    psychometric: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
    $queryRaw: vi.fn().mockResolvedValue([]),
  };
  return {
    prisma: mockPrisma,
  };
});

vi.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../lib/features", () => ({
  isFeatureEnabled: () => true,
}));

vi.mock("../lib/ratelimit", () => ({
  checkRateLimit: vi.fn(() => Promise.resolve({ limited: false })),
  claimLimiter: {},
  profileUpdateLimiter: {},
  redis: null,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Security & Abuse Prevention", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("User Update Rate Limit", () => {
    test("returns 429 if rate limited", async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-1" } });
      // Override the default ratelimit mock to simulate being limited
      const ratelimit = await import("../lib/ratelimit");
      (ratelimit.checkRateLimit as any).mockImplementationOnce(() => Promise.resolve({ limited: true, reset: Date.now() + 3600000 }));

      const req = new NextRequest("http://localhost/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ pseudo: "newpseudo" }),
      });

      const res = await updatePATCH(req);
      expect(res.status).toBe(429);
    });

    test("strips HTML from pseudo and bio", async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-1" } });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        updatedAt: new Date(Date.now() - 70000), // 70s ago
      });
      (prisma.user.update as any).mockResolvedValue({
        id: "user-1",
        profile: { bio: "I am a cool person ...", secondaryObjectives: [] },
      });

      const req = new NextRequest("http://localhost/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({
          pseudo: "<b>Hacker</b>",
          bio: "I am a <i>cool</i> person <script>...</script>",
        }),
      });

      await updatePATCH(req);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: expect.objectContaining({
          pseudo: "Hacker",
          bio: "I am a cool person ...",
        }),
        select: expect.any(Object),
      });
    });
  });
});
