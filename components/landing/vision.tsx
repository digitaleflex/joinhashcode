"use client"

export function Vision() {
  return (
    <section id="vision" className="relative overflow-hidden border-b border-border/60 bg-zinc-950 py-24 sm:py-32">
      {/* Subtle radial glow — no image, no rotating shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[140px]"
      />

      <div className="relative z-[var(--z-content)] mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase text-primary">
                Manifeste
              </span>
            </div>

            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl leading-[1.1]">
              La tech africaine mérite<br />
              <span className="text-primary">une vraie infrastructure.</span>
            </h2>

            <div className="mt-8 space-y-6">
              <p className="max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400">
                Il existe des milliers de développeurs, designers et entrepreneurs en Afrique. Ils manquent rarement de talent — ils manquent de visibilité, de contexte et de pairs au même niveau.
              </p>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-zinc-500">
                HASHCODE est construit pour changer ça. Pas une plateforme généraliste, pas un énième Discord. Un système de diagnostic précis qui te place là où tu as de la valeur.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <h3 className="text-primary font-mono text-xs uppercase tracking-wider">Précision</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Un algorithme comportemental, pas un formulaire de compétences.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-primary font-mono text-xs uppercase tracking-wider">Pertinence</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Des communautés par affinité profonde, pas par hasard ou par hashtag.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — real profile breakdown card */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative rounded-2xl border border-white/8 bg-zinc-900/60 backdrop-blur-xl p-7 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">Résultat du diagnostic</p>
                  <p className="text-xl font-bold text-white mt-1">Ibrahima S.</p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                    Stratège
                  </span>
                </div>
              </div>

              {/* Score bars */}
              <div className="space-y-3">
                {[
                  { label: "Stratège", pct: 68, color: "#22D3EE" },
                  { label: "Builder", pct: 22, color: "#B8FF3B" },
                  { label: "Catalyseur", pct: 8, color: "#F97316" },
                  { label: "Créateur", pct: 2, color: "#A855F7" },
                ].map(bar => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{bar.label}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{bar.pct}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/5">
                      <div
                        className="h-1 rounded-full"
                        style={{ width: `${bar.pct}%`, background: bar.color, opacity: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Confiance</span>
                <span className="font-mono text-[11px] text-[#22D3EE] font-bold">91%</span>
              </div>

              {/* Accent glow */}
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#22D3EE]/10 blur-[60px] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
