import { Nav } from "@/components/landing/nav"
import { Terminal, Palette, TrendingUp, Users, Cpu, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ToolWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id: toolId } = await params

  const toolConfigs: Record<string, { name: string, icon: any, desc: string }> = {
    builder: { 
      name: "Terminal HASH", 
      icon: Terminal, 
      desc: "Console de debug communautaire et d'infrastructure." 
    },
    creator: { 
      name: "Studio Créatif", 
      icon: Palette, 
      desc: "Environnement de design, prototypage et art génératif." 
    },
    strategist: { 
      name: "Analyste de Marché", 
      icon: TrendingUp, 
      desc: "Tableaux de bord d'intelligence économique et algorithmes." 
    },
    catalyst: { 
      name: "Hub de Connexion", 
      icon: Users, 
      desc: "Centre névralgique du réseau social et gestion de guilde." 
    }
  }

  const config = toolConfigs[toolId] || { name: "Outil Inconnu", icon: Cpu, desc: "Module non répertorié." }
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour au Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{config.name}</h1>
            <p className="text-muted-foreground mt-1">{config.desc}</p>
          </div>
        </div>

        <div className="w-full h-[60vh] rounded-3xl border border-border/50 bg-card overflow-hidden relative flex flex-col items-center justify-center text-center p-8 group">
          {/* Decorative background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.03),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #C5F441 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <Icon className="w-24 h-24 text-border/40 group-hover:text-primary/20 transition-colors duration-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Module en Déploiement</h2>
          <p className="text-muted-foreground max-w-md mx-auto relative z-10">
            Cette interface de travail spécialisée est actuellement en cours de construction par nos ingénieurs système.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-150" />
          </div>
        </div>
      </main>
    </div>
  )
}
