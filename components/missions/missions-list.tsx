"use client";

import { useState, useEffect } from "react";
import { MISSIONS, Mission } from "@/lib/missions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Award, Target, CheckCircle2, Lock, ArrowRight, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MissionsList({ 
  userLevel, 
  userXp, 
  submissions,
  userClass
}: { 
  userLevel: number; 
  userXp: number;
  submissions: Record<string, string>; // missionId -> status
  userClass?: string | null;
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

  // Social Mission State
  const [socialClicks, setSocialClicks] = useState<Record<string, boolean>>({
    telegram: false,
    discord: false,
    whatsapp: false
  });

  // Sync social clicks with submission status
  useEffect(() => {
    const status = submissions["social-connection-protocol"];
    if (status === "APPROVED" || status === "PENDING") {
      setSocialClicks({ telegram: true, discord: true, whatsapp: true });
    }
  }, [submissions]);

  // Ancrage mission fields
  const [ancrageProjet, setAncrageProjet] = useState("");
  const [ancrageObjectif, setAncrageObjectif] = useState("");

  const handleSocialClick = async (platform: string) => {
    // If already completed or pending, don't do anything
    if (submissions["social-connection-protocol"] === "APPROVED" || submissions["social-connection-protocol"] === "PENDING") return;
    if (socialClicks[platform]) return;

    const newClicks = { ...socialClicks, [platform]: true };
    setSocialClicks(newClicks);
    
    const count = Object.values(newClicks).filter(Boolean).length;
    const percentage = Math.round((count / 3) * 100);
    
    if (count < 3) {
      toast.info(`Progression : ${percentage}% - Rejoins les autres canaux pour valider la mission !`);
    }

    if (count === 3) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            missionId: "social-connection-protocol",
            content: "Validation automatique par clics sociaux (Telegram, Discord, WhatsApp)",
            projectDescription: "Rejoint les canaux communautaires de HASHCODE.",
            userDifficulty: 1,
            userRating: 5,
            userFeedback: "Validation automatique via clics",
            improvementSuggestions: ""
          })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        toast.success("Mission accomplie ! Les protocoles de connexion sont validés.");
        
        if (data.leveledUp) {
          toast.success(`Niveau ${data.newLevel} débloqué ! Félicitations.`);
        }

        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la validation");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const availableMissions = MISSIONS.filter(m => {
    const isLevelMatch = m.requiredLevel <= userLevel;
    const isClassMatch = !m.targetProfiles || m.targetProfiles.length === 0 || (userClass && m.targetProfiles.includes(userClass.toLowerCase() as any));
    return isLevelMatch && isClassMatch;
  });

  const lockedMissions = MISSIONS.filter(m => {
    const isLevelLocked = m.requiredLevel > userLevel;
    const isClassMatch = !m.targetProfiles || m.targetProfiles.length === 0 || (userClass && m.targetProfiles.includes(userClass.toLowerCase() as any));
    return isLevelLocked && isClassMatch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission) return;

    const isAncrage = selectedMission.type === "INTRO";

    if (isAncrage) {
      if (!ancrageProjet.trim() || !ancrageObjectif.trim()) return;
    } else {
      if (!content.trim()) return;
      if (step === 1) { setStep(2); return; }
    }

    setIsSubmitting(true);
    try {
      const submissionContent = isAncrage
        ? `Projet : ${ancrageProjet}\n\nObjectif 3 mois : ${ancrageObjectif}`
        : content;

      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: selectedMission.id,
          content: submissionContent,
          projectDescription: isAncrage ? ancrageObjectif : projectDescription,
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
    setAncrageProjet("");
    setAncrageObjectif("");
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
              
              {mission.id === "social-connection-protocol" ? (
                <div className="flex flex-col gap-3 mt-3">
                  <a 
                    href="https://t.me/innovcode" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('telegram')}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all text-xs ${socialClicks.telegram ? 'bg-[#0088cc]/40 border-[#0088cc] text-white' : 'bg-[#0088cc]/20 border-[#0088cc]/30 hover:bg-[#0088cc]/30 text-[#0088cc]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                      Rejoindre Telegram
                    </div>
                    {socialClicks.telegram && <CheckCircle2 className="h-3 w-3" />}
                  </a>
                  <a 
                    href="https://discord.gg/54J6AsrTFm" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('discord')}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all text-xs ${socialClicks.discord ? 'bg-[#5865F2]/40 border-[#5865F2] text-white' : 'bg-[#5865F2]/20 border-[#5865F2]/30 hover:bg-[#5865F2]/30 text-[#5865F2]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                      Rejoindre Discord
                    </div>
                    {socialClicks.discord && <CheckCircle2 className="h-3 w-3" />}
                  </a>
                  <a 
                    href="https://chat.whatsapp.com/JwJGgoQpS46I9r81QPrCs4" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('whatsapp')}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all text-xs ${socialClicks.whatsapp ? 'bg-[#25D366]/40 border-[#25D366] text-white' : 'bg-[#25D366]/20 border-[#25D366]/30 hover:bg-[#25D366]/30 text-[#25D366]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Groupe WhatsApp
                    </div>
                    {socialClicks.whatsapp && <CheckCircle2 className="h-3 w-3" />}
                  </a>
                </div>
              ) : (
                <ul className="list-disc pl-4 space-y-1">
                  {mission.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
              )}
            </div>

            {mission.id === "social-connection-protocol" && !isCompleted && !isPending && (
              <div className="mt-4 space-y-2 animate-in fade-in duration-500">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-primary">
                  <span>Progression_</span>
                  <span>{Math.round((Object.values(socialClicks).filter(Boolean).length / 3) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                    style={{ width: `${(Object.values(socialClicks).filter(Boolean).length / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!isLocked && !isCompleted && !isPending && mission.id !== "social-connection-protocol" && (
              <Dialog
                open={selectedMission?.id === mission.id}
                onOpenChange={(open) => {
                  if (!open) resetForm();
                  if (open) setSelectedMission(mission);
                }}
              >
                <DialogTrigger asChild>
                  <Button className="btn-primary-glow w-full gap-2">
                    {mission.type === "INTRO" ? "Me présenter" : "Démarrer la validation"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/40 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {step === 2 && mission.type !== "INTRO" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => setStep(1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                      {mission.type === "INTRO"
                        ? "Ton ancrage dans HASHCODE"
                        : step === 1 ? `Validation : ${mission.title}` : "Rétrospection du projet"}
                    </DialogTitle>
                    <DialogDescription>
                      {mission.type === "INTRO"
                        ? "Deux phrases suffisent. Sois direct, sois toi."
                        : step === 1
                          ? "Soumet ton lien de projet pour prouver tes compétences."
                          : "Partage ton expérience sur cette mission pour aider la communauté."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {mission.type === "INTRO" ? (
                      <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ce que tu construis</Label>
                          <Textarea
                            placeholder="Ex : Une plateforme SaaS pour freelances, une app mobile de fitness, un studio créatif..."
                            value={ancrageProjet}
                            onChange={(e) => setAncrageProjet(e.target.value)}
                            className="bg-card/30 border-border/40 rounded-xl min-h-[90px]"
                            required
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ton objectif dans 3 mois</Label>
                          <Textarea
                            placeholder="Ex : Avoir mes 10 premiers clients, sortir la v1 en public, maîtriser React..."
                            value={ancrageObjectif}
                            onChange={(e) => setAncrageObjectif(e.target.value)}
                            className="bg-card/30 border-border/40 rounded-xl min-h-[90px]"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl btn-primary-glow" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                          Ancrer mon profil (+{mission.xpReward} XP)
                        </Button>
                      </div>
                    ) : step === 1 ? (
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
                          <div className="space-y-2">
                            <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Difficulté</Label>
                            <div className="flex gap-1">
                              {[
                                { val: 1, label: "Facile" },
                                { val: 2, label: "Moyen" },
                                { val: 3, label: "Dur" },
                                { val: 4, label: "Très dur" },
                                { val: 5, label: "Extrême" },
                              ].map(({ val, label }) => (
                                <button
                                  key={val}
                                  type="button"
                                  title={label}
                                  onClick={() => setUserDifficulty(val)}
                                  className={`flex-1 h-8 rounded-lg text-xs font-mono border transition-all ${userDifficulty === val ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{["", "Facile", "Moyen", "Difficile", "Très dur", "Extrême"][userDifficulty]}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Note mission</Label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setUserRating(val)}
                                  className={`flex-1 h-8 rounded-lg text-sm border transition-all ${userRating >= val ? "bg-primary/10 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent"][userRating]}</p>
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
