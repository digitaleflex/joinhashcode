import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-500",
  PUBLISHED: "bg-emerald-500",
  CLOSED: "bg-amber-500",
  ARCHIVED: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiée",
  CLOSED: "Fermée",
  ARCHIVED: "Archivée",
};

function daysAgo(d: number): Date {
  const now = new Date();
  now.setDate(now.getDate() - d);
  return now;
}

async function getAnalytics(range: string) {
  const since =
    range === "7d"
      ? daysAgo(7)
      : range === "30d"
        ? daysAgo(30)
        : range === "90d"
          ? daysAgo(90)
          : null;

  const missionWhere = { deletedAt: null as null, ...(since ? { createdAt: { gte: since } } : {}) };

  const [statusCounts, missionsWithCounts, recentSubmissions, allMissions] = await Promise.all([
    prisma.mission.groupBy({
      by: ["status"],
      where: missionWhere,
      _count: true,
    }),
    prisma.mission.findMany({
      where: missionWhere,
      select: {
        id: true,
        title: true,
        submissions: { select: { id: true, createdAt: true, updatedAt: true, status: true, xpAwarded: true } },
        attempts: { select: { id: true, createdAt: true, submittedAt: true, score: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.missionSubmission.findMany({
      where: since ? { createdAt: { gte: since } } : {},
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.mission.findMany({
      where: missionWhere,
      select: { id: true, title: true },
    }),
  ]);

  const totalMissions = statusCounts.reduce((acc, s) => acc + s._count, 0);

  const completedAttempts = missionsWithCounts.flatMap((m) =>
    m.attempts.filter((a) => a.status === "APPROVED" || a.submittedAt !== null)
  );
  const avgCompletionTime =
    completedAttempts.length > 0
      ? completedAttempts.reduce((acc, a) => {
          const created = new Date(a.createdAt).getTime();
          const submitted = new Date(a.submittedAt ?? a.createdAt).getTime();
          return acc + (submitted - created);
        }, 0) / completedAttempts.length / (1000 * 60 * 60 * 24)
      : 0;

  const topMissions = missionsWithCounts
    .map((m) => ({
      id: m.id,
      title: m.title,
      submissionCount: m.submissions.length + m.attempts.length,
      avgScore:
        m.attempts.length > 0
          ? m.attempts.reduce((acc, a) => acc + (a.score ?? 0), 0) / m.attempts.length
          : 0,
    }))
    .sort((a, b) => b.submissionCount - a.submissionCount)
    .slice(0, 10);

  const weeklySubmissions: { week: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const weekStart = daysAgo(i * 7);
    const weekEnd = daysAgo((i - 1) * 7);
    const count = recentSubmissions.filter(
      (s) => s.createdAt >= weekStart && s.createdAt < weekEnd
    ).length;
    const label = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    weeklySubmissions.push({ week: label, count });
  }

  const avgScorePerMission = allMissions
    .map((m) => {
      const mission = missionsWithCounts.find((x) => x.id === m.id);
      if (!mission) return null;
      const allScores = mission.attempts.map((a) => a.score).filter(
        (s): s is number => s !== null
      );
      return {
        title: m.title,
        avg: allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0,
        count: allScores.length,
      };
    })
    .filter((x): x is { title: string; avg: number; count: number } => x !== null && x.count > 0)
    .sort((a, b) => b.avg - a.avg);

  const maxWeeklyCount = Math.max(...weeklySubmissions.map((w) => w.count), 1);

  return {
    totalMissions,
    statusCounts: Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
    avgCompletionTime,
    topMissions,
    weeklySubmissions,
    avgScorePerMission,
    maxWeeklyCount,
  };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range = "all" } = await searchParams;
  const analytics = await getAnalytics(range);

  const ranges = [
    { key: "7d", label: "7 jours" },
    { key: "30d", label: "30 jours" },
    { key: "90d", label: "90 jours" },
    { key: "all", label: "Tout" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <BarChart3 className="h-8 w-8" />
            Analytics des missions
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Tableau de bord des métriques de performance des missions.
          </p>
        </div>
        <Link href="/admin/missions">
          <Button variant="outline" className="font-mono text-xs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <Link key={r.key} href={`/admin/missions/analytics?range=${r.key}`}>
            <Button
              size="sm"
              variant={range === r.key ? "default" : "outline"}
              className={
                range === r.key
                  ? "bg-primary text-black font-mono text-xs"
                  : "text-xs font-mono text-zinc-400"
              }
            >
              {r.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{analytics.totalMissions}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Missions totales</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {Object.values(analytics.statusCounts).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Total</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {analytics.avgCompletionTime.toFixed(1)}j
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Temps moyen</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-violet-500/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{analytics.topMissions.length}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Avec soumissions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-tight mb-4">
            Missions par statut
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.statusCounts).map(([status, count]) => {
              const pct = analytics.totalMissions > 0 ? (count / analytics.totalMissions) * 100 : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="border font-mono text-3xs uppercase"
                    >
                      {STATUS_LABELS[status] ?? status}
                    </Badge>
                    <span className="text-zinc-400 font-mono text-xs">{count}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className={`${STATUS_COLORS[status] ?? "bg-zinc-600"} h-2 rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(analytics.statusCounts).length === 0 && (
              <p className="text-zinc-500 font-mono text-sm text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-tight mb-4">
            Soumissions par semaine (12 dernières semaines)
          </h2>
          <div className="flex items-end gap-1 h-40">
            {analytics.weeklySubmissions.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/70 rounded-t transition-all min-h-[2px]"
                  style={{
                    height: `${analytics.maxWeeklyCount > 0 ? (w.count / analytics.maxWeeklyCount) * 100 : 0}%`,
                  }}
                />
                <span className="text-xs-sm font-mono text-zinc-500 truncate w-full text-center">
                  {w.week}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-tight mb-4">
            Top 10 — Missions les plus soumises
          </h2>
          <div className="space-y-2">
            {analytics.topMissions.map((m, i) => (
              <Link
                key={m.id}
                href={`/admin/missions/${m.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="text-zinc-500 font-mono text-xs w-5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-mono text-sm group-hover:text-primary transition-colors truncate">
                    {m.title}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-primary font-mono text-sm font-bold">{m.submissionCount}</div>
                  <div className="text-zinc-500 font-mono text-3xs">soumissions</div>
                </div>
              </Link>
            ))}
            {analytics.topMissions.length === 0 && (
              <p className="text-zinc-500 font-mono text-sm text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-tight mb-4">
            Score moyen par mission
          </h2>
          <div className="space-y-3">
            {analytics.avgScorePerMission.slice(0, 10).map((m) => (
              <div key={m.title} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-mono text-xs truncate">{m.title}</span>
                  <span className="text-primary font-mono text-sm font-bold shrink-0 ml-2">
                    {m.avg.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((m.avg / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {analytics.avgScorePerMission.length === 0 && (
              <p className="text-zinc-500 font-mono text-sm text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
