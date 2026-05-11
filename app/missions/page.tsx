import { Nav } from "@/components/landing/nav"
import { Zap, Target, Crosshair, Award } from "lucide-react"

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Missions & Quêtes</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Objectifs Actifs</h2>
                <p className="text-sm text-muted-foreground">Progression du niveau en cours</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-background border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-medium">Terminer le Profilage</span>
                </div>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">COMPLÉTÉ</span>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/40 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="font-medium">Rejoindre sa Guilde</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">EN ATTENTE</span>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/40 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="font-medium">Première contribution</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">VERROUILLÉ</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-linear-to-br from-card to-background border border-border/50 relative overflow-hidden group">
            <Crosshair className="absolute -right-10 -bottom-10 w-48 h-48 text-border/20 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-2xl font-bold mb-4">La Voie de l'Évolution</h2>
            <p className="text-muted-foreground mb-8 relative z-10 leading-relaxed">
              Le système d'expérience (XP) et les récompenses de palier sont en cours de calibrage. Bientôt, chaque action vous rapprochera du statut d'Architecte HASHCODE.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold relative z-10">
              <Award className="w-4 h-4" />
              Saison 1 imminente
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
