"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { AnalysisResult } from "@/lib/analysis"
import {
  ChevronRight, ChevronLeft, Sparkles
} from "lucide-react"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { ResultPage } from "./result-page"
import type { DiagnosticAnswers } from "./pre-quiz-diagnostic"

interface QuizUser {
  id: string;
  pseudo: string | null;
  name: string;
  memberNumber: number | null;
  class: string | null;
  level: number;
  experience: number;
  createdAt: Date | string;
}

const QUIZ_STORAGE_KEY = "hc_quiz_progress";

const ANALYSIS_STEPS = [
  { label: "Lecture des réponses",          desc: "Traitement de tes 13 arbitrages...",          pct: 12 },
  { label: "Analyse comportementale",       desc: "Détection des patterns de décision...",       pct: 28 },
  { label: "Calcul des vecteurs",           desc: "Pondération par temps de réaction...",        pct: 45 },
  { label: "Scénarios de crise",            desc: "Évaluation des réponses sous pression...",    pct: 62 },
  { label: "Profil dominant",               desc: "Identification de la tendance principale...", pct: 78 },
  { label: "Génération de l'hypothèse",     desc: "Finalisation du profilage...",                pct: 94 },
];

function AnalyzingScreen() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx(prev => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
    }, 350);
    return () => clearInterval(timer);
  }, []);

  const step = ANALYSIS_STEPS[stepIdx];

  return (
    <div className="max-w-sm mx-auto py-32 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-10">
        [ANALYSE_EN_COURS]
      </p>

      <div className="h-6 flex items-center justify-center mb-2">
        <p key={stepIdx} className="text-sm font-mono text-primary animate-in fade-in duration-300">
          {step.label}
        </p>
      </div>
      <div className="h-5 flex items-center justify-center mb-10">
        <p key={`d-${stepIdx}`} className="text-xs text-muted-foreground animate-in fade-in duration-300">
          {step.desc}
        </p>
      </div>

      <div className="w-full space-y-2">
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${step.pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>Profilage comportemental</span>
          <span>{step.pct}%</span>
        </div>
      </div>
    </div>
  );
}

interface QuizProps {
  user?: QuizUser
  diagnosticAnswers?: DiagnosticAnswers
}

