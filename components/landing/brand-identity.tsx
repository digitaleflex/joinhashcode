"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "20+", label: "Pays représentés", sub: "Afrique & Diaspora" },
  { value: "4", label: "Profils identifiés", sub: "Builder · Creator · Strategist · Catalyst" },
  { value: "3 min", label: "Pour se profiler", sub: "13 questions ciblées" },
  { value: "100%", label: "Gratuit", sub: "Sans engagement" },
]

const regions = [
  "Sénégal", "Côte d'Ivoire", "Nigeria", "Cameroun", "Maroc",
  "Tunisie", "Ghana", "Kenya", "RDC", "Burkina Faso",
]

export function BrandIdentity() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-black py-24 sm:py-32">
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              La Communauté
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Construit pour l'Afrique.<br />
            <span className="text-primary">Ouvert au monde.</span>
          </h2>
          <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
            HASHCODE est né d'un constat : la tech africaine manque d'une infrastructure communautaire à la hauteur de ses talents.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-1.5 bg-zinc-950 p-8 sm:p-10 text-center"
            >
              <span className="text-3xl sm:text-4xl font-bold text-primary font-mono tracking-tight">
                {s.value}
              </span>
              <span className="text-sm font-medium text-white">{s.label}</span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-tight">
                {s.sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Countries scroll */}
        <div className="flex flex-wrap justify-center gap-2">
          {regions.map((r) => (
            <span
              key={r}
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 border border-white/5 px-3 py-1 rounded-full bg-zinc-900/40 hover:text-primary hover:border-primary/20 transition-colors"
            >
              {r}
            </span>
          ))}
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 border border-white/5 px-3 py-1 rounded-full bg-zinc-900/40">
            + d'autres...
          </span>
        </div>
      </div>
    </section>
  )
}
