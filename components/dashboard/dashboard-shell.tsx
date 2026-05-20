"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Settings, 
  Zap, 
  Lock, 
  Unlock, 
  Terminal, 
  Palette, 
  TrendingUp, 
  Users,
  ChevronRight,
  Award,
  Globe,
  Check,
  Camera,
  Target,
  User as UserIcon,
  Linkedin,
  LogOut,
  FileText,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { ScrambleText } from "@/components/ui/scramble-text"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserTopBar } from "./user-topbar"
import { MemberCard } from "@/components/ui/member-card"
import { DailyCheckinWidget } from "./daily-checkin-widget"
import { MISSIONS, type Mission } from "@/lib/missions"
import { SquadBanner } from "./squad-banner"
import { MissionDeck } from "./mission-deck"
import { NeuralFeed } from "./neural-feed"
import { NeuralSyncGauge } from "./neural-sync-gauge"
import { ProfileDriftAlert } from "./profile-drift-alert"

export function DashboardShell({
  user,
  quizResult,
  submissions = {},
  squad = null,
  recommendedMissions = []
}: {
  user: any,
  quizResult: any,
  submissions?: Record<string, string>,
  squad?: any,
  recommendedMissions?: Mission[]
}) {
  const pathname = usePathname();
  const hasFinishedQuiz = !!quizResult;
  const profile = user?.class || quizResult?.profileType || "unknown";
  const level = user?.level || 1;
  const levelMap: Record<number, string> = { 1: "INIT", 2: "CORE", 3: "PRO", 4: "ELITE" };
  const levelName = levelMap[level] || "INIT";

  // Squad Lock Logic
  const isSquadFull = squad && squad.members.length >= 5;
  const isLocked = !isSquadFull;

  const profileConfigs: Record<string, { title: string, color: string, gradient: string, message: string }> = {
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
  };

  const config = profileConfigs[profile.toLowerCase()] || profileConfigs.builder;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline"></div>
        <UserTopBar user={user} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
            <div className="max-w-6xl mx-auto space-y-10">

            {isLocked && (
              <SquadBanner user={user} squad={squad} />
            )}

            {user.profileDrift > 0.3 && (
              <ProfileDriftAlert
                profileDrift={user.profileDrift}
                userClass={user.class}
                userId={user.id}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <DailyCheckinWidget />
                
                {/* Welcome Banner Personalized */}
                <div className={`p-8 sm:p-12 rounded-[2.5rem] glass-card relative overflow-hidden group border-white/5`}>
                  <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} via-transparent to-transparent opacity-20`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", config.color.replace('text-', 'bg-'))}></div>
                      <span className="text-[10px] font-mono font-bold tracking-tight text-zinc-500">système_prêt_</span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-[-0.04em] leading-[0.9] text-white">
                      Bienvenue, <span className={config.color}><ScrambleText text={user.name.split(' ')[0]} duration={1000} /></span>.
                    </h2>
                    <p className="text-zinc-400 max-w-2xl text-base sm:text-xl leading-relaxed font-medium">
                      {(() => {
                        if ((user.currentStreak ?? 0) >= 3) return `${user.currentStreak} jours de suite. Ton signal est fort.`
                        if ((user.missionsCompletedCount ?? 0) > 0) return `Tu as complété ${user.missionsCompletedCount} mission${user.missionsCompletedCount > 1 ? 's' : ''}. Quelle est la prochaine ?`
                        return config.message
                      })()}
                    </p>
                    {user.bio && (
                      <p className="mt-6 text-xs sm:text-sm text-primary/60 font-mono italic border-l-2 border-primary/20 pl-4 max-w-lg">
                        "{user.bio}"
                      </p>
                    )}
                  </div>
                  <Zap className={`absolute -bottom-10 -right-10 h-32 sm:h-56 w-32 sm:w-56 ${config.color} opacity-[0.03] -rotate-12 group-hover:scale-110 transition-transform duration-1000`} />
                </div>
              </div>

              <div className="space-y-8">
                <MissionDeck recommendedMissions={recommendedMissions} />
                <NeuralFeed />
              </div>
            </div>

            {/* Core Stats Grid - Balanced 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Level & XP */}
              <Card variant="premium" className="overflow-hidden group">
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
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-tight">
                      <span className="text-muted-foreground uppercase">Niveau {levelName}</span>
                      <span className="text-primary">{user.experience} XP</span>
                    </div>
                    <Progress value={(user.experience % 1000) / 10} variant="glow" className="h-2" />
                    <p className="text-[10px] text-zinc-600 font-mono">
                      {1000 - (user.experience % 1000)} XP pour le niveau suivant
                    </p>
                  </div>

                  {/* Neural Sync Gauge */}
                  <NeuralSyncGauge 
                    confidenceScore={user.confidenceScore ?? 0.25} 
                    currentStreak={user.currentStreak ?? 0} 
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                      <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight mb-1">missions</div>
                      <div className="text-2xl font-bold text-white tracking-tighter">{user.missionsCompletedCount || 0}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                      <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight mb-1">niveau</div>
                      <div className="text-2xl font-bold text-white tracking-tighter">{levelName}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Digital Identity */}
              <Card variant="premium" className="overflow-hidden group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-tight">identité_numérique</span>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">connectivité_</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium tracking-tight">Montre ton travail. Les recruteurs vérifient ces liens.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-white/[0.04] transition-colors">
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

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-white/[0.04] transition-colors">
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

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-white/[0.04] transition-colors">
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
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Domaines & Outils */}
              <Card variant="premium" className="overflow-hidden group">
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
                <CardContent className="space-y-8">
                  <div className="flex flex-wrap gap-2">
                    {user.domains?.length > 0 ? (
                      user.domains.map((d: string) => (
                        <span key={d} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-mono border border-primary/10 font-bold tracking-tight uppercase">{d}</span>
                      ))
                    ) : (
                      <Button asChild variant="outline" size="sm" className="w-full border-dashed border-white/10 bg-white/[0.02] text-xs font-mono text-muted-foreground hover:border-primary/30 hover:text-primary h-12 rounded-2xl">
                        <Link href="/settings">+ Ajouter mes spécialités</Link>
                      </Button>
                    )}
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

              {/* Card 4: Données Personnelles */}
              <Card variant="premium" className="overflow-hidden group">
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
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight uppercase">Pseudo</div>
                        <div className="text-sm font-bold text-white tracking-tight">@{user.pseudo || "Talent"}</div>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
                        <Link href="/settings">Modifier</Link>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-600 font-mono font-bold tracking-tight uppercase">Localisation</div>
                        <div className="text-sm font-medium text-white tracking-tight">{user.city || "N/A"}, {user.country || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-[1.5rem] bg-primary/[0.03] border border-primary/10 space-y-3 relative overflow-hidden group/objective">
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
            </div>

            {/* Member Card */}
            <div className="space-y-6 pt-4">
              <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-zinc-600 flex items-center gap-4 px-2">
                <span className="h-px w-10 bg-zinc-800"></span>
                carte_de_membre_officielle
              </h3>
              <div className="hover:scale-[1.01] transition-transform duration-500 ease-out">
                <MemberCard
                  userId={user.id}
                  pseudo={user.pseudo ?? user.name}
                  memberNumber={user.memberNumber ?? null}
                  userClass={user.class ?? null}
                  level={user.level ?? 1}
                  experience={user.experience ?? 0}
                  createdAt={user.createdAt ?? new Date()}
                  confidenceScore={user.confidenceScore ?? 0.25}
                  missionsCompleted={user.missionsCompletedCount ?? 0}
                  tools={user.tools ?? []}
                />
              </div>
            </div>


            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
