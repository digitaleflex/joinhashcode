import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/internal/cron/release-claims/route";
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";

const { mockPrisma } = vi.hoisted(() => {
  const m = {
    missionSubmission: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    activityLog: {
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  m.$transaction.mockImplementation((cb) => cb(m));
  return { mockPrisma: m };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/qstash", () => ({
  triggerNotification: vi.fn().mockResolvedValue({ success: true }),
}));

describe("POST /api/internal/cron/release-claims", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, CRON_SECRET: "test_super_secret_token" };
  });

  it("should return 401 if authorization header is missing", async () => {
    const req = new Request("http://localhost/api/internal/cron/release-claims", {
      method: "POST",
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.text();
    expect(body).toContain("Accès non autorisé");
  });

  it("should return 401 if authorization header is invalid", async () => {
    const req = new Request("http://localhost/api/internal/cron/release-claims", {
      method: "POST",
      headers: {
        Authorization: "Bearer wrong_token",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 200 with released: 0 if no stale submissions found", async () => {
    (prisma.missionSubmission.findMany as any).mockResolvedValue([]);

    const req = new Request("http://localhost/api/internal/cron/release-claims", {
      method: "POST",
      headers: {
        Authorization: "Bearer test_super_secret_token",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.released).toBe(0);
    expect(body.message).toContain("Aucune soumission expirée");
    expect(prisma.missionSubmission.updateMany).not.toHaveBeenCalled();
  });

  it("should release stale submissions, create audit logs, and trigger notifications", async () => {
    const mockStaleSubmissions = [
      {
        id: "sub_1",
        missionId: "mission_1",
        userId: "user_1",
        reviewerId: "reviewer_1",
        mission: { title: "Build a Compiler" },
      },
      {
        id: "sub_2",
        missionId: "mission_2",
        userId: "user_2",
        reviewerId: "reviewer_2",
        mission: { title: "Design a Landing Page" },
      },
    ];

    (prisma.missionSubmission.findMany as any).mockResolvedValue(mockStaleSubmissions);
    (prisma.missionSubmission.updateMany as any).mockResolvedValue({ count: 2 });

    const req = new Request("http://localhost/api/internal/cron/release-claims", {
      method: "POST",
      headers: {
        Authorization: "Bearer test_super_secret_token",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.released).toBe(2);
    expect(body.ids).toEqual(["sub_1", "sub_2"]);

    // Verify time cutoff query filter
    expect(prisma.missionSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "IN_REVIEW",
          updatedAt: expect.any(Object),
        }),
      })
    );

    // Verify database reset in bulk
    expect(prisma.missionSubmission.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["sub_1", "sub_2"] } },
      data: {
        status: "PENDING",
        reviewerId: null,
      },
    });

    // Verify audit logs creation
    expect(prisma.activityLog.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: "reviewer_1",
          action: "CLAIM_RELEASED_AUTO",
          entity: "MissionSubmission",
          entityId: "sub_1",
        }),
        expect.objectContaining({
          userId: "reviewer_2",
          action: "CLAIM_RELEASED_AUTO",
          entity: "MissionSubmission",
          entityId: "sub_2",
        }),
      ],
    });

    // Verify notification dispatches
    expect(triggerNotification).toHaveBeenCalledTimes(2);
    expect(triggerNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        userId: "user_1",
        type: "MISSION_REVIEW_RELEASED",
        title: "Soumission remise en file d'attente",
      })
    );
    expect(triggerNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        userId: "user_2",
        type: "MISSION_REVIEW_RELEASED",
        title: "Soumission remise en file d'attente",
      })
    );
  });
});
