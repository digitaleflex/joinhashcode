"use client"

import Link from "next/link"
// import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function FinalCta() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-20" />
      
      <div className="relative z-[var(--z-content)] mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Zap className="size-4 text-primary" />
            <span className="font-mono text-xs uppercase font-bold text-zinc-400 tracking-widest">Commence maintenant</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase italic leading-[0.9]">
            Arrête de <span className="text-zinc-500">regarder</span>.
            <br />
            <span className="text-primary text-glow">Commence à construire</span>.
          </h2>

          <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Rejoins une communauté de builders qui ne parlent pas de tech — qui la construisent. Tes compétences sont tes seules limites.
          </p>

          {/* Cost reminder — remove friction right before the CTA */}
          <p className="font-mono text-sm-plus font-bold uppercase tracking-widest text-zinc-500">
            Gratuit · 3 minutes · Sans engagement
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="btn-primary-glow group h-16 px-12 rounded-2xl text-xs font-black uppercase tracking-widest"
            >
              <Link href="/quiz">
                Commencer mon évolution
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-white font-mono">4</span>
              <span className="font-mono text-xs uppercase font-bold text-zinc-500 tracking-tighter">Profils identifiés</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-white font-mono">100%</span>
              <span className="font-mono text-xs uppercase font-bold text-zinc-500 tracking-tighter">Gratuit au départ</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-white font-mono">5</span>
              <span className="font-mono text-xs uppercase font-bold text-zinc-500 tracking-tighter">Questions ciblées</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
