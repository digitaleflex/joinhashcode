import { describe, it, expect, vi, beforeEach } from "vitest";
import { proxy as middleware } from "../proxy";
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
  getCookieCache: vi.fn(),
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

  it("should redirect to /specialization if user has class but no primaryDomain", async () => {
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

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe("http://localhost:3000/specialization");
  });

  it("should allow access to dashboard if user is fully onboarded", async () => {
    const userData = {
      id: "user_1",
      currentSituation: "STUDENT",
      class: "BUILDER",
      primaryDomain: "Web",
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

describe("Middleware anti-boucle infinie (source fraîche prioritaire)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("privilégie la source fraîche sur le cookie JWE périmé (anti-boucle onboarding<->quiz)", async () => {
    const freshUser = {
      id: "user_1",
      currentSituation: "STUDENT",
      class: null,
      betaKeyId: "key_1",
    };
    // Le JWE (périmé) n'a pas currentSituation → pourrait renvoyer vers /onboarding
    const { getCookieCache } = await import("better-auth/cookies");
    (getCookieCache as any).mockResolvedValue({
      session: { id: "sess_stale" },
      user: { id: "user_1", currentSituation: null, class: null },
    });
    // La source fraîche (DB) a currentSituation
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ session: { id: "sess_1" }, user: freshUser }),
    });

    const req = createRequest("/quiz", "session=mock-token");
    const res = await middleware(req);

    // PAS de renvoi vers /onboarding : le funnel utilise la donnée fraîche
    expect(res?.status).not.toBe(307);
  });

  it("redirige /onboarding -> /quiz directement quand onboarding terminé sans class (pas de détour /dashboard)", async () => {
    const userData = {
      id: "user_1",
      currentSituation: "STUDENT",
      class: null,
      betaKeyId: "key_1",
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ session: { id: "sess_1" }, user: userData }),
    });

    const req = createRequest("/onboarding", "session=mock-token");
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toBe("http://localhost:3000/quiz");
  });

  it("retombe sur le JWE si le fetch de la source fraîche échoue (résilience, pas de boucle)", async () => {
    const { getCookieCache } = await import("better-auth/cookies");
    (getCookieCache as any).mockResolvedValue({
      session: { id: "sess_stale" },
      user: { id: "user_1", currentSituation: "STUDENT", class: "BUILDER", primaryDomain: "Web" },
    });
    (global.fetch as any).mockRejectedValueOnce(new Error("network down"));

    const req = createRequest("/dashboard", "session=mock-token");
    const res = await middleware(req);

    // JWE complet → accès autorisé
    expect(res?.status).not.toBe(307);
  });
});
