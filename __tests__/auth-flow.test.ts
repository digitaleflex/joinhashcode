import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware } from "../middleware";
import { NextRequest } from "next/server";

// Mock better-auth/cookies
vi.mock("better-auth/cookies", () => ({
  getSessionCookie: vi.fn((req) => {
    // Check if there is a cookie header with a session token
    const cookie = req.headers.get("cookie");
    return cookie &&
      (cookie.includes("auth_token") || cookie.includes("session"))
      ? { value: "mock-session-token" }
      : null;
  }),
}));

// Mock next/headers to provide cookies and headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn((name) => {
      if (name === "auth_token" || name === "session") {
        return { value: "mock-session-token" };
      }
      return undefined;
    }),
    getAll: vi.fn(() => []),
  })),
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// Helper to create a request
function createRequest(path: string, cookie?: string) {
  const url = `http://localhost:3000${path}`;
  return new NextRequest(url, {
    headers: {
      cookie: cookie || "",
    },
  });
}

// Mock fetch globally
global.fetch = vi.fn();

describe("Middleware Auth & Onboarding Funnel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to /signin if no session on protected path", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ session: null, user: null }),
    });

    const req = createRequest("/dashboard");
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toContain(
      "http://localhost:3000/signin",
    );
  });

  it("should redirect to /onboarding if user has no currentSituation", async () => {
    const userData = {
      id: "user_1",
      currentSituation: null,
      betaKeyId: "key_1",
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        session: { id: "sess_1" },
        user: userData,
      }),
    });

    // Provide a cookie to satisfy getSessionCookie
    const req = createRequest("/dashboard", "session=mock-token");
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe(
      "http://localhost:3000/onboarding",
    );
  });

  it("should redirect to /quiz if user has situation but no class", async () => {
    const userData = {
      id: "user_1",
      currentSituation: "STUDENT",
      class: null,
      betaKeyId: "key_1",
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        session: { id: "sess_1" },
        user: userData,
      }),
    });

    // Provide a cookie to satisfy getSessionCookie
    const req = createRequest("/dashboard", "session=mock-token");
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe("http://localhost:3000/quiz");
  });

  it("should allow access to dashboard if user is fully onboarded", async () => {
    const userData = {
      id: "user_1",
      currentSituation: "STUDENT",
      class: "BUILDER",
      betaKeyId: "key_1",
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        session: { id: "sess_1" },
        user: userData,
      }),
    });

    // Provide a cookie to satisfy getSessionCookie
    const req = createRequest("/dashboard", "session=mock-token");
    const res = await middleware(req);

    expect(res?.status).not.toBe(307);
  });
});
