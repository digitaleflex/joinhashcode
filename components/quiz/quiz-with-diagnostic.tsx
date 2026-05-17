"use client"

import { useState, useEffect } from 'react'
import { PreQuizDiagnostic, DiagnosticAnswers } from './pre-quiz-diagnostic'
import { Quiz } from './quiz'

interface QuizWithDiagnosticProps {
  user?: {
    id: string
    pseudo: string | null
    name: string
    memberNumber: number | null
    class: string | null
    level: number
    experience: number
    createdAt: Date | string
  }
}

export function QuizWithDiagnostic({ user }: QuizWithDiagnosticProps) {
  const [diagnosticDone, setDiagnosticDone] = useState<boolean | null>(null)
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswers | null>(null)

  useEffect(() => {
    const done = localStorage.getItem('hashcode_diagnostic_done') === 'true'
    setDiagnosticDone(done)
  }, [])

  // Hydration guard — localStorage is only available client-side
  if (diagnosticDone === null) return null

  if (!diagnosticDone) {
    return (
      <PreQuizDiagnostic
        onComplete={(answers) => {
          setDiagnosticAnswers(answers)
          localStorage.setItem('hashcode_diagnostic_done', 'true')
          setDiagnosticDone(true)
        }}
      />
    )
  }

  return <Quiz user={user} diagnosticAnswers={diagnosticAnswers ?? undefined} />
}
