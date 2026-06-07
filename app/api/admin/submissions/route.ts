export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) return new NextResponse("Forbidden", { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.missionSubmission.findMany({
        where: { status: { in: ["PENDING", "PENDING_ADMIN"] } },
        include: {
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
        },
        orderBy: { createdAt: "asc" },
        take: limit,
        skip,
      }),
      prisma.missionSubmission.count({
        where: { status: { in: ["PENDING", "PENDING_ADMIN"] } },
      }),
    ]);

    return NextResponse.json({ submissions, total, page, limit });
  } catch (error) {
    console.error("[ADMIN_SUBMISSIONS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
