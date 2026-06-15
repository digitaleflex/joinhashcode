import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const cursor = searchParams.get("cursor");

    const cacheKey = `public_squads_${limit}_${cursor || "none"}`;
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });

    const squads = await prisma.organization.findMany({
      where: {
        isPrivate: false,
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: string | null = null;
    if (squads.length > limit) {
      const nextItem = squads.pop();
      nextCursor = nextItem!.id;
    }

    const result = {
      data: squads,
      nextCursor,
    };

    setCache(cacheKey, result, 300);

    return NextResponse.json(result, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  } catch (error: unknown) {
    console.error("[SQUAD_PUBLIC_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500, headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  }
}
