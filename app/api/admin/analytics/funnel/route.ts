import { checkAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { getFunnelStats, getStageThreshold, isStageHealthy } from "@/lib/activation-funnel";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations" }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await getFunnelStats(startDate, endDate);

    const statsWithHealth = stats.map((s) => ({
      ...s,
      threshold: getStageThreshold(s.stage),
      isHealthy: isStageHealthy(s.stage, s.conversionRate),
    }));

    return NextResponse.json({
      period: { startDate: startDate.toISOString(), endDate: endDate.toISOString(), days },
      stages: statsWithHealth,
      summary: {
        totalLanding: stats[0]?.count ?? 0,
        totalActivated: stats[stats.length - 1]?.count ?? 0,
        overallConversionRate: stats[0]?.count
          ? Math.round(((stats[stats.length - 1]?.count ?? 0) / stats[0].count) * 10000) / 100
          : 0,
        bottlenecks: statsWithHealth
          .filter((s) => !s.isHealthy && s.stage !== "landing")
          .map((s) => ({
            stage: s.stage,
            conversionRate: s.conversionRate,
            threshold: s.threshold,
            gap: Math.round((s.threshold - s.conversionRate) * 100) / 100,
          })),
      },
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_FUNNEL_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}