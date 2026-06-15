export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const userId = session.user.id;

    // Fetch user created date and last quiz result
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, class: true },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const lastQuiz = await prisma.quizResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!user.class || !lastQuiz) {
      // If user hasn't active class or no quiz result, they can take it
      return NextResponse.json({
        canRetake: true,
        isNewAccount: true,
        cooldownDaysRemaining: 0,
        lastQuizDate: null,
        nextAvailableDate: null,
      });
    }

    const now = new Date();
    const quizCreatedAt = new Date(lastQuiz.createdAt);
    const userCreatedAt = new Date(user.createdAt);

    // 24 hours window for new accounts
    const isNewAccount = (now.getTime() - userCreatedAt.getTime()) < 24 * 60 * 60 * 1000;

    // 14 days cooldown limit
    const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
    const cooldownEnd = new Date(quizCreatedAt.getTime() + COOLDOWN_MS);
    const isCooldownElapsed = now.getTime() >= cooldownEnd.getTime();

    const canRetake = isNewAccount || isCooldownElapsed;
    const cooldownMsRemaining = Math.max(0, cooldownEnd.getTime() - now.getTime());
    const cooldownDaysRemaining = Math.ceil(cooldownMsRemaining / (24 * 60 * 60 * 1000));

    return NextResponse.json({
      canRetake,
      isNewAccount,
      cooldownDaysRemaining: canRetake ? 0 : cooldownDaysRemaining,
      lastQuizDate: quizCreatedAt.toISOString(),
      nextAvailableDate: cooldownEnd.toISOString(),
    });
  } catch (error: any) {
    console.error("[GET_QUIZ_STATUS_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
