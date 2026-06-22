"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { cookies, headers } from "next/headers";
import { emailService } from "@/lib/email";
import { analyzeQuizResults } from "@/lib/analysis";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";
import { questions } from "@/lib/questions";

const QuizSubmissionSchema = z.object({
  answers: z.array(z.string()).min(1),
  responseTimes: z.array(z.number()).optional(),
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
      return { success: false, error: "Non autorisé", status: 401 };
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

    const { answers, responseTimes = [] } = result.data;

    // Fix SEC-017: Validate answers against the question bank
    if (answers.length !== questions.length) {
      return {
        success: false,
        error: "Nombre de réponses incorrect.",
        status: 400,
      };
    }

    const isValidAnswers = answers.every((answer, index) => {
      const question = questions[index];
      return question && question.options.some((opt) => opt.value === answer);
    });

    if (!isValidAnswers) {
      return {
        success: false,
        error: "Certaines réponses sont invalides.",
        status: 400,
      };
    }

    // Block re-taking the quiz if profile is already assigned AND cooldown/24h conditions are not met
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { class: true, createdAt: true },
    });

    if (existingUser?.class) {
      const lastQuiz = await prisma.quizResult.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (lastQuiz) {
        const now = new Date();
        const quizCreatedAt = new Date(lastQuiz.createdAt);
        const userCreatedAt = new Date(existingUser.createdAt);

        const isNewAccount = (now.getTime() - userCreatedAt.getTime()) < 24 * 60 * 60 * 1000;
        const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
        const cooldownEnd = new Date(quizCreatedAt.getTime() + COOLDOWN_MS);
        const isCooldownElapsed = now.getTime() >= cooldownEnd.getTime();

        if (!isNewAccount && !isCooldownElapsed) {
          const daysLeft = Math.ceil((cooldownEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return {
            success: false,
            error: `Recalibrage verrouillé. Tu dois attendre encore ${daysLeft} jour(s) pour repasser le quiz.`,
            status: 409,
          };
        }
      }
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
          averageResponseTime: avgResponseTime,
        },
      });

      // 2. Update the user scores, level and class
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          class: analysis.primary,
          behavioralVibrancy: analysis.scores as Prisma.InputJsonValue,
          lastHypothesisUpdate: new Date(),
          builderScore: analysis.scores.builder || 0,
          creatorScore: analysis.scores.creator || 0,
          strategistScore: analysis.scores.strategist || 0,
          catalystScore: analysis.scores.catalyst || 0,
          confidenceScore: 0.25,
          progress: {
            upsert: {
              create: { level: analysis.level, experience: 0 },
              update: { level: analysis.level },
            }
          }
        },
      });

      // 3. Find the Guild
      const guild = await tx.guild.findUnique({
        where: { slug: guildSlug },
      });

      if (!guild) {
        throw new Error(`La guilde [${guildSlug}] est introuvable.`);
      }

      // 4. Clean up other active guild memberships of profile classes (except the new one)
      await tx.guildMember.deleteMany({
        where: {
          userId: session.user.id,
          guildId: { not: guild.id },
        },
      });

      // 5. Enroll the user in the Guild
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

    // Clear middleware cookie so the redirect funnel picks up the new class
    try { (await cookies()).delete("hc_mw"); } catch { /* ignore */ }

    return {
      success: true,
      quizResultId: quizResult.id,
      analysis,
    };
  } catch (error: any) {
    console.error("[QUIZ_SERVER_ACTION_ERROR]", error);
    return {
      success: false,
      error: error.message || "Erreur interne du serveur",
      status: 500,
    };
  }
}
