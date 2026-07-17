import { expect, test, describe, vi, beforeEach } from "vitest";
import { POST as checkinPOST } from "../app/api/user/checkin/route";
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
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    guildMember: {
      findFirst: vi.fn(),
    },
    engagementStats: {
      upsert: vi.fn(),
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
  checkinLimiter: {},
  claimLimiter: {},
  squadJoinLimiter: {},
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

  describe("Daily Check-in Cooldown", () => {
    test("returns 429 if check-in exists in last 20 hours", async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-1" } });
      (prisma.dailyCheckin.findFirst as any).mockResolvedValue({ id: "checkin-1", createdAt: new Date() });

      const req = new NextRequest("http://localhost/api/user/checkin", {
        method: "POST",
        body: JSON.stringify({
          note: "Aujourd'hui j'ai codé des super fonctionnalités de matchmaking pour Hashcode.",
          domain: "Web",
          energy: 5,
          duration: 30,
        }),
      });

      const res = await checkinPOST(req);
      expect(res.status).toBe(429);
      const json = await res.json();
      expect(json.message).toContain("Tu as déjà signé ton check-in");
    });

    test("strips HTML from note", async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-1" } });
      (prisma.dailyCheckin.findFirst as any).mockResolvedValue(null);
      (prisma.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        lastCheckinAt: null,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
        guildMembers: [],
      });
      (prisma.dailyCheckin.create as any).mockResolvedValue({ id: "checkin-2" });

      const req = new NextRequest("http://localhost/api/user/checkin", {
        method: "POST",
        body: JSON.stringify({
          note: "<script>alert('xss')</script>Hello <b>World</b>",
          domain: "Web",
          energy: 5,
          duration: 30,
        }),
      });

      await checkinPOST(req);
      
      expect(prisma.dailyCheckin.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          note: "alert('xss')Hello World",
        }),
      });
    });
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
          profile: {
            upsert: {
              create: { bio: "I am a cool person ..." },
              update: { bio: "I am a cool person ..." },
            }
          }
        }),
        select: expect.any(Object),
      });
    });
  });
});
