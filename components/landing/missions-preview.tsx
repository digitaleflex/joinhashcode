"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const profiles = [
  {
    id: "builder",
    label: "Builder",
    color: "#B8FF3B",
    tagline: "Tu construis.",
    desc: "Code, produits, systèmes. Tu t'épanouis quand une idée devient quelque chose qui tourne en production.",
    traits: ["Développeur", "Ingénieur", "Architecte", "Maker"],
  },
  {
    id: "creator",
    label: "Créateur",
    color: "#A855F7",
    tagline: "Tu imagines.",
    desc: "Design, contenu, narration. Tu crées ce que les autres n'ont pas encore eu l'idée de voir.",
    traits: ["Designer", "UI/UX", "Vidéaste", "Rédacteur"],
  },
  {
    id: "strategist",
    label: "Stratège",
    color: "#22D3EE",
    tagline: "Tu structures.",
    desc: "Business, produit, croissance. Tu vois les systèmes derrière les événements et tu construis pour durer.",
    traits: ["PM", "Growth", "Business Dev", "Analyste"],
  },
  {
    id: "catalyst",
    label: "Catalyseur",
    color: "#F97316",
    tagline: "Tu connectes.",
    desc: "Réseau, communauté, impact. Tu amplifies ce qui existe autour de toi — les gens, les idées, les projets.",
    traits: ["Community", "Mentor", "Ambassadeur", "Networker"],
  },
]

export function MissionsPreview() {
  return (
    <section id="missions" className="relative border-b border-border/60 bg-zinc-950 py-24 sm:py-32 overflow-hidden">
      {/* Background line */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Les 4 Profils
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Qui es-tu dans <span className="text-primary">HASHCODE</span> ?
          </h2>
          <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
            Notre algorithme analyse tes réponses pour identifier ta tendance dominante.
            Beaucoup de membres sont hybrides — c'est la norme, pas l'exception.
          </p>
        </div>

        {/* Profiles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col gap-5 rounded-2xl border bg-zinc-900/40 p-6 transition-all duration-300 hover:bg-zinc-900/80"
              style={{ borderColor: `${p.color}20` }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px ${p.color}08` }}
              />

              {/* Top */}
              <div className="flex items-start justify-between">
                <div
                  className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-md"
                  style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}
                >
                  {p.label}
                </div>
                <div className="w-2 h-2 rounded-full mt-1" style={{ background: p.color }} />
              </div>

              {/* Tagline */}
              <div>
                <p className="text-2xl font-bold text-white tracking-tight mb-2">{p.tagline}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.traits.map(t => (
                  <span
                    key={t}
                    className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ color: `${p.color}99`, background: `${p.color}0d`, border: `1px solid ${p.color}15` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Découvrir mon profil en 3 minutes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
