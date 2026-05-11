"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { analyzeQuizResults, type AnalysisResult } from "@/lib/analysis"
import { 
  TrendingUp, Terminal, Palette, Users, Award, 
  Map, Video, GitBranch, ChevronRight, ChevronLeft, 
  CheckCircle2 
} from "lucide-react"
import Link from "next/link"

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = async (value: string) => {
    const endTime = Date.now()
    const elapsed = endTime - startTime
    
    const newAnswers = { ...answers, [questions[currentStep].id]: value }
    const newTimes = [...responseTimes, elapsed]
    
    setAnswers(newAnswers)
    setResponseTimes(newTimes)

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
      setStartTime(Date.now())
    } else {
      setIsSaving(true)
      try {
        const analysis = analyzeQuizResults(Object.values(newAnswers))
        await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileType: analysis.primary,
            answers: newAnswers,
            responseTimes: newTimes,
            averageResponseTime: Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
          })
        })
        setIsFinished(true)
      } catch (error) {
        console.error("Failed to save results:", error)
        setIsFinished(true) // Still finish even if save fails for UX
      } finally {
        setIsSaving(false)
      }
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setStartTime(Date.now()) // Reset timer when going back
    }
  }

  if (isFinished) {
    const analysis = analyzeQuizResults(Object.values(answers));
    
    const profiles: Record<string, { title: string; desc: string; color: string }> = {
      builder: {
        title: "Le Builder",
        desc: "Tu es l'architecte du futur. Ton obsession pour la technique et la résolution de problèmes fait de toi le pilier indispensable de toute innovation.",
        color: "text-blue-500",
      },
      creator: {
        title: "Le Créateur",
        desc: "Tu es l'âme visuelle. Ta capacité à transformer une idée abstraite en une expérience esthétique et émotionnelle est ton plus grand pouvoir.",
        color: "text-purple-500",
      },
      strategist: {
        title: "Le Stratège",
        desc: "Tu es le cerveau derrière la croissance. Ton analyse froide et ta vision à long terme permettent de transformer des projets en empires.",
        color: "text-emerald-500",
      },
      catalyst: {
        title: "Le Catalyseur",
        desc: "Tu es le lien qui unit. Ta force réside dans ton réseau et ta capacité à mobiliser l'intelligence collective pour atteindre des sommets.",
        color: "text-orange-500",
      },
    }

    const myProfile = profiles[analysis.primary] || profiles.builder;

    const getIcon = (iconName: string) => {
      switch(iconName) {
        case 'terminal': return <Terminal className="h-5 w-5" />;
        case 'git-branch': return <GitBranch className="h-5 w-5" />;
        case 'palette': return <Palette className="h-5 w-5" />;
        case 'video': return <Video className="h-5 w-5" />;
        case 'trending-up': return <TrendingUp className="h-5 w-5" />;
        case 'map': return <Map className="h-5 w-5" />;
        case 'users': return <Users className="h-5 w-5" />;
        case 'award': return <Award className="h-5 w-5" />;
        default: return <ChevronRight className="h-5 w-5" />;
      }
    };

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Algorithme d'Analyse Terminé
          </h2>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">
            Ton profil est <span className={myProfile.color}>{myProfile.title}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed mb-8">
            {myProfile.desc}
          </p>

          {/* Scores Breakdown */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {(Object.entries(analysis.percentages) as [any, number][]).map(([type, percent]) => (
              <div key={type} className="p-4 rounded-2xl border border-border bg-card/30 backdrop-blur">
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{type}</div>
                <div className="text-2xl font-semibold">{percent}%</div>
                <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-1000`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-12">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Score de polarisation mathématique : {Math.round(analysis.consistencyScore * 100)}%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Channels Redirection */}
          <div>
            <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Canaux recommandés
            </h3>
            <div className="space-y-4">
              {analysis.suggestedChannels.map((channel, i) => (
                <Link 
                  key={i} 
                  href={channel.url}
                  className="group block p-5 rounded-2xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      {getIcon(channel.icon)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {channel.name}
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{channel.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col justify-center p-8 rounded-3xl bg-linear-to-br from-primary/10 to-transparent border border-primary/20">
            <h3 className="text-2xl font-semibold mb-4">Prêt à hacker ton futur ?</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Basé sur ton profil <span className="text-white font-medium">{myProfile.title}</span>, nous avons débloqué ton accès prioritaire aux écosystèmes HASHCODE les plus pertinents.
            </p>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(197,244,65,0.3)]">
                <Link href={`/community/${analysis.primary}`}>Accéder à mon espace</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full text-zinc-400">
                <Link href="/">Quitter le profilage</Link>
              </Button>
            </div>
          </div>
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
