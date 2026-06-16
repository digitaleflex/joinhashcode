"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Zap, Users, Target, ChevronRight, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"

// ─── Config par classe ─────────────────────────────────────────────────────────

const CLASS_CONFIG: Record<string, {
  emoji: string
  color: string
  border: string
  bg: string
  glow: string
  tagline: string
  desc: string
}> = {
  builder: {
    emoji: "🏗️",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    glow: "shadow-[0_0_60px_rgba(59,130,246,0.15)]",
    tagline: "Tu es un Builder.",
    desc: "Tu construis. Code, systèmes, produits — chaque projet est une brique de ton empire numérique.",
  },
  creator: {
    emoji: "🎨",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    glow: "shadow-[0_0_60px_rgba(168,85,247,0.15)]",
    tagline: "Tu es un Creator.",
    desc: "Tu crées. Design, contenu, narration — tu imagines ce que les autres ne voient pas encore.",
  },
  strategist: {
    emoji: "🧠",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.15)]",
    tagline: "Tu es un Strategist.",
    desc: "Tu analyses. Data, growth, business — ton approche méthodique démêle les systèmes complexes.",
  },
  catalyst: {
    emoji: "⚡",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.15)]",
    tagline: "Tu es un Catalyst.",
    desc: "Tu fédères. Leadership, communauté, impact — partout où tu passes, les idées deviennent réalité.",
  },
}

const PLATFORM_CONCEPTS = [
  {
    icon: Target,
    title: "Missions",
    desc: "Des défis concrets classés par niveau. Complète-les pour gagner de l'XP et monter en grade.",
    href: "/missions",
    cta: "Voir les missions",
  },
  {
    icon: Users,
    title: "Escouade (Squad)",
    desc: "Ton équipe de 5 personnes max. Plus votre cohésion est haute, plus vous progressez vite ensemble.",
    href: "/squad",
    cta: "Rejoindre une squad",
  },
  {
    icon: Zap,
    title: "XP & Grades",
    desc: "Chaque mission approuvée = XP. INIT → CORE → PRO → ELITE. Ton grade débloque des missions avancées.",
    href: "/dossier",
    cta: "Voir mon dossier",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WelcomeModal({ userId, userName, userClass }: {
  userId: string
  userName: string
  userClass: string
}) {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<"class" | "guide">("class")

  const storageKey = `hc_welcomed_${userId}`
  const cfg = CLASS_CONFIG[userClass?.toLowerCase()] ?? CLASS_CONFIG.builder
  const firstName = userName?.split(" ")[0] || "toi"

  useEffect(() => {
    if (!userId || !userClass) return
    try {
      const seen = localStorage.getItem(storageKey)
      if (!seen) setVisible(true)
    } catch { /* ignore */ }
  }, [userId, userClass, storageKey])

  const dismiss = () => {
    try { localStorage.setItem(storageKey, "1") } catch { /* ignore */ }
    setVisible(false)
    window.dispatchEvent(new CustomEvent("welcome-modal-dismissed"))
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-lg rounded-3xl bg-zinc-950 border ${cfg.border} ${cfg.glow} overflow-hidden`}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ambient glow */}
            <div className={`absolute inset-0 ${cfg.bg} pointer-events-none`} />

            <AnimatePresence mode="wait">

              {/* ── Phase 1: Class reveal ─────────────────────────────────── */}
              {phase === "class" && (
                <motion.div
                  key="class"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 text-center space-y-6 relative z-10"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/8 mb-4">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Profil attribué</span>
                    </div>

                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-7xl mb-2"
                    >
                      {cfg.emoji}
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className={`text-3xl font-black uppercase tracking-tighter ${cfg.color}`}
                    >
                      {cfg.tagline}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto"
                    >
                      {cfg.desc}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg}`}
                  >
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Bienvenue dans la communauté HASHCODE,{" "}
                      <span className={`font-bold ${cfg.color}`}>{firstName}</span>.
                      Voici comment fonctionne la plateforme.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                  >
                    <Button
                      onClick={() => setPhase("guide")}
                      className="btn-primary-glow w-full h-12 rounded-2xl font-bold uppercase tracking-wider text-xs group"
                    >
                      Découvrir la plateforme
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* ── Phase 2: Platform guide ───────────────────────────────── */}
              {phase === "guide" && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6 relative z-10"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">Comment ça marche ?</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">3 concepts à connaître</p>
                  </div>

                  <div className="space-y-3">
                    {PLATFORM_CONCEPTS.map((concept, i) => {
                      const Icon = concept.icon
                      return (
                        <motion.div
                          key={concept.title}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className={`p-2.5 rounded-xl ${cfg.bg} border ${cfg.border} shrink-0`}>
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white mb-0.5">{concept.title}</p>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">{concept.desc}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      asChild
                      onClick={dismiss}
                      className="flex-1 h-11 rounded-xl border-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase"
                    >
                      <Link href="/guide">
                        <BookOpen className="size-3.5 mr-1.5" />
                        Guide complet
                      </Link>
                    </Button>
                    <Button
                      asChild
                      onClick={dismiss}
                      className="flex-1 h-11 rounded-xl btn-primary-glow text-xs font-bold uppercase tracking-wider group"
                    >
                      <Link href="/missions">
                        Première mission
                        <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
