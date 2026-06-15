export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const quizResult = await prisma.quizResult.findUnique({
    where: { userId: session.user.id },
    select: { id: true, completedAt: true },
  });

  return NextResponse.json({
    completed: !!quizResult,
    quizResultId: quizResult?.id ?? null,
    completedAt: quizResult?.completedAt ?? null,
  });
}
