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
  Terminal,
  Target,
  Zap,
  LayoutDashboard,
  ExternalLink,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMissionPermissions } from "@/hooks/use-mission-permissions";
import { Input } from "@/components/ui/input";

interface MissionRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: number;
  xp: number;
  missionLevel: string | null;
  status: string;
  isWeeklyChallenge: boolean;
  deletedAt: string | null;
  _count: { attempts: number; submissions: number };
}

const STATUS_TABS = [
  { key: "all", label: "Toutes" },
  { key: "DRAFT", label: "Brouillon" },
  { key: "PUBLISHED", label: "Publiée" },
  { key: "CLOSED", label: "Fermée" },
  { key: "ARCHIVED", label: "Archivée" },
];

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  PUBLISHED: { label: "Publiée", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CLOSED: { label: "Fermée", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ARCHIVED: { label: "Archivée", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminMissionsPage() {
  const { canCreate, canDelete } = useMissionPermissions();
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (tagFilter.trim()) params.set("tag", tagFilter.trim());
      const response = await fetch(`/api/admin/missions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setMissions(data.missions as MissionRow[]);
      setCounts(data.counts as Record<string, number>);
    } catch {
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  }, [tab, tagFilter]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleSoftDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/missions/${deleteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error("Failed to soft-delete");
      toast.success("Mission supprimée");
      fetchMissions();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
      setDeleteTitle("");
    }
  };

  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (diff <= 4) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <Terminal className="h-8 w-8" />
            Centre de gestion des missions
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Gère les missions et les défis de la communauté.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreate && (
            <Link href="/admin/missions/new">
              <Button className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Mission
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{totalCount}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Missions Totales</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <Zap className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{counts.PUBLISHED ?? 0}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Publiées</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-zinc-500/10 p-3 rounded-full">
            <LayoutDashboard className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{counts.DRAFT ?? 0}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Brouillons</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-full">
            <Target className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {(counts.CLOSED ?? 0) + (counts.ARCHIVED ?? 0)}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Fermées / Archivées</div>
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
              onClick={() => setTab(t.key)}
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
          <Tag className="h-4 w-4 text-zinc-500 shrink-0" />
          <Input
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Filtrer par tag..."
            className="bg-zinc-900 border-zinc-800 font-mono text-sm"
          />
        </div>
      </div>

      <div className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Mission</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Statut</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Catégorie</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Niveau</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Difficulté</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">XP</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Tentatives</TableHead>
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
            ) : missions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-zinc-500 font-mono">
                  Aucune mission disponible.
                </TableCell>
              </TableRow>
            ) : (
              missions.map((mission) => {
                const sm = STATUS_META[mission.status] ?? {
                  label: mission.status,
                  className: "bg-zinc-500/10 text-zinc-400",
                };
                return (
                  <TableRow
                    key={mission.id}
                    className="border-zinc-800 hover:bg-primary/5 transition-colors group"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-white font-mono font-bold text-base group-hover:text-primary transition-colors">
                          {mission.title}
                        </span>
                        <span className="text-zinc-500 text-xs font-mono">{mission.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border font-mono text-3xs uppercase ${sm.className}`}
                      >
                        {sm.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-zinc-700 font-mono text-xs uppercase"
                      >
                        {mission.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-zinc-300 font-mono text-sm">
                        {mission.missionLevel || "INIT"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`${getDifficultyColor(mission.difficulty)} border font-mono`}
                      >
                        {mission.difficulty}/5
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-primary font-mono font-bold">{mission.xp} XP</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-zinc-400 font-mono text-sm">
                        {mission._count.attempts + mission._count.submissions}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/missions/${mission.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => {
                              setDeleteId(mission.id);
                              setDeleteTitle(mission.title);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeleteTitle("");
          }
        }}
        title="Supprimer cette mission ?"
        description={`La mission « ${deleteTitle} » sera masquée de la liste. Cette action est réversible.`}
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleSoftDelete}
      />
    </div>
  );
}
