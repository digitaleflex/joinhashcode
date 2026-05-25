export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) return new NextResponse("Forbidden", { status: 403 });

    const submissions = await prisma.missionSubmission.findMany({
      where: { status: "PENDING" },
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
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[ADMIN_SUBMISSIONS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
