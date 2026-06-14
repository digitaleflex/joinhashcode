"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Mission } from "@/lib/missions";
import { COMMUNITY_LINKS } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, ArrowRight, Zap, ShieldCheck, Globe, MessageSquare, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MissionSlideOver } from "./mission-slideover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface MissionWithStats extends Mission {
  completionsCount: number;
  avgRating: number | null;
  ratingsCount: number;
  avgDelay: number;
}

type ProgressionStage = "INIT" | "CORE" | "PRO";

function getUserStage(userLevel: number): ProgressionStage {
  if (userLevel <= 1) return "INIT";
  if (userLevel <= 3) return "CORE";
  return "PRO";
}

const STAGE_CONFIG: Record<ProgressionStage, {
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  requiredLevel: number;
}> = {
  INIT: {
    label: "INIT",
    sublabel: "Missions de départ",
    color: "#10B981",
    bgColor: "bg-emerald-950/20",
    borderColor: "border-emerald-500/20",
    requiredLevel: 1,
  },
  CORE: {
    label: "CORE",
    sublabel: "Missions intermédiaires",
    color: "#06B6D4",
    bgColor: "bg-cyan-950/20",
    borderColor: "border-cyan-500/20",
    requiredLevel: 2,
  },
  PRO: {
    label: "PRO",
    sublabel: "Missions avancées",
    color: "#A855F7",
    bgColor: "bg-purple-950/20",
    borderColor: "border-purple-500/20",
    requiredLevel: 4,
  },
};

const XP_PER_LEVEL: Record<number, number> = { 1: 1000, 2: 2000, 3: 3000 }

