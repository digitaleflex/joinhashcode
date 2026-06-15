"use client"

import Link from "next/link"
// import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Target, Users } from "lucide-react"

export function FinalCta() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Zap className="size-4 text-primary" />
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Initialisation_v2.0</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase italic leading-[0.9]">
            Ne sois plus un <span className="text-primary text-glow">spectateur</span>.
            <br />
            Deviens un <span className="underline decoration-primary/30 underline-offset-8">bâtisseur</span>.
          </h2>

          <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Rejoins une communauté d'élite où tes compétences sont tes seules limites. Le futur de l'Afrique se code ici.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-16 border-t border-white/5"
          >
            <div className="flex flex-col items-center gap-2">
              <Shield className="size-5 text-zinc-600" />
              <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 tracking-tighter">Accès Sécurisé</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Target className="size-5 text-zinc-600" />
              <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 tracking-tighter">Objectifs Réels</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="size-5 text-zinc-600" />
              <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 tracking-tighter">Impact Immédiat</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="size-5 text-indigo-400" />
              <span className="font-mono text-[9px] uppercase font-bold text-indigo-400 tracking-tighter">Parrainage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
