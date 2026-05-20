"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, X, Zap, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ProfileDriftAlertProps {
  profileDrift: number
  userClass: string | null
  userId: string
}

const DISMISS_KEY = "profile_drift_dismissed_at"
const DISMISS_TTL_MS = 48 * 60 * 60 * 1000 // 48h

function getDriftLevel(drift: number): {
  label: string
  color: string
  border: string
  bg: string
  glow: string
  message: string
} {
  if (drift >= 0.7) return {
    label: "RECALIBRATION URGENTE",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.08)]",
    message: "Ton comportement réel s'est fortement éloigné de ton profil. Le système ne peut plus te modéliser précisément.",
  }
  if (drift >= 0.5) return {
    label: "DÉRIVE DÉTECTÉE",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    message: "Ta trajectoire réelle diverge de ton profil initial. Une recalibration va affiner tes recommandations.",
  }
  return {
    label: "EN MUTATION",
    color: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
    glow: "shadow-[0_0_30px_rgba(184,255,59,0.05)]",
    message: "Tu évolues. Ton profil commence à dériver de ta classification initiale — c'est normal après une activité soutenue.",
  }
}

export function ProfileDriftAlert({ profileDrift, userClass, userId }: ProfileDriftAlertProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (profileDrift < 0.3) return
    try {
      const raw = localStorage.getItem(DISMISS_KEY)
      if (raw) {
        const dismissedAt = parseInt(raw, 10)
        if (Date.now() - dismissedAt < DISMISS_TTL_MS) return
      }
    } catch {}
    setVisible(true)
  }, [profileDrift])

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch {}
    setVisible(false)
  }

  if (!visible) return null

  const level = getDriftLevel(profileDrift)
  const driftPct = Math.round(profileDrift * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "relative rounded-[1.75rem] border p-6 sm:p-8 overflow-hidden",
          level.border, level.bg, level.glow
        )}
      >
        {/* Animated scan line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
          style={{ color: level.color.replace("text-", "") }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon + drift meter */}
          <div className="flex items-center gap-5 shrink-0">
            <div className={cn("relative size-14 rounded-2xl border flex items-center justify-center", level.border, level.bg)}>
              <Activity className={cn("size-6", level.color)} />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: `0 0 20px currentColor` }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="space-y-1">
              <div className={cn("text-[9px] font-mono font-black uppercase tracking-[0.4em]", level.color)}>
                {level.label}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-white tracking-tighter">{driftPct}%</span>
                <span className="text-[10px] font-mono text-zinc-600 mb-1 uppercase tracking-wider">Drift</span>
              </div>
            </div>
          </div>

          {/* Drift bar */}
          <div className="hidden sm:block w-px h-12 bg-white/5 shrink-0" />

          {/* Message */}
          <div className="flex-1 space-y-3 min-w-0">
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {level.message}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                asChild
                size="sm"
                className="btn-primary-glow h-9 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest gap-2"
              >
                <Link href="/quiz">
                  <RefreshCw className="size-3" />
                  Recalibrer le profil
                </Link>
              </Button>
              <span className={cn("text-[10px] font-mono", level.color)}>
                Profil actuel : <span className="font-bold uppercase">{userClass || "—"}</span>
              </span>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
            aria-label="Fermer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
