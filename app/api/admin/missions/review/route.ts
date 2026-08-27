import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const missionId = searchParams.get("missionId");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    } else {
      where.status = { in: ["PENDING", "IN_REVIEW", "REVISION_REQUIRED"] };
    }
    if (missionId && missionId !== "all") {
      where.missionId = missionId;
    }

    const [submissions, missions] = await Promise.all([
      prisma.missionSubmission.findMany({
        where,
        select: {
          id: true,
          userId: true,
          missionId: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          xpAwarded: true,
          user: { select: { name: true, email: true } },
          mission: { select: { title: true, slug: true } },
        },
        orderBy: { createdAt: "asc" },
        take: 200,
      }),
      prisma.mission.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ]);

    const mapped = submissions.map((s) => ({
      id: s.id,
      userId: s.userId,
      missionId: s.missionId,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      xpAwarded: s.xpAwarded,
      userName: s.user.name,
      userEmail: s.user.email,
      missionTitle: s.mission.title,
      missionSlug: s.mission.slug,
    }));

    return NextResponse.json({ submissions: mapped, missions });
  } catch (error) {
    console.error("[ADMIN_REVIEW_LIST_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
