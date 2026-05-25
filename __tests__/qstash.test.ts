import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@upstash/qstash";
import { triggerNotification } from "../lib/qstash";

const mockPublishJSON = vi.fn().mockResolvedValue({ messageId: "msg_123" });

vi.mock("@upstash/qstash", () => ({
  Client: vi.fn().mockImplementation(() => ({
    publishJSON: mockPublishJSON,
  })),
}));

describe("triggerNotification", () => {
  beforeEach(() => {
    vi.stubEnv("QSTASH_CURRENT_SIGNING_KEY", "real_key");
    vi.stubEnv("QSTASH_TOKEN", "test_token");
    mockPublishJSON.mockClear();
    vi.mocked(Client).mockClear();
  });

  it("should call qstash.publishJSON with correct parameters", async () => {
    const payload = {
      userId: "user_123",
      type: "SYSTEM" as const,
      title: "Test Title",
      message: "Test Message",
    };

    const result = await triggerNotification(payload);

    expect(mockPublishJSON).toHaveBeenCalledWith({
      url: expect.stringContaining("/api/internal/notify"),
      body: payload,
    });
    expect(result).toEqual({ messageId: "msg_123" });
  });
});
