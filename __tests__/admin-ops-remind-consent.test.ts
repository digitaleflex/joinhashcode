import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { mockPrisma, mockSendOpsReminder, mockLogActivity } = vi.hoisted(() => ({
  mockPrisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
  mockSendOpsReminder: vi.fn(),
  mockLogActivity: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/activity-log", () => ({ logActivity: mockLogActivity }));
vi.mock("@/lib/email", () => ({
  emailService: { sendOpsReminder: mockSendOpsReminder },
}));
vi.mock("@/lib/admin-auth", () => ({
  withAdminAuth:
    (handler: (req: Request, admin: { userId: string; role: string }) => unknown) =>
    (req: Request) =>
      handler(req, { userId: "admin_1", role: "ADMIN" }),
}));
vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
  adminOpsLimiter: {},
}));

import { POST } from "@/app/api/admin/users/[id]/remind/route";

function request() {
  return new NextRequest("http://localhost:3000/api/admin/users/user_1/remind", {
    method: "POST",
  });
}

const baseUser = {
  id: "user_1",
  name: "Awa",
  email: "awa@hashcode.test",
  currentSituation: null,
  class: null,
  primaryDomain: null,
  firstActionStartedAt: null,
  emailStatus: "VALID",
  banned: false,
  deactivatedAt: null,
  lastOpsReminderAt: null,
  emailOptOutAt: null,
  emailOptOutToken: null,
};

describe("POST /api/admin/users/[id]/remind — consentement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.user.update.mockResolvedValue({});
    mockSendOpsReminder.mockResolvedValue({ success: true, mocked: true });
  });

  it("refuse la relance d'un membre désabonné", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...baseUser,
      emailOptOutAt: new Date(),
    });

    const res = await POST(request());
    expect(res.status).toBe(409);
    expect(mockSendOpsReminder).not.toHaveBeenCalled();
  });

  it("envoie la relance et joint un lien de désabonnement signé", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(baseUser);

    const res = await POST(request());
    expect(res.status).toBe(200);

    expect(mockPrisma.user.update).toHaveBeenCalled(); // token persisté
    const call = mockSendOpsReminder.mock.calls[0][0];
    expect(call.unsubscribeUrl).toContain("/unsubscribe");
    expect(call.unsubscribeUrl).toContain("u=user_1");
    expect(call.unsubscribeUrl).toContain("s=");
  });
});
