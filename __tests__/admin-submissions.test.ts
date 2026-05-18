import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/admin/submissions/[id]/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { triggerNotification } from "@/lib/qstash";
import { updateUserEvolution } from "@/lib/evolution-engine";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    missionSubmission: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/qstash", () => ({
  triggerNotification: vi.fn(),
}));

vi.mock("@/lib/evolution-engine", () => ({
  updateUserEvolution: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Admin Submissions API [id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);
    const req = new Request("http://localhost/api/admin/submissions/1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not admin", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "user1", role: "MEMBER" });
    const req = new Request("http://localhost/api/admin/submissions/1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(403);
  });

  it("should approve submission and update evolution and notify", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });
    
    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      mission: { id: "m1", title: "Mission 1", xp: 100, weightBuilder: 1, weightCreator: 0, weightStrategist: 0, weightCatalyst: 0 },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE" }),
    });
    
    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });
    
    expect(res.status).toBe(200);
    expect(updateUserEvolution).toHaveBeenCalled();
    expect(triggerNotification).toHaveBeenCalledWith(expect.objectContaining({
      type: "MISSION_APPROVED",
      userId: "user1"
    }));
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "sub1" },
      data: expect.objectContaining({ status: "APPROVED" })
    }));
  });

  it("should reject submission and notify", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });

    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      mission: { id: "m1", title: "Mission 1", xp: 100 },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({ action: "REJECT", feedback: "Try harder" }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });

    expect(res.status).toBe(200);
    expect(updateUserEvolution).not.toHaveBeenCalled();
    expect(triggerNotification).toHaveBeenCalledWith(expect.objectContaining({
      type: "SYSTEM",
      userId: "user1",
      message: "Try harder"
    }));
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "sub1" },
      data: expect.objectContaining({ status: "REJECTED", adminFeedback: "Try harder" })
    }));
  });

  it("should approve with GOOD quality level and award 125% XP", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });

    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      mission: { id: "m1", title: "Mission 1", xp: 200, category: "CODE", weightBuilder: 1, weightCreator: 0, weightStrategist: 0, weightCatalyst: 0 },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE", qualityLevel: "GOOD" }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(200);
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ xpAwarded: 250, qualityLevel: "GOOD" })
    }));
  });

  it("should set NEEDS_REVISION with revisionNotes", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });

    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      revisionCount: 0,
      mission: { id: "m1", title: "Mission 1", xp: 100, category: "CODE" },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({
        action: "NEEDS_REVISION",
        feedback: "Le README est insuffisant et le code n'est pas fonctionnel.",
        revisionNotes: "README présent avec description du projet\nCode fonctionnel (pas un scaffold vide)"
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(200);
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "NEEDS_REVISION",
        adminFeedback: "Le README est insuffisant et le code n'est pas fonctionnel.",
        revisionNotes: "README présent avec description du projet\nCode fonctionnel (pas un scaffold vide)",
        revisionCount: { increment: 1 }
      })
    }));
  });
});
