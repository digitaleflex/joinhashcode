import Image from "next/image"

export function BrandIdentity() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-black py-24 sm:py-32">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] opacity-50"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="mb-12 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Identité Visuelle
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>

          {/* Logo Showcase */}
          <div className="relative group">
             {/* Dynamic border glow */}
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-b from-primary/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative rounded-4xl border border-white/5 bg-neutral-950/50 p-8 sm:p-12 backdrop-blur-sm shadow-2xl shadow-black">
              <Image
                src="/hashcode-logo.png"
                alt="HASHCODE Brand Identity"
                width={1200}
                height={400}
                sizes="(max-width: 768px) 100vw, 600px"
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Brand Tagline */}
          <div className="mt-16 max-w-2xl">
            <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Un symbole de structure et d&apos;intelligence.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              L&apos;identité de HASHCODE reflète notre engagement envers la clarté technique 
              et l&apos;évolution communautaire. Un design minimal, robuste et résolument futuriste.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
