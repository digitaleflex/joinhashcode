"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isFinished, setIsFinished] = useState(false)

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value })
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isFinished) {
    // Calculate result
    const counts = Object.values(answers).reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const result = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]

    const profiles: Record<string, { title: string; desc: string }> = {
      builder: {
        title: "Le Builder",
        desc: "Tu es l'architecte du futur. Ton obsession pour la technique et la résolution de problèmes fait de toi le pilier indispensable de toute innovation.",
      },
      creator: {
        title: "Le Créateur",
        desc: "Tu es l'âme visuelle. Ta capacité à transformer une idée abstraite en une expérience esthétique et émotionnelle est ton plus grand pouvoir.",
      },
      strategist: {
        title: "Le Stratège",
        desc: "Tu es le cerveau derrière la croissance. Ton analyse froide et ta vision à long terme permettent de transformer des projets en empires.",
      },
      catalyst: {
        title: "Le Catalyseur",
        desc: "Tu es le lien qui unit. Ta force réside dans ton réseau et ta capacité à mobiliser l'intelligence collective pour atteindre des sommets.",
      },
    }

    const myProfile = profiles[result] || profiles.builder

    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Profilage terminé
        </h2>
        <h1 className="text-4xl font-medium mb-6">
          Tu es <span className="text-primary">{myProfile.title}</span>
        </h1>
        <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
          {myProfile.desc}
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="w-full">
            <Link href={`/community/${result}`}>Rejoindre ma communauté</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
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
          <div className="text-xs font-mono text-muted-foreground">
            {Math.round(progress)}%
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-2xl sm:text-3xl font-medium mb-10 leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, idx) => (
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
