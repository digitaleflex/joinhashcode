export function Vision() {
  return (
    <section id="vision" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Eyebrow */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Vision
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="lg:col-span-8">
            <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Une nouvelle façon de connecter les ambitions.
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              HASHCODE n&apos;est pas une plateforme de plus. C&apos;est un écosystème où chaque
              profil trouve sa place, sa communauté et ses outils pour avancer — sans bruit,
              sans détour.
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Un seul code d&apos;entrée : le tien.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
