export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!membership) return NextResponse.json([]);

    const membersData = await prisma.member.findMany({
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
            stats: {
              select: {
                lastCheckinAt: true,
              }
            }
          },
          include: {
            progress: { select: { level: true } },
          },
        },
      },
    });

    const members = membersData.map(m => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      user: {
        id: m.user.id,
        name: m.user.name,
        pseudo: m.user.pseudo,
        image: m.user.image,
        class: m.user.class,
        level: m.user.progress?.level ?? 1,
        lastCheckinAt: m.user.stats?.lastCheckinAt ?? null,
      }
    }));

    return NextResponse.json(members);
  } catch (error: unknown) {
    console.error("[SQUAD_MEMBERS_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
