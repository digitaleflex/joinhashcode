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
            <div className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Mission 01 · INTRO</div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-1">{state.title}</h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 2-3 jours estimés · Applicable à tous les profils
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
              <p className="text-xs text-emerald-400/70 mt-1 font-mono">Score : {attempt.score}/25 · Profil HashCode v1 généré</p>
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
    default:
      return null;
  }
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
    onChange(rows.filter((r) => r.name.trim()));
  }, [rows]);

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
                setRows(next);
              }}
              className="bg-zinc-900/60 border-border/60"
            />
            <Select
              value={row.level}
              onValueChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], level: v };
                setRows(next);
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
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
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
          onClick={() => setRows([...rows, { name: "", level: "Découverte" }])}
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
