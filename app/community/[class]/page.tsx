import { Nav } from "@/components/landing/nav"
import { Users, Shield, Terminal, Zap } from "lucide-react"

export default async function CommunityHub({ params }: { params: Promise<{ class: string }> }) {
  const { class: profileClass } = await params
  
  const classNames: Record<string, string> = {
    builder: "Builder",
    creator: "Créateur",
    strategist: "Stratège",
    catalyst: "Catalyseur"
  }
  
  const displayName = classNames[profileClass.toLowerCase()] || profileClass.toUpperCase()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="flex items-center gap-3 mb-8 text-primary">
          <Shield className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight text-white">Guilde : {displayName}</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 rounded-2xl bg-card border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Flux Principal
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cet espace est en cours d'initialisation. Bientôt, vous pourrez échanger avec les autres <strong>{displayName}s</strong>, partager vos avancées et construire ensemble l'écosystème.
              </p>
              
              <div className="mt-8 space-y-4">
                {/* Placeholder messages */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border/20 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted/50 rounded w-full" />
                      <div className="h-3 bg-muted/50 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Membres Actifs
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Connexion au réseau en cours...</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted animate-pulse" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  +99
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                <Zap className="w-4 h-4" />
                Mission de Guilde
              </h3>
              <p className="text-sm text-muted-foreground">
                Préparez-vous pour le premier sprint communautaire.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
