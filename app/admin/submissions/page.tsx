"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, X, ExternalLink, User, Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCriteriaForMission, computeQualityLevel } from "@/lib/acceptance-criteria"
import Link from "next/link"

interface Submission {
  id: string
  status: string
  content: string | null
  projectDescription: string | null
  createdAt: string
  updatedAt: string
  qualityLevel: string | null
  xpAwarded: number | null
  adminFeedback: string | null
  revisionNotes: string | null
  revisionCount: number
  user: {
    id: string
    name: string
    email: string
    level: number
  }
  mission: {
    title: string
    category: string
    xp: number
    submissionMethod: string
    deliverables: string[]
  }
}

const URL_METHODS = ["ANY_LINK", "LIVE_URL", "DOCUMENT_LINK", "GITHUB_REPO", "GITHUB_LINK"]

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function SubmissionContent({
  content,
  submissionMethod,
  deliverables,
  expanded = false,
}: {
  content: string | null
  submissionMethod: string
  deliverables?: string[]
  expanded?: boolean
}) {
  if (!content) return <span className="text-xs text-muted-foreground italic">Aucun contenu</span>

  if (URL_METHODS.includes(submissionMethod) && isValidUrl(content)) {
    return (
      <div className="flex items-center gap-2">
        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-primary hover:underline ${expanded ? "break-all" : "truncate block max-w-xs"}`}
        >
          {content}
        </a>
      </div>
    )
  }

  if (expanded) {
    return (
      <div className="space-y-3">
        {deliverables && deliverables.length > 0 && (
          <div className="space-y-1">
            <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Livrables attendus</p>
            <ul className="space-y-0.5">
              {deliverables.map((d, i) => (
                <li key={i} className="text-[11px] text-zinc-500 font-mono">— {d}</li>
              ))}
            </ul>
          </div>
        )}
        <pre className="text-sm text-zinc-200 whitespace-pre-wrap break-words font-sans leading-relaxed bg-white/3 border border-white/5 rounded-xl p-4">
          {content}
        </pre>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <FileText className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{content}</p>
    </div>
  )
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  PENDING_ADMIN: { label: "Admin requis", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  IN_REVIEW: { label: "En revue", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  APPROVED: { label: "Approuvé", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejeté", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  NEEDS_REVISION: { label: "Révision", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" }
  return (
    <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter font-mono ${meta.className}`}>
      {meta.label}
    </Badge>
  )
}

