export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";

export async function GET() {
  try {
    const cacheKey = "squad_leaderboard";
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached, { headers: { "Cache-Control": "public, max-age=120, s-maxage=120" } });

    const squads = await prisma.organization.findMany({
      where: { isPrivate: false },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        cohesionScore: true,
        streakCount: true,
        description: true,
        members: {
          select: {
            id: true,
            role: true,
            user: { select: { id: true, name: true, pseudo: true, image: true, class: true, level: true, missionsCompletedCount: true } },
          },
        },
      },
      orderBy: [{ cohesionScore: "desc" }, { streakCount: "desc" }],
      take: 20,
    });

    // Compute aggregate stats per squad
    const ranked = squads.map((s, i) => ({
      ...s,
      rank: i + 1,
      totalXp: s.members.reduce((acc, m) => acc + (m.user.level * 100), 0),
      totalMissions: s.members.reduce((acc, m) => acc + (m.user.missionsCompletedCount || 0), 0),
      avgLevel: s.members.length
        ? Math.round(s.members.reduce((acc, m) => acc + m.user.level, 0) / s.members.length * 10) / 10
        : 0,
    }));

    setCache(cacheKey, ranked, 120);
    return NextResponse.json(ranked, { headers: { "Cache-Control": "public, max-age=120, s-maxage=120" } });
  } catch (error: unknown) {
    console.error("[SQUAD_LEADERBOARD]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: { "Cache-Control": "public, max-age=120, s-maxage=120" } });
  }
}