export function MissionsList({
  userLevel,
  userXp = 0,
  submissions,
  userClass,
  missions
}: {
  userLevel: number;
  userXp?: number;
  submissions: Record<string, string>; // missionId -> status
  userClass?: string | null;
  missions: MissionWithStats[];
}) {

  const [selectedMission, setSelectedMission] = useState<MissionWithStats | null>(null);
  
  const lowerClass = useMemo(() => userClass?.toLowerCase(), [userClass]);

  const { availableMissions, comingSoonMissions } = useMemo(() => {
    const available: MissionWithStats[] = [];
    const comingSoon: MissionWithStats[] = [];

    for (const m of missions) {
      const classMatch = !m.targetProfiles || m.targetProfiles.length === 0 || (lowerClass && m.targetProfiles.includes(lowerClass as any));
      if (!classMatch) continue;

      if (m.comingSoon) {
        comingSoon.push(m);
      } else {
        available.push(m);
      }
    }

    return { availableMissions: available, comingSoonMissions: comingSoon };
  }, [lowerClass, missions]);

  const missionsByStage = useMemo(() => {
    return {
      INIT: availableMissions.filter(m => m.missionLevel === "INIT"),
      CORE: availableMissions.filter(m => m.missionLevel === "CORE"),
      PRO: availableMissions.filter(m => m.missionLevel === "PRO"),
    };
  }, [availableMissions]);

  const userStage = getUserStage(userLevel);
  const stages: ProgressionStage[] = ["INIT", "CORE", "PRO"];

  return (
    <div className="space-y-10">
      
      {/* Barre de progression des étapes */}
      <div className="flex items-center gap-0">
        {stages.map((stage, i) => {
          const config = STAGE_CONFIG[stage];
          const isActive = stage === userStage;
          const isDone = stages.indexOf(userStage) > i;
          
          return (
            <div key={stage} className="flex items-center flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex-1 py-3 px-4 flex flex-col items-center gap-0.5 rounded-2xl border transition-all duration-500 cursor-help",
                      isActive ? `${config.bgColor} ${config.borderColor}` : isDone ? "bg-zinc-900/30 border-white/5" : "bg-transparent border-transparent"
                    )}>
                      <span className="text-[8px] font-mono font-black uppercase tracking-widest" style={{ color: isActive ? config.color : isDone ? "#6b7280" : "#374151" }}>
                        {config.label}
                      </span>
                      <span className="text-[7px] text-zinc-600 font-mono text-center hidden md:block">{config.sublabel}</span>
                      {isDone && <span className="text-[7px] text-emerald-500 font-mono mt-0.5">✓ Complété</span>}
                      {isActive && <div className="size-1.5 rounded-full mt-0.5 animate-pulse" style={{ backgroundColor: config.color }} />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-xs">
                    {stage === "INIT" && "Missions d'initiation pour maîtriser les outils de base du réseau."}
                    {stage === "CORE" && "Le cœur de ton expertise technique. Valide tes compétences fondamentales."}
                    {stage === "PRO" && "Défis complexes simulant des environnements de production réels."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {i < 2 && (
                <div className={cn("h-px w-2 md:w-4 shrink-0", isDone || isActive ? "bg-white/10" : "bg-zinc-900")} />
              )}
            </div>
          )
        })}
      </div>

      {/* Sections par étape */}
      {stages.map(stage => {
        const config = STAGE_CONFIG[stage];
        const stageMissions = missionsByStage[stage];
        const isLocked = config.requiredLevel > userLevel;

        if (stageMissions.length === 0) return null;

        return (
          <section key={stage} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ borderColor: `${config.color}30`, backgroundColor: `${config.color}08` }}>
                <div className="size-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-[9px] font-mono font-black uppercase tracking-widest" style={{ color: config.color }}>
                  {config.label}
                </span>
                <span className="text-[8px] text-zinc-600 font-mono hidden md:inline">— {stageMissions.length} missions</span>
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {isLocked && (() => {
              const levelsToGo = config.requiredLevel - userLevel;
              const xpInCurrentLevel = userXp % 1000;
              const xpPerLevel = 1000;
              const totalXpNeeded = (levelsToGo - 1) * xpPerLevel + (xpPerLevel - xpInCurrentLevel);
              const progressPct = Math.round((xpInCurrentLevel / xpPerLevel) * 100);
              return (
                <div className="px-4 py-4 bg-zinc-900/40 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="size-3 text-zinc-600" />
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
                      Niveau {config.requiredLevel} requis — tu es au niveau {userLevel} ({levelsToGo} niveau{levelsToGo > 1 ? "x" : ""} restant{levelsToGo > 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase">Progression vers le prochain niveau</span>
                      <span className="text-[8px] font-mono text-primary">{xpInCurrentLevel} / {xpPerLevel} XP</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-[8px] text-zinc-700 font-mono">~{totalXpNeeded} XP restants pour débloquer ces missions</span>
                  </div>
                </div>
              );
            })()}

            <div className={cn("grid md:grid-cols-2 gap-6 lg:gap-8", isLocked && "opacity-40 pointer-events-none grayscale")}>
              {stageMissions.map(mission => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  userLevel={userLevel} 
                  submissions={submissions}
                  onPreview={() => setSelectedMission(mission)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Coming Soon Missions */}
      {comingSoonMissions.length > 0 && (
        <section className="mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="size-1.5 rounded-full bg-zinc-600 animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-600">
              En développement — {comingSoonMissions.length} missions à venir
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {comingSoonMissions.map(mission => (
              <div
                key={mission.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/5"
              >
                <span className="size-1 rounded-full bg-zinc-700" />
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">
                  {mission.title}
                </span>
                <span className="text-[8px] font-mono text-zinc-700 ml-1">
                  +{mission.xpReward} XP
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SlideOver */}
      <MissionSlideOver
        mission={selectedMission}
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        userLevel={userLevel}
        hasSubmission={selectedMission ? !!submissions[selectedMission.id] : false}
        submissionStatus={selectedMission ? submissions[selectedMission.id] : null}
      />
    </div>
  );
}

function MissionCard({ 
  mission, 
  userLevel, 
  submissions,
  onPreview
}: { 
  mission: MissionWithStats; 
  userLevel: number;
  submissions: Record<string, string>;
  onPreview: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const status = submissions[mission.id];
  const isCompleted = status === "APPROVED";
  const isPending = status === "PENDING" || status === "IN_REVIEW" || status === "NEEDS_REVISION";
  const requiredLevel = mission.requiredLevel ?? 1;
  const isLocked = userLevel < requiredLevel;

  const [socialClicks, setSocialClicks] = useState<Record<string, boolean>>({
    telegram: false, discord: false, whatsapp: false
  });
  const [socialForm, setSocialForm] = useState({ telegram: '', discord: '', whatsapp: '' });

  const socialFormRef = useRef(socialForm);
  useEffect(() => {
    socialFormRef.current = socialForm;
  }, [socialForm]);

  useEffect(() => {
    if (mission.id === "social-connection-protocol" && (status === "APPROVED" || status === "PENDING")) {
      setSocialClicks({ telegram: true, discord: true, whatsapp: true });
    }
  }, [status, mission.id]);

  const allLinksClicked = Object.values(socialClicks).every(Boolean);

  const handleSocialClick = useCallback((platform: string) => {
    if (mission.id !== "social-connection-protocol") return;
    if (status === "APPROVED" || status === "PENDING") return;
    
    setSocialClicks((prev) => {
      if (prev[platform]) return prev;
      const next = { ...prev, [platform]: true };
      const count = Object.values(next).filter(Boolean).length;
      if (count < 3) {
        toast.info(`${count}/3 canaux rejoints — continue !`);
      } else {
        toast.success("Tous les canaux rejoints ! Entre tes identifiants pour valider.");
      }
      return next;
    });
  }, [status, mission.id]);

  const handleSocialSubmit = useCallback(async () => {
    const { telegram, discord, whatsapp } = socialFormRef.current;
    if (!telegram.trim() || !discord.trim() || !whatsapp.trim()) {
      toast.error("Remplis les 3 champs pour valider la mission.");
      return;
    }
    setIsSubmitting(true);
    try {
      const content = `Protocole de Connexion Globale — Vérification admin\nTelegram : ${telegram.trim()}\nDiscord : ${discord.trim()}\nWhatsApp : ${whatsapp.trim()}`;
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: "social-connection-protocol",
          content,
          projectDescription: "Rejoint les 3 canaux communautaires HASHCODE.",
          userDifficulty: 1,
          userRating: 5,
          userFeedback: "Validation via identifiants communautaires",
          improvementSuggestions: ""
        })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Soumission envoyée ! Un admin va vérifier et valider sous 24h.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la validation");
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 rounded-4xl border-white/5 group shadow-2xl flex flex-col",
      isLocked ? 'opacity-40 grayscale bg-white/1' : 'bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-primary/40'
    )}>
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={cn(
                    "text-[9px] uppercase font-black tracking-wider cursor-help",
                    isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    isPending ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-primary/10 text-primary border-primary/20'
                  )}>
                    {isCompleted ? 'Validé' : isPending ? 'En Revue' : `+${mission.xpReward} XP`}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                  {isCompleted ? "Récompense déjà acquise." : isPending ? "En attente de validation par un reviewer." : "XP à gagner pour cette mission."}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-[9px] font-mono border-white/10 text-zinc-500 cursor-help">
                    {mission.type}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                  {mission.type === "CODE" && "Mission technique (Build)"}
                  {mission.type === "DESIGN" && "Mission créative (UX/UI)"}
                  {mission.type === "BUSINESS" && "Mission stratégique (Growth)"}
                  {mission.type === "NETWORK" && "Mission sociale (Commu)"}
                  {mission.type === "INTRO" && "Mission d'intégration"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <CardDescription className="text-zinc-400 text-xs leading-relaxed font-light mt-2 line-clamp-2">
          {mission.shortDesc || mission.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 bg-black/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 -rotate-45 translate-x-8 -translate-y-8" />
            
            <p className="font-mono text-[9px] uppercase text-zinc-500 mb-2 font-bold">Protocole_Validation</p>
            
            {mission.id === "social-connection-protocol" ? (
              <div className="space-y-2 mt-3">
                {/* Step 1 — join the 3 channels */}
                <div className="grid gap-2">
                  <a href={COMMUNITY_LINKS.telegram} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('telegram')}
                    className={cn("flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                      socialClicks.telegram ? 'bg-[#0088cc]/10 border-[#0088cc]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#0088cc]/20 text-[#0088cc]'
                    )}>
                    <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" />Telegram</div>
                    {socialClicks.telegram ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <span className="text-[8px] text-zinc-600">Clic pour rejoindre</span>}
                  </a>
                  <a href={COMMUNITY_LINKS.discord} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('discord')}
                    className={cn("flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                      socialClicks.discord ? 'bg-[#5865F2]/10 border-[#5865F2]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#5865F2]/20 text-[#5865F2]'
                    )}>
                    <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />Discord</div>
                    {socialClicks.discord ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <span className="text-[8px] text-zinc-600">Clic pour rejoindre</span>}
                  </a>
                  <a href={COMMUNITY_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => handleSocialClick('whatsapp')}
                    className={cn("flex items-center justify-between p-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase",
                      socialClicks.whatsapp ? 'bg-[#25D366]/10 border-[#25D366]/50 text-white' : 'bg-white/5 border-white/10 hover:bg-[#25D366]/20 text-[#25D366]'
                    )}>
                    <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />WhatsApp</div>
                    {socialClicks.whatsapp ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <span className="text-[8px] text-zinc-600">Clic pour rejoindre</span>}
                  </a>
                </div>

                {/* Step 2 — identify yourself for admin review */}
                {allLinksClicked && !isPending && !isCompleted && (
                  <div className="mt-3 space-y-2 p-3 rounded-xl bg-white/3 border border-white/10">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Étape 2 — Confirme tes identifiants</p>
                    <Input
                      value={socialForm.telegram}
                      onChange={e => setSocialForm(f => ({ ...f, telegram: e.target.value }))}
                      placeholder="Pseudo Telegram (ex: @mon_pseudo)"
                      className="h-9 text-xs bg-zinc-950 border-white/10 text-white placeholder:text-zinc-700 rounded-xl"
                    />
                    <Input
                      value={socialForm.discord}
                      onChange={e => setSocialForm(f => ({ ...f, discord: e.target.value }))}
                      placeholder="Pseudo Discord (ex: mon_pseudo)"
                      className="h-9 text-xs bg-zinc-950 border-white/10 text-white placeholder:text-zinc-700 rounded-xl"
                    />
                    <Input
                      value={socialForm.whatsapp}
                      onChange={e => setSocialForm(f => ({ ...f, whatsapp: e.target.value }))}
                      placeholder="Numéro WhatsApp (ex: +225XXXXXXXXXX)"
                      className="h-9 text-xs bg-zinc-950 border-white/10 text-white placeholder:text-zinc-700 rounded-xl"
                    />
                    <Button
                      onClick={handleSocialSubmit}
                      disabled={isSubmitting || !socialForm.telegram.trim() || !socialForm.discord.trim() || !socialForm.whatsapp.trim()}
                      className="w-full h-10 rounded-xl btn-primary-glow text-[10px] uppercase font-black tracking-wider gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {isSubmitting ? "Envoi..." : "Envoyer pour validation admin"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <ul className="space-y-1.5 list-none">
                {mission.requirements?.slice(0, 3).map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                      <div className="size-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      <span className="text-[11px] leading-tight text-zinc-500 line-clamp-1">{req}</span>
                  </li>
                ))}
                {mission.requirements?.length > 3 && (
                   <li className="text-[10px] font-mono text-zinc-600 pt-1">+ {mission.requirements.length - 3} autres pré-requis</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-auto pt-4">
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-emerald-500/60" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  {mission.completionsCount > 0
                    ? `${mission.completionsCount} complét${mission.completionsCount > 1 ? "ions" : "ion"}`
                    : "Sois le premier"}
                </span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-help group/delay">
                      <Clock className="size-2.5 text-zinc-600 group-hover/delay:text-primary transition-colors" />
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">
                        ~{mission.avgDelay}h
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                    Délai moyen de validation par le réseau.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {mission.avgRating !== null && mission.ratingsCount >= 3 && (
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-[9px] font-mono text-amber-400">
                    {"★".repeat(Math.round(mission.avgRating))}{"☆".repeat(5 - Math.round(mission.avgRating))}
                  </span>
                  <span className="text-[8px] text-zinc-600 font-mono">
                    {mission.avgRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={onPreview}
              className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2 shrink-0"
            >
              Voir le briefing
            </button>
          </div>

          {!isLocked && !isCompleted && !isPending && mission.id !== "social-connection-protocol" && (
            <Button asChild className="btn-primary-glow w-full h-12 rounded-xl text-[10px] uppercase font-black tracking-wider gap-2">
              <Link href={`/missions/${mission.id}`}>
                {mission.type === "INTRO" ? "Me présenter" : "Commencer"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}

          {isPending && (
            <Button variant="secondary" className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-[10px] uppercase font-black tracking-wider" disabled>
              Analyse en cours...
            </Button>
          )}
          
          {isCompleted && (
            <div className="text-center py-2 h-12 flex items-center justify-center">
                <span className="text-[10px] font-mono text-emerald-500/60 uppercase">-- Mission Terminée --</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
