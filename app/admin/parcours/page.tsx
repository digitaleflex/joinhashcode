import { Route } from "lucide-react"

export default async function AdminParcoursPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-3">
          <Route className="h-6 w-6 text-primary" />
          Parcours
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Gestion des parcours de spécialisation
        </p>
      </div>
      <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-12 text-center">
        <Route className="h-12 w-12 text-primary/40 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Module en construction</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Créez et gérez les parcours Cloud, Cybersécurité, IA, Fullstack, Design et Product.
          Chaque parcours définit les étapes, ateliers, projets et compétences associés.
        </p>
      </div>
    </div>
  )
}
