'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export type DiagnosticAnswers = {
  project: 'yes' | 'no'
  direction: 'yes' | 'no'
  languages: 'few' | 'some' | 'many'
  mentor: 'yes' | 'no'
  lost: 'rarely' | 'sometimes' | 'often'
}

interface Question {
  id: keyof DiagnosticAnswers
  text: string
  options: { label: string; value: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'project',
    text: "As-tu un projet informatique terminé que tu peux montrer aujourd'hui ?",
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Pas encore', value: 'no' },
    ],
  },
  {
    id: 'direction',
    text: 'Sais-tu exactement dans quel métier tu veux travailler dans 2 ans ?',
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Pas vraiment', value: 'no' },
    ],
  },
  {
    id: 'languages',
    text: "Combien de langages ou frameworks as-tu commencé sans aller au bout ?",
    options: [
      { label: '0 – 1', value: 'few' },
      { label: '2 – 3', value: 'some' },
      { label: '4+', value: 'many' },
    ],
  },
  {
    id: 'mentor',
    text: "As-tu un mentor ou quelqu'un qui guide ta progression ?",
    options: [
      { label: 'Oui', value: 'yes' },
      { label: 'Non', value: 'no' },
    ],
  },
  {
    id: 'lost',
    text: 'Te sens-tu souvent perdu sur quoi apprendre ensuite ?',
    options: [
      { label: 'Rarement', value: 'rarely' },
      { label: 'Parfois', value: 'sometimes' },
      { label: 'Souvent', value: 'often' },
    ],
  },
]

interface Props {
  onComplete: (answers: DiagnosticAnswers) => void
}

export function PreQuizDiagnostic({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({})

  function handleChoice(value: string) {
    const question = QUESTIONS[step]
    const updated = { ...answers, [question.id]: value } as Partial<DiagnosticAnswers>
    setAnswers(updated)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      const final = updated as DiagnosticAnswers
      localStorage.setItem('hashcode_diagnostic_done', 'true')
      localStorage.setItem('hashcode_diagnostic_answers', JSON.stringify(final))
      onComplete(final)
    }
  }

  const question = QUESTIONS[step]
  const progress = (step / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Barre de progression */}
      <div className="w-full max-w-md mb-12">
        <div className="h-px bg-border w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {step + 1} / {QUESTIONS.length}
        </p>
      </div>

      {/* Question */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-foreground mb-10 leading-snug text-center">
          {question.text}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChoice(opt.value)}
              className="w-full py-4 px-6 rounded-2xl border border-border bg-card text-foreground font-medium text-left hover:border-foreground/40 hover:bg-card/80 transition-all duration-200 active:scale-[0.98]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
