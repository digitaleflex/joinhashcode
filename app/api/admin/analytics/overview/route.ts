import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import { Prisma } from "@/generated/prisma/client";

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

    const [
      userStats,
      missionStats,
      squadStats,
      profileStats,
      funnelStats,
      growthData,
    ] = await Promise.all([
      getUserStats(startDate, endDate),
      getMissionStats(startDate, endDate),
      getSquadStats(),
      getProfileStats(),
      getFunnelStats(startDate, endDate),
      getGrowthData(startDate, endDate),
    ]);

    return NextResponse.json({
      period: { startDate: startDate.toISOString(), endDate: endDate.toISOString(), days },
      users: userStats,
      missions: missionStats,
      squads: squadStats,
      profiles: profileStats,
      funnel: funnelStats,
      growth: growthData,
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_OVERVIEW_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

async function getUserStats(startDate: Date, endDate: Date) {
  const [
    totalUsers,
    newUsers,
    activeUsers7d,
    activeUsers30d,
    retentionData,
    byCountry,
    byRole,
    byClass,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
    prisma.user.count({
      where: { lastCheckinAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.user.count({ where: { lastCheckinAt: { not: null } } }),
    prisma.$queryRaw<{ cohort: Date; total: number; active: number }[]>`
      SELECT 
        DATE_TRUNC('week', "createdAt") as "cohort",
        COUNT(*)::int as "total",
        COUNT(CASE WHEN "lastCheckinAt" IS NOT NULL THEN 1 END)::int as "active"
      FROM "user"
      WHERE "createdAt" >= ${startDate}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.user.groupBy({ by: ["country"], _count: true, where: { country: { not: null } } }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.user.groupBy({ by: ["class"], _count: true, where: { class: { not: null } } }),
  ]);

  const retention30 = totalUsers > 0 ? Math.round((activeUsers30d / totalUsers) * 100) : 0;
  const retention7 = totalUsers > 0 ? Math.round((activeUsers7d / totalUsers) * 100) : 0;

  return {
    total: totalUsers,
    new: newUsers,
    active7d: activeUsers7d,
    active30d: activeUsers30d,
    retention7,
    retention30,
    retentionData: retentionData.map((r) => ({
      cohort: r.cohort.toISOString(),
      total: r.total,
      active: r.active,
      retention: r.total > 0 ? Math.round((r.active / r.total) * 100) : 0,
    })),
    byCountry: byCountry.slice(0, 10).map((c) => ({ country: c.country, count: c._count })),
    byRole: byRole.map((r) => ({ role: r.role, count: r._count })),
    byClass: byClass.map((c) => ({ class: c.class, count: c._count })),
  };
}

async function getMissionStats(startDate: Date, endDate: Date) {
  const [
    totalMissions,
    publishedMissions,
    submissions,
    completionsByCategory,
    completionsByDifficulty,
    avgScoreByCategory,
  ] = await Promise.all([
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "PUBLISHED" } }),
    prisma.missionSubmission.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { status: true, missionId: true, xpAwarded: true },
    }),
    prisma.missionSubmission.groupBy({
      by: ["status", "missionId"],
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: true,
    }),
    prisma.missionSubmission.groupBy({
      by: ["status", "missionId"],
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: true,
    }),
    prisma.mission.findMany({
      select: { category: true, difficulty: true, id: true, submissions: { select: { status: true, xpAwarded: true } } },
    }),
  ]);

  const missionDetails = await prisma.mission.findMany({
    select: { category: true, difficulty: true, id: true },
  });

  const categoryMap = new Map<string, { total: number; approved: number; rejected: number; pending: number }>();
  const difficultyMap = new Map<number, { total: number; approved: number; rejected: number; pending: number }>();

  for (const sub of submissions) {
    const mission = missionDetails.find((m) => m.id === sub.missionId);
    if (!mission) continue;

    const cat = mission.category;
    const diff = mission.difficulty;

    if (!categoryMap.has(cat)) categoryMap.set(cat, { total: 0, approved: 0, rejected: 0, pending: 0 });
    if (!difficultyMap.has(diff)) difficultyMap.set(diff, { total: 0, approved: 0, rejected: 0, pending: 0 });

    const catData = categoryMap.get(cat)!;
    const diffData = difficultyMap.get(diff)!;

    catData.total++;
    diffData.total++;

    if (sub.status === "APPROVED") {
      catData.approved++;
      diffData.approved++;
    } else if (sub.status === "REJECTED") {
      catData.rejected++;
      diffData.rejected++;
    } else {
      catData.pending++;
      diffData.pending++;
    }
  }

  const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    approved: data.approved,
    rejected: data.rejected,
    pending: data.pending,
    completionRate: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0,
  }));

  const difficultyStats = Array.from(difficultyMap.entries()).map(([difficulty, data]) => ({
    difficulty,
    total: data.total,
    approved: data.approved,
    rejected: data.rejected,
    pending: data.pending,
    completionRate: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0,
  }));

  const totalSubs = submissions.length;
  const approvedSubs = submissions.filter((s) => s.status === "APPROVED").length;
  const rejectedSubs = submissions.filter((s) => s.status === "REJECTED").length;
  const pendingSubs = submissions.filter((s) => s.status === "PENDING").length;

  return {
    total: totalMissions,
    published: publishedMissions,
    submissions: { total: totalSubs, approved: approvedSubs, rejected: rejectedSubs, pending: pendingSubs },
    overallCompletionRate: totalSubs > 0 ? Math.round((approvedSubs / totalSubs) * 100) : 0,
    byCategory: categoryStats,
    byDifficulty: difficultyStats,
  };
}

async function getSquadStats() {
  const [
    totalSquads,
    activeSquads,
    cohesionAvg,
    streakData,
    memberDistribution,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({ where: { cohesionScore: { gte: 0.5 } } }),
    prisma.organization.aggregate({ _avg: { cohesionScore: true } }),
    prisma.organization.findMany({
      select: { streakCount: true, cohesionScore: true },
    }),
    prisma.member.groupBy({ by: ["organizationId"], _count: true }),
  ]);

  const avgCohesion = cohesionAvg._avg.cohesionScore ?? 0;

  const streakDistribution = {
    "0": streakData.filter((s) => s.streakCount === 0).length,
    "1-3": streakData.filter((s) => s.streakCount > 0 && s.streakCount <= 3).length,
    "4-7": streakData.filter((s) => s.streakCount > 3 && s.streakCount <= 7).length,
    "8-14": streakData.filter((s) => s.streakCount > 7 && s.streakCount <= 14).length,
    "15+": streakData.filter((s) => s.streakCount > 14).length,
  };

  const memberCounts = memberDistribution.map((m) => m._count);
  const avgMembers = memberCounts.length > 0
    ? memberCounts.reduce((a, b) => a + b, 0) / memberCounts.length
    : 0;

  return {
    total: totalSquads,
    active: activeSquads,
    avgCohesion: Math.round(avgCohesion * 100) / 100,
    avgMembers: Math.round(avgMembers * 10) / 10,
    streakDistribution,
  };
}

async function getProfileStats() {
  const [
    quizResults,
    vibrancyData,
  ] = await Promise.all([
    prisma.quizResult.groupBy({ by: ["profileType"], _count: { _all: true } }),
    prisma.user.findMany({
      where: { behavioralVibrancy: { not: Prisma.DbNull } },
      select: { behavioralVibrancy: true, class: true },
    }),
  ]);

  const totalQuizzes = quizResults.reduce((a, b) => a + b._count._all, 0);

  const profileDistribution = ["builder", "creator", "strategist", "catalyst"].map((p) => {
    const count = quizResults.find((q) => q.profileType === p)?._count._all ?? 0;
    return { profile: p, count, percentage: totalQuizzes > 0 ? Math.round((count / totalQuizzes) * 100) : 0 };
  });

  return { distribution: profileDistribution, totalQuizzes };
}

async function getFunnelStats(startDate: Date, endDate: Date) {
  const stages = [
    { stage: "landing", action: "USER_SIGNUP" as const },
    { stage: "signin", action: "USER_SIGNIN" as const },
    { stage: "quiz", model: "quizResult" as const },
    { stage: "profile_choice", condition: { class: { not: null } } as { class: { not: null } } },
    { stage: "orientation", action: "POST_QUIZ_COMPLETED" as const },
    { stage: "first_atelier", condition: { status: { in: ["SUBMITTED", "APPROVED"] as const }, mission: { isOnboarding: true } } as { status: { in: readonly ["SUBMITTED", "APPROVED"] }; mission: { isOnboarding: true } } },
    { stage: "first_evidence", condition: { status: "APPROVED", mission: { isOnboarding: true } } as { status: "APPROVED"; mission: { isOnboarding: true } } },
  ];

  const counts: Record<string, number> = {};

  for (const s of stages) {
    if ("action" in s) {
      counts[s.stage] = await prisma.activityLog.count({
        where: { action: s.action, createdAt: { gte: startDate, lte: endDate } },
      });
    } else if ("model" in s) {
      if (s.model === "quizResult") {
        counts[s.stage] = await prisma.quizResult.count({ where: { createdAt: { gte: startDate, lte: endDate } } });
      }
    } else if ("condition" in s) {
      if (s.stage === "profile_choice") {
        counts[s.stage] = await prisma.user.count({
          where: { ...s.condition, createdAt: { gte: startDate, lte: endDate } } as Prisma.UserWhereInput,
        });
      } else if (s.stage === "first_atelier") {
        counts[s.stage] = await prisma.missionAttempt.count({
          where: { ...s.condition, submittedAt: { gte: startDate, lte: endDate } } as Prisma.MissionAttemptWhereInput,
        });
      } else if (s.stage === "first_evidence") {
        counts[s.stage] = await prisma.missionSubmission.count({
          where: { ...s.condition, createdAt: { gte: startDate, lte: endDate } } as Prisma.MissionSubmissionWhereInput,
        });
      }
    }
  }

  const landingCount = counts.landing || 1;
  const funnel = stages.map((s, i) => ({
    stage: s.stage,
    count: counts[s.stage] ?? 0,
    conversionRate: landingCount > 0 ? Math.round(((counts[s.stage] ?? 0) / landingCount) * 10000) / 100 : 0,
    dropOffRate: i > 0 && counts[stages[i - 1].stage] > 0
      ? Math.round(((counts[stages[i - 1].stage] - (counts[s.stage] ?? 0)) / counts[stages[i - 1].stage]) * 10000) / 100
      : 0,
  }));

  return funnel;
}

async function getGrowthData(startDate: Date, endDate: Date) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const interval = days <= 7 ? "day" : days <= 30 ? "day" : "week";

  const [signupsRaw, checkinsRaw, submissionsRaw] = await Promise.all([
    prisma.$queryRaw<{ day: Date; count: number }[]>`
      SELECT DATE_TRUNC('${interval}', "createdAt") as "day", COUNT("id")::int as "count"
      FROM "user"
      WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<{ day: Date; count: number }[]>`
      SELECT DATE_TRUNC('${interval}', "createdAt") as "day", COUNT("id")::int as "count"
      FROM "daily_checkin"
      WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<{ day: Date; count: number }[]>`
      SELECT DATE_TRUNC('${interval}', "createdAt") as "day", COUNT("id")::int as "count"
      FROM "mission_submission"
      WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  const dataPoints: Record<string, { signups: number; checkins: number; submissions: number }> = {};

  for (const r of signupsRaw) {
    const key = r.day.toISOString().split("T")[0];
    dataPoints[key] = { ...(dataPoints[key] || { signups: 0, checkins: 0, submissions: 0 }), signups: r.count };
  }
  for (const r of checkinsRaw) {
    const key = r.day.toISOString().split("T")[0];
    dataPoints[key] = { ...(dataPoints[key] || { signups: 0, checkins: 0, submissions: 0 }), checkins: r.count };
  }
  for (const r of submissionsRaw) {
    const key = r.day.toISOString().split("T")[0];
    dataPoints[key] = { ...(dataPoints[key] || { signups: 0, checkins: 0, submissions: 0 }), submissions: r.count };
  }

  return Object.entries(dataPoints)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}