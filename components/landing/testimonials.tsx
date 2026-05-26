"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"

export function Testimonials() {
  return (
    <section className="relative border-b border-border/60 bg-black py-24 sm:py-32 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-primary/50" />
            <span className="font-mono text-[11px] uppercase text-primary tracking-wider">Cohorte Fondatrice</span>
            <span className="h-px w-8 bg-primary/50" />
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
            <Users className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-5">
            Les premiers témoignages arrivent.
          </h2>

          <p className="text-zinc-400 text-base max-w-lg leading-relaxed">
            La cohorte fondatrice est en cours de formation.
            <br />
            Leurs retours seront partagés ici — sans filtre.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
              Accès bêta ouvert maintenant
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
