"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  TrendingUp,
  Users,
  Award,
  Globe,
  Check,
  Target,
  User as UserIcon,
  Info,
  Download
} from "lucide-react"
import { Linkedin } from "@/components/ui/brand-icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrambleText } from "@/components/ui/scramble-text"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserTopBar } from "./user-topbar"
import { MemberCard } from "@/components/ui/member-card"
import { DailyCheckinWidget } from "./daily-checkin-widget"
const WelcomeModal = dynamic(() => import("./welcome-modal").then((m) => m.WelcomeModal), { ssr: false })
const LevelUpModal = dynamic(() => import("./level-up-modal").then((m) => m.LevelUpModal), { ssr: false })
const ShareCardDialog = dynamic(() => import("./share-card-dialog").then((m) => m.ShareCardDialog), { ssr: false })
const AmbassadorGoal = dynamic(() => import("./AmbassadorGoal").then((m) => m.AmbassadorGoal), { ssr: false })
const ReferralCard = dynamic(() => import("./ReferralCard").then((m) => m.ReferralCard), { ssr: false })
const MissionHistory = dynamic(() => import("./mission-history").then((m) => m.MissionHistory), { ssr: false })
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { type Mission } from "@/lib/missions"
import { SquadBanner } from "./squad-banner"
import { MissionDeck } from "./mission-deck"
import { WeeklyChallengeWidget } from "./weekly-challenge-widget"
const NeuralSyncGauge = dynamic(() => import("./neural-sync-gauge").then((m) => m.NeuralSyncGauge), { ssr: false })
import { BottomNav } from "./bottom-nav"
import { ActivationChecklist } from "./activation-checklist"
import { getLevelProgress } from "@/lib/level-utils"
import { UserProfile, DetailedMissionSubmission } from "@/lib/types"
const ActivityFeed = dynamic(() => import("../landing/activity-feed").then((m) => m.ActivityFeed), { ssr: false })

const LEVEL_MAP: Record<number, string> = { 1: "INIT", 2: "CORE", 3: "PRO", 4: "ELITE" }

const PROFILE_CONFIGS: Record<string, { title: string, color: string, gradient: string, message: string }> = {
  builder: {
    title: "Builder",
    color: "text-blue-500",
    gradient: "from-blue-500/10",
    message: "Tu as l'âme d'un bâtisseur. Chaque ligne de code est une brique vers ton empire numérique."
  },
  catalyst: {
    title: "Catalyseur",
    color: "text-emerald-500",
    gradient: "from-emerald-500/10",
    message: "Tu accélères les projets. Partout où tu passes, les idées deviennent des réalités palpables."
  },
  strategist: {
    title: "Stratège",
    color: "text-amber-500",
    gradient: "from-amber-500/10",
    message: "Rien n'est laissé au hasard. Ton approche méthodique est la clé des systèmes complexes."
  },
  creator: {
    title: "Créateur",
    color: "text-purple-500",
    gradient: "from-purple-500/10",
    message: "L'art et la technique ne font qu'un dans tes mains. Tu imagines ce que les autres ne voient pas encore."
  }
}

