"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, CheckCircle2, Circle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getCriteriaForMission, computeQualityLevel, type Criterion } from "@/lib/acceptance-criteria"

interface ReviewerRubricFormProps {
  submissionId: string
  missionCategory: string
  missionXp: number
}

export function ReviewerRubricForm({ submissionId, missionCategory, missionXp }: ReviewerRubricFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const criteria = getCriteriaForMission(missionCategory)
  const required = criteria.filter(c => c.weight === "REQUIRED")
  const bonus = criteria.filter(c => c.weight === "BONUS")
  const allRequiredPassed = required.every(c => checked[c.id])
  const suggestedQuality = allRequiredPassed ? computeQualityLevel(criteria, checked) : null

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim() || feedback.length < 20) {
      toast.error("Le feedback doit contenir au moins 20 caractères.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/missions/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: checked, feedback }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (data.status === "NEEDS_REVISION") {
        toast.info("Révision demandée. Le membre a été notifié.")
      } else {
        toast.success(`Mission validée — Niveau ${data.qualityLevel} (+${data.xpAwarded} XP pour le membre)`)
      }
      router.push("/reviewer")
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la soumission de la revue."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CriterionRow = ({ criterion }: { criterion: Criterion }) => (
    <button
      type="button"
      onClick={() => toggle(criterion.id)}
      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
        checked[criterion.id]
          ? "border-primary/30 bg-primary/5 text-zinc-200"
          : "border-border/30 bg-card/20 text-zinc-400 hover:border-border/60"
      }`}
    >
      {checked[criterion.id]
        ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        : <Circle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
      }
      <span className="text-sm leading-relaxed">{criterion.label}</span>
      {criterion.weight === "BONUS" && (
        <span className="ml-auto text-[9px] font-mono text-primary/40 uppercase tracking-widest shrink-0 mt-0.5">bonus</span>
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Critères requis</p>
        {required.map(c => <CriterionRow key={c.id} criterion={c} />)}
      </div>

      {bonus.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Critères bonus</p>
          {bonus.map(c => <CriterionRow key={c.id} criterion={c} />)}
        </div>
      )}

      {suggestedQuality && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono text-primary text-center uppercase tracking-widest">
          Niveau suggéré : {suggestedQuality} · +{Math.round(missionXp * (suggestedQuality === "EXEMPLARY" ? 1.5 : suggestedQuality === "GOOD" ? 1.25 : 1))} XP
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Feedback pour le membre {!allRequiredPassed && <span className="text-amber-400">(explique ce qui manque)</span>}
        </label>
        <Textarea
          placeholder={allRequiredPassed ? "Commentaire sur le travail réalisé..." : "Explique précisément ce qui doit être amélioré..."}
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          className="bg-card/30 border-border/40 rounded-xl min-h-[100px] text-sm"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl btn-primary-glow"
        disabled={isSubmitting || feedback.length < 20}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        {allRequiredPassed ? "Valider la soumission" : "Demander une révision"}
      </Button>
    </form>
  )
}
