"use client";

import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MissionForm } from "@/components/admin/MissionForm";
import { Prisma } from "@/generated/prisma/client";

type Mission = Prisma.MissionGetPayload<object>;
import { 
  Plus, 
  Edit, 
  Trash2, 
  Terminal, 
  Target, 
  Zap,
  LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/missions");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setMissions(data as Mission[]);
    } catch (error: unknown) {
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Es-tu sûr de vouloir supprimer cette mission ?")) return;

    try {
      const response = await fetch(`/api/admin/missions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Mission supprimée");
      fetchMissions();
    } catch (error: unknown) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (diff <= 4) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

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

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingMission(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Mission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-mono text-primary uppercase tracking-tighter">
                {editingMission ? "Édition de Mission" : "Configuration d'un Nouvel Objectif"}
              </DialogTitle>
            </DialogHeader>
            <MissionForm 
              initialData={editingMission} 
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchMissions();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">{missions.length}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Missions Totales</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-sm flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Zap className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {missions.filter(m => m.isWeeklyChallenge).length}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Challenges Hebdo</div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-sm flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-full">
            <LayoutDashboard className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">
              {new Set(missions.map(m => m.category)).size}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase">Catégories</div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Mission</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs">Catégorie</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Niveau</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Difficulté</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">XP</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500 font-mono">
                  Initialisation du flux de données...
                </TableCell>
              </TableRow>
            ) : missions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500 font-mono">
                  Aucune mission détectée dans le secteur.
                </TableCell>
              </TableRow>
            ) : (
              missions.map((mission) => (
                <TableRow key={mission.id} className="border-zinc-800 hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-mono font-bold text-base group-hover:text-primary transition-colors">
                        {mission.title}
                      </span>
                      <span className="text-zinc-500 text-xs font-mono">{mission.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-zinc-700 font-mono text-[10px] uppercase">
                      {mission.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-zinc-300 font-mono text-sm">{mission.missionLevel || "INIT"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getDifficultyColor(mission.difficulty)} border font-mono`}>
                      {mission.difficulty}/5
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-primary font-mono font-bold">{mission.xp} XP</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setEditingMission(mission);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(mission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
