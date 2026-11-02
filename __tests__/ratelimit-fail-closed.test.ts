import { describe, it, expect, vi, afterEach } from "vitest";

// Isolate the module from real Redis/env between tests.
afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("checkRateLimit — fail-closed behaviour", () => {
  it("fails closed when a sensitive limiter throws", async () => {
    vi.resetModules();
    const { checkRateLimit } = await import("@/lib/ratelimit");

    const brokenLimiter = {
      check: vi.fn().mockRejectedValue(new Error("redis unavailable")),
    };

    const result = await checkRateLimit(brokenLimiter, "user-1", {
      failClosed: true,
    });

    expect(result.limited).toBe(true);
  });

  it("fails open for non-sensitive limiters when the limiter throws", async () => {
    vi.resetModules();
    const { checkRateLimit } = await import("@/lib/ratelimit");

    const brokenLimiter = {
      check: vi.fn().mockRejectedValue(new Error("redis unavailable")),
    };

    const result = await checkRateLimit(brokenLimiter, "user-1");

    expect(result.limited).toBe(false);
  });

  it("fails closed when a sensitive limiter is not configured", async () => {
    vi.resetModules();
    const { checkRateLimit } = await import("@/lib/ratelimit");

    const result = await checkRateLimit(null, "user-1", { failClosed: true });

    expect(result.limited).toBe(true);
  });

  it("allows the request when the limiter passes", async () => {
    vi.resetModules();
    const { checkRateLimit } = await import("@/lib/ratelimit");

    const okLimiter = {
      check: vi.fn().mockResolvedValue({ success: true, reset: Date.now() + 1000 }),
    };

    const result = await checkRateLimit(okLimiter, "user-1", {
      failClosed: true,
    });

    expect(result.limited).toBe(false);
  });
});