export default function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 50
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null)
  const [adminFeedback, setAdminFeedback] = useState("")
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({})

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ tab: activeTab, page: String(page), limit: String(limit) })
      const res = await fetch(`/api/admin/submissions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions ?? [])
        setTotal(data.total ?? 0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [activeTab, page])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  // reset page on tab switch
  useEffect(() => {
    setPage(1)
    setActiveSubmission(null)
  }, [activeTab])

  const handleAction = async (id: string, action: string, details: Record<string, unknown>) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...details }),
      })

      if (res.ok) {
        toast({ title: "Succès", description: "Action enregistrée avec succès" })
        setSubmissions(prev => prev.filter(s => s.id !== id))
        setActiveSubmission(null)
        setAdminFeedback("")
        setCheckedCriteria({})
      } else {
        const err = await res.text()
        toast({ title: "Erreur", description: err, variant: "destructive" })
      }
    } catch (e) {
      console.error(e)
      toast({ title: "Erreur réseau", variant: "destructive" })
    } finally {
      setProcessingId(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Soumissions</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Révise les soumissions en attente et consulte l&apos;historique des décisions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/60 border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all ${
            activeTab === "pending"
              ? "bg-primary text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all ${
            activeTab === "history"
              ? "bg-primary text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Historique
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Chargement des données neuronal...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Check className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">
              {activeTab === "pending" ? "Aucune soumission en attente" : "Aucun historique"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === "pending" ? "Tout est à jour. Bon travail !" : "Pas encore de décisions enregistrées."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSubmissions} className="border-white/10 text-[10px] uppercase font-mono tracking-wider">
            Actualiser
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Membre</TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Mission</TableHead>
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Contenu</TableHead>
                  {activeTab === "history" && (
                    <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Décision</TableHead>
                  )}
                  <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-right">
                    {activeTab === "pending" ? "Actions" : "Date"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow key={s.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center border border-white/10">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${s.user.id}`}
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            {s.user.name}
                          </Link>
                          <p className="text-[10px] text-muted-foreground font-mono">LVL {s.user.level} · {s.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{s.mission.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-primary/5 text-primary border-primary/20 font-mono">
                            {s.mission.category}
                          </Badge>
                          <span className="text-[10px] text-[#B8FF3B] font-mono">+{s.mission.xp} XP</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-1.5">
                        <SubmissionContent
                          content={s.content}
                          submissionMethod={s.mission.submissionMethod}
                        />
                        {s.projectDescription && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                            &ldquo;{s.projectDescription}&rdquo;
                          </p>
                        )}
                        <p className="text-[9px] text-muted-foreground/60 font-mono">
                          Soumis le {new Date(s.createdAt).toLocaleDateString()} à {new Date(s.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    {activeTab === "history" && (
                      <TableCell>
                        <div className="space-y-1.5">
                          <StatusBadge status={s.status} />
                          {s.status === "APPROVED" && s.qualityLevel && s.qualityLevel !== "STANDARD" && (
                            <p className="text-[9px] font-mono text-primary/70">
                              {s.qualityLevel === "EXEMPLARY" ? "⭐ Exemplaire" : "✦ Très bon"}
                              {s.xpAwarded != null && ` · +${s.xpAwarded} XP`}
                            </p>
                          )}
                          {s.status === "APPROVED" && s.xpAwarded != null && s.qualityLevel === "STANDARD" && (
                            <p className="text-[9px] font-mono text-zinc-500">+{s.xpAwarded} XP</p>
                          )}
                          {s.adminFeedback && (
                            <p className="text-[10px] text-zinc-400 line-clamp-2 italic max-w-[200px]">
                              &ldquo;{s.adminFeedback}&rdquo;
                            </p>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {activeTab === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-primary/20 text-primary hover:bg-primary/10 font-mono text-[9px] uppercase tracking-wider"
                          onClick={() => {
                            setActiveSubmission(s)
                            setCheckedCriteria({})
                            setAdminFeedback("")
                          }}
                          disabled={processingId === s.id}
                        >
                          Réviser
                        </Button>
                      ) : (
                        <p className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                          {new Date(s.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination (history only) */}
          {activeTab === "history" && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground font-mono">
                {(page - 1) * limit + 1}–{Math.min(page * limit, total)} sur {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-white/10"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-white/10"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Review panel (pending tab only) */}
          {activeTab === "pending" && activeSubmission && (
            <div className="rounded-2xl border border-primary/20 bg-zinc-900/60 p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-lg">{activeSubmission.mission.title}</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {activeSubmission.user.name} · LVL {activeSubmission.user.level}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="text-xs font-mono text-muted-foreground hover:text-white"
                >
                  ✕ Fermer
                </button>
              </div>

              {activeSubmission.content && (
                <div className="space-y-6">
                  {/* Context Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSubmission.projectDescription && (
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                        <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Description du projet</p>
                        <p className="text-sm text-zinc-300 leading-relaxed italic">
                          &ldquo;{activeSubmission.projectDescription}&rdquo;
                        </p>
                      </div>
                    )}
                    {(activeSubmission as any).userFeedback && (
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                        <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Feedback membre</p>
                        <p className="text-sm text-zinc-300 leading-relaxed italic">
                          &ldquo;{(activeSubmission as any).userFeedback}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          {(activeSubmission as any).userDifficulty && (
                            <span className="text-[10px] font-mono text-amber-400">DIFF: {(activeSubmission as any).userDifficulty}/5</span>
                          )}
                          {(activeSubmission as any).userRating && (
                            <span className="text-[10px] font-mono text-primary">RATING: {(activeSubmission as any).userRating}/5</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Deliverable */}
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Livrable principal</p>
                    <SubmissionContent
                      content={activeSubmission.content}
                      submissionMethod={activeSubmission.mission.submissionMethod}
                      deliverables={activeSubmission.mission.deliverables}
                      expanded
                    />
                  </div>

                  {(activeSubmission as any).improvementSuggestions && (
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-blue-400/60">Suggestions d&apos;amélioration système</p>
                      <p className="text-xs text-zinc-400 leading-relaxed italic">
                        &ldquo;{(activeSubmission as any).improvementSuggestions}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Rubrique d&apos;évaluation</p>
                {getCriteriaForMission(activeSubmission.mission.category).map(criterion => (
                  <button
                    key={criterion.id}
                    type="button"
                    onClick={() => setCheckedCriteria(prev => ({ ...prev, [criterion.id]: !prev[criterion.id] }))}
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
                      <span className="ml-auto text-[9px] font-mono text-primary/40 uppercase tracking-wider">bonus</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Feedback</label>
                <Textarea
                  placeholder="Commentaire pour le membre..."
                  className="bg-black/40 border-white/5 min-h-[100px] text-sm"
                  value={adminFeedback}
                  onChange={e => setAdminFeedback(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    const criteria = getCriteriaForMission(activeSubmission.mission.category)
                    const quality = computeQualityLevel(criteria, checkedCriteria)
                    handleAction(activeSubmission.id, "APPROVE", {
                      criteria: checkedCriteria,
                      feedback: adminFeedback,
                      qualityLevel: quality,
                    })
                  }}
                  disabled={processingId === activeSubmission.id}
                >
                  {processingId === activeSubmission.id
                    ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    : <Check className="w-4 h-4 mr-2" />
                  }
                  Valider
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => handleAction(activeSubmission.id, "NEEDS_REVISION", {
                    criteria: checkedCriteria,
                    feedback: adminFeedback,
                  })}
                  disabled={processingId === activeSubmission.id || !adminFeedback.trim()}
                >
                  Demander révision
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleAction(activeSubmission.id, "REJECT", { feedback: adminFeedback })}
                  disabled={processingId === activeSubmission.id || !adminFeedback.trim()}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
