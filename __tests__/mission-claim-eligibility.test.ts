import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/missions/[id]/claim/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const { mockPrisma } = vi.hoisted(() => {
  const m = {
    user: {
      findUnique: vi.fn(),
    },
    missionSubmission: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  };
  return { mockPrisma: m };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("@/lib/activity-log", () => ({
  logActivity: vi.fn(),
}));

describe("Mission Claim API - éligibilité des relecteurs (D-029)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 if a MEMBER has not validated 3 labs", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "user1", role: "MEMBER", missionsCompletedCount: 1 });
    (prisma.missionSubmission.findUnique as any).mockResolvedValue({ id: "sub1" }); // Mock submission
    
    const req = new Request("http://localhost/api/missions/sub1/claim", {
      method: "POST",
    });
    
    const res = await POST(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(403);
    const body = await res.text();
    expect(body).toContain("au moins 3 labs");
  });
});
