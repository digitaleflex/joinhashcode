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
  Plus,
  Trash2,
  Calendar,
  Users,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";




import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";

interface InterventionRow {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  speaker: string;
  capacity: number;
  location: string;
  locationUrl: string | null;
  recordingUrl: string | null;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attendeeCount: number;
  registeredCount: number;
  attendedCount: number;
  waitlistCount: number;
}

const STATUS_TABS = [
  { key: "all", label: "Toutes" },
  { key: "DRAFT", label: "Brouillon" },
  { key: "PUBLISHED", label: "Publiée" },
  { key: "COMPLETED", label: "Terminée" },
  { key: "CANCELLED", label: "Annulée" },
];

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  PUBLISHED: { label: "Publiée", className: "bg-primary/10 text-primary border-primary/20" },
  COMPLETED: { label: "Terminée", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Annulée", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const LOCATION_TYPES = [
  { value: "online", label: "En ligne" },
  { value: "offline", label: "Présentiel" },
  { value: "hybrid", label: "Hybride" },
];

export default function AdminInterventionsPage() {
  const [interventions, setInterventions] = useState<InterventionRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarWeek, setCalendarWeek] = useState(new Date());

  const fetchInterventions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("page", String(page));
      params.set("limit", "20");
      const response = await fetch(`/api/admin/interventions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setInterventions(data.interventions as InterventionRow[]);
      setCounts(data.counts as Record<string, number>);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Erreur lors du chargement des interventions");
    } finally {
      setLoading(false);
    }
  }, [tab, page, searchQuery]);

  useEffect(() => {
    fetchInterventions();
  }, [fetchInterventions]);

  const handleSoftDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/interventions/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Intervention supprimée");
      fetchInterventions();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
      setDeleteTitle("");
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      const response = await fetch(`/api/admin/interventions/export?${params}`);
      if (!response.ok) throw new Error("Failed to export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interventions-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Export téléchargé");
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const weekStart = startOfWeek(calendarWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(calendarWeek, { weekStartsOn: 1 });

  const calendarInterventions = interventions.filter((i) => {
    const date = new Date(i.date);
    return date >= weekStart && date <= weekEnd;
  });

  const getStatusColor = (status: string) => {
    return STATUS_META[status]?.className || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <Calendar className="h-8 w-8" />
            Interventions
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Gestion des événements, ateliers et conférences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="font-mono text-xs"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/admin/interventions/new">
            <Button className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Intervention
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{totalCount}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Interventions Totales</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{counts.PUBLISHED ?? 0}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Publiées</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {interventions.reduce((sum, i) => sum + i.attendeeCount, 0)}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Inscrits Total</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{counts.COMPLETED ?? 0}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Terminées</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const count = t.key === "all" ? totalCount : (counts[t.key] ?? 0);
          return (
            <Button
              key={t.key}
              size="sm"
              variant={tab === t.key ? "default" : "outline"}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={
                tab === t.key
                  ? "bg-primary text-black font-mono text-xs"
                  : "text-xs font-mono text-zinc-400"
              }
            >
              {t.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Rechercher par titre, speaker, lieu..."
            className="bg-zinc-900 border-zinc-800 font-mono text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary text-black" : ""}
          >
            Liste
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={viewMode === "calendar" ? "bg-primary text-black" : ""}
          >
            Calendrier
          </Button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="glass-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead className="text-zinc-400 font-mono uppercase text-xs">Intervention</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs">Date / Durée</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs">Speaker</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs">Lieu</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Capacité</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Inscrits</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs">Statut</TableHead>
                <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-zinc-500 font-mono">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : interventions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-zinc-500 font-mono">
                    Aucune intervention disponible.
                  </TableCell>
                </TableRow>
              ) : (
                interventions.map((intervention) => {
                  const sm = STATUS_META[intervention.status] ?? {
                    label: intervention.status,
                    className: "bg-zinc-500/10 text-zinc-400",
                  };
                  const date = new Date(intervention.date);
                  return (
                    <TableRow
                      key={intervention.id}
                      className="border-zinc-800 hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-mono font-bold text-base group-hover:text-primary transition-colors">
                            {intervention.title}
                          </span>
                          <span className="text-zinc-500 text-xs font-mono line-clamp-1 max-w-xs">
                            {intervention.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-white font-mono text-sm">
                            {format(date, "dd MMM yyyy", { locale: fr })}
                          </span>
                          <span className="text-zinc-500 text-xs font-mono">
                            {format(date, "HH:mm", { locale: fr })} · {intervention.duration}min
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-300 font-mono text-sm">{intervention.speaker}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-zinc-700 font-mono text-xs uppercase">
                          {LOCATION_TYPES.find((l) => l.value === intervention.location)?.label || intervention.location}
                        </Badge>
                        {intervention.locationUrl && (
                          <a href={intervention.locationUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline text-xs">
                            Lien
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-zinc-300 font-mono text-sm">{intervention.capacity}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-white font-mono font-bold">{intervention.registeredCount}</span>
                          <span className="text-zinc-500 text-xs font-mono">
                            {intervention.waitlistCount > 0 ? `+${intervention.waitlistCount} liste d'attente` : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border font-mono text-3xs uppercase ${getStatusColor(intervention.status)}`}
                        >
                          {sm.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/interventions/${intervention.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/interventions/${intervention.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => {
                              setDeleteId(intervention.id);
                              setDeleteTitle(intervention.title);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => setCalendarWeek(subWeeks(calendarWeek, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-bold text-white font-mono">
              Semaine du {format(weekStart, "dd MMM", { locale: fr })} au {format(weekEnd, "dd MMM yyyy", { locale: fr })}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setCalendarWeek(addWeeks(calendarWeek, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const day = addDays(weekStart, i);
              const dayInterventions = calendarInterventions.filter((intervention) => {
                const date = new Date(intervention.date);
                return date.getDate() === day.getDate() && date.getMonth() === day.getMonth();
              });
              return (
                <div key={i} className="min-h-[120px] border border-white/5 bg-white/[0.02] rounded-lg p-2">
                  <div className="text-xs font-mono text-zinc-400 mb-2">
                    {format(day, "EEE dd", { locale: fr })}
                  </div>
                  <div className="space-y-1">
                    {dayInterventions.map((intervention) => (
                      <div
                        key={intervention.id}
                        className="text-xs font-mono px-1.5 py-1 rounded bg-primary/20 text-primary truncate hover:bg-primary/30 cursor-pointer"
                        title={intervention.title}
                      >
                        {format(new Date(intervention.date), "HH:mm", { locale: fr })} {intervention.title}
                      </div>
                    ))}
                    {dayInterventions.length === 0 && (
                      <div className="text-xs text-zinc-600 h-full flex items-center justify-center">
                        —
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-zinc-400 font-mono text-sm">Page {page} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeleteTitle("");
          }
        }}
        title="Supprimer cette intervention ?"
        description={`L'intervention « ${deleteTitle} » sera supprimée définitivement.`}
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleSoftDelete}
      />
    </div>
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}