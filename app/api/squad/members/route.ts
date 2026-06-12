export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!membership) return NextResponse.json([]);

    const members = await prisma.member.findMany({
      where: { organizationId: membership.organizationId },
      select: {
        id: true,
        userId: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            image: true,
            class: true,
            level: true,
            lastCheckinAt: true,
          },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("[SQUAD_MEMBERS_GET]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
