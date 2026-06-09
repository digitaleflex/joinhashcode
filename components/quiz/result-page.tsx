'use client'

import { useRef } from 'react'
import { type AnalysisResult } from '@/lib/analysis'
import { ResultRevelation } from './result-revelation'
import { ResultScores } from './result-scores'
import { ResultLocked } from './result-locked'
import { QuizFeedbackCard } from './QuizFeedbackCard'
import { QuizShareButtons } from './QuizShareButtons'

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
}

export function ResultPage({ analysis, user, quizResultId }: Props) {
  const scoresRef = useRef<HTMLDivElement>(null)

  function scrollToScores() {
    scoresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <ResultRevelation analysis={analysis} onScrollToScores={scrollToScores} />

      <div ref={scoresRef} className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 uppercase whitespace-nowrap">
          Analyse du diagnostic
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <ResultScores analysis={analysis} user={user} />

      {/* Social Sharing (P19) */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <QuizShareButtons profileType={analysis.primary} userName={user.name || user.pseudo || "Bâtisseur"} />
      </div>

      {/* Post-Quiz Survey (P18) */}
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

      <ResultLocked analysis={analysis} />
    </div>
  )
}
