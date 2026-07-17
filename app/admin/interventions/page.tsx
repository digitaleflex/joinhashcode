import { LifeBuoy } from "lucide-react"

export default async function AdminInterventionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
          Interventions
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Suivi des actions correctives — blocages, réassignations, messages
        </p>
      </div>
      <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-12 text-center">
        <LifeBuoy className="h-12 w-12 text-primary/40 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Module en construction</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Créez et suivez les interventions sur les membres bloqués : réassignation de mentor,
          changement d&apos;objectif, message personnalisé. Chaque intervention est historisée
          pour apprendre ce qui fonctionne.
        </p>
      </div>
    </div>
  )
}
