export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth-guard";

export async function GET() {
  try {
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        class: true,
        quizResults: {
          select: { id: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });

    return NextResponse.json({
      completed: !!user.class,
      class: user.class,
      quizResultId: user.quizResults[0]?.id ?? null,
      completedAt: user.quizResults[0]?.createdAt ?? null,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[QUIZ_STATUS]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
