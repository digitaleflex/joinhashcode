"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Users,
  Award,
  Globe,
  Check,
  Target,
  User as UserIcon,
  Info
} from "lucide-react"
import { Linkedin } from "@/components/ui/brand-icons"
import Link from "next/link"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserTopBar } from "./user-topbar"
import { DailyCheckinWidget } from "./daily-checkin-widget"
const WelcomeModal = dynamic(() => import("./welcome-modal").then((m) => m.WelcomeModal), { ssr: false })
const MissionHistory = dynamic(() => import("./mission-history").then((m) => m.MissionHistory), { ssr: false })
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { type Mission } from "@/lib/missions"
import { MissionDeck } from "./mission-deck"
import { BottomNav } from "./bottom-nav"
import { ActivationChecklist } from "./activation-checklist"
import type { FirstAction } from "@/lib/first-action"
import { UserProfile, DetailedMissionSubmission } from "@/lib/types"
import type { SquadData } from "@/components/dashboard/squad-journey"
import type { Activity } from "@/components/landing/activity-feed"
const ActivityFeed = dynamic(() => import("../landing/activity-feed").then((m) => m.ActivityFeed), { ssr: false })

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
  featureFlags: _featureFlags = {},
  socialProof: _socialProof = { activeMembers: 0, userRank: 0, weeklyCheckins: 0, totalMembers: 0 },
  firstAction,
}: {
  user: UserProfile,
  quizResult: { profileType?: string | null } | null,
  submissions?: Record<string, string>,
  fullSubmissions?: DetailedMissionSubmission[],
  squad?: SquadData | null,
  memberRole?: string,
  recommendedMissions?: Mission[],
  feedActivities?: Activity[],
  featureFlags?: Record<string, boolean>,
  socialProof?: { activeMembers: number, userRank: number, weeklyCheckins: number, totalMembers: number },
  firstAction?: FirstAction,
}) {
  const profile = useMemo(() => (user?.class || quizResult?.profileType || "unknown").toLowerCase(), [user?.class, quizResult?.profileType])
  const config = useMemo(() => PROFILE_CONFIGS[profile] || PROFILE_CONFIGS.builder, [profile])

  const isNewUser = (user?.missionsCompletedCount ?? 0) === 0 && (user?.currentStreak ?? 0) === 0
  const hasStarted = (user?.missionsCompletedCount ?? 0) > 0 || (user?.currentStreak ?? 0) > 0

  return (
    <SidebarProvider>
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

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* ── HEADER (always shown) ────────────────────────────── */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card relative overflow-hidden border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-[var(--z-content)]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">Mon Parcours</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    Bienvenue sur ton Parcours, <span className={config.color}>{user.name.split(' ')[0]}</span>.
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {(() => {
                      if ((user.currentStreak ?? 0) >= 3) return `${user.currentStreak} jours de suite. Continue comme ça.`
                      if ((user.missionsCompletedCount ?? 0) > 0) return `Tu as complété ${user.missionsCompletedCount} mission${user.missionsCompletedCount > 1 ? 's' : ''}.`
                      return "5 questions. 1 diagnostic. Maintenant, passe à l'action."
                    })()}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Labs validés</p>
                    <p className="text-lg font-bold text-white">{user.missionsCompletedCount ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── NEW USER: 3 sections only ───────────────────────── */}
            {isNewUser && (
              <>
                {/* Prochaine étape — the single most important CTA */}
                <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5">
                  <p className="text-xs font-mono text-primary uppercase font-bold tracking-widest mb-2">
                    {firstAction?.status === "ready" ? "Ta première action" : "Ta prochaine étape"}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {firstAction?.title ??
                      (user.mainObjective
                        ? `${user.mainObjective} — développer une expertise concrète`
                        : "Complète ton diagnostic pour débloquer tes missions")}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    {firstAction?.description ??
                      (user.mainObjective
                        ? "Chaque mission te rapproche de ton objectif."
                        : "5 minutes pour découvrir ton profil et accéder à ton parcours.")}
                  </p>
                  {firstAction?.duration && (
                    <p className="text-xs font-mono text-zinc-500 mt-2">{firstAction.duration}</p>
                  )}
                  <Button className="mt-4 btn-primary-glow" asChild>
                    <Link
                      href={firstAction?.href ?? (user.mainObjective ? "/missions" : "/quiz")}
                      onClick={() => {
                        if (firstAction?.status === "ready") {
                          fetch("/api/me/first-action", {
                            method: "POST",
                            keepalive: true,
                          }).catch(() => undefined)
                        }
                      }}
                    >
                      {firstAction?.status === "ready"
                        ? "Commencer ma première action →"
                        : user.mainObjective
                          ? "Voir les missions →"
                          : "Faire le quiz →"}
                    </Link>
                  </Button>
                </div>

                {/* Check-in — simple, low friction */}
                <div id="tour-checkin">
                  <DailyCheckinWidget isFirstTime={!user.lastCheckin} />
                </div>
              </>
            )}

            {/* ── ESTABLISHED USER: full dashboard ─────────────────── */}
            {hasStarted && (
              <>
                {/* Activation Checklist */}
                <ActivationChecklist
                  user={user}
                  hasSquad={!!squad}
                  hasSubmission={fullSubmissions.length > 0}
                />

                {/* Squad + referral gelés (pivot pipeline cyber) */}

                {/* Objectif 90 jours */}
                {user.mainObjective && (
                  <div className="space-y-5">
                    <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5">
                      <p className="text-xs font-mono text-primary uppercase font-bold tracking-widest mb-2">
                        Objectif 90 jours
                      </p>
                      <p className="text-lg font-bold text-white">
                        {user.mainObjective} — développer une expertise concrète
                      </p>
                      <p className="text-sm text-zinc-400 mt-1">
                        Chaque atelier, projet et mission te rapproche de cette cible.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <span className="text-primary font-bold">Apprendre</span>
                      <span className="text-zinc-700">→</span>
                      <span className={user.missionsCompletedCount > 0 ? "text-primary font-bold" : "text-zinc-600"}>Pratiquer</span>
                      <span className="text-zinc-700">→</span>
                      <span className={user.missionsCompletedCount >= 3 ? "text-primary font-bold" : "text-zinc-600"}>Valider</span>
                    </div>
                  </div>
                )}

                {/* Action Zone: Missions + Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div id="tour-missions">
                      <MissionDeck recommendedMissions={recommendedMissions} />
                    </div>
                    <MissionHistory submissions={fullSubmissions.filter((s) => s.status === "APPROVED")} />
                  </div>

                  <div className="space-y-8" id="tour-feed">
                    <ActivityFeed initialActivities={feedActivities} />
                  </div>
                </div>

                {/* Bento Grid — only boxes with content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* progression_ — labs validés (XP gelé, pivot pipeline cyber) */}
                  <Card variant="premium" className="md:col-span-2 overflow-hidden group" id="tour-progression">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="font-mono text-xs font-bold border-primary/30 text-primary px-3 py-1">Labs</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">progression_</CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 text-zinc-700 cursor-help hover:text-primary transition-colors mt-1" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono max-w-56">
                              Ta progression dans le parcours : labs réussis et evidences vérifiées.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription className="text-zinc-500 font-medium tracking-tight">Tes labs validés et tes prochaines étapes.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-colors">
                            <div className="text-xs text-zinc-600 font-mono font-bold tracking-tight mb-1 uppercase">labs validés</div>
                            <div className="text-2xl font-bold text-white tracking-tighter">{user.missionsCompletedCount || 0}</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-colors">
                            <div className="text-xs text-zinc-600 font-mono font-bold tracking-tight mb-1 uppercase">voie</div>
                            <div className="text-2xl font-bold text-white tracking-tighter">{profile === "unknown" ? "à choisir" : "cyber"}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* connectivité_ — only if at least 1 linked */}
                  {(user.portfolioUrl || user.linkedinUrl || user.twitterUrl) && (
                    <Card variant="premium" className="md:col-span-1 overflow-hidden group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground font-bold tracking-tight uppercase">identité_numérique</span>
                        </div>
                        <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">connectivité_</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium tracking-tight">Montre ton travail. Les recruteurs vérifient ces liens.</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid gap-4">
                          {user.portfolioUrl && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400"><Globe className="h-4 w-4" /></div>
                                <span className="text-sm font-medium text-zinc-300">Portfolio lié</span>
                              </div>
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          {user.linkedinUrl && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[#0077B5]"><Linkedin className="h-4 w-4" /></div>
                                <span className="text-sm font-medium text-zinc-300">LinkedIn lié</span>
                              </div>
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          {user.twitterUrl && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-white">
                                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                                </div>
                                <span className="text-sm font-medium text-zinc-300">X (Twitter) lié</span>
                              </div>
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* status_ — only if pseudo or objective set */}
                  {(user.pseudo || user.mainObjective) && (
                    <Card variant="premium" className="md:col-span-1 overflow-hidden group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground font-bold tracking-tight">profil_personnel</span>
                        </div>
                        <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">status_</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium tracking-tight">Un profil complet = plus de visibilité.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {user.pseudo && (
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                            <div className="space-y-1">
                              <div className="text-xs text-zinc-600 font-mono font-bold tracking-tight uppercase">Pseudo</div>
                              <div className="text-sm font-bold text-white tracking-tight">@{user.pseudo}</div>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                              <Link href="/settings">Modifier</Link>
                            </Button>
                          </div>
                        )}
                        {user.mainObjective && (
                          <div className="p-5 rounded-3xl bg-primary/3 border border-primary/10 space-y-3 relative overflow-hidden group/objective">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/objective:opacity-40 transition-opacity">
                              <Target className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-xs font-mono font-bold tracking-tight text-primary">Objectif principal</div>
                            <div className="text-sm font-medium text-zinc-300 leading-relaxed relative z-[var(--z-content)]">
                              {user.mainObjective}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* arsenal_ — only if has domains or tools */}
                  {(user.domains?.length > 0 || user.tools?.length > 0) && (
                    <Card variant="premium" className="md:col-span-2 overflow-hidden group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground font-bold tracking-tight">spécialisation</span>
                        </div>
                        <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">arsenal_</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium tracking-tight">Les outils que tu maîtrises.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        {user.domains?.length > 0 && (
                          <div className="space-y-4">
                            <div className="text-xs text-zinc-600 font-mono font-bold tracking-tight border-b border-white/5 pb-2">domaines_d_expertise</div>
                            <div className="flex flex-wrap gap-2">
                              {user.domains.map((d: string) => (
                                <span key={d} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-xs font-mono border border-primary/10 font-bold tracking-tight uppercase">{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {user.tools?.length > 0 && (
                          <div className="space-y-4">
                            <div className="text-xs text-zinc-600 font-mono font-bold tracking-tight border-b border-white/5 pb-2">outils_favoris</div>
                            <div className="flex flex-wrap gap-2.5">
                              {user.tools.slice(0, 10).map((tool: string) => (
                                <div key={tool} className="text-xs text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg group-hover:border-primary/20 transition-colors font-medium">{tool}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}

          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
