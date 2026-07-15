'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { type AnalysisResult, type RecommendedSpecialization } from '@/lib/analysis'
import { PROFILE_COLORS, type ProfileType } from '@/lib/profile-content'
import { ResultRevelation } from './result-revelation'
import { ResultScores } from './result-scores'
import { ResultLocked } from './result-locked'
import { QuizFeedbackCard } from './QuizFeedbackCard'
import { QuizShareButtons } from './QuizShareButtons'
import { Button } from '@/components/ui/button'

export interface UserData {
  pseudo?: string | null
  name?: string | null
  memberNumber?: number | null
  level?: number | null
  experience?: number | null
}

interface Props {
  analysis: AnalysisResult
  user: UserData
  quizResultId?: string
  pendingSquad?: string | null
}

export function ResultPage({ analysis, user, quizResultId, pendingSquad }: Props) {
  const [selectedSpec, setSelectedSpec] = useState<RecommendedSpecialization | null>(null)

  const choiceRef = useRef<HTMLDivElement>(null)
  const orientationRef = useRef<HTMLDivElement>(null)
  const scoresRef = useRef<HTMLDivElement>(null)

  const primary = analysis.primary as ProfileType
  const color = PROFILE_COLORS[primary]
  const specializations = analysis.recommendedSpecializations

  function scrollToChoice() {
    choiceRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleChoose(spec: RecommendedSpecialization) {
    setSelectedSpec(spec)
    setTimeout(() => {
      orientationRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function handleStartOrientation() {
    scoresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <ResultRevelation analysis={analysis} onScrollToScores={scrollToChoice} />

      {/* Écran de choix de spécialisation */}
      {specializations.length > 0 && (
        <section ref={choiceRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              Quelle spécialisation veux-tu explorer ?
            </h2>
            <p className="text-sm text-zinc-400 mb-10 max-w-md mx-auto">
              On a une recommandation pour toi, mais c&apos;est toi qui décides.
            </p>

            <div className="grid gap-4">
              {specializations.map((spec, i) => (
                <motion.button
                  key={spec.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleChoose(spec)}
                  className="w-full text-left p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    borderColor: i === 0 ? color : '#1a1a1a',
                    background: i === 0 ? `${color}08` : '#0f0f0f',
                  }}
                >
                  <p className="text-sm font-bold text-white mb-1">{spec.label}</p>
                  <p className="text-xs text-zinc-400">{spec.reason}</p>
                  {i === 0 && (
                    <p className="text-[10px] mt-2 font-semibold" style={{ color }}>
                      Recommandé pour toi
                    </p>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Écran d'orientation détaillée */}
      {selectedSpec && (
        <section ref={orientationRef} className="px-6 py-16 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="p-6 rounded-3xl border mb-8" style={{ borderColor: `${color}33`, background: `${color}08` }}>
              <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color }}>
                Objectif 90 jours
              </p>
              <p className="text-xl font-bold text-white mb-3">{selectedSpec.goal90days}</p>

              <p className="text-sm text-zinc-400 mb-6">{selectedSpec.goal90daysWhy}</p>

              <p className="text-xs font-semibold text-zinc-300 mb-3">
                Dans 90 jours, tu seras capable de :
              </p>
              <ul className="space-y-2 mb-6">
                {selectedSpec.goal90daysOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span style={{ color }} className="font-bold shrink-0">✓</span>
                    {outcome}
                  </li>
                ))}
              </ul>

              <p className="text-xs font-semibold text-zinc-300 mb-3">
                Ton plan d&apos;action
              </p>
              <div className="space-y-2 mb-8">
                {selectedSpec.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: i === 0 ? `${color}10` : 'transparent' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: i === 0 ? color : '#333' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${i === 0 ? 'text-white font-medium' : 'text-zinc-500'}`}>
                        {step.weekRange} : {step.title}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase text-zinc-600 shrink-0">{step.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Première étape */}
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 mb-8">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                Première étape
              </p>
              <p className="text-base font-bold text-white mb-1">
                🎓 {selectedSpec.firstAction.title}
              </p>
              <p className="text-xs text-zinc-500 mb-1">
                {selectedSpec.firstAction.duration} · {selectedSpec.firstAction.pourquoi}
              </p>
            </div>

            <Button
              onClick={handleStartOrientation}
              className="w-full h-14 rounded-xl font-bold text-base"
              style={{ background: color, color: '#000' }}
            >
              Commencer l&apos;atelier →
            </Button>
          </motion.div>
        </section>
      )}

      <div ref={scoresRef} className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 uppercase whitespace-nowrap">
          Analyse du diagnostic
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <ResultScores analysis={analysis} user={user} />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <QuizShareButtons profileType={analysis.primary} userName={user.name || user.pseudo || "Bâtisseur"} />
      </div>

      {quizResultId && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <QuizFeedbackCard quizResultId={quizResultId} />
        </div>
      )}

      <div className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 uppercase whitespace-nowrap">
          Ton parcours t&apos;attend
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <ResultLocked analysis={analysis} pendingSquad={pendingSquad} />
    </div>
  )
}
