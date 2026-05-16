"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { analyzeQuizResults, type AnalysisResult } from "@/lib/analysis"
import {
  TrendingUp, Terminal, Palette, Users, Award,
  Map, Video, GitBranch, ChevronRight, ChevronLeft,
  CheckCircle2, Timer, Loader2
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { ScrambleText } from "@/components/ui/scramble-text"
import { MemberCard } from "@/components/ui/member-card"

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

export function Quiz({ user }: { user?: QuizUser }) {
  const [isStarted, setIsStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)

  useEffect(() => {
    if (isFinished || isAnalyzing) return;
    const interval = setInterval(() => {
      setCurrentTimeMs(Date.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, [startTime, isFinished, isAnalyzing]);

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
      setIsAnalyzing(true)
      setIsSaving(true)
      try {
        const sortedAnswers = questions.map(q => newAnswers[q.id]);
        const analysis = analyzeQuizResults(sortedAnswers, newTimes)
        await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileType: analysis.primary,
            level: analysis.level,
            scores: analysis.scores,
            consistencyScore: analysis.consistencyScore,
            totalTime: newTimes.reduce((a, b) => a + b, 1),
            answers: newAnswers,
            responseTimes: newTimes,
            averageResponseTime: Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
          })
        })
        
        // Artificial delay for UI WOW effect
        setTimeout(() => {
          setIsAnalyzing(false)
          setIsFinished(true)
        }, 2500)
        
      } catch (error) {
        console.error("Failed to save results:", error)
        setTimeout(() => {
          setIsAnalyzing(false)
          setIsFinished(true)
        }, 1500)
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

          <Button
            onClick={() => setIsStarted(true)}
            size="lg"
            className="w-full h-14 rounded-xl btn-primary-glow text-base font-semibold gap-2"
          >
            Commencer le profilage <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
        <h2 className="text-2xl font-semibold mb-4 tracking-tight font-mono text-primary">
          <ScrambleText text="[GENERATION_HYPOTHESE]" duration={2000} />
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Calcul des vecteurs comportementaux et pondération des scénarios de crise...
        </p>
        <div className="w-full max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-full rounded-full" style={{ animationDuration: '1s' }} />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Identification des tendances</p>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const analysis = analyzeQuizResults(Object.values(answers), responseTimes);

    const profiles: Record<string, { title: string; desc: string; hybridDesc: string; color: string }> = {
      builder: {
        title: "Builder",
        desc: "Tes arbitrages révèlent une tendance forte à passer à l'action et à construire concrètement. Tu t'épanouis quand tu transformes une idée en quelque chose qui fonctionne réellement.",
        hybridDesc: "Tes arbitrages montrent une double tendance : construire concrètement ET raisonner en système. Cette combinaison est rare et puissante.",
        color: "text-[#B8FF3B]",
      },
      creator: {
        title: "Créateur",
        desc: "Tes arbitrages révèlent une tendance forte à penser par l'expérience et l'esthétique. Tu cherches naturellement ce qui n'existe pas encore et tu le donnes vie.",
        hybridDesc: "Tes arbitrages montrent une double tendance : imaginer des expériences nouvelles ET les ancrer dans la réalité. C'est le profil des makers qui durent.",
        color: "text-[#A855F7]",
      },
      strategist: {
        title: "Stratège",
        desc: "Tes arbitrages révèlent une tendance forte à analyser avant d'agir et à voir les systèmes derrière les événements. Tu construis pour durer, pas pour l'immédiat.",
        hybridDesc: "Tes arbitrages montrent une double tendance : structurer en profondeur ET mobiliser les gens autour de cette vision. C'est un profil de leadership naturel.",
        color: "text-[#22D3EE]",
      },
      catalyst: {
        title: "Catalyseur",
        desc: "Tes arbitrages révèlent une tendance forte à amplifier ce qui existe autour de toi — les gens, les idées, les projets. Tu crées de la dynamique là où elle manque.",
        hybridDesc: "Tes arbitrages montrent une double tendance : fédérer les personnes ET créer des expériences qui les marquent. C'est le profil des community builders visionnaires.",
        color: "text-[#F97316]",
      },
    };

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
            {analysis.isHybrid ? "Profil Hybride Détecté" : "Tendance Dominante Identifiée"}
          </h2>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">
            <span className={myProfile.color}>{analysis.hybridLabel}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed mb-4">
            {analysis.isHybrid ? myProfile.hybridDesc : myProfile.desc}
          </p>
          <p className="text-zinc-600 max-w-xl text-sm leading-relaxed mb-8">
            Ce résultat est une <strong className="text-zinc-500">hypothèse de départ</strong>, pas une étiquette permanente.
            Il évoluera au fil de tes missions réelles dans HASHCODE.
          </p>

          {/* Scores Breakdown */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {(Object.entries(analysis.percentages) as [any, number][]).map(([type, percent]) => {
              const isPrimary = type === analysis.primary;
              const isSecondary = type === analysis.secondary;
              return (
                <div key={type} className={`p-4 rounded-2xl border bg-card/30 backdrop-blur transition-all ${isPrimary ? "border-primary/40 bg-primary/5" : isSecondary && analysis.isHybrid ? "border-zinc-600/40" : "border-border"}`}>
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                    {type}
                    {isPrimary && <span className="text-[8px] text-primary">●</span>}
                    {isSecondary && analysis.isHybrid && <span className="text-[8px] text-zinc-500">●</span>}
                  </div>
                  <div className={`text-2xl font-semibold ${isPrimary ? "text-primary" : ""}`}>{percent}%</div>
                  <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isPrimary ? "bg-primary" : "bg-zinc-600"}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {analysis.consistencyScore > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-12">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">
                {analysis.isHybrid
                  ? `Profil équilibré — tendances proches (${Math.round(analysis.consistencyScore * 100)}% de polarisation)`
                  : `Profil polarisé — tendance claire (${Math.round(analysis.consistencyScore * 100)}% de cohérence)`}
              </span>
            </div>
          )}
        </div>

        {/* Member Card */}
        {user && (
          <div className="mb-12 max-w-xl mx-auto animate-in fade-in zoom-in duration-700 delay-300">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground text-center mb-6">
              Ta carte membre
            </p>
            <MemberCard
              userId={user.id}
              pseudo={user.pseudo ?? user.name}
              memberNumber={user.memberNumber}
              userClass={user.class}
              level={user.level}
              experience={user.experience}
              createdAt={user.createdAt}
            />
          </div>
        )}

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
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 text-muted-foreground border border-border/50">
              <Timer className="w-3.5 h-3.5" />
              {(currentTimeMs / 1000).toFixed(1)}s
            </div>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
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
