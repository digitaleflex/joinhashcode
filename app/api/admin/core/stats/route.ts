import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const [
      totalUsers,
      classDistribution,
      vibrancyStats,
      scoreStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ["class"],
        _count: true,
        where: { class: { not: null } },
      }),
      prisma.user.findMany({
        where: { behavioralVibrancy: { not: null } },
        select: { behavioralVibrancy: true, class: true },
      }),
      prisma.user.findMany({
        select: {
          builderScore: true,
          creatorScore: true,
          strategistScore: true,
          catalystScore: true,
          class: true,
        },
      }),
    ]);

    const vibrancyByClass: Record<string, { builder: number; creator: number; strategist: number; catalyst: number; count: number }> = {};
    vibrancyStats.forEach((u) => {
      const c = u.class || "unassigned";
      const v = u.behavioralVibrancy as Record<string, number> || { builder: 0, creator: 0, strategist: 0, catalyst: 0 };
      if (!vibrancyByClass[c]) vibrancyByClass[c] = { builder: 0, creator: 0, strategist: 0, catalyst: 0, count: 0 };
      vibrancyByClass[c].builder += v.builder || 0;
      vibrancyByClass[c].creator += v.creator || 0;
      vibrancyByClass[c].strategist += v.strategist || 0;
      vibrancyByClass[c].catalyst += v.catalyst || 0;
      vibrancyByClass[c].count += 1;
    });

    const avgVibrancyByClass: Record<string, { builder: number; creator: number; strategist: number; catalyst: number }> = {};
    Object.entries(vibrancyByClass).forEach(([cls, data]) => {
      avgVibrancyByClass[cls] = {
        builder: data.count ? data.builder / data.count : 0,
        creator: data.count ? data.creator / data.count : 0,
        strategist: data.count ? data.strategist / data.count : 0,
        catalyst: data.count ? data.catalyst / data.count : 0,
      };
    });

    const scoreAvgs = scoreStats.reduce(
      (acc, u) => {
        acc.builder += u.builderScore;
        acc.creator += u.creatorScore;
        acc.strategist += u.strategistScore;
        acc.catalyst += u.catalystScore;
        return acc;
      },
      { builder: 0, creator: 0, strategist: 0, catalyst: 0 }
    );

    const total = scoreStats.length || 1;
    const confidenceScores = {
      builder: Math.round(scoreAvgs.builder / total),
      creator: Math.round(scoreAvgs.creator / total),
      strategist: Math.round(scoreAvgs.strategist / total),
      catalyst: Math.round(scoreAvgs.catalyst / total),
    };

    const classDist = classDistribution.map((c) => ({
      class: c.class,
      count: c._count,
    }));

    return NextResponse.json({
      totalUsers,
      classDistribution: classDist,
      avgVibrancyByClass,
      confidenceScores,
    });
  } catch (error) {
    console.error("[ADMIN_CORE_STATS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}