export function DashboardShell({
  user,
  quizResult,
  squad = null,
  memberRole,
  recommendedMissions = [],
  fullSubmissions = [],
  feedActivities = [],
  featureFlags = {}
}: {
  user: UserProfile,
  quizResult: any,
  submissions?: Record<string, string>,
  fullSubmissions?: DetailedMissionSubmission[],
  squad?: any,
  memberRole?: string,
  recommendedMissions?: Mission[],
  feedActivities?: any[],
  featureFlags?: Record<string, boolean>
}) {
  const profile = useMemo(() => (user?.class || quizResult?.profileType || "unknown").toLowerCase(), [user?.class, quizResult?.profileType])
  const { level, percent, xpNeededForNext } = getLevelProgress(user.experience)
  const levelName = LEVEL_MAP[level] || "AGENT"
  const isSquadFull = useMemo(() => !!(squad && squad.members.length >= 5), [squad])
  const isLocked = !isSquadFull;
  const config = useMemo(() => PROFILE_CONFIGS[profile] || PROFILE_CONFIGS.builder, [profile])

  const hasCheckinToday = useMemo(() => {
    if (!user?.lastCheckin) return false
    const last = new Date(user.lastCheckin)
    const now = new Date()
    return last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth() && last.getDate() === now.getDate()
  }, [user?.lastCheckin])

  const isNewUser = (user?.missionsCompletedCount ?? 0) === 0 && (user?.currentStreak ?? 0) === 0

  return (
    <SidebarProvider>
      {/* First-visit welcome modal — shown once after quiz completion */}
      {user?.class && typeof window !== "undefined" && !localStorage.getItem(`hc_welcomed_${user.id}`) && (
        <WelcomeModal
          userId={user.id}
          userName={user.name}
          userClass={user.class}
        />
      )}

      <AppSidebar user={user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline"></div>
        <UserTopBar user={user} squad={squad} memberRole={memberRole} featureFlags={featureFlags} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* ACTIVATION CHECKLIST */}
            <ActivationChecklist 
              user={user} 
              hasSquad={!!squad} 
              hasSubmission={fullSubmissions.length > 0} 
            />

            {/* Global Alerts */}
            {isLocked && (
              <SquadBanner user={user} squad={squad} />
            )}

            {/* Referral / Invitation System (Growth Engine) */}
            {!isNewUser && featureFlags.referrals !== false && user?.referralCode && (
              <div className="space-y-6" id="referral-card">
                <AmbassadorGoal referralCount={user.referralCount || 0} />
                <ReferralCard referralCode={user.referralCode} referralCount={user.referralCount || 0} />
              </div>
            )}

            {/* TIER 1: HEADER ORIENTÉ OBJECTIF */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card relative overflow-hidden border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Mon Parcours</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    Bienvenue sur ton Parcours, <span className={config.color}>{user.name.split(' ')[0]}</span>.
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {(() => {
                      if ((user.currentStreak ?? 0) >= 3) return `${user.currentStreak} jours de suite. Continue comme ça.`
                      if ((user.missionsCompletedCount ?? 0) > 0) return `Tu as complété ${user.missionsCompletedCount} mission${user.missionsCompletedCount > 1 ? 's' : ''}.`
                      return "Choisis ta spécialisation pour définir ton plan d'action."
                    })()}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{levelName}</p>
                    <p className="text-lg font-bold text-white">{user.experience} XP</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Série</p>
                    <p className="text-sm font-bold text-primary flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-current" />
                      {user.currentStreak ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* OBJECTIF 90 JOURS + BOUCLE DE PROGRESSION */}
            <div className="space-y-5">
              <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5">
                <p className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest mb-2">
                  Objectif 90 jours
                </p>
                <p className="text-lg font-bold text-white">
                  {user.mainObjective
                    ? `${user.mainObjective} — développer une expertise concrète`
                    : "Choisis ta spécialisation et fixe-toi un objectif"
                  }
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  {user.mainObjective
                    ? "Chaque atelier, projet et mission te rapproche de cette cible."
                    : "Passe le quiz pour obtenir une recommandation personnalisée."
                  }
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="text-primary font-bold">Apprendre</span>
                <span className="text-zinc-700">→</span>
                <span className={user.missionsCompletedCount > 0 ? "text-primary font-bold" : "text-zinc-600"}>Pratiquer</span>
                <span className="text-zinc-700">→</span>
                <span className={user.missionsCompletedCount >= 3 ? "text-primary font-bold" : "text-zinc-600"}>Valider</span>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Prochaine étape</p>
                <p className="text-base font-bold text-white mt-1">
                  {user.mainObjective
                    ? `Premier atelier — ${user.mainObjective.toLowerCase()}`
                    : "Complète ton diagnostic"
                  }
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {user.mainObjective ? "45 min · Première étape de ton parcours" : "Découvre ton profil et ta spécialisation"}
                </p>
                <Button className="mt-3 btn-primary-glow" asChild>
                  <Link href={user.mainObjective ? "/missions" : "/quiz"}>
                    {user.mainObjective ? "Commencer" : "Faire le quiz →"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* TIER 2: ACTION & LIVE SYNC AREA (2/3 vs 1/3 Split Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div id="tour-checkin">
                    <DailyCheckinWidget />
                  </div>
                {featureFlags.weekly_challenges !== false && (
                  <div id="tour-weekly">
                    <WeeklyChallengeWidget />
                  </div>
                )}
                <div id="tour-missions">
                  <MissionDeck recommendedMissions={recommendedMissions} />
                </div>
                <MissionHistory submissions={fullSubmissions.filter((s) => s.status === "APPROVED")} />
              </div>

              {!isNewUser && (
                <div className="space-y-8" id="tour-feed">
                  <ActivityFeed initialActivities={feedActivities} />
                </div>
              )}
            </div>

            {/* TIER 3: ASYMMETRIC CYBER BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Bento Box 1: core_evolution_ (spans 2 cols on md) */}
              <Card variant="premium" className="md:col-span-2 overflow-hidden group" id="tour-progression">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold border-primary/30 text-primary px-3 py-1">LVL {level}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">progression_</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-zinc-700 cursor-help hover:text-primary transition-colors mt-1" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-56">
                          Accumule de l'XP via les missions et les check-ins pour monter en grade et débloquer de nouvelles habilitations.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-zinc-500 font-medium tracking-tight">Ta progression vers le niveau suivant.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-tight">
                        <span className="text-muted-foreground uppercase">Niveau {levelName}</span>
                        <span className="text-primary">{user.experience} XP</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Progress value={percent} variant="glow" className="h-2" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                            {xpNeededForNext > 0 
                              ? `Encore ${xpNeededForNext} XP pour atteindre le niveau ${level + 1}.` 
                              : "Tu as atteint le niveau maximum pour cette phase."}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-[10px] text-zinc-600 font-mono">
                        {xpNeededForNext > 0 ? `${xpNeededForNext} XP pour le niveau suivant` : "Niveau Max"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-colors">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight mb-1 uppercase">missions validées</div>
                        <div className="text-2xl font-bold text-white tracking-tighter">{user.missionsCompletedCount || 0}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-colors">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight mb-1 uppercase">grade actuel</div>
                        <div className="text-2xl font-bold text-white tracking-tighter">{levelName}</div>
                      </div>
                    </div>
                  </div>

                  {featureFlags.neural_sync_gauge !== false && (
                    <div className="flex items-center justify-center p-4 rounded-2xl bg-white/1 border border-white/5 hover:bg-white/2 transition-colors h-full min-h-40">
                      <NeuralSyncGauge 
                        score={25}
                        confidenceScore={user.confidenceScore}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bento Box 2: connectivité_ (spans 1 col) */}
              {!isNewUser && (
              <Card variant="premium" className="md:col-span-1 overflow-hidden group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-tight uppercase">identité_numérique</span>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">connectivité_</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium tracking-tight">Montre ton travail. Les recruteurs vérifient ces liens.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 group/item hover:bg-white/4 transition-colors cursor-help">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 group-hover/item:text-white transition-colors">
                                <Globe className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">{user.portfolioUrl ? "Portfolio lié" : "Portfolio"}</span>
                            </div>
                            {user.portfolioUrl ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                                <Link href="/settings">Connecter</Link>
                              </Button>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                          Ton portfolio centralise tes preuves de travail validées.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 group/item hover:bg-white/4 transition-colors cursor-help">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[#0077B5] group-hover/item:brightness-125 transition-all">
                                <Linkedin className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">{user.linkedinUrl ? "LinkedIn lié" : "LinkedIn"}</span>
                            </div>
                            {user.linkedinUrl ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                                <Link href="/settings">Connecter</Link>
                              </Button>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                          Lier LinkedIn permet de synchroniser tes badges officiels.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 group/item hover:bg-white/4 transition-colors cursor-help">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-white">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">{user.twitterUrl ? "X (Twitter) lié" : "X (Twitter)"}</span>
                            </div>
                            {user.twitterUrl ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                                <Link href="/settings">Connecter</Link>
                              </Button>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                          L'activité sur X booste ton score de vitalité communautaire.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Bento Box 3: status_ (spans 1 col) */}
              <Card variant="premium" className="md:col-span-1 overflow-hidden group">

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-tight">profil_personnel</span>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">status_</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium tracking-tight">Un profil complet = plus de visibilité dans la communauté.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight uppercase">Pseudo</div>
                        <div className="text-sm font-bold text-white tracking-tight">@{user.pseudo || "Talent"}</div>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                        <Link href="/settings">Modifier</Link>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight uppercase">Localisation</div>
                        <div className="text-sm font-medium text-white tracking-tight">
                          {user.city || user.country ? (
                            [user.city, user.country].filter(Boolean).join(", ")
                          ) : (
                            <span className="text-zinc-500 italic text-xs">Localisation non renseignée</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-primary/3 border border-primary/10 space-y-3 relative overflow-hidden group/objective">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/objective:opacity-40 transition-opacity">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="text-[10px] font-mono font-bold tracking-tight">Objectif principal</span>
                    </div>
                    <div className="text-sm font-medium text-zinc-300 leading-relaxed relative z-10">
                      {user.mainObjective || "Définis ton objectif principal dans tes réglages pour aligner le système."}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bento Box 4: arsenal_ (spans 2 cols on md) */}
              <Card variant="premium" className="md:col-span-2 overflow-hidden group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-tight">spécialisation</span>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">arsenal_</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium tracking-tight">Les outils que tu maîtrises.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-4">
                    <div className="text-[10px] text-zinc-600 font-mono font-bold tracking-tight border-b border-white/5 pb-2">domaines_d_expertise</div>
                    <div className="flex flex-wrap gap-2">
                      {user.domains?.length > 0 ? (
                        user.domains.map((d: string) => (
                          <span key={d} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-mono border border-primary/10 font-bold tracking-tight uppercase">{d}</span>
                        ))
                      ) : (
                        <Button asChild variant="outline" size="sm" className="w-full border-dashed border-white/10 bg-white/2 text-xs font-mono text-muted-foreground hover:border-primary/30 hover:text-primary h-12 rounded-2xl">
                          <Link href="/settings">+ Ajouter mes spécialités</Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] text-zinc-600 font-mono font-bold tracking-tight border-b border-white/5 pb-2">outils_favoris</div>
                    <div className="flex flex-wrap gap-2.5">
                      {user.tools?.length > 0 ? (
                        user.tools.slice(0, 10).map((tool: string) => (
                          <div key={tool} className="text-[10px] text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg group-hover:border-primary/20 transition-colors font-medium">{tool}</div>
                        ))
                      ) : (
                        <span className="text-xs italic text-zinc-600 font-mono tracking-tighter">Ajoute tes outils → le système affine tes missions</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* TIER 4: OFFICIAL MEMBER CARD (Holographic Showcase) */}
            <div className="space-y-6 pt-6 flex flex-col items-center w-full" id="tour-member-card">
              <h3 className="text-[10px] font-mono font-bold text-zinc-600 flex items-center gap-4 justify-center w-full">
                <span className="h-px w-10 bg-zinc-800"></span>
                carte_de_membre_officielle
                <span className="h-px w-10 bg-zinc-800"></span>
              </h3>
              <div className="hover:scale-[1.01] transition-transform duration-500 ease-out w-full max-w-4xl relative group">
                <div className={`absolute -inset-1.5 bg-linear-to-r ${config.gradient} to-transparent rounded-4xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000`} />
                <div className="relative">
                  <MemberCard
                    userId={user.id}
                    pseudo={user.pseudo ?? user.name}
                    memberNumber={user.memberNumber ?? null}
                    userClass={user.class ?? null}
                    level={user.level ?? 1}
                    experience={user.experience ?? 0}
                    createdAt={user.createdAt ?? new Date()}
                    image={user.image ?? null}
                    confidenceScore={user.confidenceScore ?? 0.25}
                    missionsCompleted={user.missionsCompletedCount ?? 0}
                    tools={user.tools ?? []}
                    actions={
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-[10px] font-bold uppercase tracking-wider h-14"
                        >
                          <a href={`/api/card/${user.id}`} download={`hashcode-passport-${user.pseudo ?? user.name}.png`}>
                            <Download className="mr-2 h-4 w-4" />
                            Exporter HD
                          </a>
                        </Button>
                        <ShareCardDialog userId={user.id} userName={user.pseudo ?? user.name} />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
        <BottomNav />
      </SidebarInset>
      <LevelUpModal currentLevel={level} userClass={profile} />
    </SidebarProvider>
  );
}
