import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NextStep, NextStepTone } from "@/lib/next-step";

const TONE: Record<
  NextStepTone,
  { border: string; bg: string; icon: LucideIcon; iconClass: string; badge: string }
> = {
  primary: {
    border: "border-primary/20",
    bg: "bg-primary/[0.05]",
    icon: Sparkles,
    iconClass: "border-primary/20 bg-primary/10 text-primary",
    badge: "text-primary",
  },
  warning: {
    border: "border-orange-400/25",
    bg: "bg-orange-400/[0.05]",
    icon: AlertTriangle,
    iconClass: "border-orange-400/25 bg-orange-400/10 text-orange-300",
    badge: "text-orange-300",
  },
  info: {
    border: "border-sky-400/25",
    bg: "bg-sky-400/[0.05]",
    icon: Clock,
    iconClass: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    badge: "text-sky-300",
  },
  success: {
    border: "border-emerald-400/25",
    bg: "bg-emerald-400/[0.05]",
    icon: CheckCircle2,
    iconClass: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    badge: "text-emerald-300",
  },
};

/** Single, prominent "what should I do now?" card for established members. */
export function NextStepCard({ step }: { step: NextStep }) {
  const tone = TONE[step.tone];
  const Icon = tone.icon;

  return (
    <section
      aria-labelledby="next-step-title"
      className={cn("rounded-3xl border p-6 sm:p-7", tone.border, tone.bg)}
    >
      <p className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.18em]", tone.badge)}>
        Prochaine étape
      </p>
      <div className="mt-4 flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
            tone.iconClass,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 id="next-step-title" className="text-lg font-bold leading-snug text-white">
            {step.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {step.description}
          </p>
          <Button className="btn-primary-glow mt-5 h-10 rounded-xl px-4" asChild>
            <Link href={step.href}>
              {step.cta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
