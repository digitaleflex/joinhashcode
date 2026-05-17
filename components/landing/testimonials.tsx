"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

const TESTIMONIALS = [
  {
    name: "Kofi A.",
    location: "Accra, GH",
    profile: "Builder",
    color: "#B8FF3B",
    quote: "En 3 minutes j'ai su exactement où je me situais. Les missions débloquées correspondaient à ce que je cherchais depuis des semaines.",
  },
  {
    name: "Aminata D.",
    location: "Dakar, SN",
    profile: "Catalyseur",
    color: "#F97316",
    quote: "Mon profil Catalyseur a été reconnu comme aussi valide que celui d'un dev. Le réseau que j'ai construit en 2 semaines est réel.",
  },
  {
    name: "Ibrahima S.",
    location: "Abidjan, CI",
    profile: "Stratège",
    color: "#22D3EE",
    quote: "L'algorithme m'a catégorisé Stratège. J'étais sceptique. Puis j'ai vu les ressources débloquées. Ça colle parfaitement.",
  },
  {
    name: "Chloé M.",
    location: "Douala, CM",
    profile: "Créatrice",
    color: "#A855F7",
    quote: "Le fait que le quiz soit une hypothèse et non une étiquette m'a rassurée. Le profil hybride Créateur × Stratège, c'est exactement moi.",
  },
  {
    name: "Yacine B.",
    location: "Tunis, TN",
    profile: "Builder",
    color: "#B8FF3B",
    quote: "J'ai complété ma première mission en 48h. Le feedback de la guilde Builder était direct et technique. C'est ce dont j'avais besoin.",
  },
  {
    name: "Fatoumata C.",
    location: "Bamako, ML",
    profile: "Catalyseur",
    color: "#F97316",
    quote: "Première fois que je vois une plateforme tech qui valorise autant les profils non-techniques. Mon rôle de connectrice est enfin reconnu.",
  },
] as const

export function Testimonials() {
  const items = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS], [])

  return (
    <section className="relative border-b border-border/60 bg-black py-24 sm:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-14">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Retours terrain</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-3">
            Ce qu&apos;ils ont vécu.
          </h2>
          <p className="text-zinc-500 text-base">
            Des membres de 20 pays — Afrique et diaspora.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, -1 * 380 * TESTIMONIALS.length] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" }}
          className="flex gap-5 py-3"
        >
          {items.map((t, i) => (
            <div
              key={i}
              className="inline-flex flex-col gap-5 w-[360px] shrink-0 rounded-2xl bg-zinc-900/60 p-6 select-none"
              style={{
                borderLeft: `2px solid ${t.color}`,
                borderTop: "1px solid #ffffff10",
                borderRight: "1px solid #ffffff08",
                borderBottom: "1px solid #ffffff08",
              }}
            >
              <p className="text-[15px] text-zinc-300 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.location}</p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded"
                  style={{ color: t.color, background: `${t.color}12`, border: `1px solid ${t.color}25` }}
                >
                  {t.profile}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
