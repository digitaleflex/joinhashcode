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

export function DashboardShell({ user, quizResult }: { user: any, quizResult: any }) {
  const pathname = usePathname();
  const hasFinishedQuiz = !!quizResult;
  const profile = user?.class || quizResult?.profileType || "unknown";
  const level = user?.level || 1;
  const levelMap: Record<number, string> = { 1: "INIT", 2: "CORE", 3: "PRO", 4: "ELITE" };
  const levelName = levelMap[level] || "INIT";

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
      <SidebarInset className="bg-background">
        <UserTopBar user={user} />
        
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto space-y-8">
          
          <DailyCheckinWidget />

          {/* Welcome Banner Personalized */}
          <div className={`p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-linear-to-br ${config.gradient} via-background to-transparent border border-white/5 relative overflow-hidden group`}>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight text-white">
                Bienvenue, <span className={config.color}><ScrambleText text={user.name.split(' ')[0]} duration={1000} /></span>.
              </h2>
              <p className="text-zinc-400 max-w-xl text-sm sm:text-lg leading-relaxed">
                {config.message}
              </p>
              {user.bio && (
                <p className="mt-4 text-xs sm:text-sm text-primary/60 font-mono italic border-l-2 border-primary/20 pl-4 max-w-lg">
                  "{user.bio}"
                </p>
              )}
            </div>
            <Zap className={`absolute -bottom-6 -right-6 h-24 sm:h-40 w-24 sm:w-40 ${config.color} opacity-[0.05] -rotate-12 group-hover:scale-110 transition-transform duration-700`} />
          </div>

          {/* Core Stats Grid - Balanced 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Level & XP */}
            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">LVL {level}</Badge>
                </div>
                <CardTitle className="text-lg text-white">Progression</CardTitle>
                <CardDescription>Ton évolution dans l'écosystème.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-mono uppercase tracking-widest">Niveau {levelName}</span>
                    <span className="text-primary font-bold">{user.experience} XP</span>
                  </div>
                  <Progress value={(user.experience % 1000) / 10} className="h-1.5 bg-primary/10" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Missions</div>
                    <div className="text-xl font-bold text-white">{user.missionsCompletedCount || 0}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Rang</div>
                    <div className="text-xl font-bold text-white">#124</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Digital Identity */}
            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Identité Numérique</span>
                </div>
                <CardTitle className="text-lg text-white">Connectivité</CardTitle>
                <CardDescription>Tes points d'ancrage externes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 group/item">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-zinc-800 text-white">
                         <Globe className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-sm font-medium text-white">{user.portfolioUrl ? "Portfolio lié" : "Portfolio"}</span>
                     </div>
                     {user.portfolioUrl ? (
                       <Check className="h-4 w-4 text-emerald-500" />
                     ) : (
                       <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono uppercase text-primary hover:text-primary hover:bg-primary/10">
                         <Link href="/settings">Lier</Link>
                       </Button>
                     )}
                   </div>
                   
                   <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 group/item">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-[#0077B5] text-white">
                         <Linkedin className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-sm font-medium text-white">{user.linkedinUrl ? "LinkedIn lié" : "LinkedIn"}</span>
                     </div>
                     {user.linkedinUrl ? (
                       <Check className="h-4 w-4 text-emerald-500" />
                     ) : (
                       <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono uppercase text-primary hover:text-primary hover:bg-primary/10">
                         <Link href="/settings">Lier</Link>
                       </Button>
                     )}
                   </div>

                   <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 group/item">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-black text-white">
                         <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                           <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                         </svg>
                       </div>
                       <span className="text-sm font-medium text-white">{user.twitterUrl ? "X (Twitter) lié" : "X (Twitter)"}</span>
                     </div>
                     {user.twitterUrl ? (
                       <Check className="h-4 w-4 text-emerald-500" />
                     ) : (
                       <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono uppercase text-primary hover:text-primary hover:bg-primary/10">
                         <Link href="/settings">Lier</Link>
                       </Button>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Domaines & Outils */}
            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Spécialisation</span>
                </div>
                <CardTitle className="text-lg text-white">Domaines & Outils</CardTitle>
                <CardDescription>Ton arsenal technique actuel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.domains?.length > 0 ? (
                    user.domains.map((d: string) => (
                      <span key={d} className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">{d}</span>
                    ))
                  ) : (
                    <Button asChild variant="outline" size="sm" className="w-full border-dashed border-border/50 text-xs font-mono text-muted-foreground hover:border-primary/30 hover:text-primary">
                      <Link href="/settings">+ Ajouter des domaines</Link>
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest border-b border-border/40 pb-1">Outils favoris</div>
                  <div className="flex flex-wrap gap-2">
                    {user.tools?.length > 0 ? (
                      user.tools.slice(0, 8).map((tool: string) => (
                        <div key={tool} className="text-[10px] text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md border border-white/5">{tool}</div>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">Aucun outil défini.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Données Personnelles */}
            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Profil Personnel</span>
                </div>
                <CardTitle className="text-lg text-white">Données & Status</CardTitle>
                <CardDescription>Tes informations de base.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Pseudo</div>
                      <div className="text-sm font-bold text-white">@{user.pseudo || "Talent"}</div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono text-primary hover:text-primary hover:bg-primary/10">
                      <Link href="/settings">Editer</Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">Localisation</div>
                      <div className="text-sm font-medium text-white">{user.city || "N/A"}, {user.country || "N/A"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Target className="h-3 w-3" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Objectif Principal</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-300 leading-relaxed">
                    {user.mainObjective || "Définis ton objectif principal dans tes réglages."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Card */}
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Carte de Membre
            </p>
            <MemberCard
              userId={user.id}
              pseudo={user.pseudo ?? user.name}
              memberNumber={user.memberNumber ?? null}
              userClass={user.class ?? null}
              level={user.level ?? 1}
              experience={user.experience ?? 0}
              createdAt={user.createdAt ?? new Date()}
            />
          </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
