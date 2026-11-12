"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  getVisibleQuestions,
  getProgress,
  validateAnswer,
  generateProfile,
} from "@/lib/acquisition/engine";
import type { ProfileAnswers, Question } from "@/lib/acquisition/types";
import { track } from "@/lib/acquisition/analytics";
import { ProfilingShell } from "./profiling-shell";
import { QuestionView } from "./question-view";
import { ProfileCard } from "./profile-card";

const STORAGE_KEY = "hashcode:acq:profiling";

interface PersistedState {
  answers: ProfileAnswers;
  answeredIds: string[];
  step: number;
}

interface ProfilingFlowProps {
  onComplete: (answers: ProfileAnswers) => void;
  onBack: () => void;
}

export function ProfilingFlow({ onComplete, onBack }: ProfilingFlowProps) {
  const [answers, setAnswers] = React.useState<ProfileAnswers>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
  });
  const [answeredIds, setAnsweredIds] = React.useState<string[]>([]);
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [hydrated, setHydrated] = React.useState(false);
  const [hasResume, setHasResume] = React.useState(false);
  const [showResumePrompt, setShowResumePrompt] = React.useState(false);
  const [phase, setPhase] = React.useState<"questions" | "preview">("questions");
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [duplicate, setDuplicate] = React.useState(false);
  const lastQuestionRef = React.useRef<string | null>(null);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as PersistedState;
          if (parsed?.answers && Array.isArray(parsed.answeredIds)) {
            setAnswers(parsed.answers);
            setAnsweredIds(parsed.answeredIds);
            setStep(parsed.step ?? 0);
            setHasResume(true);
            setShowResumePrompt(true);
            if (parsed.answers.email && parsed.answers.email.trim().length > 0) {
              setDuplicate(true);
            }
          }
        }
      } catch {
        /* ignore corrupt storage */
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, []);

  function saveDraft() {
    const email = answers.email;
    if (!email || !email.trim()) return;
    const payload = { email, answers, lastQuestionId: lastQuestionRef.current ?? undefined };
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/profiling/draft", blob);
      } else {
        void fetch("/api/profiling/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch { /* best-effort */ }
  }

  // Confirmation de sortie
  React.useEffect(() => {
    if (!hydrated || answeredIds.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Tu es sûr de vouloir quitter ?";
      if (lastQuestionRef.current) {
        track({ type: "profiling_abandoned", ref: lastQuestionRef.current });
        saveDraft();
      }
      return "Tes réponses sont sauvegardées, tu peux reprendre plus tard.";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hydrated, answeredIds.length, answers, lastQuestionRef]);

  // Track drop-off on visibility change
  React.useEffect(() => {
    if (!hydrated || answeredIds.length === 0) return;
    let lastHiddenAt = 0;
    const handler = () => {
      if (document.visibilityState === "hidden" && lastQuestionRef.current) {
        const now = Date.now();
        if (now - lastHiddenAt > 5000) {
          lastHiddenAt = now;
          track({ type: "profiling_abandoned", ref: lastQuestionRef.current });
          saveDraft();
        }
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [hydrated, answeredIds.length, answers, lastQuestionRef]);

  // Persist to localStorage
  React.useEffect(() => {
    if (!hydrated) return;
    if (answeredIds.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const data: PersistedState = { answers, answeredIds, step };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [answers, answeredIds, step, hydrated]);

  const visible = React.useMemo(() => getVisibleQuestions(answers), [answers]);
  const answeredSet = React.useMemo(() => new Set(answeredIds), [answeredIds]);
  const progress = React.useMemo(() => getProgress(answers, answeredSet), [answers, answeredSet]);
  const current = step < visible.length ? visible[step] : undefined;
  const questionStartRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (current) {
      lastQuestionRef.current = current.id;
      questionStartRef.current = Date.now();
    }
  }, [current]);

  function setAnswer(q: Question, value: unknown) {
    setAnswers((prev) => ({ ...prev, [q.mapsTo]: value as never }));
  }

  function markAnswered(q: Question) {
    setAnsweredIds((prev) => (prev.includes(q.id) ? prev : [...prev, q.id]));
  }

  function advance(q: Question, value?: unknown) {
    if (value !== undefined) setAnswer(q, value);
    markAnswered(q);
    setLocalError(null);

    if (questionStartRef.current > 0) {
      const durationMs = Date.now() - questionStartRef.current;
      if (durationMs > 0 && durationMs < 10 * 60 * 1000) {
        track({ type: "profiling_question_timed", ref: q.id, value: Math.round(durationMs) });
      }
    }

    if (q.id === "email") {
      setDirection(1);
      setStep((s) => Math.min(s + 1, visible.length));
      return;
    }

    if (q.id === "threeMonthGoal") {
      setPhase("preview");
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, visible.length));
  }

  function goBack() {
    if (phase === "preview") {
      setPhase("questions");
      return;
    }
    if (step === 0) {
      onBack();
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    setLocalError(null);
  }

  function resume() {
    setShowResumePrompt(false);
  }
  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({ firstName: "", lastName: "", email: "", phone: "", country: "", city: "" });
    setAnsweredIds([]);
    setStep(0);
    setPhase("questions");
    setShowResumePrompt(false);
    setHasResume(false);
    setDuplicate(false);
  }

  function maybeFinish() {
    const allRequiredAnswered = visible.every((q) => !q.required || answeredSet.has(q.id));
    if (allRequiredAnswered) {
      localStorage.removeItem(STORAGE_KEY);
      onComplete(answers);
    } else {
      const firstUnanswered = visible.find((q) => q.required && !answeredSet.has(q.id));
      if (firstUnanswered) {
        const idx = visible.indexOf(firstUnanswered);
        setStep(idx);
      }
    }
  }

  // Auto-finish
  React.useEffect(() => {
    if (phase !== "questions") return;
    if (!hydrated || showResumePrompt) return;
    if (!current) {
      maybeFinish();
    }
  }, [current, phase, hydrated, showResumePrompt]);

  // Resume prompt
  if (hydrated && showResumePrompt) {
    return (
      <ResumePrompt
        onResume={resume}
        onRestart={restart}
        progress={progress}
        answeredCount={answeredIds.length}
        duplicate={duplicate}
      />
    );
  }

  // Profile preview interlude
  if (phase === "preview") {
    const gen = generateProfile(answers);
    return (
      <ProfilingShell
        progress={0.98}
        onBack={goBack}
        stepLabel="Ton profil HASHCODE est prêt"
        group="vision"
        showCompletionIndicator
      >
        <div className="animate-in fade-in duration-500">
          <div className="max-w-xl mx-auto text-center">
            <Logo variant="mark" size="md" className="mx-auto" />
            <h2 className="mt-5 font-syne font-bold text-2xl sm:text-3xl tracking-tight">
              Ton profil HASHCODE est prêt.
            </h2>
            <p className="mt-2 text-muted-foreground">
              {gen.archetype} — {gen.domainLabel}. Voici la première orientation qu'on tire de tes réponses.
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <ProfileCard profile={gen} goal={answers.threeMonthGoal} />
          </div>
          <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="w-full group"
              onClick={() => {
                setPhase("questions");
                setDirection(1);
                const phoneIdx = visible.findIndex((q) => q.id === "phone");
                if (phoneIdx >= 0) setStep(phoneIdx);
              }}
            >
              Finaliser mon profil
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={goBack}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Modifier mes réponses
            </Button>
          </div>
          <p className="mt-6 max-w-md mx-auto text-center text-xs text-muted-foreground">
            Plus que ton WhatsApp pour recevoir ton invitation. 15 secondes.
          </p>
        </div>
      </ProfilingShell>
    );
  }

  if (!current) {
    return (
      <ProfilingShell
        progress={1}
        onBack={goBack}
        stepLabel="Finalisation…"
        showCompletionIndicator
      >
        <div className="text-center animate-in fade-in duration-500">
          <div className="relative inline-flex">
            <Logo variant="mark" size="md" />
          </div>
          <h2 className="mt-5 font-syne font-bold text-lg text-foreground">
            On finalise ton profil…
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Une seconde.</p>
        </div>
      </ProfilingShell>
    );
  }

  return (
    <ProfilingShell
      progress={progress}
      onBack={goBack}
      stepLabel={current.group === "contact" ? "WhatsApp (presque fini)" : "Ton profil HASHCODE"}
      microcopy={current.microcopy}
      group={current.group}
      showCompletionIndicator
    >
      <QuestionView
        key={current.id}
        question={current}
        answers={answers}
        value={answers[current.mapsTo]}
        error={localError}
        onSingle={(v) => {
          track({ type: "profiling_question_answered", ref: current.id });
          advance(current, v);
        }}
        onMultiToggle={(v) => {
          const cur = (answers[current.mapsTo] as string[]) ?? [];
          const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
          setAnswer(current, next);
        }}
        onTextChange={(v) => setAnswer(current, v)}
        onCountry={(v) => setAnswer(current, v)}
        onContinue={() => {
          const v = answers[current.mapsTo];
          const err = validateAnswer(current, v);
          if (err) {
            setLocalError(err);
            return;
          }
          if (!answeredSet.has(current.id)) {
            markAnswered(current);
            track({ type: "profiling_question_answered", ref: current.id });
          }
          advance(current);
        }}
      />

      {/* Consentement — affiché sur la DERNIÈRE question uniquement.
          Réutilise le pattern déjà en place dans components/auth/signin-form.tsx
          (« En continuant, tu acceptes… ») pour rester cohérent.
          Couvre : CGU + traitement du profil + envoi de l'email d'accès
          (transactionnel). Le marketing exigerait un opt-in séparé. */}
      {step === visible.length - 1 && (
        <p className="mt-6 max-w-md mx-auto text-xs leading-normal text-muted-foreground font-medium text-center px-1 select-none">
          En continuant, tu acceptes nos{" "}
          <Link
            href="/terms"
            className="text-primary hover:underline font-bold transition-colors"
          >
            Conditions d&apos;utilisation
          </Link>{" "}
          et notre{" "}
          <Link
            href="/privacy"
            className="text-primary hover:underline font-bold transition-colors"
          >
            Politique de confidentialité
          </Link>
          , et tu autorises HASHCODE à traiter tes réponses pour établir ton
          profil et t&apos;envoyer ton accès.
        </p>
      )}
    </ProfilingShell>
  );
}

/* ------------------------------------------------------------------ */
// Resume prompt

function ResumePrompt({
  onResume,
  onRestart,
  progress,
  answeredCount,
  duplicate,
}: {
  onResume: () => void;
  onRestart: () => void;
  progress: number;
  answeredCount: number;
  duplicate: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 h-14 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">Ton profil HASHCODE</span>
          <span className="text-xs text-muted-foreground font-mono">{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-0.5 bg-border">
          <div className="h-full bg-primary" style={{ width: `${Math.max(2, progress * 100)}%` }} />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8">
        <div className="w-full max-w-md text-center animate-in fade-in duration-500">
          <Logo variant="mark" size="md" className="mx-auto" />
          <h2 className="mt-5 font-syne font-bold text-2xl tracking-tight">
            {duplicate ? "Tu as déjà un compte HASHCODE." : "Tu avais un brouillon en cours."}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {duplicate
              ? "Reprends là où tu en étais — on a retrouvé ton profil."
              : `Tu as déjà répondu à ${answeredCount} question${answeredCount > 1 ? "s" : ""}. Tu peux reprendre là où tu t'es arrêté.`}
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="w-full sm:w-auto" onClick={onResume}>
              Reprendre
            </Button>
            <Button size="lg" variant="outline" onClick={onRestart}>
              <RotateCcw className="size-4" /> Recommencer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
