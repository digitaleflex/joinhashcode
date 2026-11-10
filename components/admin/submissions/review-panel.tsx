"use client"

import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getReviewCriteria, computeQualityLevel } from "@/lib/acceptance-criteria"
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
  acceptanceCriteria?: string[]
}

interface SubmissionArtifact {
  key: string
  type: string
  label: string
  value: string | null
  fileUrl: string | null
  fileName: string | null
  status: string
  reviewerNote: string | null
}

export interface ArtifactDecision {
  status: "ACCEPTED" | "REJECTED"
  note: string
}

interface Submission {
  id: string
  content: string | null
  projectDescription: string | null
  userFeedback: string | null
  userDifficulty: number | null
  userRating: number | null
  improvementSuggestions: string | null
  artifacts?: SubmissionArtifact[]
  mission: SubmissionMission
  user: SubmissionUser
}

interface ReviewPanelProps {
  submission: Submission
  processingId: string | null
  adminFeedback: string
  checkedCriteria: Record<string, boolean>
  artifactDecisions: Record<string, ArtifactDecision>
  onFeedbackChange: (value: string) => void
  onCriteriaToggle: (id: string) => void
  onArtifactDecision: (key: string, decision: ArtifactDecision | null) => void
  onApprove: (id: string, criteria: Record<string, boolean>, feedback: string, qualityLevel: string) => void
  onNeedsRevision: (id: string, criteria: Record<string, boolean>, feedback: string) => void
  onReject: (id: string, feedback: string) => void
  onClose: () => void
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function ReviewPanel({
  submission,
  processingId,
  adminFeedback,
  checkedCriteria,
  artifactDecisions,
  onFeedbackChange,
  onCriteriaToggle,
  onArtifactDecision,
  onApprove,
  onNeedsRevision,
  onReject,
  onClose,
}: ReviewPanelProps) {
  const isProcessing = processingId === submission.id
  const artifacts = submission.artifacts ?? []
  const criteria = getReviewCriteria(submission.mission)
  const rejectedCount = Object.values(artifactDecisions).filter(d => d.status === "REJECTED").length

  return (
    <div className="rounded-2xl border border-primary/20 bg-zinc-900/60 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-lg">{submission.mission.title}</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {submission.user.name}
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

          {/* Artefacts (multi-preuves) ou livrable unique legacy */}
          {artifacts.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Artefacts ({artifacts.length})
                {rejectedCount > 0 && (
                  <span className="ml-2 text-amber-400">{rejectedCount} refusé{rejectedCount > 1 ? "s" : ""}</span>
                )}
              </p>
              {artifacts.map((artifact) => {
                const decision = artifactDecisions[artifact.key]
                const status = decision?.status ?? artifact.status
                return (
                  <div
                    key={artifact.key}
                    className={`p-4 rounded-xl border space-y-2 ${
                      status === "REJECTED"
                        ? "border-red-500/30 bg-red-500/5"
                        : status === "ACCEPTED"
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-200">{artifact.label}</p>
                      <span className="text-3xs font-mono uppercase tracking-wider text-muted-foreground">
                        {artifact.type}
                      </span>
                    </div>
                    {artifact.value && isHttpUrl(artifact.value) ? (
                      <a
                        href={artifact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-primary hover:underline break-all"
                      >
                        {artifact.value}
                      </a>
                    ) : artifact.value ? (
                      <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-words bg-black/40 border border-white/5 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {artifact.value}
                      </pre>
                    ) : null}
                    {artifact.fileUrl && (
                      <a
                        href={artifact.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-primary hover:underline break-all"
                      >
                        📎 {artifact.fileName ?? artifact.fileUrl}
                      </a>
                    )}
                    {artifact.reviewerNote && (
                      <p className="text-xs text-amber-300/80 italic">&ldquo;{artifact.reviewerNote}&rdquo;</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onArtifactDecision(artifact.key, { status: "ACCEPTED", note: "" })}
                        className={`px-3 py-1.5 rounded-lg text-3xs font-mono uppercase tracking-wider border transition-all ${
                          status === "ACCEPTED"
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 text-zinc-500 hover:border-emerald-500/30"
                        }`}
                      >
                        ✓ Accepter
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          onArtifactDecision(artifact.key, { status: "REJECTED", note: decision?.note ?? "" })
                        }
                        className={`px-3 py-1.5 rounded-lg text-3xs font-mono uppercase tracking-wider border transition-all ${
                          status === "REJECTED"
                            ? "border-red-500/50 bg-red-500/10 text-red-300"
                            : "border-white/10 text-zinc-500 hover:border-red-500/30"
                        }`}
                      >
                        ✕ Refuser
                      </button>
                      {decision && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => onArtifactDecision(artifact.key, null)}
                          className="text-3xs font-mono text-zinc-600 hover:text-zinc-300"
                        >
                          annuler
                        </button>
                      )}
                    </div>
                    {status === "REJECTED" && (
                      <Textarea
                        placeholder="Pourquoi cet artefact est refusé ? (repris dans les notes de révision)"
                        className="bg-black/40 border-white/5 min-h-[60px] text-xs"
                        value={decision?.note ?? ""}
                        disabled={isProcessing}
                        onChange={(e) =>
                          onArtifactDecision(artifact.key, { status: "REJECTED", note: e.target.value })
                        }
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Livrable principal</p>
              <SubmissionContent
                content={submission.content}
                submissionMethod={submission.mission.submissionMethod}
                deliverables={submission.mission.deliverables}
                expanded
              />
            </div>
          )}

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
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {criteria[0]?.id.startsWith("lab-") ? "Critères du labo" : "Rubrique d'évaluation"}
        </p>
        {criteria.map(criterion => (
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
