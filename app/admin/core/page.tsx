"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BrainCircuit,
  RefreshCw,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Progress,
} from "@/components/ui/progress";

interface CoreStats {
  totalUsers: number;
  classDistribution: { class: string; count: number }[];
  avgVibrancyByClass: Record<string, { builder: number; creator: number; strategist: number; catalyst: number }>;
  confidenceScores: { builder: number; creator: number; strategist: number; catalyst: number };
}

export default function AdminCorePage() {
  const [stats, setStats] = useState<CoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/core/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error("Erreur lors du chargement des stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRecalculate = async (scope: "all" | "unassigned") => {
    setRecalculating(true);
    try {
      const res = await fetch("/api/admin/core/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast.success(`${data.updated} utilisateurs recalculés (${scope})`);
      fetchStats();
    } catch {
      toast.error("Erreur lors du recalcul");
    } finally {
      setRecalculating(false);
    }
  };

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  };

  const profileLabels: Record<string, string> = {
    builder: "Builder",
    creator: "Créateur",
    strategist: "Stratège",
    catalyst: "Catalyst",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <BrainCircuit className="h-8 w-8" />
            CORE — Moteur Comportemental
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Dashboard de surveillance et actions sur le moteur d'évolution comportemental.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleRecalculate("unassigned")}
            disabled={recalculating}
            className="font-mono text-xs"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculer non assignés
          </Button>
          <Button
            onClick={() => handleRecalculate("all")}
            disabled={recalculating}
            className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight text-xs"
          >
            {recalculating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recalcul en cours...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recalculer TOUS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-primary" />
              Utilisateurs Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono font-bold text-white">{stats?.totalUsers ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-emerald-500" />
              Classes Assignées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono font-bold text-white">
              {stats?.classDistribution.reduce((a, b) => a + b.count, 0) ?? 0}
            </div>
            <div className="text-zinc-500 text-xs font-mono mt-1">
              {stats?.totalUsers && stats.totalUsers > 0
                ? `${Math.round((stats.classDistribution.reduce((a, b) => a + b.count, 0) / stats.totalUsers) * 100)}% assignés`
                : "0% assignés"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Confiance Globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono font-bold text-white">
              {stats?.confidenceScores
                ? Math.round(
                    (stats.confidenceScores.builder +
                      stats.confidenceScores.creator +
                      stats.confidenceScores.strategist +
                      stats.confidenceScores.catalyst) /
                      4
                  )
                : 0}
            </div>
            <div className="text-zinc-500 text-xs font-mono mt-1">Score moyen toutes dimensions</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Sans Classe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono font-bold text-white">
              {stats && stats.totalUsers - stats.classDistribution.reduce((a, b) => a + b.count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5" />
              Distribution des Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.classDistribution.map((c) => (
              <div key={c.class} className="space-y-1">
                <div className="flex justify-between text-sm font-mono">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: profileColors[c.class] || "#666" }}
                    />
                    {profileLabels[c.class] || c.class}
                  </span>
                  <span className="text-primary font-bold">{c.count}</span>
                </div>
                <Progress
                  value={stats.totalUsers > 0 ? (c.count / stats.totalUsers) * 100 : 0}
                  className="h-2"
                  style={{ "--progress-color": profileColors[c.class] || "#666" } as React.CSSProperties}
                />
              </div>
            ))}
            {(!stats?.classDistribution.length || stats.classDistribution.length === 0) && (
              <p className="text-zinc-500 text-center py-8 font-mono text-sm">Aucune classe assignée</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
              <Target className="h-5 w-5" />
              Scores de Confiance (Moyennes)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats && (
              <>
                {(["builder", "creator", "strategist", "catalyst"] as const).map((dim) => (
                  <div key={dim} className="space-y-1">
                    <div className="flex justify-between text-sm font-mono">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: profileColors[dim] }}
                        />
                        {profileLabels[dim]}
                      </span>
                      <span className="text-primary font-bold">{stats.confidenceScores[dim]}</span>
                    </div>
                    <Progress
                      value={Math.min((stats.confidenceScores[dim] / 100) * 100, 100)}
                      className="h-2"
                      style={{ "--progress-color": profileColors[dim] } as React.CSSProperties}
                    />
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center gap-2 text-white">
            <BrainCircuit className="h-5 w-5" />
            Vibrance Comportementale Moyenne par Classe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="text-left p-3">Classe</th>
                  <th className="text-right p-3" style={{ color: profileColors.builder }}>Builder</th>
                  <th className="text-right p-3" style={{ color: profileColors.creator }}>Créateur</th>
                  <th className="text-right p-3" style={{ color: profileColors.strategist }}>Stratège</th>
                  <th className="text-right p-3" style={{ color: profileColors.catalyst }}>Catalyst</th>
                  <th className="text-right p-3">Utilisateurs</th>
                </tr>
              </thead>
              <tbody>
                {stats && Object.entries(stats.avgVibrancyByClass).map(([cls, vibrancy]) => (
                  <tr key={cls} className="border-b border-zinc-800/50 hover:bg-white/5">
                    <td className="p-3 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: profileColors[cls] || "#666" }}
                      />
                      {profileLabels[cls] || cls}
                    </td>
                    <td className="p-3 text-right" style={{ color: profileColors.builder }}>
                      {vibrancy.builder.toFixed(1)}
                    </td>
                    <td className="p-3 text-right" style={{ color: profileColors.creator }}>
                      {vibrancy.creator.toFixed(1)}
                    </td>
                    <td className="p-3 text-right" style={{ color: profileColors.strategist }}>
                      {vibrancy.strategist.toFixed(1)}
                    </td>
                    <td className="p-3 text-right" style={{ color: profileColors.catalyst }}>
                      {vibrancy.catalyst.toFixed(1)}
                    </td>
                    <td className="p-3 text-right text-zinc-400">{stats.classDistribution.find((c) => c.class === cls)?.count || 0}</td>
                  </tr>
                ))}
                {(!stats || Object.keys(stats.avgVibrancyByClass).length === 0) && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-zinc-500 font-mono text-sm">
                      Aucune donnée de vibrance disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}