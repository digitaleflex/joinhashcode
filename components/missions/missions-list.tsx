"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { MISSIONS, Mission } from "@/lib/missions";
import { COMMUNITY_LINKS } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, ArrowRight, Target, Zap, ShieldCheck, Globe, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const renderMission = (mission: Mission, isLocked: boolean) => {
    const status = submissions[mission.id];
    const isCompleted = status === "APPROVED";
    const isPending = status === "PENDING";

    return (
      <Card key={mission.id} className={cn(
        "relative overflow-hidden transition-all duration-500 rounded-[2rem] border-white/5 group shadow-2xl",
        isLocked ? 'opacity-40 grayscale bg-white/[0.01]' : 'bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-primary/40'
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge className={cn(
                "text-[9px] uppercase font-black tracking-widest",
                isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                isPending ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                'bg-primary/10 text-primary border-primary/20'
              )}>
                {isCompleted ? 'Validé' : isPending ? 'En Revue' : `+${mission.xpReward} XP`}
              </Badge>
              <Badge variant="outline" className="text-[9px] font-mono border-white/10 text-zinc-500">
                {mission.type}
              </Badge>
            </div>
            {isLocked ? (
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Lock className="h-3 w-3 text-zinc-600" />
              </div>
            ) : isCompleted ? (
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            ) : (
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                    <Zap className="h-3.5 w-3.5" />
                </div>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-white uppercase tracking-tight italic">
            {mission.title}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs leading-relaxed font-light mt-2">
            {mission.shortDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div className="space-y-4">
            <div className="text-xs text-zinc-400 bg-black/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] -rotate-45 translate-x-8 -translate-y-8" />
              
              <p className="font-mono text-[9px] uppercase text-primary mb-2 tracking-[0.2em] font-bold">Briefing_Technique</p>
              <p className="leading-relaxed">{mission.description}</p>
              
              <p className="font-mono text-[9px] uppercase text-zinc-500 mb-2 mt-4 tracking-[0.2em] font-bold">Protocole_Validation</p>
              
              {mission.id === "social-connection-protocol" ? (
                <div className="grid gap-2 mt-3">
                  <a
                    href={COMMUNITY_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('telegram')}
                    className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                        socialClicks.telegram ? 'bg-[#0088cc]/10 border-[#0088cc]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#0088cc]/20 text-[#0088cc]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" />
                      Telegram
                    </div>
                    {socialClicks.telegram && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  </a>
                  <a
                    href={COMMUNITY_LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('discord')}
                    className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                        socialClicks.discord ? 'bg-[#5865F2]/10 border-[#5865F2]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#5865F2]/20 text-[#5865F2]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Discord
                    </div>
                    {socialClicks.discord && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  </a>
                  <a
                    href={COMMUNITY_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer" 
                    onClick={() => handleSocialClick('whatsapp')}
                    className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                        socialClicks.whatsapp ? 'bg-[#25D366]/10 border-[#25D366]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#25D366]/20 text-[#25D366]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5" />
                      WhatsApp
                    </div>
                    {socialClicks.whatsapp && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  </a>
                </div>
              ) : (
                <ul className="space-y-1.5 list-none">
                  {mission.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                        <span className="text-[11px] leading-tight text-zinc-500">{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {mission.id === "social-connection-protocol" && !isCompleted && !isPending && (
              <div className="mt-4 space-y-2 animate-in fade-in duration-500">
                <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.3em] text-primary">
                  <span>Synchronisation_</span>
                  <span>{Math.round((Object.values(socialClicks).filter(Boolean).length / 3) * 100)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.05]">
                  <div 
                    className="h-full bg-primary transition-all duration-500 shadow-[0_0_15px_rgba(var(--primary),0.6)]" 
                    style={{ width: `${(Object.values(socialClicks).filter(Boolean).length / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!isLocked && !isCompleted && !isPending && mission.id !== "social-connection-protocol" && (
              <Button asChild className="btn-primary-glow w-full h-12 rounded-xl text-[10px] uppercase font-black tracking-widest gap-2">
                <Link href={`/missions/${mission.id}`}>
                  {mission.type === "INTRO" ? "Activer le Profilage" : "Lancer le Déploiement"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}

            {isPending && (
              <Button variant="secondary" className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-[10px] uppercase font-black tracking-widest" disabled>
                Analyse en cours...
              </Button>
            )}
            
            {isCompleted && (
              <div className="text-center py-2">
                  <span className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.4em]">-- Mission Terminée --</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-12">
      {/* Active Missions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Objectifs Disponibles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {availableMissions.map(m => renderMission(m, false))}
          {availableMissions.length === 0 && (
             <div className="col-span-full py-20 text-center text-zinc-600 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
               <Zap className="size-10 text-zinc-900 mx-auto mb-4 opacity-50" />
               <p className="font-mono text-xs uppercase tracking-[0.4em]">Aucune mission disponible pour ton habilitation</p>
             </div>
          )}
        </div>
      </div>

      {/* Locked Missions */}
      {lockedMissions.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-white/5">
          <div className="flex items-center gap-3 opacity-40">
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
              <Lock className="h-5 w-5 text-zinc-500" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-500 italic">Arsenaux Verrouillés</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {lockedMissions.map(m => renderMission(m, true))}
          </div>
        </div>
      )}
    </div>
  );
}
