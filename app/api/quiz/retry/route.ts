export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { invalidateUserCache } from "@/lib/user-cache";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        class: true,
        createdAt: true,
        builderScore: true,
        creatorScore: true,
        strategistScore: true,
        catalystScore: true,
        behavioralVibrancy: true,
        level: true,
        experience: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    const lastQuiz = await prisma.quizResult.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!lastQuiz) {
      return NextResponse.json(
        { message: "Aucun quiz précédent trouvé" },
        { status: 400 }
      );
    }

    const now = new Date();
    const quizCreatedAt = new Date(lastQuiz.createdAt);
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const isRetryAllowed = now.getTime() - quizCreatedAt.getTime() >= THIRTY_DAYS_MS;

    if (!isRetryAllowed) {
      const daysLeft = Math.ceil(
        (quizCreatedAt.getTime() + THIRTY_DAYS_MS - now.getTime()) /
          (24 * 60 * 60 * 1000)
      );
      return NextResponse.json(
        {
          message: `Le recalibrage sera disponible dans ${daysLeft} jour(s)`,
          allowed: false,
          daysLeft,
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          class: null,
          builderScore: 0,
          creatorScore: 0,
          strategistScore: 0,
          catalystScore: 0,
          behavioralVibrancy: Prisma.DbNull,
          level: 1,
          experience: 0,
        },
      });
    });

    await invalidateUserCache(session.user.id);

    const mockRequest = {
      headers: req.headers,
    } as unknown as Request;

    logActivity({
      userId: session.user.id,
      action: "QUIZ_RETRY_INITIATED",
      entity: "user",
      entityId: session.user.id,
      metadata: {
        previousClass: user.class,
        previousQuizId: lastQuiz.id,
        previousScores: {
          builder: user.builderScore,
          creator: user.creatorScore,
          strategist: user.strategistScore,
          catalyst: user.catalystScore,
        },
      },
      request: mockRequest,
    });

    return NextResponse.json({
      success: true,
      message: "Quiz réinitialisé. Tu peux maintenant le repasser.",
      redirectTo: "/quiz",
    });
  } catch (error: unknown) {
    return handleApiError(error, "QUIZ_RETRY");
  }
}

import { Prisma } from "@/generated/prisma/client";