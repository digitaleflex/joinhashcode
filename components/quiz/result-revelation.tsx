'use client'

import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import {
  PROFILE_COLORS,
  getProfileContent,
  getHybridContent,
  type ProfileType,
} from '@/lib/profile-content'

interface Props {
  analysis: AnalysisResult
  onScrollToScores: () => void
}

export function ResultRevelation({ analysis, onScrollToScores }: Props) {
  const primary = analysis.primary as ProfileType
  const secondary = analysis.secondary as ProfileType
  const color = PROFILE_COLORS[primary]

  const content = analysis.isHybrid
    ? getHybridContent(primary, secondary)
    : getProfileContent(primary)

  let displayName: string
  if (analysis.isHybrid) {
    const primaryContent = getProfileContent(primary)
    const secondaryContent = getProfileContent(secondary)
    displayName = `Tu es à la fois ${primaryContent.name} et ${secondaryContent.name}`
  } else {
    displayName = content.name
  }

  const painParts = content.pain.split(content.painBold)
  const [beforeBold, afterBold] = painParts

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Halo de couleur en arrière-plan */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0.05,
          top: '-200px',
        }}
      />

      {/* Badge profil */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase mb-8"
        style={{ borderColor: color, color }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color }}
        />
        {analysis.isHybrid ? displayName : 'Profil identifié'}
      </motion.div>

      {/* Nom du profil */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-extrabold leading-none mb-6"
        style={{
          fontSize: 'clamp(52px, 9vw, 84px)',
          letterSpacing: '-2px',
          color,
        }}
      >
        {analysis.isHybrid ? content.name : displayName}
      </motion.h1>

      {/* Déclaration de douleur */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-zinc-300 max-w-[580px] mb-12 leading-relaxed"
        style={{ fontSize: 'clamp(17px, 2.5vw, 21px)' }}
      >
        <span>{beforeBold}<strong>{content.painBold}</strong>{afterBold}</span>
      </motion.p>

      {/* Les 3 vérités */}
      <div className="flex flex-col gap-3 w-full max-w-[540px] mb-14">
        {content.truths.map((truth, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-4 bg-zinc-900/60 border rounded-xl px-5 py-4 text-left"
            style={{ borderColor: `${color}33`, borderLeftColor: color, borderLeftWidth: '3px' }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{truth.icon}</span>
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-white">{truth.bold}</strong>
              {truth.rest}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onScrollToScores}
        className="flex flex-col items-center gap-2 text-zinc-500 text-xs hover:text-zinc-400 transition-colors"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-lg"
        >
          ⌄
        </motion.span>
        Voir mon analyse détaillée
      </motion.button>
    </div>
  )
}
