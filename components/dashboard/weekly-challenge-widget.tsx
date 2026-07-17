"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy } from "lucide-react"
import { getTimeUntilNextMonday } from "@/lib/dates"

export function WeeklyChallengeWidget() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    setTimeLeft(getTimeUntilNextMonday())
    const timer = setInterval(() => setTimeLeft(getTimeUntilNextMonday()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-zinc-950 border-white/5 overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="size-4 text-amber-400" />
                    Défi Hebdomadaire
                </CardTitle>
                <CardDescription className="text-[10px] text-zinc-500 uppercase font-mono mt-1">
                    Objectif : 5 Missions Validées
                </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-white/10">
                <Clock className="size-3 text-zinc-500" />
                <span className="text-[10px] font-mono font-bold text-zinc-300">{timeLeft}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>Progression</span>
            <span>2 / 5</span>
        </div>
        <Progress value={40} className="h-2 bg-zinc-900" />
        <p className="text-[10px] text-zinc-600 italic">
            Valide 3 missions de plus cette semaine pour débloquer le badge <span className="text-primary font-bold">"SÉRIE D'OR"</span>.
        </p>
      </CardContent>
    </Card>
  )
}
