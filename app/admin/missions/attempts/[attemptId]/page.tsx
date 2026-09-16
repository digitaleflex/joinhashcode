"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Send,
  MessageSquare,
  History,
  FileText,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { StepField } from "@/lib/onboarding-mission";

interface StepReview {
  stepId: string;
  stepOrder: number;
  key: string;
  title: string;
  description: string;
  fields: StepField[];
  scoreMax: number;
  data: Record<string, unknown>;
  status: string;
  score: number | null;
  feedback: string | null;
  reviewedAt: string | null;
}

interface AttemptDetail {
  id: string;
  status: string;
  currentStep: number;
  score: number | null;
  decision: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  user: { id: string; name: string; pseudo: string | null; email: string; image: string | null; class: string | null; level: number };
  mission: { id: string; title: string; slug: string; xp: number; category: string; description: string; shortDesc: string };
  reviewer: { id: string; name: string; pseudo: string | null } | null;
  scoringGrid: { key: string; label: string; max: number }[] | null;
  maxScore: number;
  stepResponses: StepReview[];
  timeline: { action: string; message: string | null; actorId: string | null; createdAt: string }[];
}

function renderFieldValue(field: StepField, value: unknown) {
  if (value === undefined || value === null || value === "") return <span className="text-zinc-700">—</span>;
  if (field.type === "DYNAMIC_TABLE") {
    if (!Array.isArray(value) || value.length === 0) return <span className="text-zinc-700">—</span>;
    return (
      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/40 bg-card/20">
              {(field.columns ?? []).map((col) => (
                <th key={col.key} className="px-2 py-1 font-medium text-zinc-500 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(value as Record<string, string>[]).map((row, i) => (
              <tr key={i} className="border-b border-border/20 last:border-0">
                {(field.columns ?? []).map((col) => (
                  <td key={col.key} className="px-2 py-1 text-zinc-300 whitespace-pre-wrap">{row[col.key] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (typeof value === "string") return <span className="whitespace-pre-wrap">{value}</span>;
  if (Array.isArray(value)) {
    if (field.type === "SKILLS") {
      return (
        <div className="flex flex-wrap gap-1.5">
          {(value as { name?: string; level?: string }[]).map((s, i) => (
            <Badge key={i} variant="outline" className="text-xs font-mono bg-primary/5 border-primary/20 text-zinc-300">
              {s.name} · {s.level}
            </Badge>
          ))}
        </div>
      );
    }
    if (value.length === 0) return <span className="text-zinc-700">—</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {(value as string[]).map((v, i) => (
          <Badge key={i} variant="outline" className="text-xs font-mono bg-primary/5 border-primary/20 text-zinc-300">
            {v}
          </Badge>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return (
      <div className="text-xs text-zinc-300 space-y-1">
        {Object.entries(obj).map(([k, v]) => (
          <div key={k}>
            <span className="text-zinc-500 font-mono text-xs uppercase">{k.replace(/_/g, " ")} : </span>
            {typeof v === "object" && v ? JSON.stringify(v) : String(v ?? "—")}
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}

export default function AdminAttemptDetailPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const [detail, setDetail] = React.useState<AttemptDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [action, setAction] = React.useState<"APPROVE" | "NEEDS_REVISION" | "REJECT">("APPROVE");
  const [feedback, setFeedback] = React.useState("");
  const [gridScores, setGridScores] = React.useState<Record<string, number>>({});
  const [stepScores, setStepScores] = React.useState<Record<string, { score: number; feedback: string; status: string }>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/missions/attempts/${params.attemptId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDetail(data.attempt);
        // Initialiser les scores par étape
        const init: Record<string, { score: number; feedback: string; status: string }> = {};
        for (const s of data.attempt.stepResponses) {
          init[s.stepId] = {
            score: s.score ?? (s.scoreMax > 0 ? Math.round((s.scoreMax / 5) * 3) : 0),
            feedback: s.feedback ?? "",
            status: s.status === "REVISION_REQUIRED" ? "REVISION_REQUIRED" : "APPROVED",
          };
        }
        setStepScores(init);
      } catch {
        toast.error("Impossible de charger la tentative");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.attemptId]);

  const computeTotal = () => {
    if (!detail?.scoringGrid) return 0;
    let total = 0;
    for (const c of detail.scoringGrid) total += Math.min(c.max, Math.max(0, gridScores[c.key] ?? 0));
    return total;
  };

  const handleDecision = async () => {
    if (!detail) return;
    if (action !== "APPROVE" && !feedback.trim()) {
      toast.error(action === "NEEDS_REVISION" ? "Une raison est obligatoire pour demander une révision" : "Une justification est obligatoire pour rejeter");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/missions/attempts/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: feedback.trim() || undefined,
          score: computeTotal(),
          gridScores,
          stepScores,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Erreur lors de la décision");
        return;
      }
      toast.success(action === "APPROVE" ? "Mission approuvée — Profile v1 généré" : action === "NEEDS_REVISION" ? "Révision demandée" : "Mission rejetée");
      router.refresh();
      await new Promise((r) => setTimeout(r, 800));
      window.location.reload();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!detail) return null;

  const submitted = ["SUBMITTED", "IN_REVIEW", "REVISION_REQUIRED"].includes(detail.status);
  const approved = detail.status === "APPROVED";
  const rejected = detail.status === "REJECTED";
  const canReview = submitted;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <Link href="/admin/missions/attempts" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-primary mb-2">
            <ChevronLeft className="w-3.5 h-3.5" /> RETOUR AUX REVIEWS
          </Link>
          <h1 className="text-2xl font-mono font-bold text-primary tracking-tighter uppercase">
            {detail.user.name} — {detail.mission.title}
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">{detail.mission.title}</p>
        </div>
        <Badge variant="outline" className={`text-xs uppercase font-mono ${STATUS_META[detail.status]}`}>
          {STATUS_META[detail.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        {/* LEFT : réponses par étape */}
        <div className="space-y-6 min-w-0">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-mono uppercase text-primary tracking-wider">Réponses du membre</h2>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          <Accordion type="multiple" defaultValue={detail.stepResponses.map((s) => s.stepId)} className="space-y-3">
            {detail.stepResponses.map((step) => {
              const review = stepScores[step.stepId] ?? { score: 0, feedback: "", status: "APPROVED" };
              return (
                <AccordionItem key={step.stepId} value={step.stepId} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden px-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xs font-mono text-primary/50">ÉTAPE {step.stepOrder + 1}</span>
                      <span className="text-sm font-semibold text-white flex-1">{step.title}</span>
                      {step.status === "REVISION_REQUIRED" ? (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-3xs font-mono">RÉVISION</Badge>
                      ) : step.status === "APPROVED" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-3xs font-mono">VALIDÉE</Badge>
                      ) : (
                        <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-3xs font-mono">{step.status}</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {step.fields.map((field) => (
                        <div key={field.key} className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
                          <Label className="text-xs font-mono text-zinc-500 uppercase">{field.label}</Label>
                          <div className="mt-1.5 text-sm text-zinc-300">{renderFieldValue(field, step.data[field.key])}</div>
                        </div>
                      ))}

                      {canReview && (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono text-zinc-500 uppercase">Review de l'étape</span>
                            {step.scoreMax > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400" />
                                <Input
                                  type="number"
                                  min={0}
                                  max={5}
                                  value={review.score}
                                  onChange={(e) => setStepScores((p) => ({ ...p, [step.stepId]: { ...p[step.stepId], score: Number(e.target.value) } }))}
                                  className="w-16 h-8 text-xs text-center"
                                />
                                <span className="text-xs font-mono text-zinc-500">/5</span>
                              </div>
                            )}
                          </div>
                          <RadioGroup
                            value={review.status}
                            onValueChange={(v) => setStepScores((p) => ({ ...p, [step.stepId]: { ...p[step.stepId], status: v } }))}
                            className="flex gap-4"
                          >
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <RadioGroupItem value="APPROVED" id={`ok-${step.stepId}`} className="peer sr-only" />
                              <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono ${review.status === "APPROVED" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-500"}`}>✓ Valider</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <RadioGroupItem value="REVISION_REQUIRED" id={`rev-${step.stepId}`} className="peer sr-only" />
                              <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono ${review.status === "REVISION_REQUIRED" ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-zinc-700 text-zinc-500"}`}>Demander correction</span>
                            </label>
                          </RadioGroup>
                          <Textarea
                            value={review.feedback}
                            onChange={(e) => setStepScores((p) => ({ ...p, [step.stepId]: { ...p[step.stepId], feedback: e.target.value } }))}
                            placeholder={`Commentaire pour l'étape « ${step.title} »...`}
                            className="bg-zinc-950/60 border-zinc-800 text-xs min-h-[70px]"
                          />
                        </div>
                      )}

                      {!canReview && step.feedback && (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-500 uppercase">Commentaire</span>
                          </div>
                          <p className="text-xs text-zinc-300 whitespace-pre-wrap">{step.feedback}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* RIGHT : panel de review */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Grille de scoring */}
          {detail.scoringGrid && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Score global</span>
                </div>
                <Badge variant="outline" className="font-mono text-primary text-xs">{computeTotal()}/{detail.maxScore}</Badge>
              </div>
              <div className="space-y-3">
                {detail.scoringGrid.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-zinc-400 flex-1">{c.label}</span>
                    <Input
                      type="number"
                      min={0}
                      max={c.max}
                      disabled={!canReview}
                      value={gridScores[c.key] ?? 3}
                      onChange={(e) => setGridScores((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
                      className="w-16 h-8 text-xs text-center"
                    />
                    <span className="text-xs font-mono text-zinc-600 w-4">/{c.max}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">Total</span>
                <span className="text-lg font-mono font-bold text-primary">{computeTotal()}/{detail.maxScore}</span>
              </div>
            </div>
          )}

          {/* Décision */}
          {canReview ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Décision</span>
              </div>
              <RadioGroup value={action} onValueChange={(v) => setAction(v as typeof action)} className="space-y-2">
                {[
                  { value: "APPROVE" as const, label: "Approuver", desc: "Valide le profil et génère le Profile v1", icon: CheckCircle2, color: "text-emerald-500" },
                  { value: "NEEDS_REVISION" as const, label: "Demander une correction", desc: "Le membre corrige puis resoumet", icon: AlertTriangle, color: "text-amber-500" },
                  { value: "REJECT" as const, label: "Rejeter", desc: "À utiliser uniquement si nécessaire", icon: XCircle, color: "text-red-500" },
                ].map((opt) => (
                  <label key={opt.value} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${action === opt.value ? "border-primary/40 bg-primary/5" : "border-zinc-800 bg-zinc-900/40"}`}>
                    <RadioGroupItem value={opt.value} id={`dec-${opt.value}`} className="peer sr-only" />
                    <opt.icon className={`w-4 h-4 mt-0.5 ${opt.color}`} />
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-white">{opt.label}</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={action === "NEEDS_REVISION" ? "Explique précisément ce qui doit être corrigé (obligatoire)..." : "Feedback pour le membre (optionnel)..."}
                className="bg-zinc-950/60 border-zinc-800 text-xs min-h-[100px]"
              />
              <Button onClick={handleDecision} disabled={saving} className="w-full bg-primary text-black font-mono text-xs uppercase tracking-wider gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {action === "APPROVE" ? "Valider la mission" : action === "NEEDS_REVISION" ? "Demander une correction" : "Rejeter la mission"}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-center">
              {approved ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-mono text-emerald-400">Mission validée</p>
                  {detail.score != null && <p className="text-xs font-mono text-zinc-500 mt-1">Score : {detail.score}/{detail.maxScore} · Profile v1 généré</p>}
                </>
              ) : rejected ? (
                <>
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-mono text-red-400">Mission rejetée</p>
                </>
              ) : (
                <p className="text-sm text-zinc-500">Brouillon — le membre n'a pas encore soumis.</p>
              )}
            </div>
          )}

          {/* Timeline */}
          {detail.timeline.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Historique</span>
              </div>
              <div className="space-y-3">
                {detail.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-300">{t.message ?? t.action}</p>
                      <p className="text-xs font-mono text-zinc-600 mt-0.5">
                        {t.createdAt ? new Date(t.createdAt).toLocaleString("fr-FR") : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_META: Record<string, string> = {
  DRAFT: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_REVIEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REVISION_REQUIRED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};
