"use client";

import { useState } from "react";
import { MISSIONS, Mission } from "@/lib/missions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Award, Target, CheckCircle2, Lock, ArrowRight, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: URL, 2: Feedback

  // Form State
  const [content, setContent] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [userDifficulty, setUserDifficulty] = useState(3);
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState("");
  const [improvementSuggestions, setImprovementSuggestions] = useState("");

  const availableMissions = MISSIONS.filter(m => m.requiredLevel <= userLevel);
  const lockedMissions = MISSIONS.filter(m => m.requiredLevel > userLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission || !content.trim()) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          missionId: selectedMission.id, 
          content,
          projectDescription,
          userDifficulty,
          userRating,
          userFeedback,
          improvementSuggestions
        })
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      toast.success("Mission accomplie !");
      
      if (data.leveledUp) {
        toast.success(`Niveau ${data.newLevel} débloqué ! Félicitations.`);
      }

      resetForm();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMission(null);
    setContent("");
    setProjectDescription("");
    setUserDifficulty(3);
    setUserRating(5);
    setUserFeedback("");
    setImprovementSuggestions("");
    setStep(1);
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
              <Dialog 
                open={selectedMission?.id === mission.id} 
                onOpenChange={(open) => {
                  if (!open) resetForm();
                  if (open) setSelectedMission(mission);
                }}
              >
                <DialogTrigger asChild>
                  <Button className="btn-primary-glow w-full gap-2">
                    Démarrer la validation <ArrowRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/40 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {step === 2 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full" 
                          onClick={() => setStep(1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                      {step === 1 ? `Validation : ${mission.title}` : "Rétrospection du projet"}
                    </DialogTitle>
                    <DialogDescription>
                      {step === 1 
                        ? "Soumet ton lien de projet pour prouver tes compétences." 
                        : "Partage ton expérience sur cette mission pour aider la communauté."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {step === 1 ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Lien du projet</Label>
                          <Input 
                            placeholder="https://github.com/ton-profil/projet" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-card/30 border-border/40 h-12 rounded-xl"
                            required
                            autoFocus
                          />
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl btn-primary-glow">
                          Suivant : Feedback <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Explique ton projet (Brief)</Label>
                          <Textarea 
                            placeholder="Qu'as-tu mis en place ? Quels outils as-tu utilisé ?" 
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            className="bg-card/30 border-border/40 rounded-xl min-h-[100px]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Difficulté ({userDifficulty}/5)</Label>
                            <Slider 
                              value={[userDifficulty]} 
                              onValueChange={(val) => setUserDifficulty(val[0])}
                              max={5}
                              min={1}
                              step={1}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Note Mission ({userRating}/5)</Label>
                            <Slider 
                              value={[userRating]} 
                              onValueChange={(val) => setUserRating(val[0])}
                              max={5}
                              min={1}
                              step={1}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ton avis global</Label>
                          <Textarea 
                            placeholder="Qu'as-tu pensé de cet exercice ?" 
                            value={userFeedback}
                            onChange={(e) => setUserFeedback(e.target.value)}
                            className="bg-card/30 border-border/40 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Suggestions d'amélioration</Label>
                          <Input 
                            placeholder="Comment rendre cette mission plus intéressante ?" 
                            value={improvementSuggestions}
                            onChange={(e) => setImprovementSuggestions(e.target.value)}
                            className="bg-card/30 border-border/40 h-12 rounded-xl"
                          />
                        </div>

                        <Button type="submit" className="w-full h-12 rounded-xl btn-primary-glow" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Award className="h-4 w-4 mr-2" />}
                          Finaliser la soumission (+{mission.xpReward} XP)
                        </Button>
                      </div>
                    )}
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
