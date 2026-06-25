export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { parsePagination } from "@/lib/schemas/pagination";

const PENDING_STATUSES = ["PENDING", "PENDING_ADMIN", "IN_REVIEW"]
const HISTORY_STATUSES = ["APPROVED", "REJECTED", "NEEDS_REVISION"]

export const GET = withAdminAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") === "history" ? "history" : "pending";
    const { page, limit } = parsePagination(searchParams);
    const skip = (page - 1) * limit;

    const statuses = tab === "history" ? HISTORY_STATUSES : PENDING_STATUSES;

    const submissionSelect = {
      id: true,
      status: true,
      content: true,
      projectDescription: true,
      createdAt: true,
      updatedAt: true,
      qualityLevel: true,
      xpAwarded: true,
      adminFeedback: true,
      revisionNotes: true,
      revisionCount: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
        include: {
          progress: { select: { level: true } },
        },
      },
      mission: {
        select: {
          id: true,
          title: true,
          category: true,
          xp: true,
          missionLevel: true,
          submissionMethod: true,
          deliverables: true,
        }
      }
    }

    const [rawSubmissions, total] = await Promise.all([
      prisma.missionSubmission.findMany({
        where: { status: { in: statuses } },
        select: submissionSelect,
        orderBy: tab === "history" ? { updatedAt: "desc" } : { createdAt: "asc" },
        take: limit,
        skip,
      }),
      prisma.missionSubmission.count({
        where: { status: { in: statuses } },
      }),
    ]);

    const submissions = rawSubmissions.map((s) => ({
      ...s,
      user: {
        id: s.user.id,
        name: s.user.name,
        email: s.user.email,
        level: s.user.progress?.level ?? 1,
      },
    }));

    return NextResponse.json({ submissions, total, page, limit });
  } catch (error) {
    console.error("[ADMIN_SUBMISSIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
});
