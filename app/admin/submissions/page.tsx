"use client"

import { useState, useEffect } from "react"
import { Check, X, ExternalLink, User, Zap, Activity, MessageSquare, Loader2, ArrowLeft } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

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
  const [rejectFeedback, setRejectFeedback] = useState("")
  const [rejectId, setRejectId] = useState<string | null>(null)

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

  const handleAction = async (id: string, action: "APPROVE" | "REJECT", feedback?: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback }),
      })

      if (res.ok) {
        toast({
          title: action === "APPROVE" ? "Validée" : "Refusée",
          description: `La soumission a été ${action === "APPROVE" ? "approuvée" : "rejetée"} avec succès.`,
        })
        setSubmissions(submissions.filter((s) => s.id !== id))
        if (action === "REJECT") {
          setRejectId(null)
          setRejectFeedback("")
        }
      } else {
        const err = await res.text()
        toast({
          title: "Erreur",
          description: err || "Une erreur est survenue.",
          variant: "destructive",
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Erreur",
        description: "Une erreur réseau est survenue.",
        variant: "destructive",
      })
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
                            "{s.projectDescription}"
                          </p>
                        )}
                        <p className="text-[9px] text-muted-foreground/60 font-mono">
                          Soumis le {new Date(s.createdAt).toLocaleDateString()} à {new Date(s.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                          onClick={() => handleAction(s.id, "APPROVE")}
                          disabled={processingId === s.id}
                        >
                          {processingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>

                        <Dialog open={rejectId === s.id} onOpenChange={(open) => !open && setRejectId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => setRejectId(s.id)}
                              disabled={processingId === s.id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-900 border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-red-500" /> Refuser la soumission
                              </DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Explique au membre pourquoi sa soumission a été rejetée et ce qu'il peut améliorer.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Textarea
                                placeholder="Ton feedback ici..."
                                className="bg-black/40 border-white/5 focus:border-red-500/50 min-h-[120px]"
                                value={rejectFeedback}
                                onChange={(e) => setRejectFeedback(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setRejectId(null)} className="text-muted-foreground hover:text-white">
                                Annuler
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleAction(s.id, "REJECT", rejectFeedback)}
                                disabled={!rejectFeedback.trim() || processingId === s.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {processingId === s.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Confirmer le rejet
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
