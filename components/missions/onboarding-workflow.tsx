"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Check,
  AlertTriangle,
  Sparkles,
  FileText,
  ListChecks,
  Wrench,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computeCriteriaScore } from "@/lib/criteria-score";
import type {
  StepField,
  MissionStepDef,
} from "@/lib/onboarding-mission";

type StepStatus = "DRAFT" | "APPROVED" | "REVISION_REQUIRED";

interface StepDTO {
  key: string;
  title: string;
  shortTitle: string;
  description: string;
  stepOrder: number;
  fields: StepField[];
  status: StepStatus;
  completeness: number;
}

interface StepResponseDTO {
  stepId: string;
  stepKey: string;
  status: StepStatus;
  data: Record<string, unknown>;
  score: number | null;
  feedback: string | null;
}

interface AttemptDTO {
  id: string;
  status: string;
  currentStep: number;
  score: number | null;
  decision: string | null;
  reviewerId: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  stepResponses: StepResponseDTO[];
}

interface MissionState {
  missionId: string;
  slug: string;
  title: string;
  shortDesc?: string | null;
  duration?: string | null;
  category?: string | null;
  missionLevel?: string | null;
  xpReward?: number | null;
  maxScore?: number | null;
  steps: StepDTO[];
  attempt: AttemptDTO | null;
  timeline: { action: string; message: string | null; createdAt: string }[];
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  SUBMITTED: { label: "Soumise", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  IN_REVIEW: { label: "En revue", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  REVISION_REQUIRED: { label: "Révision requise", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "Validée", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejetée", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function OnboardingWorkflow({ missionSlug }: { missionSlug: string }) {
  const router = useRouter();
  const [state, setState] = React.useState<MissionState | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [drafts, setDrafts] = React.useState<Record<string, Record<string, unknown>>>({});
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitting, setSubmitting] = React.useState(false);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/missions/${missionSlug}/attempt`);
        if (!res.ok) throw new Error("load failed");
        const data = await res.json();
        setState(data);
        // Restaurer les brouillons
        const restored: Record<string, Record<string, unknown>> = {};
        if (data.attempt?.stepResponses) {
          for (const r of data.attempt.stepResponses) {
            restored[r.stepKey] = r.data ?? {};
          }
        }
        setDrafts(restored);
        // Positionner sur la première étape non complétée ou l'étape courante
        const firstIncomplete = data.steps.findIndex((s: StepDTO) => s.status !== "APPROVED");
        const target = data.attempt?.status === "DRAFT"
          ? (firstIncomplete >= 0 ? firstIncomplete : 0)
          : (data.attempt?.currentStep ?? 0);
        setActiveIndex(Math.min(target, (data.steps.length || 1) - 1));
      } catch {
        toast.error("Impossible de charger la mission");
      } finally {
        setLoading(false);
      }
    })();
  }, [missionSlug]);

  const activeStep = state?.steps[activeIndex];

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    if (!activeStep) return;
    const next = { ...drafts, [activeStep.key]: { ...(drafts[activeStep.key] ?? {}), [fieldKey]: value } };
    setDrafts(next);
    setSaveState("saving");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/missions/${missionSlug}/attempt`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stepKey: activeStep.key, data: next[activeStep.key] ?? {} }),
        });
        if (!res.ok) throw new Error("save failed");
        setSaveState("saved");
        await refreshState();
      } catch {
        setSaveState("error");
      }
    }, 800);
  };

  const refreshState = async () => {
    const res = await fetch(`/api/missions/${missionSlug}/attempt`);
    if (!res.ok) return;
    const data = await res.json();
    setState(data);
  };

  const handleSubmit = async () => {
    if (!state) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/missions/${missionSlug}/attempt/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body.incomplete) {
          toast.error(`Étapes incomplètes : ${body.incomplete.join(", ")}`);
        } else {
          toast.error(body.error ?? "Erreur lors de la soumission");
        }
        return;
      }
      toast.success("Mission soumise ! Elle est maintenant en cours de revue.");
      await refreshState();
      router.refresh();
    } catch {
      toast.error("Erreur réseau lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!state) return null;

  const attempt = state.attempt;
  const submitted = attempt && ["SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED"].includes(attempt.status);
  const approved = attempt?.status === "APPROVED";
  const revision = attempt?.status === "REVISION_REQUIRED";
  const lockedAll = submitted && !revision;

  const completedSteps = state.steps.filter((s) => s.status === "APPROVED").length;
  const progressPct = state.steps.length === 0 ? 0 : Math.round((completedSteps / state.steps.length) * 100);
  const locked = lockedAll ? true : activeStep?.status === "APPROVED" && !revision;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
              {state.missionLevel ?? "MISSION"} · {state.category ?? "MISSION"}
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-1">{state.title}</h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {state.duration ?? "Durée estimée"} · Applicable à tous les profils
            </p>
          </div>
          {attempt && (
            <Badge variant="outline" className={`text-[10px] uppercase font-mono ${STATUS_BADGE[attempt.status]?.className}`}>
              {STATUS_BADGE[attempt.status]?.label}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Progression</span>
            <span>{completedSteps} / {state.steps.length} étapes</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </div>

      {/* Approved state */}
      {approved && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-400 font-mono uppercase tracking-wide">Mission validée</h3>
            {attempt.score != null && (
              <p className="text-xs text-emerald-400/70 mt-1 font-mono">
                Score : {attempt.score}/{state.maxScore ?? 25} · Profil HashCode enrichi
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => router.push("/missions")} className="gap-2">
            Retour aux missions <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Revision notice */}
      {revision && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-400">Révision demandée</p>
            <p className="text-xs text-zinc-400">
              L'équipe HashCode a demandé des modifications. Corrige les étapes concernées puis soumets à nouveau.
            </p>
            {attempt?.decision && (
              <p className="text-xs text-zinc-300 mt-2 border-l-2 border-amber-400/50 pl-3">{attempt.decision}</p>
            )}
          </div>
        </div>
      )}

      {/* Submitted state */}
      {submitted && !approved && !revision && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex items-start gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-400">Mission soumise</p>
            <p className="text-xs text-zinc-400">
              Ton profil est en cours de revue par l'équipe HashCode. Tu seras notifié dès la décision.
            </p>
          </div>
        </div>
      )}

      {lockedAll ? (
        <div className="rounded-2xl border border-border/40 bg-card/20 p-8 text-center">
          <Lock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Les réponses sont verrouillées tant que la mission est en cours de revue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Stepper */}
          <nav className="space-y-1 lg:sticky lg:top-6 lg:self-start">
            {state.steps.map((step, i) => {
              const active = i === activeIndex;
              const done = step.status === "APPROVED";
              return (
                <button
                  key={step.key}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                    active ? "bg-primary/10 border border-primary/20" : "border border-transparent hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0">
                    {done ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className={`text-[10px] font-mono w-4 h-4 inline-flex items-center justify-center rounded-full border ${active ? "border-primary text-primary" : "border-zinc-600 text-zinc-500"}`}>
                        {i + 1}
                      </span>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-xs font-medium truncate ${active ? "text-white" : "text-zinc-400"}`}>
                      {step.shortTitle}
                    </span>
                    <span className="block h-1 rounded-full bg-zinc-800 mt-1.5 overflow-hidden">
                      <span
                        className={`block h-full rounded-full transition-all ${step.completeness >= 1 ? "bg-emerald-500/70" : "bg-primary/50"}`}
                        style={{ width: `${Math.round(step.completeness * 100)}%` }}
                      />
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Step content */}
          <div className="space-y-5">
            {activeStep && (
              <div key={activeStep.key} className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-primary/50">ÉTAPE {activeStep.stepOrder + 1}</span>
                  <div className="flex-1 h-px bg-border/30" />
                  <SaveIndicator state={saveState} />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight">{activeStep.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{activeStep.description}</p>
                </div>

                {locked && !revision ? (
                  <div className="rounded-xl border border-border/30 bg-card/20 p-6 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-zinc-300">Cette étape est complétée et validée.</p>
                  </div>
                ) : (
                  <StepFields
                    step={activeStep}
                    data={drafts[activeStep.key] ?? {}}
                    onChange={handleFieldChange}
                  />
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    className="gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" /> Précédent
                  </Button>
                  {activeIndex < state.steps.length - 1 ? (
                    <Button size="sm" onClick={() => setActiveIndex((i) => Math.min(state.steps.length - 1, i + 1))} className="gap-1 text-xs">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="gap-1.5 text-xs bg-emerald-500 text-white hover:bg-emerald-500/90"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Soumettre ma mission
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Resume bar for revisions */}
            {revision && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">Étapes à corriger</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.steps.filter((s) => s.status === "REVISION_REQUIRED").map((s) => (
                    <Button key={s.key} variant="outline" size="sm" className="text-xs border-amber-500/30 text-amber-400" onClick={() => setActiveIndex(state.steps.indexOf(s))}>
                      {s.shortTitle}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  if (state === "saving") return <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Enregistrement...</span>;
  if (state === "saved") return <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Enregistré</span>;
  return <span className="text-[10px] font-mono text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Impossible d'enregistrer — réessaie</span>;
}

// ── Rendu des champs ─────────────────────────────────────────────────────────

function StepFields({
  step,
  data,
  onChange,
}: {
  step: MissionStepDef;
  data: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      {step.fields.map((field) => (
        <FieldRenderer key={field.key} field={field} value={data[field.key]} onChange={(v) => onChange(field.key, v)} />
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: StepField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (field.type) {
    case "TEXT":
      return (
        <FieldShell field={field}>
          <Input
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
            className="bg-zinc-900/60 border-border/60"
          />
        </FieldShell>
      );
    case "TEXTAREA":
      return (
        <FieldShell field={field}>
          <Textarea
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={field.minLines ?? 3}
            onChange={(e) => onChange(e.target.value)}
            className="bg-zinc-900/60 border-border/60 min-h-[100px]"
          />
          {field.maxLength && (
            <p className="text-[10px] font-mono text-zinc-600 text-right">{(value as string)?.length ?? 0}/{field.maxLength}</p>
          )}
        </FieldShell>
      );
    case "MULTI_SELECT":
      return (
        <FieldShell field={field}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(field.options ?? []).map((opt) => {
              const checked = Array.isArray(value) && value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const arr = Array.isArray(value) ? [...(value as string[])] : [];
                    const next = checked ? arr.filter((v) => v !== opt.value) : [...arr, opt.value];
                    onChange(next);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                    checked ? "border-primary/40 bg-primary/10 text-white" : "border-border/40 bg-card/20 text-zinc-400 hover:border-primary/20"
                  }`}
                >
                  <Checkbox checked={checked} />
                  <div className="min-w-0">
                    <span className="block font-medium">{opt.label}</span>
                    {opt.description ? (
                      <span className="block text-[10px] text-zinc-600 mt-0.5 leading-snug">{opt.description}</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
          {Array.isArray(value) && (
            <p className="text-[10px] font-mono text-primary/60 mt-2">{value.length} sélectionné{(value.length > 1) ? "s" : ""}</p>
          )}
        </FieldShell>
      );
    case "SELECT":
      return (
        <FieldShell field={field}>
          <Select value={(value as string) ?? ""} onValueChange={(v) => onChange(v)}>
            <SelectTrigger className="bg-zinc-900/60 border-border/60">
              <SelectValue placeholder="Choisis une option" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-border/60 text-white">
              {(field.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      );
    case "SKILLS":
      return <SkillFields field={field} value={value} onChange={onChange} />;
    case "ENV":
      return <EnvFields field={field} value={value} onChange={onChange} />;
    case "SLIDER":
      return <SliderField field={field} value={value} onChange={onChange} />;
    case "SCORED_CRITERIA":
      return <ScoredCriteriaField field={field} value={value} onChange={onChange} />;
    case "SOLUTIONS_TABLE":
      return <SolutionsTableField field={field} value={value} onChange={onChange} />;
    case "EISENHOWER":
      return <EisenhowerField field={field} value={value} onChange={onChange} />;
    case "ROADMAP":
      return <RoadmapField field={field} value={value} onChange={onChange} />;
    case "RISK_TABLE":
      return <RiskTableField field={field} value={value} onChange={onChange} />;
    case "SMART_GOALS":
      return <SmartGoalsField field={field} value={value} onChange={onChange} />;
    case "SYNTHESIS":
      return <SynthesisField field={field} value={value} onChange={onChange} />;
    case "DYNAMIC_TABLE":
      return <DynamicTableField field={field} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

const CONFIDENCE_OPTIONS = ["Faible", "Moyen", "Élevé"];

function SliderField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const min = field.min ?? 0;
  const max = field.max ?? 10;
  const num = typeof value === "number" ? value : min;
  return (
    <FieldShell field={field}>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>{min}</span>
          <span className="text-sm font-bold text-white">{num}/{max}</span>
          <span>{max}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={field.step ?? 1}
          value={num}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </FieldShell>
  );
}

function ScoredCriteriaField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const record = (value as Record<string, { score: number; justification: string; preuves: string; confiance: string }>) ?? {};
  const { total, max } = computeCriteriaScore(field, value);
  const setCriterion = (key: string, patch: Partial<Record<string, unknown>>) => {
    const raw = (record as Record<string, unknown>)[key];
    const prev: Record<string, unknown> = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const next: Record<string, unknown> = { ...prev };
    next["score"] = typeof next["score"] === "number" ? next["score"] : 0;
    next["justification"] = typeof next["justification"] === "string" ? next["justification"] : "";
    next["preuves"] = typeof next["preuves"] === "string" ? next["preuves"] : "";
    next["confiance"] = typeof next["confiance"] === "string" ? next["confiance"] : "Faible";
    for (const [k, v] of Object.entries(patch)) next[k] = v;
    onChange({ ...record, [key]: next });
  };

  const interpretation = (s: number) =>
    s <= 20 ? "Faible" : s <= 30 ? "À approfondir" : s <= 40 ? "Prometteur" : "Très fort";

  return (
    <FieldShell field={field}>
      <div className="space-y-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary/70">Score du problème</p>
          <p className="text-3xl font-bold font-mono text-white">{total}<span className="text-base text-zinc-500">/{max}</span></p>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${max > 0 ? Math.min(100, (total / max) * 100) : 0}%` }} />
          </div>
          <p className="text-xs font-medium text-primary">{interpretation(total)}</p>
          <p className="text-[10px] text-zinc-500 leading-snug">
            Ce score ne prouve pas que ton projet est viable. Il représente uniquement la force actuelle de ton hypothèse.
          </p>
        </div>

        {(field.criteria ?? []).map((c) => {
          const entry = record[c.key] ?? { score: 0, justification: "", preuves: "", confiance: "Faible" };
          return (
            <div key={c.key} className="rounded-xl border border-border/40 bg-card/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white uppercase tracking-wide text-[11px]">{c.label}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{c.question}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-mono font-bold text-white">{entry.score}/10</p>
                </div>
              </div>

              {(c.reflect ?? []).length > 0 && (
                <p className="text-[10px] text-zinc-600 flex flex-wrap gap-1">
                  {(c.reflect ?? []).map((r) => (
                    <span key={r} className="rounded-full bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5">{r}</span>
                  ))}
                </p>
              )}

              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Note</p>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={entry.score}
                  onChange={(e) => setCriterion(c.key, { score: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Justification</p>
                <Textarea
                  value={entry.justification}
                  onChange={(e) => setCriterion(c.key, { justification: e.target.value })}
                  rows={2}
                  className="bg-zinc-900/60 border-border/60 min-h-[60px]"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Preuves / sources</p>
                <Input
                  value={entry.preuves}
                  onChange={(e) => setCriterion(c.key, { preuves: e.target.value })}
                  placeholder="Source, observation, donnée, entretien…"
                  className="bg-zinc-900/60 border-border/60"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Niveau de confiance</p>
                <RadioGroup value={entry.confiance} onValueChange={(v) => setCriterion(c.key, { confiance: v })} className="flex gap-2">
                  {CONFIDENCE_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <RadioGroupItem value={opt} className="peer sr-only" />
                      <span className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${entry.confiance === opt ? "border-primary/40 bg-primary/10 text-white" : "border-border/40 bg-card/20 text-zinc-400"}`}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
    </FieldShell>
  );
}

const SOLUTION_TYPES = ["Concurrent direct", "Concurrent indirect", "Alternative", "Solution actuelle"];

function SolutionsTableField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const rows = Array.isArray(value) ? (value as { nom: string; type: string; public: string; forces: string; faiblesses: string }[]) : [];
  const setRows = (next: typeof rows) => onChange(next);
  const addRow = () => setRows([...rows, { nom: "", type: "Concurrent direct", public: "", forces: "", faiblesses: "" }]);
  const updateRow = (i: number, patch: Partial<(typeof rows)[number]>) => {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  };

  return (
    <FieldShell field={field}>
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr] gap-2 text-[10px] font-mono text-zinc-500 uppercase">
          <span>Solution</span><span>Type</span><span>Public</span><span>Forces</span><span>Faiblesses</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr] gap-2 items-start rounded-xl border border-border/40 bg-card/20 p-3">
            <Input value={row.nom} placeholder="Nom de la solution" onChange={(e) => updateRow(i, { nom: e.target.value })} className="bg-zinc-900/60 border-border/60" />
            <Select value={row.type} onValueChange={(v) => updateRow(i, { type: v })}>
              <SelectTrigger className="bg-zinc-900/60 border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-border/60 text-white">
                {SOLUTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={row.public} placeholder="Public cible" onChange={(e) => updateRow(i, { public: e.target.value })} className="bg-zinc-900/60 border-border/60" />
            <Input value={row.forces} placeholder="Forces" onChange={(e) => updateRow(i, { forces: e.target.value })} className="bg-zinc-900/60 border-border/60" />
            <Input value={row.faiblesses} placeholder="Faiblesses" onChange={(e) => updateRow(i, { faiblesses: e.target.value })} className="bg-zinc-900/60 border-border/60" />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="text-xs gap-1.5" onClick={addRow}>
          <Sparkles className="w-3.5 h-3.5" /> Ajouter une solution
        </Button>
      </div>
    </FieldShell>
  );
}

const EISENHOWER_QUADRANTS: { key: string; label: string; sub: string; accent: string }[] = [
  { key: "important-urgent", label: "IMPORTANT + URGENT", sub: "À faire immédiatement", accent: "text-red-400 border-red-500/30 bg-red-500/5" },
  { key: "important-non-urgent", label: "IMPORTANT + NON URGENT", sub: "À planifier", accent: "text-amber-400 border-amber-500/30 bg-amber-500/5" },
  { key: "non-important-urgent", label: "NON IMPORTANT + URGENT", sub: "À déléguer / automatiser", accent: "text-blue-400 border-blue-500/30 bg-blue-500/5" },
  { key: "non-important-non-urgent", label: "NON IMPORTANT + NON URGENT", sub: "À éliminer", accent: "text-zinc-500 border-zinc-700/40 bg-zinc-800/20" },
];

function EisenhowerField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const quadrants = (value as Record<string, string[]>) ?? {};
  const setQuadrant = (key: string, items: string[]) => onChange({ ...quadrants, [key]: items });
  const move = (from: string, to: string, item: string) => {
    setQuadrant(from, (quadrants[from] ?? []).filter((x) => x !== item));
    setQuadrant(to, [...(quadrants[to] ?? []), item]);
  };

  return (
    <FieldShell field={field}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EISENHOWER_QUADRANTS.map((q) => {
          const items = quadrants[q.key] ?? [];
          return (
            <div key={q.key} className={`rounded-xl border p-3 space-y-2 min-h-[120px] ${q.accent}`}>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider">{q.label}</p>
                <p className="text-[10px] text-zinc-500">{q.sub}</p>
              </div>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/50 rounded-lg px-2 py-1">
                    <span className="flex-1">{item}</span>
                    <div className="flex gap-1">
                      {q.key !== "important-urgent" && (
                        <button type="button" title="Monter" className="text-[10px] text-zinc-500 hover:text-white" onClick={() => move(q.key, "important-urgent", item)}>↑</button>
                      )}
                      {q.key !== "non-important-non-urgent" && (
                        <button type="button" title="Descendre" className="text-[10px] text-zinc-500 hover:text-white" onClick={() => move(q.key, "non-important-non-urgent", item)}>↓</button>
                      )}
                      <button type="button" title="Supprimer" className="text-[10px] text-zinc-500 hover:text-red-400" onClick={() => setQuadrant(q.key, items.filter((x) => x !== item))}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.elements.namedItem("action") as HTMLInputElement)?.value?.trim();
                  if (input) setQuadrant(q.key, [...items, input]);
                  e.currentTarget.reset();
                }}
                className="flex gap-1.5"
              >
                <Input name="action" placeholder="Ajouter une action…" className="h-8 text-xs bg-zinc-900/60 border-border/60" />
                <Button type="submit" size="sm" variant="ghost" className="h-8 px-2 text-xs">+</Button>
              </form>
            </div>
          );
        })}
      </div>
    </FieldShell>
  );
}

function RoadmapField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const months = Array.isArray(value) ? (value as { mois: string; objectif: string; resultat: string }[]) : [];
  const setMonth = (i: number, patch: Partial<(typeof months)[number]>) => {
    const next = [...months];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const labels = ["Comprendre", "Valider", "Construire", "Tester", "Améliorer", "Démontrer"];

  return (
    <FieldShell field={field}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {months.map((m, i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card/20 p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary/10 text-primary text-[10px] font-mono font-bold px-2 py-1">M{i + 1}</span>
              <span className="text-xs font-semibold text-white">{labels[i]}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Objectif</p>
              <Textarea value={m.objectif} onChange={(e) => setMonth(i, { objectif: e.target.value })} rows={2} className="bg-zinc-900/60 border-border/60 min-h-[50px]" placeholder="Objectif du mois" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Résultat attendu</p>
              <Textarea value={m.resultat} onChange={(e) => setMonth(i, { resultat: e.target.value })} rows={2} className="bg-zinc-900/60 border-border/60 min-h-[50px]" placeholder="Résultat observable" />
            </div>
          </div>
        ))}
      </div>
    </FieldShell>
  );
}

function RiskTableField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const rows = Array.isArray(value) ? (value as { nom: string; probabilite: number; impact: number; attenuation: string }[]) : [];
  const setRows = (next: typeof rows) => onChange(next);
  const addRow = () => setRows([...rows, { nom: "", probabilite: 1, impact: 1, attenuation: "" }]);
  const updateRow = (i: number, patch: Partial<(typeof rows)[number]>) => {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  };

  return (
    <FieldShell field={field}>
      <div className="space-y-3">
        {rows.map((row, i) => {
          const score = row.probabilite * row.impact;
          return (
            <div key={i} className="rounded-xl border border-border/40 bg-card/20 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={row.nom} placeholder="Risque (ex : Manque d'utilisateurs pilotes)" onChange={(e) => updateRow(i, { nom: e.target.value })} className="bg-zinc-900/60 border-border/60 flex-1" />
                <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-mono font-bold ${score >= 20 ? "bg-red-500/10 text-red-400" : score >= 12 ? "bg-amber-500/10 text-amber-400" : "bg-zinc-700/30 text-zinc-400"}`}>
                  {score}
                </span>
                <button type="button" className="text-zinc-500 hover:text-red-400 text-xs" onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Probabilité /5</p>
                  <input type="range" min={1} max={5} value={row.probabilite} onChange={(e) => updateRow(i, { probabilite: Number(e.target.value) })} className="w-full accent-primary" />
                  <p className="text-[10px] font-mono text-zinc-400 text-right">{row.probabilite}/5</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Impact /5</p>
                  <input type="range" min={1} max={5} value={row.impact} onChange={(e) => updateRow(i, { impact: Number(e.target.value) })} className="w-full accent-primary" />
                  <p className="text-[10px] font-mono text-zinc-400 text-right">{row.impact}/5</p>
                </div>
              </div>
              <Input value={row.attenuation} placeholder="Stratégie d'atténuation" onChange={(e) => updateRow(i, { attenuation: e.target.value })} className="bg-zinc-900/60 border-border/60" />
            </div>
          );
        })}
        <Button type="button" variant="outline" size="sm" className="text-xs gap-1.5" onClick={addRow}>
          <Sparkles className="w-3.5 h-3.5" /> Ajouter un risque
        </Button>
      </div>
    </FieldShell>
  );
}

const GOAL_TYPES = ["Projet", "Personnel", "Apprentissage"];

function SmartGoalsField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const goals = Array.isArray(value) ? (value as { type: string; objectif: string; indicateur: string; date: string }[]) : [];
  const updateGoal = (i: number, patch: Partial<(typeof goals)[number]>) => {
    const next = [...goals];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const filled = (g: (typeof goals)[number]) => g.objectif.trim() && g.indicateur.trim() && g.date.trim();

  return (
    <FieldShell field={field}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {goals.map((g, i) => {
          const isComplete = filled(g);
          return (
            <div key={i} className={`rounded-xl border p-4 space-y-2.5 ${isComplete ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/40 bg-card/20"}`}>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-primary/10 text-primary text-[10px] font-mono font-bold px-2 py-1">OBJECTIF {i + 1}</span>
                <Select value={g.type} onValueChange={(v) => updateGoal(i, { type: v })}>
                  <SelectTrigger className="h-8 w-32 text-[11px] bg-zinc-900/60 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-border/60 text-white">
                    {GOAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Textarea value={g.objectif} onChange={(e) => updateGoal(i, { objectif: e.target.value })} rows={2} placeholder="Objectif SMART" className="bg-zinc-900/60 border-border/60 min-h-[50px]" />
              <Input value={g.indicateur} onChange={(e) => updateGoal(i, { indicateur: e.target.value })} placeholder="Indicateur de réussite" className="bg-zinc-900/60 border-border/60" />
              <Input value={g.date} onChange={(e) => updateGoal(i, { date: e.target.value })} placeholder="Date limite" className="bg-zinc-900/60 border-border/60" />
              <p className={`text-[10px] font-mono ${isComplete ? "text-emerald-400" : "text-zinc-500"}`}>
                {isComplete ? "✓ Objectif suffisamment structuré" : "○ Objectif incomplet"}
              </p>
            </div>
          );
        })}
      </div>
    </FieldShell>
  );
}

const SELF_EVAL_ITEMS: { key: string; label: string }[] = [
  { key: "probleme", label: "Je comprends clairement le problème" },
  { key: "preuves", label: "J'ai utilisé des preuves" },
  { key: "marche", label: "J'ai étudié les solutions existantes" },
  { key: "public", label: "Je connais mon public cible" },
  { key: "valeur", label: "Ma proposition de valeur est claire" },
  { key: "objectifs", label: "Mes objectifs sont réalistes" },
  { key: "priorites", label: "Mes priorités sont claires" },
  { key: "roadmap", label: "Ma roadmap est cohérente" },
  { key: "risques", label: "J'ai identifié les principaux risques" },
  { key: "clarte", label: "Je peux expliquer mon projet simplement" },
];

function SynthesisField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const scores = (value as Record<string, number>) ?? {};
  const items = field.criteria && field.criteria.length > 0
    ? field.criteria.map((c) => ({ key: c.key, label: c.label }))
    : SELF_EVAL_ITEMS;
  const itemMax = field.totalMax ?? 50;
  const total = items.reduce((a, it) => a + (scores[it.key] ?? 0), 0);
  const perItemMax = Math.round(itemMax / Math.max(1, items.length));

  return (
    <FieldShell field={field}>
      <div className="space-y-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary/70">Auto-évaluation</p>
          <p className="text-3xl font-bold font-mono text-white">{total}<span className="text-base text-zinc-500">/{itemMax}</span></p>
          <p className="text-[10px] text-zinc-500 leading-snug">
            Cette note sert à te faire réfléchir sur la qualité de ton propre travail. Elle ne remplace pas la note du reviewer.
          </p>
        </div>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.key} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/20 px-3 py-2">
              <span className="flex-1 text-xs text-zinc-300">{it.label}</span>
              <div className="flex gap-1">
                {Array.from({ length: perItemMax }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange({ ...scores, [it.key]: n })}
                    className={`w-6 h-6 rounded-md text-[10px] font-mono transition-all ${(scores[it.key] ?? 0) >= n ? "bg-primary/20 text-primary border border-primary/40" : "bg-zinc-800/60 text-zinc-500 border border-transparent hover:border-zinc-600"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FieldShell>
  );
}

function DynamicTableField({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const rows = Array.isArray(value) ? (value as Record<string, string>[]) : [];
  const columns = field.columns ?? [];

  const updateCell = (rowIndex: number, colKey: string, cellValue: string) => {
    const next = rows.map((row, i) => (i === rowIndex ? { ...row, [colKey]: cellValue } : row));
    onChange(next);
  };

  const addRow = () => {
    const row: Record<string, string> = {};
    for (const col of columns) row[col.key] = "";
    onChange([...rows, row]);
  };

  const removeRow = (rowIndex: number) => {
    onChange(rows.filter((_, i) => i !== rowIndex));
  };

  return (
    <FieldShell field={field}>
      <div className="overflow-x-auto rounded-xl border border-border/40">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/40 bg-card/20">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-medium text-zinc-400 whitespace-nowrap">{col.label}</th>
              ))}
              <th className="px-3 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-4 text-center text-zinc-600">Aucune ligne. Clique sur « Ajouter une ligne ».</td>
              </tr>
            ) : (
              rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/20 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-1.5 align-top">
                      {col.type === "select" ? (
                        <Select value={row[col.key] ?? ""} onValueChange={(v) => updateCell(ri, col.key, v)}>
                          <SelectTrigger className="bg-zinc-900/60 border-border/60 h-8 text-xs">
                            <SelectValue placeholder="…" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-border/60 text-white">
                            {(col.options ?? []).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : col.type === "textarea" ? (
                        <Textarea
                          value={row[col.key] ?? ""}
                          rows={2}
                          onChange={(e) => updateCell(ri, col.key, e.target.value)}
                          className="bg-zinc-900/60 border-border/60 text-xs min-h-[44px]"
                        />
                      ) : (
                        <Input
                          value={row[col.key] ?? ""}
                          onChange={(e) => updateCell(ri, col.key, e.target.value)}
                          className="bg-zinc-900/60 border-border/60 h-8 text-xs"
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => removeRow(ri)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                      aria-label="Supprimer la ligne"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Ajouter une ligne
        </button>
        <p className="text-[10px] font-mono text-zinc-600">{rows.filter((r) => Object.values(r).some((v) => (v ?? "").trim().length > 0)).length} ligne(s) remplie(s)</p>
      </div>
    </FieldShell>
  );
}

function FieldShell({ field, children }: { field: StepField; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-zinc-300">
        {field.label}
        {field.required && <span className="text-primary ml-0.5">*</span>}
      </Label>
      {children}
      {field.hint && <p className="text-[10px] text-zinc-600 leading-relaxed">{field.hint}</p>}
    </div>
  );
}

function SkillFields({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const [rows, setRows] = React.useState<{ name: string; level: string }[]>(
    Array.isArray(value)
      ? (value as { name?: string; level?: string }[]).map((s) => ({ name: s.name ?? "", level: s.level ?? "Découverte" }))
      : [{ name: "", level: "Découverte" }]
  );

  const levels = field.skills?.levels ?? ["Découverte", "Débutant", "Intermédiaire", "Avancé", "Expert"];

  React.useEffect(() => {
    const next = Array.isArray(value)
      ? (value as { name?: string; level?: string }[]).map((s) => ({ name: s.name ?? "", level: s.level ?? "Découverte" }))
      : [{ name: "", level: "Découverte" }];
    setRows(next);
  }, [value]);

  const sync = (next: { name: string; level: string }[]) => {
    setRows(next);
    onChange(next.filter((r) => r.name.trim()));
  };

  return (
    <FieldShell field={field}>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={row.name}
              placeholder="Ex : Git, Python…"
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...next[i], name: e.target.value };
                sync(next);
              }}
              className="bg-zinc-900/60 border-border/60"
            />
            <Select
              value={row.level}
              onValueChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], level: v };
                sync(next);
              }}
            >
              <SelectTrigger className="bg-zinc-900/60 border-border/60 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-border/60 text-white">
                {levels.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rows.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-zinc-500 hover:text-red-400"
                onClick={() => sync(rows.filter((_, j) => j !== i))}
              >
                <Circle className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => sync([...rows, { name: "", level: "Découverte" }])}
        >
          <Sparkles className="w-3.5 h-3.5" /> Ajouter une compétence
        </Button>
      </div>
    </FieldShell>
  );
}

const ENV_OPTIONS: Record<string, { label: string; icon: React.ReactNode; options: string[] }> = {
  systeme: {
    label: "Système principal",
    icon: <Wrench className="w-4 h-4" />,
    options: ["Windows", "Linux", "macOS", "Autre"],
  },
  ide: {
    label: "Environnement de développement",
    icon: <FileText className="w-4 h-4" />,
    options: ["VS Code", "JetBrains", "Autre"],
  },
  connexion: {
    label: "Qualité de connexion",
    icon: <ListChecks className="w-4 h-4" />,
    options: ["Faible", "Moyenne", "Bonne", "Très bonne"],
  },
};

function EnvFields({ field, value, onChange }: { field: StepField; value: unknown; onChange: (v: unknown) => void }) {
  const env = (value as Record<string, unknown>) ?? {};
  const setEnv = (key: string, v: unknown) => onChange({ ...env, [key]: v });

  return (
    <FieldShell field={field}>
      <div className="space-y-5">
        {Object.entries(ENV_OPTIONS).map(([key, cfg]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              {cfg.icon} {cfg.label}
            </div>
            <RadioGroup value={(env[key] as string) ?? ""} onValueChange={(v) => setEnv(key, v)} className="flex flex-wrap gap-2">
              {cfg.options.map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                  <RadioGroupItem value={opt} id={`${key}-${opt}`} className="peer sr-only" />
                  <span className={`rounded-lg border px-3 py-1.5 text-xs transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-white ${env[key] === opt ? "border-primary/40 bg-primary/10 text-white" : "border-border/40 bg-card/20 text-zinc-400"}`}>
                    {opt}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
            <UserRound className="w-4 h-4" /> Machine
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["cpu", "ram", "stockage"] as const).map((k) => (
              <Input
                key={k}
                value={(env.machine as Record<string, string>)?.[k] ?? ""}
                placeholder={{ cpu: "CPU", ram: "RAM", stockage: "Stockage" }[k]}
                onChange={(e) => setEnv("machine", { ...((env.machine as object) ?? {}), [k]: e.target.value })}
                className="bg-zinc-900/60 border-border/60"
              />
            ))}
          </div>
        </div>
      </div>
    </FieldShell>
  );
}
