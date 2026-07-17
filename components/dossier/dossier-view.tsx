"use client"

import { useState } from "react";
import {
  Brain,
  Globe,
  ShieldCheck,
  Zap,
  Fingerprint,
  Activity,
  TrendingUp,
  Users,
  Lightbulb,
  Flame,
  Target,
  Info,
  Mail,
  Check,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/ui/member-card";
import { EvolutionRadar } from "@/components/dashboard/evolution-radar";
import { XPGrowthChart, type ActivityLog } from "@/components/dashboard/xp-growth-chart";
import { ShareCardDialog } from "@/components/dashboard/share-card-dialog";
import { ReferralWidget } from "@/components/dashboard/referral-widget";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner";

import { UserProfile, DetailedMissionSubmission } from "@/lib/types"
import { calculateNeuralSync } from "@/lib/evolution-utils";
import { NeuralSyncGauge } from "@/components/dashboard/neural-sync-gauge";

interface DossierOrg {
  name: string
  cohesionScore?: number | null
}

interface DossierQuizResult {
  profileType?: string | null
}

interface DossierViewProps {
  user: UserProfile & { missionSubmissions: DetailedMissionSubmission[]; activityLogs: ActivityLog[] };
  activeOrg: DossierOrg | null;
  quizResult: DossierQuizResult | null | undefined;
  squadMembersLogs: unknown[];
  isPublic?: boolean;
  isPrivate?: boolean;
  isInspecting?: boolean;
  viewerSquad?: {
    id: string;
    name: string;
    role: string;
    members: { userId: string; class: string | null }[];
  } | null;
  hasSentInvitation?: boolean;
}

export function DossierView({ 
  user, 
  activeOrg, 
  quizResult, 
  isPublic = false,
  isPrivate = false,
  isInspecting = false,
  viewerSquad = null,
  hasSentInvitation = false,
  featureFlags = {}
}: Omit<DossierViewProps, "squadMembersLogs"> & { featureFlags?: Record<string, boolean> }) {
  const [sendingInvite, setSendingInvite] = useState(false);
  const [alreadyInvited, setAlreadyInvited] = useState(hasSentInvitation);

  const syncScore = calculateNeuralSync(user.class, {
    builder: user.builderScore,
    creator: user.creatorScore,
    strategist: user.strategistScore,
    catalyst: user.catalystScore,
  });

  const handleInvite = async () => {
    const targetClass = user.class?.toLowerCase();
    const classCount = viewerSquad?.members.filter((m) => m.class?.toLowerCase() === targetClass).length ?? 0;
    
    if (classCount >= 2) {
      const confirmInvite = window.confirm(
        `Attention : ton escouade compte déjà ${classCount} représentant(s) de la classe "${user.class}". La règle d'équilibre cognitif recommande un maximum de 2 agents par classe. Souhaites-tu tout de même envoyer l'invitation ?`
      );
      if (!confirmInvite) return;
    }

    setSendingInvite(true);
    try {
      const res = await fetch("/api/squad/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Erreur lors de l'envoi");
      }

      toast.success(data.message || "Invitation envoyée !");
      setAlreadyInvited(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur technique");
    } finally {
      setSendingInvite(false);
    }
  };
  
  // Neural Loop Logic: Engagement tips based on stats (Only for private/admin view)
  const engagementTips = [];
  if (!isPublic) {
    if (user.currentStreak < 3) engagementTips.push("Active le boost de Vitalité en complétant un Check-in 3 jours de suite.");
    if (user.missionSubmissions.length === 0) engagementTips.push("Initialise ta première mission pour voir comment ton profil évolue (Dérive).");
    if (!activeOrg) engagementTips.push("Rejoins une Squad pour débloquer les bonus de Cohésion Réseau.");
    if (user.experience < 500) engagementTips.push("Atteins 500 XP pour débloquer l'Habilitation Niveau 2.");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
      
      {isInspecting && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-amber-500 animate-pulse" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider font-mono">Mode Inspection Administrateur</p>
              <p className="text-[10px] font-mono text-amber-500/60 uppercase">Vous visualisez le dossier tactique de {user.name} (Pseudo: {user.pseudo || "aucun"}).</p>
            </div>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-mono text-[9px] uppercase tracking-widest bg-amber-500/5">
            ADMIN_PREVIEW
          </Badge>
        </div>
      )}

      {isPrivate && isPublic && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/30 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center mx-auto">
            <ShieldCheck className="size-6 text-zinc-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Profil Privé</h3>
            <p className="text-[11px] text-zinc-600 max-w-md mx-auto">
              {user.name} a choisi de rendre son profil invisible. Seuls les administrateurs peuvent consulter les dossiers complets.
            </p>
          </div>
        </div>
      )}

      {isPublic && !isPrivate && !isInspecting && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center gap-3">
          <Info className="size-4 shrink-0" />
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Profil public — certaines données sensibles sont masquées.
          </p>
        </div>
      )}

      {/* Header Dossier */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 sm:pb-10">
          <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Fingerprint className="size-3.5 text-primary" />
                  <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase text-primary">Fiche Profil</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">
                  {user.name.split(' ')[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Badge variant="outline" className="font-mono text-[9px] sm:text-[10px] border-white/10 text-zinc-500 uppercase tracking-wider">
                      Pseudo : {user.pseudo || "TALENT"}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                      <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-wider">Actif</span>
                  </div>
                  {user.technicalLevel && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                        <span className="text-[9px] font-mono font-black text-primary uppercase tracking-tighter">Niveau : {user.technicalLevel}</span>
                    </div>
                  )}
                  {user.currentStreak > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
                        <Flame className="size-3 text-orange-500" />
                        <span className="text-[10px] font-mono font-bold text-orange-500">{user.currentStreak} Jours</span>
                    </div>
                  )}
              </div>
              <p className="text-zinc-500 max-w-xl italic text-xs sm:text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
                  &quot;{user.bio || "Le silence est parfois la meilleure signature."}&quot;
              </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-left md:text-right">
                  <div className="text-[9px] sm:text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">ID Profil</div>
                  <div className="text-lg sm:text-xl font-black text-white font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      {user.id.slice(0, 12).toUpperCase()}
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-12 lg:order-2">
              
              {/* Member Card */}
              <div className="space-y-4">
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                      Carte de Membre
                      <div className="h-px bg-white/5 flex-1" />
                  </p>
                  <div className="scale-95 sm:scale-100 origin-top">
                      <MemberCard
                          userId={user.id}
                          pseudo={user.pseudo ?? user.name}
                          memberNumber={user.memberNumber}
                          userClass={user.class}
                          level={user.level}
                          experience={user.experience}
                          createdAt={user.createdAt}
                          image={user.image ?? null}
                          confidenceScore={user.confidenceScore}
                          missionsCompleted={user.missionsCompletedCount}
                          tools={user.tools}
                      />
                  </div>

                  {!isPublic && <ShareCardDialog userId={user.id} userName={user.name} />}
                  {isPublic && (
                    <Button asChild className="w-full btn-primary-glow font-black uppercase h-12 rounded-xl text-[10px]">
                      <Link href="/signin">Rejoindre HASHCODE</Link>
                    </Button>
                  )}

                  {viewerSquad && (
                    <div className="pt-2">
                      {activeOrg ? (
                        <Button disabled className="w-full bg-zinc-800 border-white/5 text-zinc-500 font-bold uppercase h-12 rounded-xl text-[10px]">
                          Déjà dans une escouade
                        </Button>
                      ) : alreadyInvited ? (
                        <Button disabled className="w-full bg-primary/10 border border-primary/20 text-primary/60 font-bold uppercase h-12 rounded-xl text-[10px] gap-2">
                          <Check className="size-4" />
                          Invitation envoyée
                        </Button>
                      ) : (
                        <Button
                          onClick={handleInvite}
                          disabled={sendingInvite}
                          className="w-full btn-primary-glow font-black uppercase h-12 rounded-xl text-[10px] gap-2"
                        >
                          {sendingInvite ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              <Mail className="size-4" />
                              Inviter dans mon escouade
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
              </div>

              {!isPublic && (
                <div className="space-y-4">
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                        Alignement Neural
                        <div className="h-px bg-white/5 flex-1" />
                    </p>
                    <Card className="glass-card rounded-3xl sm:rounded-5xl p-6 sm:p-8">
                        <NeuralSyncGauge score={syncScore} />
                    </Card>
                </div>
              )}

              {!isPublic && (
              <div className="space-y-4" id="tour-dossier-tips">
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                      Indices de Performance
                      <div className="h-px bg-white/5 flex-1" />
                  </p>
                  <Card className="glass-card rounded-3xl sm:rounded-5xl p-6 sm:p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4 sm:gap-6">
                          <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <div className="space-y-3 cursor-help group/item">
                                          <div className="flex items-center gap-2">
                                              <Zap className="size-3.5 text-primary" />
                                              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase font-black">Vitalité</span>
                                              <Info className="size-2.5 text-zinc-700 group-hover/item:text-primary transition-colors" />
                                          </div>
                                          <div className="text-lg sm:text-xl font-black text-white font-mono italic">{Math.round(((user.behavioralVibrancy as Record<string, number> | null)?.score || 0.85) * 100)}<span className="text-primary text-xs ml-1">%</span></div>
                                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                              <div className="h-full bg-primary" style={{ width: `${((user.behavioralVibrancy as Record<string, number> | null)?.score || 0.85) * 100}%` }} />
                                          </div>
                                      </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-48">
                                      La 'Vibrancy' mesure la force de ton signal. Elle augmente avec tes check-ins quotidiens et ton activité constante.
                                  </TooltipContent>
                              </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <div className="space-y-3 cursor-help group/item">
                                          <div className="flex items-center gap-2">
                                              <ShieldCheck className="size-3.5 text-emerald-500" />
                                              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase font-black">Confiance</span>
                                              <Info className="size-2.5 text-zinc-700 group-hover/item:text-emerald-500 transition-colors" />
                                          </div>
                                          <div className="text-xl font-black text-white font-mono italic">{(user.confidenceScore * 100).toFixed(0)}<span className="text-emerald-500 text-xs ml-1">%</span></div>
                                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                              <div className="h-full bg-emerald-500" style={{ width: `${user.confidenceScore * 100}%` }} />
                                          </div>
                                      </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-48">
                                      L'indice de 'Confidence' reflète ta fiabilité technique. Un score élevé permet de valider tes missions sans délai.
                                  </TooltipContent>
                              </Tooltip>
                          </TooltipProvider>
                      </div>

                      {!isPublic && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h5 className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase font-black flex items-center gap-2">
                                <Brain className="size-3 text-primary" />
                                Glossaire des Concepts
                            </h5>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { k: "Vitalité", v: "Force de ton signal. Dépend de ta régularité quotidienne." },
                                    { k: "Alignement", v: "Précision de ta trajectoire. Un écart (Drift) est une opportunité de recalibrer tes ambitions." },
                                    { k: "Confiance", v: "Niveau de certitude du système sur tes capacités techniques." }
                                ].map((item) => (
                                    <div key={item.k} className="text-[9px] font-mono flex gap-2 items-start">
                                        <span className="text-primary font-bold shrink-0">[{item.k}]</span>
                                        <span className="text-zinc-500 leading-tight">{item.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}

                      {!isPublic && engagementTips.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h5 className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase font-black flex items-center gap-2">
                                <Lightbulb className="size-3 text-primary" />
                                Conseils d'évolution
                            </h5>
                            <div className="space-y-2 sm:space-y-3">
                                {engagementTips.map((tip, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-primary/5 border border-primary/10">
                                        <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_5px_#C5F441]" />
                                        <p className="text-[9px] sm:text-[10px] text-zinc-300 font-bold leading-tight">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}
                  </Card>
              </div>
              )}

              {/* Squad Intel Area */}
              <div className="space-y-4">
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                      Infos Équipe
                      <div className="h-px bg-white/5 flex-1" />
                  </p>
                  <Card className="glass-card rounded-3xl sm:rounded-4xl p-5 sm:p-6 space-y-6">
                      {activeOrg ? (
                          <>
                              <div className="flex items-center gap-4">
                                  <div className="size-10 sm:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                      <Users className="size-5 sm:size-6 text-primary" />
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                      <div className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase">Équipe Active</div>
                                      <div className="text-base sm:text-lg font-black text-white uppercase tracking-tighter italic truncate">{activeOrg.name}</div>
                                  </div>
                              </div>
                              
                              <div className="space-y-2">
                                  <div className="flex justify-between items-end">
                                      <span className="text-[8px] sm:text-[9px] font-mono text-zinc-600 uppercase font-black">Cohésion de groupe</span>
                                      <span className="text-[9px] sm:text-[10px] font-mono text-primary font-black">{((activeOrg.cohesionScore ?? 0) * 100).toFixed(0)}%</span>
                                   </div>
                                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full bg-primary" style={{ width: `${(activeOrg.cohesionScore ?? 0) * 100}%` }} />
                                  </div>
                              </div>
                          </>
                      ) : (
                          <div className="space-y-4 text-center py-4">
                              <div className="size-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto opacity-20">
                                  <Users className="size-5" />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-[9px] font-mono text-zinc-600 uppercase">Aucune Squad Détectée</p>
                                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic leading-tight">Build solitaire actif.</p>
                              </div>
                          </div>
                      )}
                  </Card>
              </div>

              {/* Social Links Metadata */}
              <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <div className="text-[9px] font-mono text-primary font-black uppercase">Objectif Principal</div>
                          <div className="text-base font-bold text-white uppercase tracking-tight italic">
                              {user.mainObjective || "NON_SPÉCIFIÉ"}
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="text-[9px] font-mono text-zinc-600 font-black uppercase">Localisation</div>
                          <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                              <Globe className="size-3.5 text-primary" />
                              {user.city || user.country ? (
                                [user.city, user.country].filter(Boolean).join(", ")
                              ) : (
                                "GLOBAL"
                              )}
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="text-[9px] font-mono text-zinc-600 font-black uppercase">Réseaux Sociaux</div>
                          <div className="flex items-center gap-3">
                              {user.githubUrl && (
                                <Link href={user.githubUrl} target="_blank" className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-primary transition-all group/link">
                                    <Github className="size-4" />
                                </Link>
                              )}
                              {user.linkedinUrl && (
                                <Link href={user.linkedinUrl} target="_blank" className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-[#0077B5] transition-all group/link">
                                    <Linkedin className="size-4" />
                                </Link>
                              )}
                              {user.twitterUrl && (
                                <Link href={user.twitterUrl} target="_blank" className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-white transition-all group/link">
                                    <svg viewBox="0 0 24 24" className="size-4 fill-current">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                </Link>
                              )}
                          </div>
                      </div>
                  </div>
              </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-12 lg:order-1">
              
              {!isPublic && (
              <div className="space-y-6">
                  <div className="flex items-center gap-3">
                      <Brain className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Neuro-Mapping</h2>
                  </div>
                  
                  <Card className="glass-card overflow-hidden relative group rounded-3xl sm:rounded-5xl">
                      <CardContent className="p-5 sm:p-10">
                          <div className="grid grid-cols-1 gap-8 sm:gap-12">
                              <div className="space-y-6 sm:space-y-8">
                                  <div className="p-6 rounded-3xl sm:rounded-4xl bg-linear-to-br from-primary/10 via-transparent to-transparent border border-primary/20 shadow-inner">
                                      <div className="flex items-center justify-between gap-4 mb-4">
                                          <div className="space-y-1">
                                              <span className="text-[9px] sm:text-[10px] font-mono text-primary font-black uppercase">Vecteur_Dominant</span>
                                              <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                                                  {quizResult?.profileType || "CALIBRATION_PENDING"}
                                              </h3>
                                          </div>
                                      </div>
                                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                                          L&apos;analyse comportementale profonde révèle un profil de type <span className="text-white font-bold">{quizResult?.profileType || "inconnu"}</span>. 
                                          Ses schémas de décision montrent une prédisposition naturelle pour le build stratégique.
                                      </p>
                                  </div>

                                  <div className="space-y-4">
                                      <h4 className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-3">
                                          Vecteurs_Comportementaux
                                          <div className="h-px bg-white/5 flex-1" />
                                      </h4>
                                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                          {[
                                              { label: 'BÂTISSEUR', value: user.builderScore, color: 'text-blue-400', desc: "Conception et implémentation technique." },
                                              { label: 'CRÉATEUR', value: user.creatorScore, color: 'text-purple-400', desc: "Concepts originaux et design impactant." },
                                              { label: 'STRATÈGE', value: user.strategistScore, color: 'text-amber-400', desc: "Vision globale et optimisation." },
                                              { label: 'CATALYSEUR', value: user.catalystScore, color: 'text-emerald-400', desc: "Force d'accélération et concrétisation." }
                                          ].map((stat) => (
                                              <TooltipProvider key={stat.label}>
                                                  <Tooltip>
                                                      <TooltipTrigger asChild>
                                                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 cursor-help">
                                                              <div className="text-[7px] sm:text-[8px] font-mono text-zinc-600 uppercase mb-0.5">{stat.label}</div>
                                                              <div className={cn("text-base sm:text-lg font-black font-mono italic", stat.color)}>{stat.value}%</div>
                                                          </div>
                                                      </TooltipTrigger>
                                                      <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-48">
                                                          {stat.desc}
                                                      </TooltipContent>
                                                  </Tooltip>
                                              </TooltipProvider>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </div>
              )}

              {!isPublic && (
              <div className="space-y-6" id="tour-dossier-radar">
                  <div className="flex items-center gap-3">
                      <Activity className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Graphique d'Évolution</h2>
                  </div>
                  
                  <Card className="glass-card overflow-hidden relative group rounded-3xl sm:rounded-5xl border-white/5 shadow-2xl">
                      <CardContent className="p-6 sm:p-10 lg:p-12">
                          <div className="pt-2">
                              <EvolutionRadar 
                                  builderScore={user.builderScore}
                                  creatorScore={user.creatorScore}
                                  strategistScore={user.strategistScore}
                                  catalystScore={user.catalystScore}
                                  userClass={user.class || "builder"}
                              />
                          </div>
                      </CardContent>
                  </Card>
              </div>
              )}

              {!isPublic && (
              <div className="space-y-6" id="tour-dossier-xp">
                  <div className="flex items-center gap-3">
                      <TrendingUp className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Dynamique de Croissance</h2>
                  </div>
                  
                  <Card className="glass-card rounded-3xl sm:rounded-5xl p-5 sm:p-8 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 sm:p-6 text-right">
                          <div className="text-[9px] sm:text-[10px] font-mono text-zinc-600 uppercase">Total accumulé</div>
                          <div className="text-xl sm:text-2xl font-black text-white font-mono">{user.experience}<span className="text-primary text-xs ml-1">XP</span></div>
                      </div>
                      <XPGrowthChart logs={user.activityLogs} currentXP={user.experience} />
                  </Card>
              </div>
              )}

              {!isPublic && (
              <div className="space-y-6" id="tour-dossier-missions">
                  <div className="flex items-center gap-3">
                      <Target className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Missions Récentes</h2>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                      {user.missionSubmissions.length > 0 ? (
                          user.missionSubmissions.map((sub) => (
                              <div key={sub.id} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                  <div className="space-y-1 min-w-0">
                                      <div className="text-[9px] font-mono text-zinc-500 uppercase truncate">{sub.mission.category}</div>
                                      <div className="text-xs sm:text-sm font-bold text-white uppercase group-hover:text-primary transition-colors truncate pr-2">{sub.mission.title}</div>
                                  </div>
                                  <Badge variant="outline" className={cn(
                                      "text-[8px] sm:text-[9px] font-mono border-white/5 shrink-0",
                                      sub.status === "APPROVED" ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"
                                  )}>
                                      {sub.status === "APPROVED" ? "VALIDÉ" : sub.status}
                                  </Badge>
                              </div>
                          ))
                      ) : (
                          <div className="p-8 rounded-2xl bg-white/1 border border-dashed border-white/5 text-center">
                              <p className="text-[10px] font-mono text-zinc-600 uppercase">Aucune mission enregistrée</p>
                          </div>
                      )}
                  </div>
              </div>
              )}

              {/* Spécialisations & Outils */}
              <div className="space-y-6">
                  <div className="flex items-center gap-3">
                      <Zap className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Spécialisations & Outils</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                          <div className="space-y-2">
                              <h4 className="text-[9px] sm:text-[10px] font-mono uppercase text-primary font-black">Domaines d'expertise</h4>
                              <div className="flex flex-wrap gap-2 pt-2">
                                  {user.domains?.length > 0 ? (
                                      user.domains.map((d: string) => (
                                          <Badge key={d} className="bg-primary/10 text-primary border-primary/20 text-[9px] sm:text-[10px] font-black uppercase py-1 px-3">
                                              {d}
                                          </Badge>
                                      ))
                                  ) : (
                                      <span className="text-[10px] italic text-zinc-600 font-mono">-- Aucun domaine détecté --</span>
                                  )}
                              </div>
                          </div>
                      </Card>
                      
                      <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                          <div className="space-y-2">
                              <h4 className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-500 font-black">Outils favoris</h4>
                              <div className="flex flex-wrap gap-2 pt-2">
                                  {user.tools?.length > 0 ? (
                                      user.tools.map((t: string) => (
                                          <Badge key={t} variant="outline" className="border-white/10 text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase py-1 px-3">
                                              {t}
                                          </Badge>
                                      ))
                                  ) : (
                                      <span className="text-[10px] italic text-zinc-600 font-mono">-- Aucun outil configuré --</span>
                                  )}
                              </div>
                          </div>
                      </Card>
                  </div>
              </div>

              {/* Referral widget — own profile only */}
              {!isPublic && <ReferralWidget />}

              {featureFlags.badges !== false && (
              <div className="space-y-4">
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                      Badges & Distinctions
                      <div className="h-px bg-white/5 flex-1" />
                  </p>
                  <div className="flex flex-wrap gap-2">
                      {user.badges?.length > 0 ? (
                          user.badges.map((badge: string) => (
                              <Badge key={badge} className="bg-primary/20 text-primary border-primary/30 text-[9px] font-black uppercase py-1 px-3 rounded-lg">
                                  {badge}
                              </Badge>
                          ))
                      ) : (
                          <p className="text-[9px] text-zinc-700 font-mono italic">-- En attente de premiers accomplissements --</p>
                      )}
                  </div>
              </div>
              )}
          </div>
      </div>
    </div>
  );
}
