import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Shared store that survives `vi.resetModules()`: it simulates a remote Redis
// backend shared by several application instances.
const { sharedStore } = vi.hoisted(() => ({
  sharedStore: new Map<string, number>(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor() {}
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    async limit(identifier: string) {
      if (process.env.REDIS_URL?.includes("127.0.0.1:1")) {
        throw new Error("ECONNREFUSED: simulated Redis outage");
      }
      const count = (sharedStore.get(identifier) ?? 0) + 1;
      sharedStore.set(identifier, count);
      return { success: count <= 2, reset: Date.now() + 1000 };
    }
  },
}));

beforeEach(() => {
  sharedStore.clear();
  vi.resetModules();
  vi.stubEnv("REDIS_URL", "http://redis.internal");
  vi.stubEnv("REDIS_TOKEN", "test-token");
});

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("rate limiting — backend Redis indisponible", () => {
  it("bloque une opération sensible quand Redis est injoignable (fail-closed)", async () => {
    vi.resetModules();
    vi.stubEnv("REDIS_URL", "http://127.0.0.1:1");
    vi.stubEnv("REDIS_TOKEN", "test-token");

    const { checkRateLimit, strictMutationLimiter } = await import(
      "@/lib/ratelimit"
    );

    const result = await checkRateLimit(strictMutationLimiter, "user-down", {
      failClosed: true,
    });

    expect(result.limited).toBe(true);
  }, 20_000);

  it("laisse passer une opération non sensible quand Redis est injoignable (fail-open)", async () => {
    vi.resetModules();
    vi.stubEnv("REDIS_URL", "http://127.0.0.1:1");
    vi.stubEnv("REDIS_TOKEN", "test-token");

    const { checkRateLimit, mutationLimiter } = await import("@/lib/ratelimit");

    const result = await checkRateLimit(mutationLimiter, "user-down");

    expect(result.limited).toBe(false);
  }, 20_000);
});

describe("rate limiting — plusieurs instances partagent le compteur", () => {
  it("le compteur est partagé entre deux chargements du module", async () => {
    const instanceA = await import("@/lib/ratelimit");
    const first = await instanceA.checkRateLimit(
      instanceA.strictMutationLimiter,
      "shared-user",
      { failClosed: true },
    );
    const second = await instanceA.checkRateLimit(
      instanceA.strictMutationLimiter,
      "shared-user",
      { failClosed: true },
    );

    // New module instance — simulates another process/instance.
    vi.resetModules();
    const instanceB = await import("@/lib/ratelimit");
    const third = await instanceB.checkRateLimit(
      instanceB.strictMutationLimiter,
      "shared-user",
      { failClosed: true },
    );

    expect(first.limited).toBe(false);
    expect(second.limited).toBe(false);
    expect(third.limited).toBe(true);
    expect(sharedStore.get("shared-user")).toBe(3);
  });
});
