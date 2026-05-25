import { describe, it, expect, vi, beforeEach } from "vitest";
import { triggerNotification, qstash } from "../lib/qstash";

vi.mock("@upstash/qstash", () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      publishJSON: vi.fn().mockResolvedValue({ messageId: "msg_123" }),
    })),
  };
});

describe("triggerNotification", () => {
  beforeEach(() => {
    vi.stubEnv("QSTASH_CURRENT_SIGNING_KEY", "real_key");
  });

  it("should call qstash.publishJSON with correct parameters", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM" as const,
      title: "Test Title",
      message: "Test Message",
    };

    const result = await triggerNotification(payload);

    expect(qstash.publishJSON).toHaveBeenCalledWith({
      url: expect.stringContaining("/api/internal/notify"),
      body: payload,
    });
    expect(result).toEqual({ messageId: "msg_123" });
  });
});
