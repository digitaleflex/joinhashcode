'use client'

import { useRef } from 'react'
import { type AnalysisResult } from '@/lib/analysis'
import { ResultRevelation } from './result-revelation'
import { ResultScores } from './result-scores'
import { ResultLocked } from './result-locked'

interface UserData {
  pseudo?: string | null
  name?: string | null
  memberNumber?: number | null
  class?: string | null
  level?: number | null
  experience?: number | null
}

interface Props {
  analysis: AnalysisResult
  user: UserData
}

export function ResultPage({ analysis, user }: Props) {
  const scoresRef = useRef<HTMLDivElement>(null)

  function scrollToScores() {
    scoresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <ResultRevelation analysis={analysis} onScrollToScores={scrollToScores} />

      <div ref={scoresRef} className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 tracking-[0.2em] uppercase whitespace-nowrap">
          Analyse psychométrique
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <ResultScores analysis={analysis} user={user} />

      <div className="flex items-center gap-4 px-6 max-w-2xl mx-auto py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] text-zinc-600 tracking-[0.2em] uppercase whitespace-nowrap">
          Ton parcours t&apos;attend
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <ResultLocked analysis={analysis} />
    </div>
  )
}
