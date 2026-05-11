"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
  Check
} from "lucide-react"
import Link from "next/link"
import { ScrambleText } from "@/components/ui/scramble-text"
import { motion, Variants } from "framer-motion"

export function DashboardShell({ user, quizResult }: { user: any, quizResult: any }) {
  const hasFinishedQuiz = !!quizResult;
  const profile = user?.class || quizResult?.profileType || "unknown";
  const level = user?.level || 1;
  const levelMap: Record<number, string> = { 1: "INIT", 2: "CORE", 3: "PRO", 4: "ELITE" };
  const levelName = levelMap[level] || "INIT";
  const progress = hasFinishedQuiz ? (level * 25) : 10;

  const profileConfigs: Record<string, { title: string, color: string, gradient: string, message: string }> = {
    builder: { 
      title: "Builder", 
      color: "text-blue-500", 
      gradient: "from-blue-500/10",
      message: "Prêt à construire l'infrastructure du futur ? Tes outils techniques sont prêts."
    },
    creator: { 
      title: "Créateur", 
      color: "text-purple-500", 
      gradient: "from-purple-500/10",
      message: "L'art et le code ne font qu'un. Tes outils de création t'attendent."
    },
    strategist: { 
      title: "Stratège", 
      color: "text-emerald-500", 
      gradient: "from-emerald-500/10",
      message: "Analyse, optimise, domine. Tes tableaux de bord stratégiques sont débloqués."
    },
    catalyst: { 
      title: "Catalyseur", 
      color: "text-orange-500", 
      gradient: "from-orange-500/10",
      message: "Le réseau est ta force. Connecte-toi aux écosystèmes les plus vibrants."
    },
    unknown: { 
      title: "En attente", 
      color: "text-zinc-500", 
      gradient: "from-primary/10",
      message: "Complète ton profilage pour débloquer ton plein potentiel."
    }
  };

  const config = profileConfigs[profile];

  const tools = [
    { id: "builder", name: "Terminal HASH", icon: <Terminal />, minLevel: 1, desc: "Console de debug communautaire" },
    { id: "creator", name: "Studio Créatif", icon: <Palette />, minLevel: 2, desc: "Outils de design collaboratifs" },
    { id: "strategist", name: "Analyste de Marché", icon: <TrendingUp />, minLevel: 3, desc: "Données business en temps réel" },
    { id: "catalyst", name: "Hub de Connexion", icon: <Users />, minLevel: 4, desc: "Networking haute fidélité" },
  ].sort((a, b) => (a.id === profile ? -1 : b.id === profile ? 1 : 0));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Profile Summary */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="border-border/60 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${config.gradient} to-transparent`} />
            <CardHeader className="text-center pt-8">
              <div className="mx-auto h-24 w-24 rounded-full border-2 border-primary/20 p-1 bg-background/50 relative group">
                <div className="h-full w-full rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
                  )}
                </div>
                {hasFinishedQuiz && (
                   <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border border-border shadow-lg ${config.color}`}>
                     <Award className="h-4 w-4" />
                   </div>
                )}
              </div>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <div className="flex flex-col items-center gap-1">
                <CardDescription>{user.email}</CardDescription>
                {hasFinishedQuiz && (
                  <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${config.color}`}>
                    Classe: {config.title}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground tracking-tighter">
                  <span>Niveau {level} [{levelName}]</span>
                  <span>{progress}% d'évolution</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
              
              {!hasFinishedQuiz && (
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/quiz">Terminer mon profilage</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <nav className="hidden md:block space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 text-primary bg-primary/5">
              <LayoutDashboard className="h-4 w-4" />
              Vue d'ensemble
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start gap-3 text-muted-foreground">
              <Link href="/missions">
                <Zap className="h-4 w-4" />
                Missions
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start gap-3 text-muted-foreground">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Configuration
              </Link>
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Welcome Banner Personalized */}
          <div className={`p-10 rounded-[2.5rem] bg-linear-to-br ${config.gradient} via-background to-transparent border border-white/5 relative overflow-hidden group`}>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Bienvenue, <span className={config.color}><ScrambleText text={user.name.split(' ')[0]} duration={1000} /></span>.</h2>
              <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
                {config.message}
              </p>
            </div>
            <Zap className={`absolute -bottom-6 -right-6 h-40 w-40 ${config.color} opacity-[0.05] -rotate-12 group-hover:scale-110 transition-transform duration-700`} />
          </div>

          {/* Progressive Profile Collection (Step 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Étape 4: Visibilité</span>
                </div>
                <CardTitle className="text-lg">Identité Numérique</CardTitle>
                <CardDescription>Lien vers tes preuves de travail.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 group/item">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-zinc-800 text-white">
                         <Terminal className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-sm font-medium">{user.githubUrl ? "GitHub lié" : "GitHub"}</span>
                     </div>
                     {user.githubUrl ? (
                       <Check className="h-4 w-4 text-emerald-500" />
                     ) : (
                       <Button variant="ghost" size="sm" className="h-8 text-[10px] font-mono uppercase text-primary hover:text-primary hover:bg-primary/10">Lier</Button>
                     )}
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 group/item">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-zinc-800 text-white">
                         <Globe className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-sm font-medium">{user.portfolioUrl ? "Portfolio lié" : "Portfolio"}</span>
                     </div>
                     {user.portfolioUrl ? (
                       <Check className="h-4 w-4 text-emerald-500" />
                     ) : (
                       <Button variant="ghost" size="sm" className="h-8 text-[10px] font-mono uppercase text-primary hover:text-primary hover:bg-primary/10">Lier</Button>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Étape 4: Spécialisation</span>
                </div>
                <CardTitle className="text-lg">Domaines & Outils</CardTitle>
                <CardDescription>Affine ton profil technique.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.domains?.length > 0 ? (
                    user.domains.map((d: string) => (
                      <span key={d} className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">{d}</span>
                    ))
                  ) : (
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border/50 text-xs font-mono text-muted-foreground hover:border-primary/30 hover:text-primary">
                      + Ajouter des domaines
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Unlock className="h-5 w-5 text-primary" />
                Espace de Travail Personnalisé
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {tools.filter(t => level >= t.minLevel).length}/{tools.length} Actifs
              </span>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {tools.map((tool, i) => {
                const isUnlocked = level >= tool.minLevel;
                const isPrimary = tool.id === profile;
                return (
                  <motion.div variants={itemVariants} key={i}>
                    <Card className={`relative h-full group border-border/60 transition-all duration-300 ${isUnlocked ? 'hover:border-primary/40 bg-card/50' : 'opacity-50 bg-muted/20 grayscale'} ${isPrimary ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-5">
                          <div className={`p-4 rounded-2xl ${isUnlocked ? 'bg-primary/10 text-primary shadow-inner' : 'bg-muted text-muted-foreground'}`}>
                            {tool.icon}
                          </div>
                          {isUnlocked ? (
                            <div className="flex flex-col items-end gap-1">
                               <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-tighter uppercase">ACTIF</span>
                               {isPrimary && <span className="text-[9px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">SPECIALITÉ</span>}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Lock className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-mono">LVL {tool.minLevel}</span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold mb-1 flex items-center gap-2 group-hover:text-primary transition-colors">
                          {isUnlocked ? (
                            <Link href={`/tools/${tool.id}`} className="flex items-center gap-2 w-full before:absolute before:inset-0">
                              {tool.name}
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Link>
                          ) : (
                            tool.name
                          )}
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">{tool.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
