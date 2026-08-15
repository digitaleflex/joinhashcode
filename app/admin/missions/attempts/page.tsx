"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Target,
  Users,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttemptRow {
  id: string;
  status: string;
  currentStep: number;
  score: number | null;
  decision: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  user: { id: string; name: string; pseudo: string | null; email: string; image: string | null; class: string | null; level: number };
  mission: { id: string; title: string; slug: string; xp: number; category: string };
  reviewer: { id: string; name: string; pseudo: string | null } | null;
  stepsCompleted: number;
  lastActivity: { createdAt: string; action: string } | null;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  SUBMITTED: { label: "Soumise", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  IN_REVIEW: { label: "En revue", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  REVISION_REQUIRED: { label: "Révision", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "Validée", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejetée", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const TABS = [
  { key: "all", label: "Tous" },
  { key: "draft", label: "Brouillons" },
  { key: "submitted", label: "Soumises" },
  { key: "revision", label: "Révision" },
  { key: "approved", label: "Validées" },
  { key: "rejected", label: "Rejetées" },
];

export default function AdminAttemptsPage() {
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<{ attempts: AttemptRow[]; total: number }>({ attempts: [], total: 0 });
  const [loading, setLoading] = React.useState(true);
  const limit = 50;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab, page: String(page), limit: String(limit) });
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/missions/attempts?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [tab, page, search]);

  React.useEffect(() => {
    const t = setTimeout(() => fetchData(), search.trim() ? 350 : 100);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  const totalPages = Math.max(1, Math.ceil(data.total / limit));
  const counts = React.useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of data.attempts) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [data.attempts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <FileCheck className="h-8 w-8" />
            Onboarding — Reviews
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Suivi et revue de Mission 01 — Fais connaissance avec HashCode.
          </p>
        </div>
        <Link href="/admin/missions">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Missions
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Membres concernés", value: data.total, color: "text-primary" },
          { icon: Hourglass, label: "En attente de revue", value: (counts.SUBMITTED ?? 0) + (counts.IN_REVIEW ?? 0), color: "text-blue-500" },
          { icon: AlertTriangle, label: "Révisions", value: counts.REVISION_REQUIRED ?? 0, color: "text-amber-500" },
          { icon: CheckCircle2, label: "Validées", value: counts.APPROVED ?? 0, color: "text-emerald-500" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
            <s.icon className={`h-6 w-6 ${s.color}`} />
            <div>
              <div className="text-2xl font-mono font-bold text-white">{s.value}</div>
              <div className="text-zinc-500 text-[10px] font-mono uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Button
              key={t.key}
              size="sm"
              variant={tab === t.key ? "default" : "outline"}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={tab === t.key ? "bg-primary text-black font-mono text-xs" : "text-xs font-mono text-zinc-400"}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un membre..."
            className="pl-9 bg-zinc-900/50 border-zinc-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Membre</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Progression</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Statut</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Score</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Dernière activité</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500 font-mono">Chargement...</TableCell>
              </TableRow>
            ) : data.attempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500 font-mono">
                  Aucune tentative trouvée.
                </TableCell>
              </TableRow>
            ) : (
              data.attempts.map((a) => {
                const meta = STATUS_META[a.status] ?? { label: a.status, className: "bg-zinc-500/10 text-zinc-400" };
                const pct = a.mission ? Math.round((a.stepsCompleted / 10) * 100) : 0;
                return (
                  <TableRow key={a.id} className="border-zinc-800 hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-white font-mono font-bold text-sm">{a.user.name}</span>
                        <span className="text-zinc-500 text-xs font-mono">{a.user.pseudo ?? a.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-zinc-300 font-mono text-sm">{pct}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[9px] uppercase font-mono ${meta.className}`}>{meta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-mono text-sm ${a.score != null ? "text-primary" : "text-zinc-600"}`}>
                        {a.score != null ? `${a.score}/25` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-zinc-500 text-xs font-mono">
                        {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/missions/attempts/${a.id}`}>
                        <Button size="sm" variant="outline" className="font-mono text-xs gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {a.status === "DRAFT" ? "Voir" : "Revoir"}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono text-zinc-500">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
