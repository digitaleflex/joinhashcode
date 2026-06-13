"use client"

import { useMemo } from "react"
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
import { type Mission } from "@/lib/missions"
import { SquadBanner } from "./squad-banner"
import { MissionDeck } from "./mission-deck"
import { NeuralFeed } from "./neural-feed"
import { NeuralSyncGauge } from "./neural-sync-gauge"
import { BottomNav } from "./bottom-nav"
import { MissionHistory } from "./mission-history"
import { NextStepsCard } from "./next-steps-card"
import { ReferralCard } from "./ReferralCard"
import { AmbassadorGoal } from "./AmbassadorGoal"
import { WelcomeModal } from "./welcome-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  fullSubmissions = []
}: {
  user: any,
  quizResult: any,
  submissions?: Record<string, string>,
  fullSubmissions?: any[],
  squad?: any,
  memberRole?: string,
  recommendedMissions?: Mission[]
}) {
  const profile = useMemo(() => (user?.class || quizResult?.profileType || "unknown").toLowerCase(), [user?.class, quizResult?.profileType])
  const level = user?.level || 1;
  const levelName = LEVEL_MAP[level] || "INIT";
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
      {user?.class && (
        <WelcomeModal
          userId={user.id}
          userName={user.name}
          userClass={user.class}
        />
      )}

      <AppSidebar user={user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline"></div>
        <UserTopBar user={user} squad={squad} memberRole={memberRole} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* Global Alerts */}
            {isLocked && (
              <SquadBanner user={user} squad={squad} />
            )}

            {/* Referral / Invitation System (Growth Engine) */}
            {user?.referralCode && (
              <div className="space-y-6" id="referral-card">
                <AmbassadorGoal referralCount={user.referralCount || 0} />
                <ReferralCard referralCode={user.referralCode} referralCount={user.referralCount || 0} />
              </div>
            )}

            {/* TIER 1: COMMAND DECK (Full-Width Welcome Header) */}
            <div className="p-6 sm:p-10 rounded-4xl glass-card relative overflow-hidden group border-white/5">
              <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} via-transparent to-transparent opacity-20`} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", config.color.replace('text-', 'bg-'))}></div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[10px] font-mono font-bold tracking-tight text-zinc-500 cursor-help">{profile.toLowerCase()}_connecté_</span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                          Ta classe actuelle est basée sur tes missions validées.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-tight text-white">
                    Bienvenue, <span className={config.color}><ScrambleText text={user.name.split(' ')[0]} duration={1000} /></span>.
                  </h2>
                  <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                    {(() => {
                      if ((user.currentStreak ?? 0) >= 3) return `${user.currentStreak} jours de suite. Ton signal est fort.`
                      if ((user.missionsCompletedCount ?? 0) > 0) return `Tu as complété ${user.missionsCompletedCount} mission${user.missionsCompletedCount > 1 ? 's' : ''}. Quelle est la prochaine ?`
                      return config.message
                    })()}
                  </p>
                  {user.bio && (
                    <p className="text-xs text-primary/60 font-mono italic border-l-2 border-primary/20 pl-4 max-w-lg">
                      "{user.bio}"
                    </p>
                  )}
                </div>

                {/* Cyber HUD Right Panel */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 w-full md:min-w-55 md:w-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-left md:text-right cursor-help group/hub">
                          <div className="flex items-center md:justify-end gap-1.5 mb-0.5">
                            <div className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Niveau Actuel</div>
                            <Info className="size-2.5 text-zinc-600 group-hover/hub:text-primary transition-colors md:hidden" />
                          </div>
                          <div className="text-2xl font-black text-white tracking-tighter">{levelName}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-48">
                        {levelName === "INIT" && "Niveau de départ. Valide des missions pour monter CORE."}
                        {levelName === "CORE" && "Niveau intermédiaire. Accès aux missions techniques."}
                        {levelName === "PRO" && "Expertise confirmée. Tu peux encadrer des recrues."}
                        {levelName === "ELITE" && "L'élite de HASHCODE. Tes actions influencent le réseau."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="h-px w-full bg-white/5 hidden md:block"></div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-right cursor-help group/hub">
                          <div className="flex items-center justify-end gap-1.5 mb-0.5">
                            <div className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Série quotidienne</div>
                            <Info className="size-2.5 text-zinc-600 group-hover/hub:text-primary transition-colors md:hidden" />
                          </div>
                          <div className="text-sm font-bold text-primary flex items-center gap-1.5 justify-end">
                            <Zap className="h-3.5 w-3.5 fill-current animate-pulse" />
                            <span>{user.currentStreak ?? 0} {user.currentStreak > 1 ? 'jours' : 'jour'}</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                        Maintiens ta série pour booster tes gains d'XP.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Zap className={`absolute -bottom-10 -right-10 h-32 sm:h-56 w-32 sm:w-56 ${config.color} opacity-[0.03] -rotate-12 group-hover:scale-110 transition-transform duration-1000`} />
            </div>

            {/* TIER 2: ACTION & LIVE SYNC AREA (2/3 vs 1/3 Split Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {isNewUser && (
                  <NextStepsCard
                    hasMissions={(user?.missionsCompletedCount ?? 0) > 0}
                    hasSquad={!!squad}
                    hasCheckin={hasCheckinToday}
                    hasProfile={!!(user?.pseudo && user?.country)}
                  />
                )}
                <div id="tour-checkin">
                  <DailyCheckinWidget />
                </div>
                <div id="tour-missions">
                  <MissionDeck recommendedMissions={recommendedMissions} />
                </div>
                <MissionHistory submissions={fullSubmissions.filter((s: any) => s.status === "APPROVED")} />
              </div>

              <div className="space-y-8" id="tour-feed">
                <NeuralFeed />
              </div>
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
                  <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">progression_</CardTitle>
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
                              <Progress value={(user.experience % 1000) / 10} variant="glow" className="h-2" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                            Chaque palier de 1000 XP te rapproche du grade supérieur.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-[10px] text-zinc-600 font-mono">
                        {1000 - (user.experience % 1000)} XP pour le niveau suivant
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

                  <div className="flex items-center justify-center p-4 rounded-2xl bg-white/1 border border-white/5 hover:bg-white/2 transition-colors h-full min-h-40">
                    <NeuralSyncGauge 
                      confidenceScore={user.confidenceScore ?? 0.25} 
                      currentStreak={user.currentStreak ?? 0} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bento Box 2: connectivité_ (spans 1 col) */}
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
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
