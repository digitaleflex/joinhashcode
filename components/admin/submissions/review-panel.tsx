"use client"

import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getCriteriaForMission, computeQualityLevel } from "@/lib/acceptance-criteria"
import { SubmissionContent } from "./submission-content"

interface SubmissionUser {
  id: string
  name: string
  level: number
}

interface SubmissionMission {
  title: string
  category: string
  submissionMethod: string
  deliverables: string[]
}

interface Submission {
  id: string
  content: string | null
  projectDescription: string | null
  userFeedback: string | null
  userDifficulty: number | null
  userRating: number | null
  improvementSuggestions: string | null
  mission: SubmissionMission
  user: SubmissionUser
}

interface ReviewPanelProps {
  submission: Submission
  processingId: string | null
  adminFeedback: string
  checkedCriteria: Record<string, boolean>
  onFeedbackChange: (value: string) => void
  onCriteriaToggle: (id: string) => void
  onApprove: (id: string, criteria: Record<string, boolean>, feedback: string, qualityLevel: string) => void
  onNeedsRevision: (id: string, criteria: Record<string, boolean>, feedback: string) => void
  onReject: (id: string, feedback: string) => void
  onClose: () => void
}

export function ReviewPanel({
  submission,
  processingId,
  adminFeedback,
  checkedCriteria,
  onFeedbackChange,
  onCriteriaToggle,
  onApprove,
  onNeedsRevision,
  onReject,
  onClose,
}: ReviewPanelProps) {
  const isProcessing = processingId === submission.id

  return (
    <div className="rounded-2xl border border-primary/20 bg-zinc-900/60 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-lg">{submission.mission.title}</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {submission.user.name} · LVL {submission.user.level}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-mono text-muted-foreground hover:text-white"
        >
          ✕ Fermer
        </button>
      </div>

      {submission.content && (
        <div className="space-y-6">
          {/* Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.projectDescription && (
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <p className="text-3xs font-mono uppercase tracking-wider text-muted-foreground/60">Description du projet</p>
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;{submission.projectDescription}&rdquo;
                </p>
              </div>
            )}
            {submission.userFeedback && (
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <p className="text-3xs font-mono uppercase tracking-wider text-muted-foreground/60">Feedback membre</p>
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;{submission.userFeedback}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {submission.userDifficulty && (
                    <span className="text-xs font-mono text-amber-400">DIFF: {submission.userDifficulty}/5</span>
                  )}
                  {submission.userRating && (
                    <span className="text-xs font-mono text-primary">RATING: {submission.userRating}/5</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Deliverable */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Livrable principal</p>
            <SubmissionContent
              content={submission.content}
              submissionMethod={submission.mission.submissionMethod}
              deliverables={submission.mission.deliverables}
              expanded
            />
          </div>

          {submission.improvementSuggestions && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
              <p className="text-3xs font-mono uppercase tracking-wider text-blue-400/60">Suggestions d&apos;amélioration système</p>
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                &ldquo;{submission.improvementSuggestions}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Rubrique d&apos;évaluation</p>
        {getCriteriaForMission(submission.mission.category).map(criterion => (
          <button
            key={criterion.id}
            type="button"
            onClick={() => onCriteriaToggle(criterion.id)}
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
          onChange={e => onFeedbackChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => {
            const criteria = getCriteriaForMission(submission.mission.category)
            const quality = computeQualityLevel(criteria, checkedCriteria)
            onApprove(submission.id, checkedCriteria, adminFeedback, quality)
          }}
          disabled={isProcessing}
        >
          {isProcessing
            ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
            : <Check className="w-4 h-4 mr-2" />
          }
          Valider
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          onClick={() => onNeedsRevision(submission.id, checkedCriteria, adminFeedback)}
          disabled={isProcessing || !adminFeedback.trim()}
        >
          Demander révision
        </Button>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          onClick={() => onReject(submission.id, adminFeedback)}
          disabled={isProcessing || !adminFeedback.trim()}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
