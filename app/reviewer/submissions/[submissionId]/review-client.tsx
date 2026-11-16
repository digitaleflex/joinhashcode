"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2, ClipboardCheck } from "lucide-react"
import { computeQualityLevel } from "@/lib/acceptance-criteria"
import { SubmissionContent } from "@/components/admin/submissions/submission-content"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ReviewClientProps {
  submission: any
  criteria: { id: string; label: string; weight: string }[]
  canClaim: boolean
  reviewerId: string
}

export function ReviewClient({ submission, criteria, canClaim, reviewerId }: ReviewClientProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [claimed, setClaimed] = useState(submission.status === "IN_REVIEW" && submission.reviewerId === reviewerId)
  const [adminFeedback, setAdminFeedback] = useState("")
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const isProcessing = processing
  const isClaimed = claimed || submission.status === "IN_REVIEW"
  const isOwn = submission.userId === reviewerId

  const handleClaim = async () => {
    setProcessing(true)
    setError(null)
    try {
      const res = await fetch(`/api/missions/${submission.id}/claim`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Erreur lors de la prise en charge.")
        return
      }
      setClaimed(true)
    } catch {
      setError("Erreur réseau.")
    } finally {
      setProcessing(false)
    }
  }

  const handleReview = async (status: "APPROVED" | "NEEDS_REVISION") => {
    setProcessing(true)
    setError(null)
    try {
      const qualityLevel = computeQualityLevel(criteria as any, checkedCriteria)
      const res = await fetch(`/api/missions/${submission.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          criteria: checkedCriteria,
          feedback: adminFeedback,
          forceApprove: false,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Erreur lors de la revue.")
        return
      }
      router.push("/reviewer")
      router.refresh()
    } catch {
      setError("Erreur réseau.")
    } finally {
      setProcessing(false)
    }
  }

  const toggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (isOwn) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-400">Tu ne peux pas relire ta propre soumission.</p>
      </div>
    )
  }

  if (!canClaim && !isClaimed) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-400">Tu n'es pas éligible pour relire cette soumission.</p>
        <p className="text-xs text-zinc-600 mt-2">Il faut avoir validé au moins 3 labs.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="size-6 text-primary" />
        <h1 className="text-2xl font-black uppercase italic tracking-tight">
          Relecture — {submission.mission?.title}
        </h1>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/2 border border-white/5">
        <Avatar className="size-10 rounded-lg border border-white/10">
          <AvatarImage src={submission.user?.image || ""} alt={submission.user?.name} />
          <AvatarFallback className="rounded-lg bg-zinc-800 text-xs">
            {submission.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{submission.user?.name}</p>
          {submission.user?.pseudo && (
            <p className="text-xs font-mono text-zinc-500">@{submission.user.pseudo}</p>
          )}
        </div>
        <Badge className="ml-auto text-3xs font-mono bg-amber-500/10 text-amber-400 border-amber-500/20">
          {submission.status === "PENDING" ? "En attente" : submission.status === "IN_REVIEW" ? "En relecture" : submission.status}
        </Badge>
      </div>

      {submission.content && (
        <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Livrable</p>
          <SubmissionContent
            content={submission.content}
            submissionMethod={submission.mission?.submissionMethod || "TEXT"}
            deliverables={submission.mission?.deliverables || []}
            expanded
          />
        </div>
      )}

      {submission.artifacts && submission.artifacts.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Artefacts ({submission.artifacts.length})
          </p>
          {submission.artifacts.map((artifact: any) => (
            <div key={artifact.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
              <p className="text-sm font-medium text-zinc-200">{artifact.label}</p>
              {artifact.value && (
                <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-words bg-black/40 border border-white/5 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {artifact.value}
                </pre>
              )}
              {artifact.fileUrl && (
                <a href={artifact.fileUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline break-all">
                  📎 {artifact.fileName ?? artifact.fileUrl}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!isClaimed && submission.status === "PENDING" && (
        <Button
          className="w-full bg-primary text-primary-foreground"
          onClick={handleClaim}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Prendre en charge
        </Button>
      )}

      {isClaimed && submission.status === "IN_REVIEW" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Critères d'évaluation
            </p>
            {criteria.map((criterion) => (
              <button
                key={criterion.id}
                type="button"
                onClick={() => toggleCriterion(criterion.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm ${
                  checkedCriteria[criterion.id]
                    ? "border-primary/30 bg-primary/5 text-zinc-200"
                    : "border-white/5 bg-white/[0.02] text-zinc-500 hover:border-white/10"
                }`}
              >
                {checkedCriteria[criterion.id]
                  ? <Check className="w-4 h-4 text-primary shrink-0" />
                  : <div className="w-4 h-4 rounded border border-white/20 shrink-0" />
                }
                {criterion.label}
                {criterion.weight === "BONUS" && (
                  <span className="ml-auto text-3xs font-mono text-primary/40 uppercase tracking-wider">bonus</span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Feedback</label>
            <Textarea
              placeholder="Commentaire pour le membre..."
              className="bg-black/40 border-white/5 min-h-[100px] text-sm"
              value={adminFeedback}
              onChange={(e) => setAdminFeedback(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleReview("APPROVED")}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Valider
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => handleReview("NEEDS_REVISION")}
              disabled={isProcessing || !adminFeedback.trim()}
            >
              Demander révision
            </Button>
          </div>
        </div>
      )}

      {submission.status === "APPROVED" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          Cette soumission a déjà été validée.
        </div>
      )}

      {submission.status === "NEEDS_REVISION" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          Cette soumission nécessite une révision.
        </div>
      )}
    </div>
  )
}