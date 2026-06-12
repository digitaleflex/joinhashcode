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
    const cached = getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

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

    setCache(cacheKey, result, 300); // 5 mins cache

    return NextResponse.json(result);
  } catch (error) {
    console.error("[SQUAD_PUBLIC_GET]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
