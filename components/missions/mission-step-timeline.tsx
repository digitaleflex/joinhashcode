"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";

export interface MissionStepTimelineProps {
  steps: Array<{
    key: string;
    title: string;
    shortTitle: string;
    stepOrder: number;
    status: "DRAFT" | "COMPLETE" | "APPROVED" | "REVISION_REQUIRED";
    completeness: number;
  }>;
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  disabled?: boolean;
}

const STATUS_CONFIG = {
  DRAFT: {
    label: "Brouillon",
    icon: Circle,
    color: "text-zinc-500",
    bg: "bg-zinc-900",
    border: "border-white/10",
    progressColor: "bg-primary/50",
  },
  COMPLETE: {
    label: "Complétée",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500/40",
    progressColor: "bg-emerald-500",
  },
  APPROVED: {
    label: "Validée",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500/40",
    progressColor: "bg-emerald-500",
  },
  REVISION_REQUIRED: {
    label: "Révision requise",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500/40",
    progressColor: "bg-amber-500",
  },
} as const;

export function MissionStepTimeline({
  steps,
  currentStepIndex,
  onStepClick,
  disabled = false,
}: MissionStepTimelineProps) {
  return (
    <nav className="space-y-1" aria-label="Étapes de la mission">
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
      <div className="relative space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = step.status === "COMPLETE" || step.status === "APPROVED";
          const isRevision = step.status === "REVISION_REQUIRED";
          const config = STATUS_CONFIG[step.status];
          const Icon = config.icon;

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => !disabled && onStepClick(index)}
              disabled={disabled}
              className={cn(
                "group flex items-start gap-3 w-full transition-all",
                isActive && "scale-[1.02] z-10"
              )}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Étape ${index + 1}: ${step.shortTitle} — ${config.label}`}
            >
              <div className={cn(
                "relative shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300",
                isCompleted || isRevision
                  ? `${config.bg} ${config.border} border-transparent`
                  : "bg-zinc-900 border-white/10",
                isActive && "ring-2 ring-primary/50 ring-offset-2 ring-offset-zinc-950"
              )}>
                {(isCompleted || isRevision) && (
                  <Icon className={cn("size-2.5", isCompleted ? "text-black" : "text-black")} />
                )}
                {!isCompleted && !isRevision && (
                  <span className={cn(
                    "text-[9px] font-mono font-bold",
                    isActive ? "text-primary" : "text-zinc-500"
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium truncate",
                    isActive ? "text-white" : "text-zinc-400"
                  )}>
                    {step.shortTitle}
                  </span>
                  <span className={cn(
                    "text-[9px] font-mono uppercase tracking-wider shrink-0",
                    config.color
                  )}>
                    {config.label}
                  </span>
                </div>

                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      config.progressColor
                    )}
                    style={{ width: `${Math.round(step.completeness * 100)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}