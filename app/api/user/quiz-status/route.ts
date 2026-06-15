export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

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
}
