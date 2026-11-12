"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, Loader2, PlayCircle, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FirstAction } from "@/lib/first-action";

type FirstActionStatus = "not_started" | "started" | "completed";

const STATUS_META: Record<
  FirstActionStatus,
  { label: string; className: string; dot: string }
> = {
  not_started: {
    label: "À commencer",
    className: "border-primary/25 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  started: {
    label: "En cours",
    className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Terminée",
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
};

const STEPS = ["Choisir", "Commencer", "Terminer"] as const;

function completedSteps(status: FirstActionStatus): number {
  if (status === "completed") return 3;
  if (status === "started") return 2;
  return 1;
}

const DOMAIN_CHOICES = [
  { value: "web", label: "Développement web" },
  { value: "cybersecurity", label: "Cybersécurité" },
  { value: "ai", label: "IA appliquée" },
] as const;

export function FirstActionCard({
  action,
  status = "not_started",
}: {
  action: FirstAction;
  status?: FirstActionStatus;
}) {
  const router = useRouter();
  const [choosing, setChoosing] = React.useState<string | null>(null);
  const [choiceError, setChoiceError] = React.useState<string | null>(null);
  const meta = STATUS_META[status];
  const done = completedSteps(status);
  const isReady = action.status === "ready";

  const chooseDomain = async (domain: string) => {
    setChoosing(domain);
    setChoiceError(null);
    try {
      const res = await fetch("/api/specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryDomain: domain,
          tools: [],
          learningTools: [],
          certifications: [],
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Impossible d'enregistrer ton domaine.");
      }
      router.refresh();
    } catch (error) {
      setChoiceError(error instanceof Error ? error.message : "Impossible d'enregistrer ton domaine.");
    } finally {
      setChoosing(null);
    }
  };

  const recordEvent = (event: "started" | "completed") => {
    fetch("/api/me/first-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const primaryHref =
    status === "completed" ? "/labs" : action.href ?? "/programs";
  const primaryLabel =
    status === "completed"
      ? "Explorer les Labs"
      : status === "started"
        ? "Reprendre ma première action"
        : action.source === "atelier"
          ? "Commencer ma première action"
          : "Choisir mon domaine";

  return (
    <section
      aria-labelledby="first-action-title"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-transparent p-6 sm:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden />
          Première action
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.12em]",
            meta.className,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden />
          {meta.label}
        </span>
      </div>

      <div className="relative mt-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          {status === "completed" ? (
            <Trophy className="h-6 w-6" aria-hidden />
          ) : status === "started" ? (
            <PlayCircle className="h-6 w-6" aria-hidden />
          ) : (
            <Sparkles className="h-6 w-6" aria-hidden />
          )}
        </div>
        <div className="min-w-0">
          <h2 id="first-action-title" className="text-lg font-bold leading-snug text-white sm:text-xl">
            {status === "completed" ? "Première action terminée — bravo." : action.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {status === "completed"
              ? "Tu as posé la première brique de ton parcours. La suite : pratiquer avec un Lab et documenter ce que tu sais faire."
              : action.description}
          </p>
          {action.duration && status !== "completed" && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {action.duration}
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center justify-between gap-2" aria-hidden>
          {STEPS.map((step, index) => {
            const reached = index < done;
            return (
              <div key={step} className="flex flex-1 items-center gap-2 last:flex-none">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    reached
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/15 bg-white/[0.02] text-zinc-600",
                  )}
                >
                  {reached ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    reached ? "text-zinc-300" : "text-zinc-600",
                  )}
                >
                  {step}
                </span>
                {index < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "mx-1 hidden h-px flex-1 sm:block",
                      index < done - 1 ? "bg-primary/50" : "bg-white/10",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {action.domain === "unknown" && status === "not_started" ? (
        <div className="relative mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Choisis ton domaine pour débloquer ta première action
          </p>
          <div className="flex flex-wrap gap-2">
            {DOMAIN_CHOICES.map((domain) => (
              <Button
                key={domain.value}
                type="button"
                variant="outline"
                disabled={Boolean(choosing)}
                onClick={() => chooseDomain(domain.value)}
                className="h-10 rounded-xl px-4"
              >
                {choosing === domain.value ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                {domain.label}
              </Button>
            ))}
          </div>
          {choiceError && <p className="text-xs font-medium text-red-400">{choiceError}</p>}
        </div>
      ) : (
        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <Button className="btn-primary-glow h-11 rounded-xl px-5" asChild>
            <Link
              href={primaryHref}
              onClick={() => {
                if (status === "not_started" && isReady) recordEvent("started");
              }}
            >
              {primaryLabel}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Link
            href="/ateliers"
            className="text-xs font-semibold text-zinc-400 transition-colors hover:text-primary"
          >
            Voir tous les ateliers
          </Link>
          <Link
            href="/contact"
            className="text-xs font-semibold text-zinc-500 transition-colors hover:text-primary"
          >
            Besoin d&apos;aide ?
          </Link>
        </div>
      )}
    </section>
  );
}
