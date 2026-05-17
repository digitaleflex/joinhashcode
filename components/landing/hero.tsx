"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
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
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-b border-border/60">
      {/* Pure CSS background — no image */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/7 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-35 z-10"
      />

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent z-20"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Profilage tech · Ouvert à tous
            </span>
          </div>

          {/* H1 with shuffle */}
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            Tu es
            <br />
            <span className="inline-flex items-center justify-center min-w-[280px] sm:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.label}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ color: current.color }}
                >
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="mt-4 text-lg text-zinc-500 font-light">
            Ou peut-être autre chose.{" "}
            <span className="text-zinc-400">3 minutes pour le savoir.</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="btn-primary-glow group h-12 rounded-xl px-8 text-sm font-bold"
            >
              <Link href="/quiz">
                Découvrir mon profil
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-xl px-5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <Link href="/signin">Déjà membre ? Connexion</Link>
            </Button>
          </div>

          {/* Meta */}
          <div className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">
            <span>Gratuit</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>3 minutes</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Sans engagement</span>
          </div>
        </div>

        {/* Profile result card */}
        <div className="mx-auto mt-20 max-w-2xl">
          <div className="relative rounded-2xl border border-border bg-card/60 shadow-2xl shadow-black/60 backdrop-blur-md overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-b from-primary/15 to-transparent opacity-40"
            />
            {/* Browser bar */}
            <div className="relative flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="ml-2 font-mono text-[11px] text-muted-foreground/60">
                joinhashcode.com/dossier
              </span>
            </div>
            {/* Result */}
            <div className="relative p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Résultat · Ibrahima S.</p>
                  <p className="text-2xl font-bold mt-1 font-mono" style={{ color: "#22D3EE" }}>
                    STRATÈGE
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                  style={{ color: "#22D3EE", background: "#22D3EE15", border: "1px solid #22D3EE30" }}
                >
                  CORE
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Stratège",   pct: 68, color: "#22D3EE" },
                  { label: "Builder",    pct: 22, color: "#B8FF3B" },
                  { label: "Catalyseur", pct:  7, color: "#F97316" },
                  { label: "Créateur",   pct:  3, color: "#A855F7" },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-zinc-500 w-20 shrink-0 uppercase tracking-wider">
                      {bar.label}
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-white/5">
                      <div
                        className="h-1 rounded-full"
                        style={{ width: `${bar.pct}%`, background: bar.color, opacity: 0.75 }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600 w-8 text-right">{bar.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Confiance algorithmique</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: "#22D3EE" }}>91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
