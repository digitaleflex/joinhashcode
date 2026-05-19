import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { analyzeQuizResults } from "@/lib/analysis";

import { z } from "zod";

const QuizSubmissionSchema = z.object({
  answers: z.array(z.string()).min(1),
  responseTimes: z.array(z.number()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Block re-taking the quiz if profile is already assigned
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { class: true },
    });
    if (existingUser?.class) {
      return new NextResponse("Quiz déjà complété. Ton profil est verrouillé.", { status: 409 });
    }

    const json = await req.json();
    const result = QuizSubmissionSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: "Réponses invalides", issues: result.error.issues }, { status: 400 });
    }

    const { answers, responseTimes = [] } = result.data;

    // Algorithm runs server-side only — client sends raw data, never computed scores
    const analysis = analyzeQuizResults(
      answers as string[],
      responseTimes
    );

    const avgResponseTime =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length)
        : 0;

    const quizResult = await prisma.quizResult.create({
      data: {
        user: { connect: { id: session.user.id } },
        profileType: analysis.primary,
        answers: Object.fromEntries(answers.map((a: string, i: number) => [i, a])),
        detailedResponseTimes: responseTimes ?? [],
        averageResponseTime: avgResponseTime,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        class: analysis.primary,
        level: analysis.level,
        // Psychometric scores
        builderScore: analysis.scores.builder,
        creatorScore: analysis.scores.creator,
        strategistScore: analysis.scores.strategist,
        catalystScore: analysis.scores.catalyst,
        polarization: analysis.consistencyScore,
        // Behavioral
        answerConsistency: analysis.consistencyScore,
        onboardingSpeed: avgResponseTime,
        // Adaptive loop
        confidenceScore: 0.25,
        behavioralVibrancy: analysis.scores,
        lastHypothesisUpdate: new Date(),
      },
    });

    emailService.sendQuizResults({
      email: session.user.email,
      name: session.user.name,
      profileType: analysis.primary,
    }).catch(console.error);

    return NextResponse.json({ quizResultId: quizResult.id, analysis });
  } catch (error) {
    console.error("[QUIZ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
