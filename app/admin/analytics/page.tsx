"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  Shield,
  Target,
  Download,
  Calendar,
  ChevronLeft,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";


import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { FunnelSection } from "@/components/admin/dashboard/funnel-section";
import { RetentionSection } from "@/components/admin/dashboard/retention-section";
import { ActivityChartSection } from "@/components/admin/dashboard/activity-chart-section";
import { MissionDropoffSection } from "@/components/admin/dashboard/mission-dropoff-section";
import { ProfileDistributionSection } from "@/components/admin/dashboard/profile-distribution-section";

interface AnalyticsData {
  period: { startDate: string; endDate: string; days: number };
  users: {
    total: number;
    new: number;
    active7d: number;
    active30d: number;
    retention7: number;
    retention30: number;
    retentionData: { cohort: string; total: number; active: number; retention: number }[];
    byCountry: { country: string; count: number }[];
    byRole: { role: string; count: number }[];
    byClass: { class: string; count: number }[];
  };
  missions: {
    total: number;
    published: number;
    submissions: { total: number; approved: number; rejected: number; pending: number };
    overallCompletionRate: number;
    byCategory: { category: string; total: number; approved: number; rejected: number; pending: number; completionRate: number }[];
    byDifficulty: { difficulty: number; total: number; approved: number; rejected: number; pending: number; completionRate: number }[];
  };
  squads: {
    total: number;
    active: number;
    avgCohesion: number;
    avgMembers: number;
    streakDistribution: Record<string, number>;
  };
  profiles: { distribution: { profile: string; count: number; percentage: number }[]; totalQuizzes: number };
  funnel: { stage: string; count: number; conversionRate: number; dropOffRate: number }[];
  growth: { date: string; signups: number; checkins: number; submissions: number }[];
}

