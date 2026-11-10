import { describe, it, expect, vi, beforeEach } from "vitest";
import { triggerNotification } from "../lib/qstash";
import { prisma } from "../lib/prisma";
import { emailService } from "../lib/email";

vi.mock("../lib/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("../lib/email", () => ({
  emailService: {
    sendMissionApproval: vi.fn().mockResolvedValue(true),
    sendDailyReminder: vi.fn().mockResolvedValue(true),
    sendLevelUp: vi.fn().mockResolvedValue(true),
  },
}));

describe("triggerNotification (Direct DB)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a notification directly in PostgreSQL and return success", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM" as const,
      title: "System Update",
      message: "Your profile has been synchronized.",
      link: "/dashboard",
    };

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const result = await triggerNotification(payload);

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "user_123",
        type: "SYSTEM",
        title: "System Update",
        message: "Your profile has been synchronized.",
        link: "/dashboard",
      },
      include: { user: true },
    });
    expect(result.success).toBe(true);
    expect(result.notificationId).toBe("notif_123");
  });

  it("should trigger email sending when type is MISSION_APPROVED", async () => {
    const payload = {
      userId: "user_123",
      type: "MISSION_APPROVED" as const,
      title: "Mission validée : Build a CLI",
      message: "Your submission has been reviewed.",
    };

    (prisma.notification.create as any).mockResolvedValue({
      id: "notif_123",
      ...payload,
      user: { email: "test@example.com", name: "Test User" },
    });

    const result = await triggerNotification(payload);

    expect(result.success).toBe(true);
    expect(emailService.sendMissionApproval).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      missionTitle: "Build a CLI",
    });
  });

  it("should catch errors and fail silently to not break main transaction", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM" as const,
      title: "Test",
      message: "Test",
    };

    (prisma.notification.create as any).mockRejectedValue(new Error("Database crash"));

    const result = await triggerNotification(payload);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Database crash");
  });
});
