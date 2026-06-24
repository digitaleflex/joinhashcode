export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : undefined;

    const squads = await prisma.organization.findMany({
      where: {
        members: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                pseudo: true,
                image: true,
                class: true,
                progress: { select: { level: true } },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const publicSquads = squads.map(squad => ({
      id: squad.id,
      name: squad.name,
      slug: squad.slug,
      createdAt: squad.createdAt,
      memberCount: squad.members.length,
      members: squad.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        pseudo: member.user.pseudo,
        image: member.user.image,
        class: member.user.class,
        level: member.user.progress?.level ?? 1,
      })),
    }));

    return NextResponse.json(publicSquads);
  } catch (error: unknown) {
    console.error("[SQUAD_PUBLIC_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
