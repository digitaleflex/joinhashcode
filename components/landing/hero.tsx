"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
// import { motion, AnimatePresence } from "framer-motion"
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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const id = setInterval(() => {
      setIndex(i => (i + 1) % PROFILES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const current = PROFILES[index]

  if (!isMounted) return <div className="min-h-screen bg-background" />

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
          <div
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm mb-12"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#B8FF3B]" />
            <span className="font-mono text-[10px] font-black text-primary tracking-tight">
              découvre ton potentiel tech
            </span>
          </div>

          {/* H1 — Refined Avant-Garde */}
          <h1
            className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] uppercase"
          >
            Tu es
            <br />
            <span className="inline-flex items-center justify-center min-w-[180px] sm:min-w-[320px] italic">
                <span
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ color: current.color, textShadow: `0 0 20px ${current.color}20` }}
                >
                  {current.label}
                </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-8 text-lg text-zinc-400 font-medium tracking-tight max-w-lg"
          >
            Le système décode tes forces en <span className="text-white italic">3 minutes</span> chrono.
          </p>

          {/* CTAs */}
          <div
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
          </div>

          {/* Disclaimer pédagogique */}
          <p
            className="mt-8 max-w-md text-center text-xs text-zinc-600 leading-relaxed"
          >
            Ce quiz ne te classe pas — il identifie ta <span className="text-zinc-500">tendance dominante du moment</span>.
            Ton profil est une hypothèse de travail, pas une étiquette définitive.
            Il peut évoluer. Beaucoup de membres sont hybrides.
          </p>

          {/* Meta */}
          <div
            className="mt-6 flex items-center gap-4 font-mono text-[9px] font-bold text-zinc-700 tracking-tight"
          >
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">initiation gratuite</span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">3 minutes chrono</span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">sans engagement</span>
          </div>
        </div>

        {/* Profile result card — Premium UI */}
        <div
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
                  <div
                    key={bar.label}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                        {bar.label}
                      </span>
                      <span className="font-mono text-[9px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ background: bar.color, width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold text-zinc-700 uppercase tracking-tight">cohérence du profil</span>
                <span className="font-mono text-[11px] font-black" style={{ color: "#22D3EE" }}>élevée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
