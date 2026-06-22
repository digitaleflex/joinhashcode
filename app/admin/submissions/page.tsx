"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { SubmissionsTable } from "@/components/admin/submissions/submissions-table"
import { ReviewPanel } from "@/components/admin/submissions/review-panel"

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
  userFeedback: string | null
  userDifficulty: number | null
  userRating: number | null
  improvementSuggestions: string | null
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
          <SubmissionsTable
            submissions={submissions}
            activeTab={activeTab}
            processingId={processingId}
            onReview={(s) => {
              setActiveSubmission(s)
              setCheckedCriteria({})
              setAdminFeedback("")
            }}
          />

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
            <ReviewPanel
              submission={activeSubmission}
              processingId={processingId}
              adminFeedback={adminFeedback}
              checkedCriteria={checkedCriteria}
              onFeedbackChange={setAdminFeedback}
              onCriteriaToggle={(id) => setCheckedCriteria(prev => ({ ...prev, [id]: !prev[id] }))}
              onApprove={(id, criteria, feedback, qualityLevel) => handleAction(id, "APPROVE", {
                criteria,
                feedback,
                qualityLevel,
              })}
              onNeedsRevision={(id, criteria, feedback) => handleAction(id, "NEEDS_REVISION", {
                criteria,
                feedback,
              })}
              onReject={(id, feedback) => handleAction(id, "REJECT", { feedback })}
              onClose={() => setActiveSubmission(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}
