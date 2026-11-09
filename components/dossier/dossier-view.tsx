"use client"

import {
  Brain,
  Globe,
  ShieldCheck,
  Zap,
  Flame,
  Target,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReferralWidget } from "@/components/dashboard/referral-widget";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { UserProfile, DetailedMissionSubmission } from "@/lib/types"

interface DossierQuizResult {
  profileType?: string | null
}

interface DossierViewProps {
  user: UserProfile & { missionSubmissions: DetailedMissionSubmission[]; activityLogs: unknown[] };
  quizResult: DossierQuizResult | null | undefined;
  isPublic?: boolean;
  isPrivate?: boolean;
  isInspecting?: boolean;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "VALIDÉ", className: "text-emerald-500 bg-emerald-500/5" },
  REJECTED: { label: "REFUSÉ", className: "text-red-500 bg-red-500/5" },
  NEEDS_REVISION: { label: "À REVOIR", className: "text-amber-500 bg-amber-500/5" },
  IN_REVIEW: { label: "EN REVUE", className: "text-blue-500 bg-blue-500/5" },
  PENDING_ADMIN: { label: "EN REVUE", className: "text-blue-500 bg-blue-500/5" },
  PENDING: { label: "EN ATTENTE", className: "text-zinc-400 bg-white/5" },
};

