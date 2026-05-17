"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { AnalysisResult } from "@/lib/analysis"
import {
  ChevronRight, ChevronLeft,
} from "lucide-react"
import { useEffect } from "react"
import { ResultPage } from "./result-page"

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

export function Quiz({ user }: { user?: QuizUser }) {
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
            body: JSON.stringify({ answers: sortedAnswers, responseTimes: newTimes }),
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
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
        <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Avant de commencer</p>
            <h2 className="text-2xl font-semibold tracking-tight">Ce que ce quiz n'est pas</h2>
          </div>

          {/* Points */}
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Pas un test de personnalité définitif</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Il n'existe pas de "bon" ou "mauvais" profil ici. Ces résultats sont une <span className="text-zinc-400">hypothèse de départ</span> basée sur tes tendances naturelles actuelles — pas une vérité immuable sur qui tu es.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Ton profil évoluera avec tes actions</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  La manière dont tu complètes des missions, interagis avec la communauté et progresses a bien plus de poids que ces 13 questions. Le quiz est un point de départ, pas une destination.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Un outil de recommandation, pas une étiquette</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Le seul objectif de ce profilage est de t'orienter vers les missions, canaux et ressources les plus pertinents pour toi aujourd'hui. Beaucoup de membres ont un profil hybride — c'est la norme, pas l'exception.
                </p>
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-zinc-400 leading-relaxed text-center">
              Réponds instinctivement, sans chercher à optimiser. La première réponse qui te vient est presque toujours la plus juste.
            </p>
          </div>

          {hasResumable && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-white">Progression sauvegardée</p>
                <p className="text-[10px] text-zinc-500">Tu avais commencé ce quiz — reprends là où tu t'es arrêté.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 border-primary/40 text-primary hover:bg-primary/10 text-xs"
                onClick={() => {
                  setHasResumable(false)
                  setIsStarted(true)
                }}
              >
                Reprendre
              </Button>
            </div>
          )}
          <Button
            onClick={() => {
              if (hasResumable) {
                // Fresh start — clear saved progress
                try { localStorage.removeItem(QUIZ_STORAGE_KEY) } catch { /* ignore */ }
                setCurrentStep(0)
                setAnswers({})
                setResponseTimes([])
                setHasResumable(false)
              }
              setIsStarted(true)
            }}
            size="lg"
            className="w-full h-14 rounded-xl btn-primary-glow text-base font-semibold gap-2"
          >
            {hasResumable ? "Recommencer à zéro" : "Commencer le profilage"} <ChevronRight className="h-5 w-5" />
          </Button>
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
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Question {currentStep + 1} sur {questions.length}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-2xl sm:text-3xl font-medium mb-10 leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="grid gap-3">
          {currentQuestion.options.map((option: { text: string; value: string }, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="group relative flex items-center justify-between p-5 rounded-xl border border-border bg-card/40 text-left transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]"
            >
              <span className="text-base text-foreground group-hover:text-primary transition-colors">
                {option.text}
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={currentStep === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Question précédente
        </Button>
      </div>
    </div>
  )
}
