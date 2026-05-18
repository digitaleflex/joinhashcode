"use client"

import { useState, useEffect } from "react"
import { Check, X, ExternalLink, User, Activity, Loader2, ArrowLeft } from "lucide-react"
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

interface Submission {
  id: string
  status: string
  content: string | null
  projectDescription: string | null
  createdAt: string
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
  }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null)
  const [adminFeedback, setAdminFeedback] = useState("")
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({})

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/submissions")
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les soumissions.",
          variant: "destructive",
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleAction = async (
    id: string,
    action: "APPROVE" | "REJECT" | "NEEDS_REVISION",
    options?: { criteria?: Record<string, boolean>; feedback?: string; qualityLevel?: string }
  ) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: options?.feedback,
          qualityLevel: options?.qualityLevel,
          revisionNotes: options?.criteria && activeSubmission
            ? getCriteriaForMission(activeSubmission.mission.category)
                .filter(c => c.weight === "REQUIRED" && !options.criteria![c.id])
                .map(c => c.label)
                .join("\n")
            : undefined,
        }),
      })
      if (res.ok) {
        toast({
          title: action === "APPROVE" ? "Validée" : action === "NEEDS_REVISION" ? "Révision demandée" : "Refusée",
          description: `Soumission ${action === "APPROVE" ? "approuvée" : action === "NEEDS_REVISION" ? "mise en révision" : "rejetée"} avec succès.`,
        })
        setSubmissions(s => s.filter(sub => sub.id !== id))
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header consistent with admin dashboard */}
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Activity className="h-3 w-3 text-primary" />
          </div>
          <span className="font-mono text-sm font-bold text-white">HASHCODE · ADMIN · SUBMISSIONS</span>
        </div>
        <a href="/admin" className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
          <ArrowLeft className="h-3 w-3" /> Retour Admin
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Validation des Missions</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Révise les soumissions en attente et valide la progression des membres.
          </p>
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
              <h3 className="font-medium">Aucune soumission en attente</h3>
              <p className="text-sm text-muted-foreground">Tout est à jour. Bon travail !</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSubmissions} className="border-white/10 text-[10px] uppercase font-mono tracking-widest">
              Actualiser
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Membre</TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Mission</TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Détails</TableHead>
                    <TableHead className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-right">Actions</TableHead>
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
                            <p className="text-sm font-medium">{s.user.name}</p>
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
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={s.content || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate block"
                            >
                              {s.content}
                            </a>
                          </div>
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
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-primary/20 text-primary hover:bg-primary/10 font-mono text-[9px] uppercase tracking-widest"
                          onClick={() => {
                            setActiveSubmission(s)
                            setCheckedCriteria({})
                            setAdminFeedback("")
                          }}
                          disabled={processingId === s.id}
                        >
                          Réviser
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {activeSubmission && (
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
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Soumission</p>
                    <a
                      href={activeSubmission.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {activeSubmission.content} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Rubrique d&apos;évaluation</p>
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
                        <span className="ml-auto text-[9px] font-mono text-primary/40 uppercase tracking-widest">bonus</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Feedback</label>
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
    </div>
  )
}
