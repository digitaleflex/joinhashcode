import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Save Post-Quiz Feedback
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Feedback can be anonymous or linked to a user
    const { quizResultId, isAccurate, usefulness, comment } = await req.json();

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
