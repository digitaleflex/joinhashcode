import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/internal/cron/check-activity/route";
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/qstash", () => ({
  triggerNotification: vi.fn(),
}));

describe("Daily Activity Cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("INTERNAL_API_SECRET", "test_secret");
    vi.stubEnv("QSTASH_CURRENT_SIGNING_KEY", "test_key");
    vi.stubEnv("QSTASH_NEXT_SIGNING_KEY", "test_key");
  });

  it("should trigger notifications for inactive users", async () => {
    const mockUsers = [
      { id: "user1" },
      { id: "user2" },
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);
    (triggerNotification as any).mockResolvedValue({ messageId: "msg1" });

    const req = new Request("http://localhost/api/internal/cron/check-activity", {
      method: "POST",
      headers: {
        "x-internal-secret": "test_secret",
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.processed).toBe(2);
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(triggerNotification).toHaveBeenCalledTimes(2);
    expect(triggerNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user1",
      type: "DAILY_REMINDER",
    }));
  });
});
