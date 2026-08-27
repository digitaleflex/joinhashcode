import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });
    }

    const attemptWhere: Record<string, unknown> = { missionId: id };
    if (statusFilter) {
      attemptWhere.status = statusFilter;
    }

    const attempts = await prisma.missionAttempt.findMany({
      where: attemptWhere,
      select: {
        id: true,
        status: true,
        submittedAt: true,
        score: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const participants = attempts.map((a) => ({
      attemptId: a.id,
      userId: a.user.id,
      name: a.user.name,
      pseudo: a.user.pseudo,
      avatar: a.user.image,
      status: a.status,
      submittedAt: a.submittedAt?.toISOString() ?? null,
      score: a.score,
      startedAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ participants, total: participants.length });
  } catch (error) {
    console.error("[ADMIN_MISSION_PARTICIPANTS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
