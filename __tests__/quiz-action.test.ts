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
    },
    guild: {
      findUnique: vi.fn(),
    },
    guildMember: {
      upsert: vi.fn(),
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
      error: "Unauthorized",
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

  test("should return 409 when user already has a class assigned", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      class: "builder",
    });

    const res = await submitQuiz({
      answers: Array(13).fill("builder"),
    });

    expect(res).toEqual({
      success: false,
      error: "Quiz déjà complété. Ton profil est verrouillé.",
      status: 409,
    });
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
        level: 1,
        psychometrics: {
          upsert: {
            create: {
              builderScore: 100,
              creatorScore: 0,
              strategistScore: 0,
              catalystScore: 0,
              confidenceScore: 0.25,
            },
            update: {
              builderScore: 100,
              creatorScore: 0,
              strategistScore: 0,
              catalystScore: 0,
              confidenceScore: 0.25,
            },
          },
        },
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
