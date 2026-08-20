"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

const PROFILES = [
  {
    id: "builder",
    label: "Builder",
    tagline: "Tu construis.",
    color: "#B8FF3B",
    desc: "Code, systèmes, produits. Tu t'épanouis quand une idée tourne en production. Le débogage ne te décourage pas — il t'intrigue.",
    traits: ["Développeur", "Ingénieur", "Maker", "Architecte"],
  },
  {
    id: "creator",
    label: "Créateur",
    tagline: "Tu imagines.",
    color: "#A855F7",
    desc: "Design, contenu, narration. Tu crées ce que les autres n'ont pas encore eu l'idée de voir. L'esthétique n'est pas un détail pour toi.",
    traits: ["Designer", "UI/UX", "Rédacteur", "Vidéaste"],
  },
  {
    id: "strategist",
    label: "Stratège",
    tagline: "Tu structures.",
    color: "#22D3EE",
    desc: "Business, produit, croissance. Tu vois les systèmes derrière les événements et tu construis pour durer. Les chiffres parlent avant les intuitions.",
    traits: ["Product", "Growth", "Business Dev", "Analyste"],
  },
  {
    id: "catalyst",
    label: "Catalyseur",
    tagline: "Tu connectes.",
    color: "#F97316",
    desc: "Réseau, communauté, impact. Tu amplifies ce qui existe autour de toi — les gens, les idées, les projets. Sans toi, l'énergie ne circule pas.",
    traits: ["Community", "Mentor", "Ambassadeur", "Networker"],
  },
] as const

export function MissionsPreview() {
  const [active, setActive] = useState(0)
  const profile = PROFILES[active]

  return (
    <section id="profils" className="border-b border-border/60 bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary">Les 4 profils</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            L'un de ces quatre te ressemble.
          </h2>
          <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
            L'algorithme identifie ta tendance dominante — pas une boîte dans laquelle tu restes enfermé.
          </p>
          <p className="mt-4 max-w-xl text-center text-xs text-zinc-600 leading-relaxed">
            Ton profil est une hypothèse de travail, pas une étiquette définitive.
            Il peut évoluer. Beaucoup de membres sont hybrides.
          </p>
        </div>

        {/* Desktop: two columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-start">

          {/* Left — animated panel on profile switch */}
          <div className="sticky top-24">
              <div
                className="rounded-2xl border p-8"
                style={{ borderColor: `${profile.color}25`, background: `${profile.color}06` }}
              >
                <div
                  className="text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded-md inline-block mb-6"
                  style={{ color: profile.color, background: `${profile.color}15`, border: `1px solid ${profile.color}30` }}
                >
                  {profile.label}
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">{profile.tagline}</h3>
                <p className="text-zinc-400 text-base leading-relaxed mb-6">{profile.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.traits.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md"
                      style={{ color: `${profile.color}90`, background: `${profile.color}0d`, border: `1px solid ${profile.color}20` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-8 h-px w-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${profile.color}60, transparent)` }}
                />
              </div>
          </div>

          {/* Right — profile selector list */}
          <div
            className="space-y-2"
          >
            {PROFILES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="w-full text-left rounded-xl border px-6 py-5 transition-all duration-300 cursor-pointer"
                style={{
                  borderColor: active === i ? `${p.color}40` : "transparent",
                  background: active === i ? `${p.color}08` : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full transition-all duration-300 shrink-0"
                      style={{
                        background: p.color,
                        opacity: active === i ? 1 : 0.3,
                        boxShadow: active === i ? `0 0 8px ${p.color}` : "none",
                      }}
                    />
                    <span
                      className="text-2xl font-bold tracking-tight transition-colors duration-300"
                      style={{ color: active === i ? p.color : "#71717A" }}
                    >
                      {p.label}
                    </span>
                  </div>
                  <span
                    className="font-mono text-sm transition-colors duration-300"
                    style={{ color: active === i ? p.color : "#3F3F46" }}
                  >
                    {p.tagline}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: 4 stacked cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILES.map((p, i) => (
            <div
              key={p.id}
              className="rounded-2xl border p-6 space-y-4"
              style={{ borderColor: `${p.color}20`, background: `${p.color}06` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md"
                  style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}
                >
                  {p.label}
                </div>
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: p.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white mb-2">{p.tagline}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.traits.map(t => (
                  <span
                    key={t}
                    className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ color: `${p.color}80`, background: `${p.color}0d`, border: `1px solid ${p.color}15` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="flex justify-center mt-14"
        >
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Découvrir mon profil
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
