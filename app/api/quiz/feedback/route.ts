import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { quizFeedbackLimiter, checkRateLimit } from "@/lib/ratelimit";
import { quizFeedbackSchema } from "@/lib/validation";

/**
 * Save Post-Quiz Feedback
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Rate limit: only applies if logged in
    if (session) {
      const { limited } = await checkRateLimit(quizFeedbackLimiter, session.user.id);
      if (limited) return NextResponse.json({ error: "Trop de feedback. Réessaie dans une heure." }, { status: 429 });
    }

    // Feedback can be anonymous or linked to a user
    const body = await req.json();
    const parsed = quizFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const { quizResultId, isAccurate, usefulness, comment } = parsed.data;

    if (!quizResultId) {
      return NextResponse.json({ error: "ID du résultat manquant" }, { status: 400 });
    }

    // Verify if result exists
    const result = await prisma.quizResult.findUnique({
      where: { id: quizResultId }
    });

    if (!result) {
      return NextResponse.json({ error: "Résultat introuvable" }, { status: 404 });
    }

    // Upsert feedback
    const feedback = await prisma.quizFeedback.upsert({
      where: { quizResultId },
      update: {
        isAccurate,
        usefulness,
        comment
      },
      create: {
        quizResultId,
        isAccurate,
        usefulness,
        comment
      }
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error: unknown) {
    console.error("[QUIZ_FEEDBACK_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