export function Quiz({ user, diagnosticAnswers }: QuizProps) {
  const [isStarted, setIsStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [hasResumable, setHasResumable] = useState(false)

  // Restore saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY)
      if (saved) {
        const { step, answers: savedAnswers, times } = JSON.parse(saved)
        if (step > 0 && savedAnswers) {
          setCurrentStep(step)
          setAnswers(savedAnswers)
          setResponseTimes(times || [])
          setHasResumable(true)
        }
      }
    } catch { /* corrupt storage — ignore */ }
  }, [])
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = async (value: string) => {
    const endTime = Date.now()
    const elapsed = endTime - startTime
    
    const newAnswers = { ...answers, [questions[currentStep].id]: value }
    const newTimes = [...responseTimes, elapsed]
    
    setAnswers(newAnswers)
    setResponseTimes(newTimes)

    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1
      // Persist progress so a refresh doesn't lose answers
      try {
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({ step: nextStep, answers: newAnswers, times: newTimes }))
      } catch { /* storage full — continue silently */ }
      setCurrentStep(nextStep)
      setStartTime(Date.now())
    } else {
      setIsAnalyzing(true)
      setIsSaving(true)
      const sortedAnswers = questions.map(q => newAnswers[q.id]);
      // Min display time for the analyzing animation (UX)
      const minDelay = new Promise(res => setTimeout(res, 800));
      try {
        const [res] = await Promise.all([
          fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: sortedAnswers, responseTimes: newTimes, diagnosticAnswers }),
          }),
          minDelay,
        ]);
        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data.analysis);
        }
      } catch (error) {
        console.error("Failed to save results:", error)
      } finally {
        setIsSaving(false)
        setIsAnalyzing(false)
        setIsFinished(true)
        try { localStorage.removeItem(QUIZ_STORAGE_KEY) } catch { /* ignore */ }
      }
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setStartTime(Date.now()) // Reset timer when going back
    }
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-xl p-10 space-y-10 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-[100px]" />

          {/* Header */}
          <div className="space-y-3 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Initialisation du Profil</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase font-mono">
              Analyse de <span className="text-primary">Vibrance</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              Ce n&apos;est pas un test de personnalité. C&apos;est la détection de ton mode d&apos;action dominant pour construire le futur.
            </p>
          </div>

          {/* Points */}
          <div className="grid gap-4 relative">
            {[
              { 
                t: "Zéro Étiquette", 
                d: "Il n'y a pas de bon profil. Ton résultat est une hypothèse de départ, pas une destination finale.",
                i: "01"
              },
              { 
                t: "Évolution Réelle", 
                d: "Tes actions futures (missions, check-ins) auront plus de poids que tes réponses d'aujourd'hui.",
                i: "02"
              },
              { 
                t: "Alignement", 
                d: "L&apos;objectif est de t&apos;orienter vers les missions et la guilde où tu seras le plus performant.",
                i: "03"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/20 transition-colors group">
                <div className="text-xs font-mono text-primary/40 mt-1 group-hover:text-primary transition-colors">
                  {item.i}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200 mb-1 uppercase tracking-tight">{item.t}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          {hasResumable && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-xs font-medium text-primary uppercase tracking-widest">Session active détectée</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-primary/40 text-primary hover:bg-primary/20 text-[10px] font-mono uppercase"
                onClick={() => {
                  setHasResumable(false)
                  setIsStarted(true)
                }}
              >
                Reprendre_
              </Button>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <Button
              onClick={() => {
                if (hasResumable) {
                  try { localStorage.removeItem(QUIZ_STORAGE_KEY) } catch { /* ignore */ }
                  setCurrentStep(0); setAnswers({}); setResponseTimes([]); setHasResumable(false);
                }
                setIsStarted(true)
              }}
              size="lg"
              className="w-full h-16 rounded-2xl btn-primary-glow text-base font-bold gap-3 uppercase tracking-widest"
            >
              Lancer le scan <ChevronRight className="w-5 h-5" />
            </Button>
            <p className="text-[10px] text-center text-zinc-600 font-mono italic">
              -- Temps estimé : 2 minutes // 13 arbitrages cognitifs --
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return <AnalyzingScreen />;
  }

  if (isFinished) {
    if (!analysisResult) return null;

    return (
      <ResultPage
        analysis={analysisResult}
        user={{
          pseudo: user?.pseudo,
          name: user?.name,
          memberNumber: user?.memberNumber,
          level: user?.level,
          experience: user?.experience,
        }}
      />
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 flex flex-col min-h-[80vh] justify-center">
      <div className="mb-16">
        <div className="flex justify-between items-end mb-4 px-1">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/60 block">
              Séquence de Profilage
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Question {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/[0.02]">
           <motion.div 
            className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
           />
        </div>
      </div>

      <div key={currentStep} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-2xl sm:text-4xl font-bold mb-12 leading-[1.2] text-white tracking-tight italic">
          &ldquo;{currentQuestion.text}&rdquo;
        </h2>

        <div className="grid gap-4">
          {currentQuestion.options.map((option: { text: string; value: string }, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="group relative flex items-center justify-between p-6 rounded-2xl border border-white/[0.05] bg-card/20 text-left transition-all hover:border-primary/50 hover:bg-primary/[0.03] active:scale-[0.99] overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-base sm:text-lg text-zinc-300 group-hover:text-white transition-colors relative z-10 pr-8">
                {option.text}
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all relative z-10">
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={currentStep === 0}
          className="text-zinc-500 hover:text-primary hover:bg-transparent font-mono text-[10px] uppercase tracking-widest disabled:opacity-0"
        >
          <ChevronLeft className="mr-2 h-3 w-3" />
          Retour
        </Button>
        <div className="h-px bg-zinc-800 flex-1 mx-8 opacity-20" />
        <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
          [AUTO_SAVE_ENABLED]
        </span>
      </div>
    </div>
  )
}
