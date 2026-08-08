'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import { CLASS_COLORS as PROFILE_COLORS } from '@/lib/member-card-constants'
import {
  getProfileContent,
  getHybridContent,
  type ProfileType,
} from '@/lib/profile-content'
import { ResultRadar } from './result-radar'
import { Cpu, Zap, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  analysis: AnalysisResult
  onScrollToScores: () => void
}

type Step = 'scanning' | 'revealing' | 'complete'

export function ResultRevelation({ analysis, onScrollToScores }: Props) {
  const [step, setStep] = useState<Step>('scanning')
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
    displayName = `${primaryContent.name} × ${secondaryContent.name}`
  } else {
    displayName = content.name
  }

  useEffect(() => {
    const scanTimer = setTimeout(() => setStep('revealing'), 2500)
    const revealTimer = setTimeout(() => setStep('complete'), 4500)
    return () => {
      clearTimeout(scanTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  const painParts = content.pain.split(content.painBold)
  const [beforeBold, afterBold] = painParts

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden bg-black"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <AnimatePresence mode="wait">
        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="size-32 rounded-full border border-dashed border-primary/30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="size-12 text-primary animate-pulse" />
              </div>
              <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-0.5 bg-primary/40 blur-sm z-20"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black font-mono text-white tracking-tighter uppercase italic">
                Analyse de ton profil
              </h2>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                    className="size-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {(step === 'revealing' || step === 'complete') && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center w-full max-w-4xl"
          >
            {/* Holographic Aura */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-20 blur-[120px]"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              {/* Left: Radar Visual */}
              <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="order-2 lg:order-1"
              >
                <ResultRadar 
                  builderScore={analysis.percentages.builder}
                  creatorScore={analysis.percentages.creator}
                  strategistScore={analysis.percentages.strategist}
                  catalystScore={analysis.percentages.catalyst}
                  color={color}
                />
              </motion.div>

              {/* Right: Identity Text */}
              <div className="order-1 lg:order-2 text-center lg:text-left space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest uppercase text-zinc-400"
                >
                  <Cpu className="size-3" style={{ color }} />
                  Ton profil est prêt
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-6xl sm:text-7xl font-black italic tracking-tighter leading-[0.8] text-white"
                >
                  {displayName.split(' × ')[0]}
                  {displayName.includes(' × ') && (
                    <span className="block text-4xl sm:text-5xl text-zinc-500 not-italic mt-2">
                      × {displayName.split(' × ')[1]}
                    </span>
                  )}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg sm:text-xl text-zinc-300 leading-tight max-w-md mx-auto lg:mx-0 font-light"
                >
                  {beforeBold}<strong className="text-white italic">{content.painBold}</strong>{afterBold}
                </motion.p>

                {step === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="flex flex-col gap-2">
                      {content.truths.map((truth, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex items-center gap-3 text-xs text-zinc-400 font-mono"
                        >
                          <Zap className="size-3 shrink-0" style={{ color }} />
                          <span className="truncate">{truth.bold}</span>
                        </motion.div>
                      ))}
                    </div>

                    {analysis.recommendedSpecializations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mt-6 p-4 rounded-xl border"
                        style={{ borderColor: `${color}33`, background: `${color}08` }}
                      >
                        <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color }}>
                          Spécialisation recommandée
                        </p>
                        <p className="text-sm font-bold text-white mb-1">
                          {analysis.recommendedSpecializations[0].label}
                        </p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {analysis.recommendedSpecializations[0].reason}
                        </p>
                        <p className="text-xs text-zinc-500 mt-2">
                          Objectif 90 jours : <span className="text-white">{analysis.recommendedSpecializations[0].goal90days}</span>
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Première étape : <span className="text-white">{analysis.recommendedSpecializations[0].firstAction.title}</span> · {analysis.recommendedSpecializations[0].firstAction.duration}
                        </p>
                      </motion.div>
                    )}

                    <Button 
                      onClick={onScrollToScores}
                      className="btn-primary-glow w-full lg:w-auto px-8 h-12 rounded-xl font-black uppercase italic tracking-wider"
                    >
                      Choisir ma spécialisation →
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