interface WeeklyData {
  dayStart: Date;
  checkins: number;
  signups: number;
  missions: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("days", String(days));
      const response = await fetch(`/api/admin/analytics/overview?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      setData(json);
    } catch {
      // Silent error
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async (type: string) => {
    try {
      const params = new URLSearchParams();
      params.set("type", type);
      params.set("days", String(days));
      const response = await fetch(`/api/admin/analytics/export?${params}`);
      if (!response.ok) throw new Error("Failed to export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${type}-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // Silent error
    }
  };

  const handleDateRangeChange = (newDays: number) => {
    setDays(newDays);
    const newStart = new Date();
    newStart.setDate(newStart.getDate() - newDays);
    setStartDate(newStart);
    setEndDate(new Date());
  };

  if (!data && loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics & Insights
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Cockpit de progression — acquisition, activation, orientation, rétention
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-8 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics & Insights
          </h1>
        </div>
        <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-12 text-center">
          <p className="text-sm text-muted-foreground">Erreur lors du chargement des données</p>
          <Button onClick={fetchData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const { users, missions, squads, profiles, funnel, growth } = data;

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  };

  const funnelSteps = funnel.map((f) => ({
    label: f.stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: f.count,
    desc: "",
  }));

  const weeklyData: WeeklyData[] = growth.map((g) => ({
    dayStart: new Date(g.date),
    checkins: g.checkins,
    signups: g.signups,
    missions: g.submissions,
  }));

  const submissionsByLevel: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {
    INIT: { total: 0, approved: 0, pending: 0, rejected: 0 },
    CORE: { total: 0, approved: 0, pending: 0, rejected: 0 },
    PRO: { total: 0, approved: 0, pending: 0, rejected: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <BarChart3 className="h-8 w-8" />
            Analytics & Insights
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Vue d'ensemble plateforme — {data.period.days} derniers jours
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  {format(startOfDay(startDate), "dd MMM", { locale: fr })}
                  {" - "}
                  {format(endOfDay(endDate), "dd MMM yyyy", { locale: fr })}
                  <ChevronLeft className="h-4 w-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="grid grid-cols-2 gap-1">
                  {[7, 14, 30, 60, 90].map((d) => (
                    <Button
                      key={d}
                      variant={days === d ? "default" : "outline"}
                      size="sm"
                      className="font-mono text-xs"
                      onClick={() => handleDateRangeChange(d)}
                    >
                      {d}j
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs col-span-2"
                    onClick={() => handleDateRangeChange(365)}
                  >
                    365j
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => handleExport("overview")} className="font-mono text-xs">
              <Download className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("users")} className="font-mono text-xs">
              <Users className="h-4 w-4 mr-1" />
              Users
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("missions")} className="font-mono text-xs">
              <Target className="h-4 w-4 mr-1" />
              Missions
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("squads")} className="font-mono text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Squads
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("funnel")} className="font-mono text-xs">
              <Filter className="h-4 w-4 mr-1" />
              Funnel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Membres Totaux</span>
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">{users.total.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px] font-mono">+{users.new} nouveaux ({data.period.days}j)</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Actifs 7j / 30j</span>
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {users.active7d} / {users.active30d}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className={users.retention7 >= 50 ? "text-emerald-400" : "text-amber-400"}>
              Rétention J7: {users.retention7}%
            </span>
            <span className={users.retention30 >= 30 ? "text-emerald-400" : "text-amber-400"}>
              Rétention J30: {users.retention30}%
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-violet-400">
            <Target className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Missions</span>
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {missions.published} / {missions.total}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Taux completion: {missions.overallCompletionRate}%
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Escouades</span>
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">{squads.active} / {squads.total}</div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>Cohésion: {squads.avgCohesion}</span>
            <span>Moy. membres: {squads.avgMembers}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelSection steps={funnelSteps} />

        <ProfileDistributionSection
          quizByProfile={profiles.distribution.map((d) => ({
            profileType: d.profile,
            _count: { profileType: d.count },
          }))}
          profileColors={profileColors}
        />
      </div>

      <ActivityChartSection
        activeNow={0}
        weeklyData={weeklyData.length > 0 ? weeklyData : Array.from({ length: 7 }, (_, i) => ({
          dayStart: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
          checkins: 0,
          signups: 0,
          missions: 0,
        }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissionDropoffSection submissionsByLevel={submissionsByLevel} />

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Target className="h-3 w-3" /> Completion par Catégorie
          </h2>
          <div className="space-y-3">
            {missions.byCategory.slice(0, 8).map((cat) => (
              <div key={cat.category} className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{cat.category}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{cat.total} soumissions</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-emerald-400">✅ {cat.approved}</span>
                  <span className="text-amber-400">⏳ {cat.pending}</span>
                  <span className="text-red-400">❌ {cat.rejected}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Taux de réussite</span>
                    <span className={cat.completionRate >= 60 ? "text-emerald-400" : cat.completionRate >= 30 ? "text-amber-400" : "text-red-400"}>{cat.completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${cat.completionRate}%`, background: cat.completionRate >= 60 ? "#22c55e" : cat.completionRate >= 30 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-3 w-3" /> Completion par Difficulté
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missions.byDifficulty.map((diff) => (
              <div key={diff.difficulty} className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Niveau {diff.difficulty}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{diff.total} soumissions</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-emerald-400">✅ {diff.approved}</span>
                  <span className="text-amber-400">⏳ {diff.pending}</span>
                  <span className="text-red-400">❌ {diff.rejected}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Taux de réussite</span>
                    <span className={diff.completionRate >= 60 ? "text-emerald-400" : diff.completionRate >= 30 ? "text-amber-400" : "text-red-400"}>{diff.completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${diff.completionRate}%`, background: diff.completionRate >= 60 ? "#22c55e" : diff.completionRate >= 30 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Shield className="h-3 w-3" /> Distribution des Streaks Escouades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(squads.streakDistribution).map(([range, count]) => (
              <div key={range} className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <div className="text-2xl font-bold text-white font-mono">{count}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">{range} jours</div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  {squads.total > 0 ? Math.round((count / squads.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RetentionSection
        kpis={[
          { label: "Cohortes hebdo (rétention)", value: users.retentionData.slice(-1)[0]?.retention ?? 0, icon: Shield, color: "text-emerald-400", sub: "Dernière cohorte" },
          { label: "Pays top", value: users.byCountry[0]?.country ?? "—", icon: Users, color: "text-primary", sub: `${users.byCountry[0]?.count ?? 0} membres` },
          { label: "Rôle dominant", value: users.byRole[0]?.role ?? "—", icon: Target, color: "text-amber-400", sub: `${users.byRole[0]?.count ?? 0} membres` },
          { label: "Profil dominant", value: profiles.distribution[0]?.profile ?? "—", icon: BarChart3, color: "text-violet-400", sub: `${profiles.distribution[0]?.percentage ?? 0}%` },
        ]}
      />
    </div>
  );
}