"use client"

import { useState } from "react"
import { submitQuiz } from "@/app/actions/quiz"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { AnalysisResult } from "@/lib/analysis"
import {
  ChevronRight, ChevronLeft, Sparkles, Zap, ShieldAlert, ShieldCheck
} from "lucide-react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResultPage } from "./result-page"
import type { DiagnosticAnswers } from "./pre-quiz-diagnostic"
import { track } from "@vercel/analytics"
import { cn } from "@/lib/utils"

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
  { label: "Lecture des réponses",          desc: "Lecture de tes 13 réponses...",               pct: 12 },
  { label: "Analyse comportementale",       desc: "Analyse de tes choix de dev...",              pct: 28 },
  { label: "Calcul des vecteurs",           desc: "Analyse de tes points forts...",              pct: 45 },
  { label: "Scénarios de crise",            desc: "Analyse de tes réflexes en équipe...",        pct: 62 },
  { label: "Profil dominant",               desc: "Identification de la tendance principale...", pct: 78 },
  { label: "Génération de l'hypothèse",     desc: "Génération de ton profil...",                 pct: 94 },
];

function AnalyzingScreen() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx(prev => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const step = ANALYSIS_STEPS[stepIdx];

  return (
    <div className="max-w-md mx-auto py-32 px-4 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000 relative">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      
      <p className="text-[10px] font-mono uppercase text-primary/60 mb-12 relative">
        [ PROCESSUS_DE_SYNCHRONISATION ]
      </p>

      <div className="relative mb-12">
        <div className="size-24 rounded-full border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
            <div className="size-16 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="size-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="h-8 flex items-center justify-center mb-2 relative">
        <h3 key={stepIdx} className="text-lg font-black uppercase tracking-tighter text-white animate-in slide-in-from-bottom-2 duration-500">
          {step.label}
        </h3>
      </div>
      <div className="h-6 flex items-center justify-center mb-12 relative">
        <p key={`d-${stepIdx}`} className="text-xs text-zinc-500 font-mono uppercase tracking-wider animate-in fade-in duration-700">
          {step.desc}
        </p>
      </div>

      <div className="w-full space-y-4 relative">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-primary shadow-[0_0_20px_#C5F441]"
            initial={{ width: 0 }}
            animate={{ width: `${step.pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
          <span>Neural_Mapping</span>
          <span className="text-primary font-bold">{step.pct}%</span>
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
          submitQuiz({ answers: sortedAnswers, responseTimes: newTimes, diagnosticAnswers }),
          minDelay,
        ]);
        if (res.success) {
          setAnalysisResult(res.analysis ?? null);
          track("quiz_completed", { profileType: res.analysis?.primary ?? "unknown" });
          setIsFinished(true); // Mark as finished immediately upon successful sync
        } else if (res.status === 409) {
          toast.info("Protocole déjà enregistré. Redirection vers le dashboard...");
          setTimeout(() => window.location.href = "/dashboard", 2000);
          return; // Exit early to avoid showing empty ResultPage
        } else {
          throw new Error(res.error || "Erreur lors de la synchronisation");
        }
      } catch (error: any) {
        console.error("Failed to save results:", error)
        toast.error(error.message || "Le système n'a pas pu traiter tes vecteurs. Réessaie.");
      } finally {
        setIsSaving(false)
        setIsAnalyzing(false)
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
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl p-8 sm:p-12 space-y-12 overflow-hidden shadow-2xl group">
          {/* Decorative Glows */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/15 transition-all duration-1000" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]" />

          {/* Header */}
          <div className="space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-mono font-black text-primary">Prêt à commencer ?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-white italic leading-[0.95]">
              Découvre ton <span className="text-primary drop-shadow-[0_0_15px_rgba(197,244,65,0.3)]">style de build</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md font-light">
              Évalue ta façon de concevoir, de coder et de collaborer pour trouver la guilde qui te correspond.
            </p>
          </div>

          {/* Points - Optimized for persuasion */}
          <div className="grid gap-6 relative">
            {[
              { 
                t: "Profil vivant", 
                d: "Pas de case fixe. Ton profil évolue en temps réel selon les projets que tu construis.",
                i: "01"
              },
              { 
                t: "Impact réel", 
                d: "Tes missions futures pèseront plus lourd que tes réponses d'aujourd'hui.",
                i: "02"
              },
              { 
                t: "Trouve ta place", 
                d: "Découvre ta Guilde et débloque les outils adaptés à tes forces.",
                i: "03"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-primary/30 transition-all duration-500 group/item">
                <div className="text-xs font-mono text-primary font-black mt-1 group-hover/item:scale-110 transition-transform">
                  [{item.i}]
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1 tracking-tight italic group-hover/item:text-primary transition-colors">{item.t}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          {hasResumable && (
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary shadow-[0_0_10px_#C5F441]" />
                <p className="text-[10px] font-black text-primary">Session active détectée</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 border-primary/40 text-primary hover:bg-primary/20 text-[10px] font-black tracking-wider px-6"
                onClick={() => {
                  setHasResumable(false)
                  setIsStarted(true)
                }}
              >
                Reprendre_
              </Button>
            </div>
          )}

          <div className="space-y-6 pt-4 relative">
            <Button
              onClick={() => {
                if (hasResumable) {
                  try { localStorage.removeItem(QUIZ_STORAGE_KEY) } catch { /* ignore */ }
                  setCurrentStep(0); setAnswers({}); setResponseTimes([]); setHasResumable(false);
                }
                setIsStarted(true)
              }}
              size="lg"
              className="w-full h-20 rounded-3xl btn-primary-glow text-lg font-black gap-4"
            >
              Débuter l'évaluation <ChevronRight className="w-6 h-6" />
            </Button>
            <div className="flex justify-center items-center gap-6 text-[9px] text-zinc-600 font-mono">
              <span>[ 13 arbitrages ]</span>
              <span className="size-1 rounded-full bg-zinc-800" />
              <span>[ ~2 minutes ]</span>
            </div>
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
    <div className="w-full max-w-3xl mx-auto py-10 px-4 flex flex-col relative z-10">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-5 px-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono font-black uppercase text-zinc-500 block">
                    Neural_Calibration_Sequence
                </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
              Interrogation [{currentStep + 1} / {questions.length}]
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-primary italic">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/3 rounded-full overflow-hidden border border-white/5">
           <motion.div 
            className="h-full bg-primary shadow-[0_0_20px_rgba(197,244,65,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
           />
        </div>
      </div>

      <div key={currentStep} className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mb-10 relative">
            <div className="absolute -left-6 top-0 w-1 h-full bg-primary/20 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-snug text-white tracking-tight">
                {currentQuestion.text}
            </h2>
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider mt-3">
              -- Analyse des réflexes cognitifs --
            </p>
        </div>

        <div className="grid gap-4">
          {currentQuestion.options.map((option: { text: string; value: string }, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="group relative flex items-center justify-between p-6 sm:p-8 rounded-3xl border border-white/8 bg-white/2 text-left transition-all hover:border-primary/40 hover:bg-primary/4 active:scale-[0.98] overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
              
              <div className="flex items-center gap-6 relative z-10">
                <span className="text-[10px] font-mono text-zinc-600 group-hover:text-primary transition-colors font-bold">
                    {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base sm:text-lg text-zinc-300 font-medium group-hover:text-white transition-colors pr-8">
                    {option.text}
                </span>
              </div>

              <div className="size-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all relative z-10 shadow-inner">
                <ChevronRight className="size-5 text-zinc-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
              
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 size-8 bg-linear-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-8 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={currentStep === 0}
          className="h-11 px-6 text-zinc-500 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase disabled:opacity-0 rounded-xl border border-transparent hover:border-white/10"
        >
          <ChevronLeft className="mr-2 size-4" />
          Précédent_
        </Button>
        
        <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
              [ CRYPTO_LINK_SECURED ]
            </span>
            <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider">
              HASHCODE_TERMINAL_V2
            </span>
        </div>
      </div>
    </div>
  )
}
