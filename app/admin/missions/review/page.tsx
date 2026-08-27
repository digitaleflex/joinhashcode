"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ClipboardCheck,
  Check,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface SubmissionRow {
  id: string;
  userId: string;
  missionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  xpAwarded: number;
  userName: string | null;
  userEmail: string | null;
  missionTitle: string;
  missionSlug: string;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "En attente",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  IN_REVIEW: {
    label: "En revue",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  REVISION_REQUIRED: {
    label: "Révision",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  APPROVED: {
    label: "Approuvé",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejeté",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const STATUS_OPTIONS = [
  { key: "all", label: "Toutes" },
  { key: "PENDING", label: "En attente" },
  { key: "IN_REVIEW", label: "En revue" },
  { key: "REVISION_REQUIRED", label: "Révision" },
];

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 jour";
  return `${days} jours`;
}

export default function ReviewDashboardPage() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [missions, setMissions] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [missionFilter, setMissionFilter] = useState("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (missionFilter !== "all") params.set("missionId", missionFilter);
      const res = await fetch(`/api/admin/missions/review?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSubmissions(data.submissions);
      setMissions(data.missions);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, missionFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleClaim = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/missions/review/${id}/claim`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Soumission réclamée");
      fetchSubmissions();
    } catch {
      toast.error("Erreur lors de la réclamation");
    } finally {
      setActionId(null);
    }
  };

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE", feedback: "Approuvé par l'admin" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Soumission approuvée");
      fetchSubmissions();
    } catch {
      toast.error("Erreur lors de l'approbation");
    } finally {
      setActionId(null);
    }
  };

  const handleRevision = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "NEEDS_REVISION", feedback: "Révision demandée par l'admin" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Révision demandée");
      fetchSubmissions();
    } catch {
      toast.error("Erreur lors de la demande de révision");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <ClipboardCheck className="h-8 w-8" />
            Centre de revue unifié
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Révise toutes les soumissions en attente depuis une seule page.
          </p>
        </div>
        <Link href="/admin/missions">
          <Button variant="outline" className="font-mono text-xs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-zinc-500 font-mono text-[10px] uppercase">Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-zinc-500 font-mono text-[10px] uppercase">Mission</label>
          <select
            value={missionFilter}
            onChange={(e) => setMissionFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Toutes</option>
            {missions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <span className="text-zinc-500 font-mono text-xs">
            {submissions.length} soumission{submissions.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Utilisateur</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Mission</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Statut</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Score</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Soumis</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Attente</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-zinc-500 font-mono">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-zinc-500 font-mono">
                  Aucune soumission en attente.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((s) => {
                const sm = STATUS_META[s.status] ?? {
                  label: s.status,
                  className: "bg-zinc-500/10 text-zinc-400",
                };
                const isBusy = actionId === s.id;
                return (
                  <TableRow
                    key={s.id}
                    className="border-zinc-800 hover:bg-primary/5 transition-colors group"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-white font-mono text-sm">
                          {s.userName || "Anonyme"}
                        </span>
                        <span className="text-zinc-500 text-[10px] font-mono">{s.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/missions/${s.missionId}`}
                        className="text-zinc-300 font-mono text-sm hover:text-primary transition-colors"
                      >
                        {s.missionTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border font-mono text-[9px] uppercase ${sm.className}`}
                      >
                        {sm.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-mono text-sm font-bold">
                        {s.xpAwarded || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-zinc-400 font-mono text-xs">
                        {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-zinc-400 font-mono text-xs">
                        {timeSince(s.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {s.status === "PENDING" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10"
                            disabled={isBusy}
                            onClick={() => handleClaim(s.id)}
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ClipboardCheck className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {(s.status === "PENDING" || s.status === "IN_REVIEW") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                            disabled={isBusy}
                            onClick={() => handleApprove(s.id)}
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {(s.status === "PENDING" || s.status === "IN_REVIEW") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
                            disabled={isBusy}
                            onClick={() => handleRevision(s.id)}
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
