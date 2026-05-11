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
  ChevronRight
} from "lucide-react"
import Link from "next/link"

export function DashboardShell({ user, quizResult }: { user: any, quizResult: any }) {
  const hasFinishedQuiz = !!quizResult;
  const level = hasFinishedQuiz ? 3 : 1;
  const progress = hasFinishedQuiz ? 100 : 25;

  const tools = [
    { name: "Terminal HASH", icon: <Terminal />, minLevel: 1, category: "builder", desc: "Console de debug communautaire" },
    { name: "Studio Créatif", icon: <Palette />, minLevel: 2, category: "creator", desc: "Outils de design collaboratifs" },
    { name: "Analyste de Marché", icon: <TrendingUp />, minLevel: 3, category: "strategist", desc: "Données business en temps réel" },
    { name: "Hub de Connexion", icon: <Users />, minLevel: 4, category: "catalyst", desc: "Networking haute fidélité" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Profile Summary */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="border-border/60 bg-card/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
                )}
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
                  <span>Niveau {level}</span>
                  <span>{progress}%</span>
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

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 text-primary bg-primary/5">
              <LayoutDashboard className="h-4 w-4" />
              Vue d'ensemble
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="p-8 rounded-3xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-semibold mb-2">Bienvenue dans ton espace, {user.name.split(' ')[0]}</h2>
              <p className="text-zinc-400 max-w-xl">
                {hasFinishedQuiz 
                  ? `Ton profil ${quizResult.profile.toUpperCase()} est actif. Explore les outils débloqués pour ton niveau.`
                  : "Complète ton profilage pour débloquer ton plein potentiel et accéder aux outils avancés."}
              </p>
            </div>
            <Zap className="absolute -bottom-4 -right-4 h-32 w-32 text-primary/10 -rotate-12" />
          </div>

          {/* Tools Grid */}
          <div>
            <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Unlock className="h-5 w-5 text-primary" />
              Tes Outils & Fonctionnalités
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((tool, i) => {
                const isUnlocked = level >= tool.minLevel;
                return (
                  <Card key={i} className={`group border-border/60 transition-all ${isUnlocked ? 'hover:border-primary/40 bg-card/50' : 'opacity-60 bg-muted/20 grayscale'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {tool.icon}
                        </div>
                        {isUnlocked ? (
                          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">UNLOCKED</span>
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        {tool.name}
                        {isUnlocked && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                      </h4>
                      <p className="text-sm text-muted-foreground">{tool.desc}</p>
                      {!isUnlocked && (
                        <p className="text-[10px] font-mono text-primary mt-3 uppercase tracking-tighter">Débloqué au Niveau {tool.minLevel}</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
