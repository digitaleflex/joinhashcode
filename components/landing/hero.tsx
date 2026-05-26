"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const PROFILES = [
  { label: "Builder",    color: "#B8FF3B" },
  { label: "Créateur",   color: "#A855F7" },
  { label: "Stratège",   color: "#22D3EE" },
  { label: "Catalyseur", color: "#F97316" },
] as const

export function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % PROFILES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const current = PROFILES[index]

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-b border-white/5 bg-background">
      {/* Clean Ambient Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Subtle Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-20 z-10"
      />

      <div className="scanline"></div>
      
      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

          {/* Eyebrow — human & welcoming */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm mb-12"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#B8FF3B]" />
            <span className="font-mono text-[10px] font-black text-primary tracking-tight">
              découvre ton potentiel tech
            </span>
          </motion.div>

          {/* H1 — Refined Avant-Garde */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] uppercase"
          >
            Tu es
            <br />
            <span className="inline-flex items-center justify-center min-w-[180px] sm:min-w-[320px] italic">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.label}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ color: current.color, textShadow: `0 0 20px ${current.color}20` }}
                >
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-lg text-zinc-400 font-medium tracking-tight max-w-lg"
          >
            Le système décode tes forces en <span className="text-white italic">3 minutes</span> chrono.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="btn-primary-glow group h-14 rounded-2xl px-10 text-[11px] font-black uppercase"
            >
              <Link href="/quiz">
                Révéler mon potentiel
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-14 rounded-2xl px-6 text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <Link href="/signin">Déjà membre ?</Link>
            </Button>
          </motion.div>

          {/* Disclaimer pédagogique */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-8 max-w-md text-center text-xs text-zinc-600 leading-relaxed"
          >
            Ce quiz ne te classe pas — il identifie ta <span className="text-zinc-500">tendance dominante du moment</span>.
            Ton profil est une hypothèse de travail, pas une étiquette définitive.
            Il peut évoluer. Beaucoup de membres sont hybrides.
          </motion.p>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-6 flex items-center gap-4 font-mono text-[9px] font-bold text-zinc-700 tracking-tight"
          >
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">initiation gratuite</span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">3 minutes chrono</span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">sans engagement</span>
          </motion.div>
        </div>

        {/* Profile result card — Premium UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mx-auto mt-24 max-w-2xl"
        >
          <div className="relative rounded-[2.5rem] border border-white/10 glass-card p-1 shadow-2xl shadow-black/80 overflow-hidden">
            {/* Browser bar */}
            <div className="relative flex items-center gap-2 border-b border-white/5 px-6 py-4 bg-white/[0.02]">
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-800" />
                <span className="h-2 w-2 rounded-full bg-zinc-800" />
                <span className="h-2 w-2 rounded-full bg-zinc-800" />
              </div>
              <span className="ml-4 font-mono text-[9px] font-bold text-zinc-600 tracking-tight">
                exemple de résultat
              </span>
            </div>
            
            {/* Result Content */}
            <div className="relative p-6 sm:p-10 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-tight uppercase">ton profil est prêt</p>
                  <p className="text-2xl sm:text-4xl font-black tracking-tighter text-[#22D3EE] uppercase italic">
                    Stratège
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[9px] sm:text-[10px] font-black border-[#22D3EE]/30 text-[#22D3EE] px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-[#22D3EE]/5 tracking-wide">
                  PROFIL DOMINANT
                </Badge>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Stratège",   pct: 68, color: "#22D3EE" },
                  { label: "Builder",    pct: 22, color: "#B8FF3B" },
                  { label: "Catalyseur", pct:  7, color: "#F97316" },
                  { label: "Créateur",   pct:  3, color: "#A855F7" },
                ].map((bar, i) => (
                  <motion.div
                    key={bar.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.07 }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                        {bar.label}
                      </span>
                      <span className="font-mono text-[9px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ background: bar.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold text-zinc-700 uppercase tracking-tight">cohérence du profil</span>
                <span className="font-mono text-[11px] font-black" style={{ color: "#22D3EE" }}>élevée</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
