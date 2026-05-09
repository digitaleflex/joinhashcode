const steps = [
  {
    n: "01",
    title: "Profile-toi",
    body: "Réponds à 20 questions ciblées en 5 minutes. Identité, parcours, objectifs, engagement.",
  },
  {
    n: "02",
    title: "Découvre ton profil",
    body: "Notre algorithme te positionne sur l'un des 4 niveaux : INIT, CORE, PRO ou ELITE.",
  },
  {
    n: "03",
    title: "Rejoins ta communauté",
    body: "Accède à un dashboard personnalisé, des outils dédiés et un parcours sur mesure.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Fonctionnement
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Trois étapes. Pas une de plus.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            On va à l&apos;essentiel. Tu rentres, tu te profiles, tu avances.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="group relative flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-card/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">{step.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  Étape {i + 1}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              {/* Bottom accent line revealed on hover */}
              <div className="mt-4 h-px w-full bg-border">
                <div className="h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
