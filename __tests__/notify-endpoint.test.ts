import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../app/api/internal/notify/route";
import { prisma } from "../lib/prisma";
import { emailService } from "../lib/email";

vi.mock("@upstash/qstash", () => ({
  Receiver: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockResolvedValue(false),
  })),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("../lib/email", () => ({
  emailService: {
    sendMissionApproval: vi.fn(),
  },
}));

describe("POST /api/internal/notify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("INTERNAL_API_SECRET", "test_secret");
  });

  it("should create a notification and return success", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM",
      title: "System Update",
      message: "Your profile has been updated.",
      link: "/dashboard",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "x-internal-secret": "test_secret",
      },
    });

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: payload,
      include: { user: true },
    });
  });

  it("should send an email if type is MISSION_APPROVED", async () => {
    const payload = {
      userId: "user_123",
      type: "MISSION_APPROVED",
      title: "Mission validée : Build a CLI",
      message: "Your mission has been approved.",
      link: "/missions",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "x-internal-secret": "test_secret",
      },
    });

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const response = await POST(req);
    
    expect(emailService.sendMissionApproval).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      missionTitle: "Build a CLI",
      xp: 0,
    });
  });

  it("should return 500 on error", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM",
      title: "Title",
      message: "Message",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "x-internal-secret": "test_secret",
      },
    });

    (prisma.notification.create as any).mockRejectedValue(new Error("DB Error"));

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });

  it("should return 401 if signature is invalid in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.QSTASH_CURRENT_SIGNING_KEY = "test_key";
    process.env.QSTASH_NEXT_SIGNING_KEY = "test_key";

    const payload = {
      userId: "user_123",
      type: "SYSTEM",
      title: "Title",
      message: "Message",
    };

    const req = new Request("http://localhost/api/internal/notify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "upstash-signature": "invalid_signature",
      },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
  });
});
