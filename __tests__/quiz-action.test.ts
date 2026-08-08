import { expect, test, describe, vi, beforeEach } from "vitest";
import { submitQuiz } from "../app/actions/quiz";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { emailService } from "../lib/email";
import { logActivity } from "../lib/activity-log";

// Mock Prisma
vi.mock("../lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    quizResult: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    guild: {
      findUnique: vi.fn(),
    },
    guildMember: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  return { prisma: mockPrisma };
});

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
    sendQuizResults: vi.fn(() => Promise.resolve({ success: true })),
    sendWelcomeProfileEmail: vi.fn(() => Promise.resolve({ success: true })),
  },
}));

// Mock Activity Log
vi.mock("../lib/activity-log", () => ({
  logActivity: vi.fn(),
}));

// Mock User Cache
vi.mock("../lib/user-cache", () => ({
  invalidateUserCache: vi.fn(() => Promise.resolve()),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// Mock analyzeQuizResults
vi.mock("../lib/analysis", () => ({
  analyzeQuizResults: vi.fn(() => ({
    primary: "builder",
    level: 1,
    scores: { builder: 100, creator: 0, strategist: 0, catalyst: 0 },
    consistencyScore: 0.9,
  })),
}));

describe("Quiz Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default transaction mock: simply execute the callback passing prisma mock
    (prisma.$transaction as any).mockImplementation(async (cb: any) => {
      return cb(prisma);
    });
  });

  test("should return Unauthorized when session is missing", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const res = await submitQuiz({
      answers: ["answer_1", "answer_2"],
    });

    expect(res).toEqual({
      success: false,
      error: "Non autorisé",
      status: 401,
    });
  });

  test("should return 400 when validation fails", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    const res = await submitQuiz({
      answers: [], // Schema requires at least 1 answer
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe(400);
    expect(res.error).toBe("Données invalides");
  });

  test("should return 409 when user is under cooldown and account is older than 24h", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    // Account created 2 days ago
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    (prisma.user.findUnique as any).mockResolvedValue({
      class: "builder",
      createdAt: twoDaysAgo,
    });

    // Quiz completed 5 days ago (so inside the 14-days cooldown window)
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    (prisma.quizResult.findFirst as any).mockResolvedValue({
      createdAt: fiveDaysAgo,
    });

    const res = await submitQuiz({
      answers: Array(13).fill("builder"),
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe(409);
    expect(res.error).toContain("Recalibrage verrouillé");
  });

  test("should allow retake when account is less than 24h old", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    // Account created 2 hours ago
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    (prisma.user.findUnique as any).mockResolvedValue({
      class: "builder",
      createdAt: twoHoursAgo,
    });

    // Quiz completed 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    (prisma.quizResult.findFirst as any).mockResolvedValue({
      createdAt: oneHourAgo,
    });

    // Mock prisma responses in transaction
    (prisma.quizResult.create as any).mockResolvedValue({ id: "quiz-res-123" });
    (prisma.guild.findUnique as any).mockResolvedValue({ id: "guild-123", slug: "builders" });
    (prisma.guildMember.upsert as any).mockResolvedValue({ id: "member-123" });
    (prisma.user.update as any).mockResolvedValue({ id: "user-1" });

    const res = await submitQuiz({
      answers: Array(13).fill("builder"),
      responseTimes: Array(13).fill(1000),
    });

    expect(res.success).toBe(true);
    expect(res.quizResultId).toBe("quiz-res-123");
  });

  test("should allow retake when cooldown has elapsed", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    // Account created 20 days ago
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    (prisma.user.findUnique as any).mockResolvedValue({
      class: "builder",
      createdAt: twentyDaysAgo,
    });

    // Quiz completed 15 days ago (so outside the 14-days cooldown window)
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    (prisma.quizResult.findFirst as any).mockResolvedValue({
      createdAt: fifteenDaysAgo,
    });

    // Mock prisma responses in transaction
    (prisma.quizResult.create as any).mockResolvedValue({ id: "quiz-res-123" });
    (prisma.guild.findUnique as any).mockResolvedValue({ id: "guild-123", slug: "builders" });
    (prisma.guildMember.upsert as any).mockResolvedValue({ id: "member-123" });
    (prisma.user.update as any).mockResolvedValue({ id: "user-1" });

    const res = await submitQuiz({
      answers: Array(13).fill("builder"),
      responseTimes: Array(13).fill(1000),
    });

    expect(res.success).toBe(true);
    expect(res.quizResultId).toBe("quiz-res-123");
  });

  test("should successfully complete the quiz flow", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    // Not completed yet
    (prisma.user.findUnique as any).mockResolvedValue({
      class: null,
    });

    // Mock prisma responses in transaction
    (prisma.quizResult.create as any).mockResolvedValue({ id: "quiz-res-123" });
    (prisma.guild.findUnique as any).mockResolvedValue({ id: "guild-123", slug: "builders" });
    (prisma.guildMember.upsert as any).mockResolvedValue({ id: "member-123" });
    (prisma.user.update as any).mockResolvedValue({ id: "user-1" });

    const res = await submitQuiz({
      answers: Array(13).fill("builder"),
      responseTimes: Array(13).fill(1000),
    });

    expect(res.success).toBe(true);
    expect(res.quizResultId).toBe("quiz-res-123");
    expect(res.analysis).toBeDefined();

    // Verify Prisma transaction operations
    expect(prisma.quizResult.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: "user-1" } },
        profileType: "builder",
        answers: Object.fromEntries(Array(13).fill("builder").map((a, i) => [i, a])),
        averageResponseTime: 1000,
      },
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({
        class: "builder",
        progress: {
          upsert: {
            create: { level: 1, experience: 0 },
            update: { level: 1 },
          }
        },
        builderScore: 100,
        creatorScore: 0,
        strategistScore: 0,
        catalystScore: 0,
        confidenceScore: 0.25,
      }),
    });

    expect(prisma.guild.findUnique).toHaveBeenCalledWith({
      where: { slug: "builders" },
    });

    expect(prisma.guildMember.upsert).toHaveBeenCalledWith({
      where: {
        userId_guildId: {
          userId: "user-1",
          guildId: "guild-123",
        },
      },
      create: {
        userId: "user-1",
        guildId: "guild-123",
        role: "MEMBER",
      },
      update: {},
    });

    // Verify email and activity triggers
    expect(emailService.sendQuizResults).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      profileType: "builder",
    });

    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        action: "QUIZ_COMPLETED",
        entity: "quiz_result",
        entityId: "quiz-res-123",
      })
    );
  });
});
