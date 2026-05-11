import { Users, Wrench, Compass, Sparkles } from "lucide-react"

const pillars = [
  {
    icon: Users,
    title: "Communauté ciblée",
    body: "Connecte-toi avec des profils alignés sur tes objectifs. Pas de bruit, que des bonnes connexions.",
  },
  {
    icon: Wrench,
    title: "Outils business",
    body: "Accède à des ressources, scripts et frameworks éprouvés sur le terrain par d'autres membres.",
  },
  {
    icon: Compass,
    title: "Parcours sur mesure",
    body: "Suis un chemin adapté à ton niveau — INIT, CORE, PRO, ELITE — avec des paliers clairs.",
  },
  {
    icon: Sparkles,
    title: "Visibilité & opportunités",
    body: "Sois identifié par les bonnes personnes au bon moment. Le bon profil attire la bonne offre.",
  },
]

export function Ecosystem() {
  return (
    <section id="ecosystem" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                L'Écosystème
              </span>
            </div>
            <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Ton Espace de Travail Augmenté.
            </h2>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
              Un environnement pensé pour les Builders : des outils communautaires, des dashboards de performance et un hub de connexion élite.
            </p>
          </div>

          {/* Grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-card/60 sm:p-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-primary transition-colors group-hover:border-primary/40">
                    <pillar.icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-medium tracking-tight text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
