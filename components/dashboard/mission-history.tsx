"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Calendar, CheckCircle2, Target } from "lucide-react"
import { format, fr } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import type { DetailedMissionSubmission } from "@/lib/types"

interface MissionHistoryProps {
  submissions: DetailedMissionSubmission[]
}

export function MissionHistory({ submissions }: MissionHistoryProps) {
  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [submissions])

  if (sortedSubmissions.length === 0) {
    return (
      <Card variant="premium" className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <History className="h-5 w-5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">historique_missions</CardTitle>
          <CardDescription className="text-zinc-500 font-medium tracking-tight">
            Ton parcours de preuves et de réalisations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <EmptyState
            icon={Target}
            title="Aucune mission complétée pour l'instant"
            description="Chaque mission approuvée apparaît ici. Commence par une mission INIT — elles sont conçues pour les débutants."
            action={
              <Button asChild size="sm" className="btn-primary-glow h-10 rounded-xl font-bold text-xs uppercase tracking-wider">
                <Link href="/missions">Voir les missions disponibles</Link>
              </Button>
            }
            className="py-10 gap-5"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="premium" className="overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <History className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="font-mono text-[10px] font-bold border-primary/30 text-primary px-3 py-1">
            {sortedSubmissions.length} COMPLÉTÉE{sortedSubmissions.length > 1 ? 'S' : ''}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-extrabold text-white tracking-[-0.03em]">historique_missions</CardTitle>
        <CardDescription className="text-zinc-500 font-medium tracking-tight">
          Ton parcours de preuves et de réalisations.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="grid gap-3">
          {sortedSubmissions.map((s) => (
            <div 
              key={s.id} 
              className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-white/2 border border-white/5 group/item hover:bg-white/4 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-primary shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {s.mission.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(s.createdAt), "dd MMM yyyy", { locale: fr })}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="text-[10px] font-mono text-primary font-bold">
                      +{s.xpAwarded} XP
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "font-mono text-[9px] font-bold px-2 py-0.5 border-white/10 bg-white/2 shrink-0",
                  s.mission.missionLevel === "INIT" && "text-blue-400 border-blue-400/20 bg-blue-400/5",
                  s.mission.missionLevel === "CORE" && "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
                  s.mission.missionLevel === "PRO" && "text-purple-400 border-purple-400/20 bg-purple-400/5"
                )}
              >
                {s.mission.missionLevel || "INIT"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
