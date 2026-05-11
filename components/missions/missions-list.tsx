"use client";

import { useState } from "react";
import { MISSIONS, Mission } from "@/lib/missions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Award, Target, CheckCircle2, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MissionsList({ 
  userLevel, 
  userXp, 
  submissions 
}: { 
  userLevel: number; 
  userXp: number;
  submissions: Record<string, string>; // missionId -> status
}) {
  const router = useRouter();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableMissions = MISSIONS.filter(m => m.requiredLevel <= userLevel);
  const lockedMissions = MISSIONS.filter(m => m.requiredLevel > userLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: selectedMission.id, content })
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      toast.success("Mission accomplie !");
      
      if (data.leveledUp) {
        toast.success(`Niveau ${data.newLevel} débloqué ! Félicitations.`);
      }

      setSelectedMission(null);
      setContent("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMission = (mission: Mission, isLocked: boolean) => {
    const status = submissions[mission.id];
    const isCompleted = status === "APPROVED";
    const isPending = status === "PENDING";

    return (
      <Card key={mission.id} className={`relative overflow-hidden transition-all ${isLocked ? 'opacity-50 grayscale bg-muted/20' : 'bg-card hover:border-primary/50'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter ${isCompleted ? 'bg-emerald-500/20 text-emerald-500' : isPending ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'}`}>
                {isCompleted ? 'COMPLÉTÉ' : isPending ? 'EN ATTENTE' : `+${mission.xpReward} XP`}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {mission.type}
              </span>
            </div>
            {isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : null}
          </div>
          <CardTitle className="text-xl">{mission.title}</CardTitle>
          <CardDescription className="text-sm mt-2">
            {mission.shortDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-zinc-400 bg-background/50 p-3 rounded-lg border border-border/50">
              <p className="font-mono text-xs uppercase text-primary mb-1 tracking-widest">Description_</p>
              <p>{mission.description}</p>
              
              <p className="font-mono text-xs uppercase text-primary mb-1 mt-3 tracking-widest">Critères_</p>
              <ul className="list-disc pl-4 space-y-1">
                {mission.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </div>

            {!isLocked && !isCompleted && !isPending && (
              <Dialog open={selectedMission?.id === mission.id} onOpenChange={(open) => !open && setSelectedMission(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" onClick={() => setSelectedMission(mission)}>
                    Démarrer la validation <ArrowRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Validation : {mission.title}</DialogTitle>
                    <DialogDescription>
                      Soumets ton lien de projet (GitHub, Figma, Vercel...) pour prouver tes compétences et gagner {mission.xpReward} XP.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <Input 
                      placeholder="https://github.com/ton-profil/projet" 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      autoFocus
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transmettre l'archive"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {isPending && (
              <Button variant="secondary" className="w-full" disabled>En cours de revue...</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Active Missions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Missions Disponibles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {availableMissions.map(m => renderMission(m, false))}
          {availableMissions.length === 0 && (
             <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border">
               Aucune mission disponible pour le moment.
             </div>
          )}
        </div>
      </div>

      {/* Locked Missions */}
      {lockedMissions.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-border/40">
          <h2 className="text-xl font-medium text-muted-foreground flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Missions Futures (Niveau supérieur requis)
          </h2>
          <div className="grid md:grid-cols-2 gap-6 opacity-80">
            {lockedMissions.map(m => renderMission(m, true))}
          </div>
        </div>
      )}
    </div>
  );
}
