"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, ExternalLink, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReviewerRubricForm } from "./reviewer-rubric-form"

interface QueueItem {
  id: string
  content: string | null
  projectDescription: string | null
  createdAt: string
  user: { name: string; pseudo: string | null; level: number }
  mission: { id: string; title: string; category: string; xp: number }
}

export function ReviewerQueue({ reviewerId }: { reviewerId: string }) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [activeReview, setActiveReview] = useState<QueueItem | null>(null)

  useEffect(() => {
    fetch("/api/reviewer")
      .then(r => r.json())
      .then(setQueue)
      .catch(() => toast.error("Impossible de charger la queue."))
      .finally(() => setLoading(false))
  }, [])

  const handleClaim = async (item: QueueItem) => {
    setClaiming(item.id)
    try {
      const res = await fetch(`/api/missions/${item.id}/claim`, { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      setActiveReview(item)
      setQueue(q => q.filter(i => i.id !== item.id))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Impossible de claim cette soumission."
      toast.error(message)
    } finally {
      setClaiming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (activeReview) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">En cours de revue</p>
          <h2 className="text-lg font-bold mt-1">{activeReview.mission.title}</h2>
          <p className="text-xs text-zinc-400 mt-1">par {activeReview.user.pseudo ?? activeReview.user.name}</p>
        </div>
        <div className="p-6 space-y-6">
          {activeReview.content && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Soumission</p>
              <a
                href={activeReview.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                {activeReview.content}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          {activeReview.projectDescription && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description du projet</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{activeReview.projectDescription}</p>
            </div>
          )}
          <ReviewerRubricForm
            submissionId={activeReview.id}
            missionCategory={activeReview.mission.category}
            missionXp={activeReview.mission.xp}
          />
        </div>
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-muted-foreground font-mono">
        Aucune soumission disponible pour ta revue actuellement.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {queue.map(item => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-border/40 bg-card/20 hover:border-border/60 transition-colors">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] font-mono uppercase text-primary border-primary/20 bg-primary/5">
                {item.mission.category}
              </Badge>
              <span className="text-[10px] font-mono text-primary">+{Math.round(item.mission.xp * 0.15)} XP reviewer</span>
            </div>
            <p className="font-medium text-sm truncate">{item.mission.title}</p>
            <p className="text-[11px] text-muted-foreground font-mono">
              {item.user.pseudo ?? item.user.name} · LVL {item.user.level} · {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-primary/30 text-primary hover:bg-primary/10 font-mono text-[10px] uppercase tracking-wider"
            onClick={() => handleClaim(item)}
            disabled={claiming === item.id}
          >
            {claiming === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Reviewer <ChevronRight className="w-3 h-3 ml-1" /></>}
          </Button>
        </div>
      ))}
    </div>
  )
}