export function DossierView({ 
  user, 
  quizResult, 
  isPublic = false,
  isPrivate = false,
  isInspecting = false,
  featureFlags = {}
}: DossierViewProps & { featureFlags?: Record<string, boolean> }) {
  // Neural Loop Logic: Engagement tips based on stats (Only for private/admin view)
  const engagementTips = [];
  if (!isPublic) {
    if (user.missionSubmissions.length === 0) engagementTips.push("Lance ta première mission pour voir ton profil prendre vie.");
    if (user.experience < 500) engagementTips.push("Atteins 500 XP pour passer au niveau 2.");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
      
      {isInspecting && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-amber-500 animate-pulse" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider font-mono">Mode Inspection Administrateur</p>
              <p className="text-xs font-mono text-amber-500/60 uppercase">Vous visualisez le profil de {user.name} (Pseudo: {user.pseudo || "aucun"}).</p>
            </div>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-mono text-3xs uppercase tracking-widest bg-amber-500/5">
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
            <p className="text-sm-plus text-zinc-600 max-w-md mx-auto">
              {user.name} a choisi de rendre son profil invisible. Seuls les administrateurs peuvent consulter les dossiers complets.
            </p>
          </div>
        </div>
      )}

      {isPublic && !isPrivate && !isInspecting && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center gap-3">
          <Info className="size-4 shrink-0" />
          <p className="text-xs font-mono font-bold uppercase tracking-wider">
            Profil public — certaines données sensibles sont masquées.
          </p>
        </div>
      )}

      {/* Header Dossier */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 sm:pb-10">
          <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">
                  {user.name.split(' ')[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {user.pseudo && (
                    <Badge variant="outline" className="font-mono text-3xs sm:text-xs border-white/10 text-zinc-500 uppercase tracking-wider">
                        @{user.pseudo}
                    </Badge>
                  )}
                  {user.technicalLevel && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                        <span className="text-3xs font-mono font-black text-primary uppercase tracking-tighter">Niveau : {user.technicalLevel}</span>
                    </div>
                  )}
                  {user.currentStreak > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
                        <Flame className="size-3 text-orange-500" />
                        <span className="text-xs font-mono font-bold text-orange-500">{user.currentStreak} Jours</span>
                    </div>
                  )}
              </div>
              <p className="text-zinc-500 max-w-xl italic text-xs sm:text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
                  &quot;{user.bio || "Pas encore de bio. Ajoute une phrase sur toi dans les paramètres."}&quot;
              </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-left md:text-right">
                  <div className="text-3xs sm:text-xs font-mono text-zinc-600 uppercase tracking-wider mb-1">Membre depuis</div>
                  <div className="text-sm font-bold text-white font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
              {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-12 lg:order-2">

              {isPublic && (
                <Button asChild className="w-full btn-primary-glow font-black uppercase h-12 rounded-xl text-xs">
                  <Link href="/signin">Rejoindre HASHCODE</Link>
                </Button>
              )}

              {!isPublic && engagementTips.length > 0 && (
              <div className="space-y-4" id="tour-dossier-tips">
                   <p className="text-3xs sm:text-xs font-mono uppercase text-zinc-600 flex items-center gap-3">
                       Conseils d&apos;évolution
                       <div className="h-px bg-white/5 flex-1" />
                   </p>
                   <Card className="glass-card rounded-3xl sm:rounded-5xl p-6 sm:p-8 space-y-6">
                         <div className="space-y-2 sm:space-y-3">
                             {engagementTips.map((tip, i) => (
                                 <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-primary/5 border border-primary/10">
                                     <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_5px_#C5F441]" />
                                     <p className="text-3xs sm:text-xs text-zinc-300 font-bold leading-tight">{tip}</p>
                                 </div>
                             ))}
                         </div>
                   </Card>
              </div>
              )}

              {/* Social Links Metadata */}
              <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                  <div className="space-y-6">
                          <div className="space-y-2">
                           <div className="text-3xs font-mono text-primary font-black uppercase">Objectif Principal</div>
                           <div className="text-base font-bold text-white uppercase tracking-tight italic">
                               {user.mainObjective || "Pas encore défini"}
                           </div>
                       </div>
                      
                          <div className="space-y-2">
                           <div className="text-3xs font-mono text-zinc-600 font-black uppercase">Localisation</div>
                           <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                               <Globe className="size-3.5 text-primary" />
                               {user.city || user.country ? (
                                 [user.city, user.country].filter(Boolean).join(", ")
                               ) : (
                                 "Non renseigné"
                               )}
                           </div>
                       </div>
                      
                      <div className="space-y-2">
                          <div className="text-3xs font-mono text-zinc-600 font-black uppercase">Réseaux Sociaux</div>
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
                                               <span className="text-3xs sm:text-xs font-mono text-primary font-black uppercase">Ton profil</span>
                                               <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                                                   {quizResult?.profileType || "Pas encore calibré"}
                                               </h3>
                                           </div>
                                       </div>
                                       <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                                           {quizResult?.profileType 
                                             ? <>Ton profil est de type <span className="text-white font-bold">{quizResult.profileType}</span>. Tes scores reflètent tes forces naturelles.</>
                                             : <>Fais le quiz pour découvrir ton profil et débloquer des missions adaptées.</>
                                           }
                                       </p>
                                   </div>

                                  <div className="space-y-4">
                                       <h4 className="text-3xs sm:text-xs font-mono uppercase text-zinc-500 flex items-center gap-3">
                                           Tes scores
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
                                                              <div className="text-2xs sm:text-xs-sm font-mono text-zinc-600 uppercase mb-0.5">{stat.label}</div>
                                                              <div className={cn("text-base sm:text-lg font-black font-mono italic", stat.color)}>{stat.value}%</div>
                                                          </div>
                                                      </TooltipTrigger>
                                                      <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono max-w-48">
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

              {/* Découplage pipeline : graphique XP retiré (gamification gelée) —
                  section "Evidences / rapports vérifiés" arrivera en Vague 3 */}

               {user.missionSubmissions.length > 0 && (
              <div className="space-y-6" id="tour-dossier-missions">
                   <div className="flex items-center gap-3">
                       <Target className="size-5 text-primary" />
                       <h2 className="text-xl font-black uppercase tracking-tight text-white">Missions Récentes</h2>
                   </div>
                   
                   <div className="space-y-3 sm:space-y-4">
                       {user.missionSubmissions.map((sub) => (
                           <div key={sub.id} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                               <div className="space-y-1 min-w-0">
                                   <div className="text-3xs font-mono text-zinc-500 uppercase truncate">{sub.mission.category}</div>
                                   <div className="text-xs sm:text-sm font-bold text-white uppercase group-hover:text-primary transition-colors truncate pr-2">{sub.mission.title}</div>
                               </div>
                               <Badge variant="outline" className={cn(
                                   "text-xs-sm sm:text-3xs font-mono border-white/5 shrink-0",
                                   (STATUS_LABELS[sub.status] ?? STATUS_LABELS.PENDING).className
                               )}>
                                   {(STATUS_LABELS[sub.status] ?? STATUS_LABELS.PENDING).label}
                               </Badge>
                           </div>
                       ))}
                   </div>
              </div>
              )}

              {/* Spécialisations & Outils — hidden if both empty */}
              {(user.domains?.length > 0 || user.tools?.length > 0) && (
              <div className="space-y-6">
                  <div className="flex items-center gap-3">
                      <Zap className="size-5 text-primary" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">Spécialisations & Outils</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {user.domains?.length > 0 && (
                      <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                          <div className="space-y-2">
                              <h4 className="text-3xs sm:text-xs font-mono uppercase text-primary font-black">Domaines d'expertise</h4>
                              <div className="flex flex-wrap gap-2 pt-2">
                                  {user.domains.map((d: string) => (
                                          <Badge key={d} className="bg-primary/10 text-primary border-primary/20 text-3xs sm:text-xs font-black uppercase py-1 px-3">
                                              {d}
                                          </Badge>
                                      ))}
                              </div>
                          </div>
                      </Card>
                      )}
                      
                      {user.tools?.length > 0 && (
                      <Card className="glass-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-6">
                          <div className="space-y-2">
                              <h4 className="text-3xs sm:text-xs font-mono uppercase text-zinc-500 font-black">Outils favoris</h4>
                              <div className="flex flex-wrap gap-2 pt-2">
                                  {user.tools.map((t: string) => (
                                          <Badge key={t} variant="outline" className="border-white/10 text-zinc-400 text-3xs sm:text-xs font-bold uppercase py-1 px-3">
                                              {t}
                                          </Badge>
                                      ))}
                              </div>
                          </div>
                      </Card>
                      )}
                  </div>
              </div>
              )}

              {/* Referral widget — own profile only */}
              {!isPublic && <ReferralWidget />}

              {featureFlags.badges !== false && (user.badges?.length > 0) && (
              <div className="space-y-4">
                   <p className="text-3xs sm:text-xs font-mono uppercase text-zinc-600 flex items-center gap-3">
                       Badges & Distinctions
                       <div className="h-px bg-white/5 flex-1" />
                   </p>
                   <div className="flex flex-wrap gap-2">
                       {user.badges.map((badge: string) => (
                           <Badge key={badge} className="bg-primary/20 text-primary border-primary/30 text-3xs font-black uppercase py-1 px-3 rounded-lg">
                               {badge}
                           </Badge>
                       ))}
                   </div>
              </div>
              )}
          </div>
      </div>
    </div>
  );
}
