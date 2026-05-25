"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { emailService } from "@/lib/email";
import { analyzeQuizResults } from "@/lib/analysis";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";

const QuizSubmissionSchema = z.object({
  answers: z.array(z.string()).min(1),
  responseTimes: z.array(z.number()).optional(),
  diagnosticAnswers: z.record(z.string(), z.string()).optional(),
});

const GUILD_SLUG_MAP: Record<string, string> = {
  builder: "builders",
  creator: "creators",
  strategist: "strategists",
  catalyst: "catalysts",
};

export async function submitQuiz(rawData: unknown) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized", status: 401 };
    }

    const result = QuizSubmissionSchema.safeParse(rawData);
    if (!result.success) {
      return {
        success: false,
        error: "Données invalides",
        issues: result.error.issues,
        status: 400,
      };
    }

    const { answers, responseTimes = [], diagnosticAnswers = {} } = result.data;

    // Block re-taking the quiz if profile is already assigned
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { class: true },
    });

    if (existingUser?.class) {
      return {
        success: false,
        error: "Quiz déjà complété. Ton profil est verrouillé.",
        status: 409,
      };
    }

    // Run core algorithm
    const analysis = analyzeQuizResults(answers, responseTimes);

    const avgResponseTime =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((a: number, b: number) => a + b, 0) /
              responseTimes.length
          )
        : 0;

    // Determine target Guild
    const guildSlug = GUILD_SLUG_MAP[analysis.primary];
    if (!guildSlug) {
      return {
        success: false,
        error: `Profil d'évolution comportementale invalide : ${analysis.primary}`,
        status: 500,
      };
    }

    // Prisma Transaction for all writes to preserve database integrity
    const { quizResult } = await prisma.$transaction(async (tx) => {
      // 1. Create the quiz result
      const createdResult = await tx.quizResult.create({
        data: {
          user: { connect: { id: session.user.id } },
          profileType: analysis.primary,
          answers: Object.fromEntries(
            answers.map((a: string, i: number) => [i, a])
          ),
          detailedResponseTimes: responseTimes,
          averageResponseTime: avgResponseTime,
          diagnosticAnswers: diagnosticAnswers,
        },
      });

      // 2. Update the user scores, level and class
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          class: analysis.primary,
          level: analysis.level,
          builderScore: analysis.scores.builder,
          creatorScore: analysis.scores.creator,
          strategistScore: analysis.scores.strategist,
          catalystScore: analysis.scores.catalyst,
          polarization: analysis.consistencyScore,
          answerConsistency: analysis.consistencyScore,
          onboardingSpeed: avgResponseTime,
          confidenceScore: 0.25,
          behavioralVibrancy: analysis.scores as any,
          lastHypothesisUpdate: new Date(),
        },
      });

      // 3. Find the Guild
      const guild = await tx.guild.findUnique({
        where: { slug: guildSlug },
      });

      if (!guild) {
        throw new Error(`La guilde [${guildSlug}] est introuvable.`);
      }

      // 4. Enroll the user in the Guild
      await tx.guildMember.upsert({
        where: {
          userId_guildId: {
            userId: session.user.id,
            guildId: guild.id,
          },
        },
        create: {
          userId: session.user.id,
          guildId: guild.id,
          role: "MEMBER",
        },
        update: {}, // No change if already exists
      });

      return { quizResult: createdResult };
    });

    // Fire-and-forget email notification
    emailService
      .sendQuizResults({
        email: session.user.email,
        name: session.user.name,
        profileType: analysis.primary,
      })
      .catch((err) =>
        console.error("[QUIZ_SERVER_ACTION] Email send failure:", err)
      );

    // Mock request object for activity logging in server actions
    const reqHeaders = await headers();
    const mockRequest = {
      headers: reqHeaders,
    } as unknown as Request;

    logActivity({
      userId: session.user.id,
      action: "QUIZ_COMPLETED",
      entity: "quiz_result",
      entityId: quizResult.id,
      metadata: {
        profileType: analysis.primary,
        level: analysis.level,
        scores: analysis.scores,
        avgResponseTime: avgResponseTime,
      },
      request: mockRequest,
    });

    return {
      success: true,
      quizResultId: quizResult.id,
      analysis,
    };
  } catch (error: any) {
    console.error("[QUIZ_SERVER_ACTION_ERROR]", error);
    return {
      success: false,
      error: error.message || "Internal Server Error",
      status: 500,
    };
  }
}
