'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import { CLASS_COLORS as PROFILE_COLORS } from '@/lib/member-card-constants'
import { getProfileContent, type ProfileType } from '@/lib/profile-content'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'

interface Props {
  analysis: AnalysisResult
}

export function ResultLocked({ analysis }: Props) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const primary = analysis.primary as ProfileType
  const color = PROFILE_COLORS[primary]
  const content = getProfileContent(primary)

  const destination = "/dashboard"

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {content.unlockedMissions.length + content.lockedMissions.length} missions t&apos;attendent dans le Guild {content.name}
        </h2>
        <p className="text-sm text-zinc-500">
          2 missions accessibles maintenant · reste disponible avec un accès membre
        </p>
      </div>

      {/* Liste des missions */}
      <div className="flex flex-col gap-2.5 mb-10">
        {content.unlockedMissions.map((mission, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-sm font-medium text-white">{mission.title}</span>
            </div>
          </motion.div>
        ))}

        {content.lockedMissions.map((mission, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl px-5 py-4 opacity-[0.45]"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-zinc-600 flex-shrink-0" />
              <span className="text-sm text-zinc-400">{mission.title}</span>
            </div>
            <span className="text-sm">🔒</span>
          </div>
        ))}

        <div className="flex items-center gap-3 px-5 py-3 opacity-25">
          <span className="w-2 h-2 rounded-full bg-zinc-700 flex-shrink-0" />
          <span className="text-sm text-zinc-600">+ 12 autres missions en cours de déverrouillage</span>
        </div>
      </div>

      {/* Preuve sociale */}
      <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 mb-10">
        <div className="flex flex-shrink-0">
          {['K', 'A', 'M'].map((letter, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-black"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}55)`,
                marginLeft: i === 0 ? 0 : '-8px',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{content.socialProof}</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={async () => {
            setIsRedirecting(true)
            try {
              // Force cookie refresh to ensure Next.js middleware gets up-to-date fields
              await authClient.getSession()
            } catch (error: unknown) {
              console.error("Session update failed:", error)
            }
            window.location.href = destination
          }}
          disabled={isRedirecting}
          className="w-full max-w-sm text-center py-4 px-8 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          style={{
            background: color,
            boxShadow: `0 8px 30px -8px ${color}55`,
          }}
        >
          {isRedirecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Accéder à ma Guilde & Voir mes missions"
          )}
        </button>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          Retourner à l&apos;accueil
        </Link>
      </div>
    </section>
  )
}
