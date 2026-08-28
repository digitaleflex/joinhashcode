import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { formatYYYYMMDD } from "@/lib/dates";

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "overview";
    const days = parseInt(searchParams.get("days") || "30", 10);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let csv = "";
    let filename = "";

    switch (type) {
      case "users":
        csv = await exportUsersCsv(startDate, endDate);
        filename = `analytics-users-${formatYYYYMMDD()}.csv`;
        break;
      case "missions":
        csv = await exportMissionsCsv(startDate, endDate);
        filename = `analytics-missions-${formatYYYYMMDD()}.csv`;
        break;
      case "squads":
        csv = await exportSquadsCsv();
        filename = `analytics-squads-${formatYYYYMMDD()}.csv`;
        break;
      case "funnel":
        csv = await exportFunnelCsv(startDate, endDate);
        filename = `analytics-funnel-${formatYYYYMMDD()}.csv`;
        break;
      default:
        csv = await exportOverviewCsv(startDate, endDate);
        filename = `analytics-overview-${formatYYYYMMDD()}.csv`;
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_EXPORT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

function escapeCSV(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function exportOverviewCsv(startDate: Date, endDate: Date): Promise<string> {
  const [
    totalUsers,
    newUsers,
    activeUsers7d,
    activeUsers30d,
    totalMissions,
    publishedMissions,
    totalSquads,
    avgCohesion,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
    prisma.user.count({ where: { lastCheckinAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.user.count({ where: { lastCheckinAt: { not: null } } }),
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "PUBLISHED" } }),
    prisma.organization.count(),
    prisma.organization.aggregate({ _avg: { cohesionScore: true } }),
  ]);

  const rows = [
    ["Metric", "Value"],
    ["Total Users", totalUsers],
    ["New Users (period)", newUsers],
    ["Active Users (7d)", activeUsers7d],
    ["Active Users (30d)", activeUsers30d],
    ["Retention 7d (%)", totalUsers > 0 ? Math.round((activeUsers7d / totalUsers) * 100) : 0],
    ["Retention 30d (%)", totalUsers > 0 ? Math.round((activeUsers30d / totalUsers) * 100) : 0],
    ["Total Missions", totalMissions],
    ["Published Missions", publishedMissions],
    ["Total Squads", totalSquads],
    ["Avg Squad Cohesion", Math.round((avgCohesion._avg.cohesionScore ?? 0) * 100) / 100],
    ["Period Start", startDate],
    ["Period End", endDate],
  ];

  return rows.map((r) => r.map(escapeCSV).join(",")).join("\n");
}

async function exportUsersCsv(startDate: Date, endDate: Date): Promise<string> {
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: {
      id: true, name: true, email: true, pseudo: true, role: true, class: true,
      createdAt: true, country: true, level: true, experience: true,
      missionsCompletedCount: true, currentStreak: true, lastCheckinAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "id", "name", "email", "pseudo", "role", "class",
    "createdAt", "country", "level", "experience",
    "missionsCompleted", "currentStreak", "lastCheckinAt",
  ];

  const rows = users.map((u) => [
    u.id, u.name, u.email, u.pseudo ?? "", u.role, u.class ?? "",
    u.createdAt, u.country ?? "", u.level, u.experience,
    u.missionsCompletedCount, u.currentStreak, u.lastCheckinAt ?? "",
  ]);

  return [header.map(escapeCSV).join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
}

async function exportMissionsCsv(startDate: Date, endDate: Date): Promise<string> {
  const submissions = await prisma.missionSubmission.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    include: { mission: { select: { id: true, title: true, category: true, difficulty: true, xp: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "submissionId", "missionId", "missionTitle", "category", "difficulty",
    "xpReward", "status", "xpAwarded", "submittedAt",
  ];

  const rows = submissions.map((s) => [
    s.id, s.missionId, s.mission?.title ?? "", s.mission?.category ?? "",
    s.mission?.difficulty ?? "", s.mission?.xp ?? "",
    s.status, s.xpAwarded, s.createdAt,
  ]);

  return [header.map(escapeCSV).join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
}

async function exportSquadsCsv(): Promise<string> {
  const squads = await prisma.organization.findMany({
    include: {
      _count: { select: { members: true } },
      members: { include: { user: { select: { class: true } } } },
    },
    orderBy: { cohesionScore: "desc" },
  });

  const header = [
    "id", "name", "slug", "membersCount", "cohesionScore",
    "streakCount", "builders", "creators", "strategists", "catalysts",
    "isPrivate", "createdAt",
  ];

  const rows = squads.map((s) => {
    const classes = s.members.reduce((acc, m) => {
      if (m.user.class) acc[m.user.class] = (acc[m.user.class] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      s.id, s.name, s.slug ?? "", s._count.members, s.cohesionScore,
      s.streakCount, classes.builder ?? 0, classes.creator ?? 0,
      classes.strategist ?? 0, classes.catalyst ?? 0,
      s.isPrivate, s.createdAt,
    ];
  });

  return [header.map(escapeCSV).join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
}

async function exportFunnelCsv(startDate: Date, endDate: Date): Promise<string> {
  const stages = [
    { stage: "landing", action: "USER_SIGNUP" as const },
    { stage: "signin", action: "USER_SIGNIN" as const },
    { stage: "quiz", model: "quizResult" as const },
    { stage: "profile_choice", condition: { class: { not: null } } as const },
    { stage: "orientation", action: "POST_QUIZ_COMPLETED" as const },
    { stage: "first_atelier", condition: { status: { in: ["SUBMITTED", "APPROVED"] }, mission: { isOnboarding: true } } as const },
    { stage: "first_evidence", condition: { status: "APPROVED", mission: { isOnboarding: true } } as const },
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
          where: { ...s.condition, createdAt: { gte: startDate, lte: endDate } },
        });
      } else if (s.stage === "first_atelier") {
        counts[s.stage] = await prisma.missionAttempt.count({
          where: { ...s.condition, submittedAt: { gte: startDate, lte: endDate } },
        });
      } else if (s.stage === "first_evidence") {
        counts[s.stage] = await prisma.missionSubmission.count({
          where: { ...s.condition, createdAt: { gte: startDate, lte: endDate } },
        });
      }
    }
  }

  const landingCount = counts.landing || 1;
  const header = ["stage", "count", "conversionRate", "dropOffRate"];
  const rows = stages.map((s, i) => [
    s.stage,
    counts[s.stage] ?? 0,
    landingCount > 0 ? Math.round(((counts[s.stage] ?? 0) / landingCount) * 10000) / 100 : 0,
    i > 0 && counts[stages[i - 1].stage] > 0
      ? Math.round(((counts[stages[i - 1].stage] - (counts[s.stage] ?? 0)) / counts[stages[i - 1].stage]) * 10000) / 100
      : 0,
  ]);

  return [header.map(escapeCSV).join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
}