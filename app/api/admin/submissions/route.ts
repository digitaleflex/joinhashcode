export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const PENDING_STATUSES = ["PENDING", "PENDING_ADMIN", "IN_REVIEW"]
const HISTORY_STATUSES = ["APPROVED", "REJECTED", "NEEDS_REVISION"]

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) return NextResponse.json({ message: "Accès refusé" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") === "history" ? "history" : "pending";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
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
          level: true,
        }
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

    const [submissions, total] = await Promise.all([
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

    return NextResponse.json({ submissions, total, page, limit });
  } catch (error) {
    console.error("[ADMIN_SUBMISSIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
