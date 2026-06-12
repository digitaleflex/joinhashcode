import { expect, test, describe, vi, beforeEach } from "vitest";
import { PATCH } from "../app/api/onboarding/route";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { emailService } from "../lib/email";
import { logActivity } from "../lib/activity-log";
import { trackEvent } from "../lib/analytics";
import { invalidateUserCache } from "../lib/user-cache";
import { NextRequest } from "next/server";

// Mock Prisma
vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

// Mock Auth
vi.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock Email Service
vi.mock("../lib/email", () => ({
  emailService: {
    sendOnboardingCompletedEmail: vi.fn(() => Promise.resolve()),
  },
}));

// Mock Activity Log
vi.mock("../lib/activity-log", () => ({
  logActivity: vi.fn(),
}));

// Mock Analytics
vi.mock("../lib/analytics", () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    ONBOARDING_STARTED: "ONBOARDING_STARTED",
  },
}));

// Mock Cache
vi.mock("../lib/user-cache", () => ({
  invalidateUserCache: vi.fn(() => Promise.resolve()),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

function createJsonRequest(body: any, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/onboarding", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });
}

describe("Onboarding API Endpoint (PATCH /api/onboarding)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return 401 when user is not authenticated", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const req = createJsonRequest({ country: "Sénégal" });
    const res = await PATCH(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toContain("Session expirée");
  });

  test("should return 400 when validation payload fails", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Malik" },
    });

    // Language option "es" is not allowed by onboardingSchema (only "fr" or "en")
    const req = createJsonRequest({ country: "", language: "es" });
    const res = await PATCH(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Données invalides");
  });

  test("should successfully save partial onboarding data", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Malik" },
    });

    const mockUpdatedUser = {
      id: "user-1",
      name: "Malik",
      email: "test@example.com",
      country: "Sénégal",
      currentSituation: "STUDENT",
      mainObjective: null,
      secondaryObjectives: [],
      language: "fr",
      updatedAt: new Date(),
    };

    (prisma.user.update as any).mockResolvedValue(mockUpdatedUser);

    const req = createJsonRequest({
      country: "Sénégal",
      currentSituation: "STUDENT",
      language: "fr",
    });
    
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.country).toBe("Sénégal");
    expect(data.currentSituation).toBe("STUDENT");

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        country: "Sénégal",
        currentSituation: "STUDENT",
        language: "fr",
        secondaryObjectives: [],
      },
      select: expect.any(Object),
    });

    expect(invalidateUserCache).toHaveBeenCalledWith("user-1");
    expect(logActivity).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalled();
    // Welcome/Onboarding completed email should NOT be sent as mainObjective is null
    expect(emailService.sendOnboardingCompletedEmail).not.toHaveBeenCalled();
  });

  test("should send completion email when onboarding is complete (mainObjective is set)", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Malik" },
    });

    const mockUpdatedUser = {
      id: "user-1",
      name: "Malik",
      email: "test@example.com",
      country: "Côte d'Ivoire",
      currentSituation: "PROFESSIONAL",
      mainObjective: "Apprendre React et Next.js",
      secondaryObjectives: ["Trouver un emploi"],
      language: "fr",
      updatedAt: new Date(),
    };

    (prisma.user.update as any).mockResolvedValue(mockUpdatedUser);

    const req = createJsonRequest({
      country: "Côte d'Ivoire",
      currentSituation: "PROFESSIONAL",
      mainObjective: "Apprendre React et Next.js",
      secondaryObjectives: ["Trouver un emploi"],
      language: "fr",
    });
    
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    
    expect(emailService.sendOnboardingCompletedEmail).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Malik",
    });
  });
});
