import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ratelimit", () => ({
  clientErrorLimiter: {},
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

import { POST } from "@/app/api/log/client-error/route";

function req(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/log/client-error", { method: "POST", body, headers });
}

describe("POST /api/log/client-error", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("logs a small payload", async () => {
    const res = await POST(req(JSON.stringify({ message: "boom" })));
    expect(res.status).toBe(200);
    expect(console.error).toHaveBeenCalledWith("[CLIENT_ERROR]", expect.stringContaining("boom"));
  });

  it("rejects an oversized body without logging it", async () => {
    const res = await POST(req(JSON.stringify({ message: "x".repeat(20_000) })));
    expect(res.status).toBe(413);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("rejects a declared oversized content-length", async () => {
    const res = await POST(req("{}", { "content-length": "999999" }));
    expect(res.status).toBe(413);
  });
});
