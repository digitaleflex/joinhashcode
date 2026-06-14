export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) return NextResponse.json({ message: "Organization ID missing" }, { status: 400 });

    // Verify user is in the organization
    const membership = await prisma.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
      },
    });

    if (!membership) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Get all member IDs
    const members = await prisma.member.findMany({
      where: { organizationId },
      select: { userId: true },
    });
    const memberIds = members.map(m => m.userId);

    // Fetch relevant logs
    const logs = await prisma.activityLog.findMany({
      where: {
        userId: { in: memberIds },
        action: {
          in: ["MISSION_SUBMITTED", "MISSION_APPROVED", "SQUAD_CREATED", "SQUAD_JOINED", "SQUAD_UPDATED", "CHECKIN_COMPLETED"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            pseudo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(logs);
  } catch (_) {
    console.error("[SQUAD_ACTIVITY_GET]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
