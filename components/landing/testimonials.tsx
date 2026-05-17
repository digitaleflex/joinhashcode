"use client"

import { useMemo } from "react"
import { Shield } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Kofi A.",
    location: "Accra, GH",
    class: "Builder",
    level: "CORE",
    color: "text-[#B8FF3B]",
    accent: "#B8FF3B",
    log: "En 3 minutes j'ai su exactement où je me situais. Le dashboard m'a orienté vers des missions que j'aurais mis des semaines à trouver seul.",
  },
  {
    name: "Aminata D.",
    location: "Dakar, SN",
    class: "Catalyst",
    level: "INIT",
    color: "text-[#F97316]",
    accent: "#F97316",
    log: "Ce que j'aimais dans HASHCODE c'est que mon profil Catalyst a été reconnu comme aussi valide que celui d'un dev. Le réseau que j'ai construit en 2 semaines est réel.",
  },
  {
    name: "Ibrahima S.",
    location: "Abidjan, CI",
    class: "Strategist",
    level: "CORE",
    color: "text-[#22D3EE]",
    accent: "#22D3EE",
    log: "L'algorithme m'a catégorisé Stratège. J'étais sceptique. Puis j'ai vu les missions et les ressources débloquées. Ça colle parfaitement à ma façon de travailler.",
  },
  {
    name: "Chloé M.",
    location: "Douala, CM",
    class: "Creator",
    level: "CORE",
    color: "text-[#A855F7]",
    accent: "#A855F7",
    log: "Le fait que le quiz soit une hypothèse et non une étiquette définitive m'a rassurée. Je me suis lancée sans pression. Le profil hybride Créateur × Stratège, c'est exactement moi.",
  },
  {
    name: "Yacine B.",
    location: "Tunis, TN",
    class: "Builder",
    level: "PRO",
    color: "text-[#B8FF3B]",
    accent: "#B8FF3B",
    log: "J'ai complété la mission 'Premier Commit' en 48h. Le feedback de la guilde Builder était direct et technique. C'est ce dont j'avais besoin, pas du networking creux.",
  },
  {
    name: "Fatoumata C.",
    location: "Bamako, ML",
    class: "Catalyst",
    level: "INIT",
    color: "text-[#F97316]",
    accent: "#F97316",
    log: "Première fois que je vois une plateforme tech africaine qui valorise autant les profils non-techniques. Mon rôle de connectrice est enfin reconnu comme un vrai skill.",
  },
]

export function Testimonials() {
  const marqueeItems = useMemo(() => [...testimonials, ...testimonials, ...testimonials], [])

  return (
    <section id="community" className="border-b border-border/60 bg-black py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] opacity-25 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-14">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Retours Terrain
            </span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Ce qu'ils ont vécu.
          </h2>
          <p className="max-w-xl text-zinc-400 text-base">
            Des membres de 20 pays africains et de la diaspora.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
        <motion.div
          animate={{ x: [0, -1 * 376 * testimonials.length] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" }}
          className="flex gap-5 py-3"
        >
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              className="inline-flex flex-col gap-4 w-[360px] shrink-0 rounded-2xl border bg-zinc-900/50 p-6 select-none"
              style={{ borderColor: `${t.accent}20` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{t.name}</span>
                    <Shield className="h-3 w-3 text-primary opacity-60" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{t.location}</span>
                </div>
                <div className="text-right">
                  <div className={`text-[9px] font-mono font-bold uppercase tracking-widest ${t.color}`}>{t.class}</div>
                  <div className="text-[9px] text-zinc-600 font-mono">LVL_{t.level}</div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                "{t.log}"
              </p>

              {/* Bottom */}
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${t.accent}30, transparent)` }} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
