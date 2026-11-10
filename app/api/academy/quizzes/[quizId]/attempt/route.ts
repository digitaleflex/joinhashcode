import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";
import { scoreQuiz } from "@/lib/quiz-scoring";
import { buildQuizReview, lessonHref } from "@/lib/quiz-review";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }

  const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
  if (limited) {
    return NextResponse.json({ message: "Trop de tentatives. Réessaie dans une minute." }, { status: 429 });
  }

  const { quizId } = await params;
  const body = (await req.json().catch(() => null)) as { answers?: Record<string, string> } | null;
  if (!body?.answers || typeof body.answers !== "object") {
    return NextResponse.json({ message: "Réponses manquantes." }, { status: 400 });
  }

  const quiz = await prisma.courseQuiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true,
          conceptContent: {
            select: {
              id: true,
              title: true,
              section: { select: { course: { select: { slug: true } } } },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!quiz) {
    return NextResponse.json({ message: "Quiz introuvable." }, { status: 404 });
  }

  const { correct, total, score, corrections } = scoreQuiz(quiz.questions, body.answers);
  const passed = score >= quiz.passScore;
  // Mode examen : explications et feedback ne sont envoyés qu'ici, après validation.
  const review = buildQuizReview(
    quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      explanation: question.explanation,
      options: question.options,
      concept: question.conceptContent
        ? {
            href: lessonHref(
              question.conceptContent.section.course.slug,
              question.conceptContent.id,
            ),
            title: question.conceptContent.title,
          }
        : null,
    })),
    corrections,
  );

  await prisma.courseQuizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: quiz.id,
      answers: body.answers,
      score,
    },
  });

  return NextResponse.json({
    score,
    passed,
    passScore: quiz.passScore,
    correct,
    total,
    corrections,
    review,
  });
}
