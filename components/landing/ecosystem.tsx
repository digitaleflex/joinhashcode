import { Users, Wrench, Compass, Sparkles } from "lucide-react"

const pillars = [
  {
    icon: Users,
    title: "Communauté ciblée",
    body: "Connecte-toi avec des profils alignés sur tes objectifs. Pas de bruit, que des connexions utiles.",
  },
  {
    icon: Wrench,
    title: "Outils & ressources",
    body: "Accède à des frameworks, scripts et ressources validés par d'autres membres sur le terrain.",
  },
  {
    icon: Compass,
    title: "Parcours sur mesure",
    body: "Un chemin adapté à ton profil — INIT, CORE, PRO, ELITE — avec des missions et des jalons clairs.",
  },
  {
    icon: Sparkles,
    title: "Visibilité & opportunités",
    body: "Sois identifié par les bonnes personnes au bon moment. Le bon profil attire la bonne offre.",
  },
]

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative border-b border-border/60 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase text-primary">
                L'Écosystème
              </span>
            </div>
            <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Ce que tu trouves une fois à l&apos;intérieur.
            </h2>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
              Un environnement pensé pour avancer vite — des outils communautaires, un dashboard de suivi, et un réseau trié sur le volet.
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
