"use client"

import { useState } from "react"
import { Check, Lock, HelpCircle, Sparkles, Loader2, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { SquadData } from "@/components/dashboard/squad-journey"

export type PhaseStatus = "completed" | "current" | "locked"

export interface Phase {
  id: number
  code: string
  title: string
  subtitle: string
  reward: string
  rewardXp: number
  icon: LucideIcon
  status: PhaseStatus
  unlockHint?: string
  whyTitle?: string
  whyDescription?: string
}

interface PhaseNodeProps {
  phase: Phase
  isLast: boolean
  memberCount: number
  squad: SquadData | null
  isCopying: boolean
  isCreating: boolean
  onCopy: () => void
  onCreate: () => void
}

export function PhaseNode({
  phase,
  isLast,
  memberCount,
  squad,
  isCopying,
  isCreating,
  onCopy,
  onCreate,
}: PhaseNodeProps) {
  const { status } = phase
  const Icon = phase.icon
  const [showWhy, setShowWhy] = useState(false)

  return (
    <div className="flex gap-5 md:gap-7">
      {/* Connector line + node icon */}
      <div className="flex flex-col items-center shrink-0">
        <div className={cn(
          "size-12 md:size-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-700 shrink-0",
          status === "completed" && "bg-primary/10 border-primary text-primary",
          status === "current" && "bg-primary/5 border-primary text-primary shadow-[0_0_25px_rgba(197,244,65,0.25)] animate-pulse",
          status === "locked" && "bg-zinc-900/40 border-white/5 text-zinc-800",
        )}>
          {status === "completed" ? (
            <Check className="size-5 md:size-6" />
          ) : status === "locked" ? (
            <Lock className="size-4 md:size-5" />
          ) : (
            <Icon className="size-5 md:size-6" />
          )}
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 min-h-10 mt-1 rounded-full",
            status === "completed" ? "bg-primary/30" : "bg-white/4",
          )} />
        )}
      </div>

      {/* Phase content card */}
      <div className={cn(
        "flex-1 rounded-3xl border p-5 md:p-6 mb-3 transition-all duration-700",
        status === "completed" && "bg-zinc-900/30 border-primary/10",
        status === "current" && "bg-zinc-900/60 border-primary/30 shadow-[0_0_30px_rgba(197,244,65,0.08)]",
        status === "locked" && "bg-zinc-950/30 border-white/3 opacity-50",
      )}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1 flex-1 min-w-50">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "text-[9px] font-mono font-bold uppercase",
                status === "completed" ? "text-primary" : status === "current" ? "text-primary/70" : "text-zinc-700",
              )}>
                PHASE_{phase.code}
              </span>
              {status === "completed" && (
                <span className="text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Complété
                </span>
              )}
              {status === "current" && (
                <span className="text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono animate-pulse">
                  En cours
                </span>
              )}
            </div>
            <h3 className={cn(
              "text-md md:text-lg font-extrabold tracking-tight uppercase flex items-center gap-1.5",
              status === "locked" ? "text-zinc-700" : "text-white",
            )}>
              {phase.title}
              {phase.whyDescription && (
                <button
                  type="button"
                  onClick={() => setShowWhy(!showWhy)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-zinc-500 hover:text-primary transition-colors p-0.5 hover:bg-white/5 shrink-0",
                    showWhy && "text-primary bg-primary/10"
                  )}
                  title="Pourquoi cette étape ?"
                >
                  <HelpCircle className="size-3.5" />
                </button>
              )}
            </h3>
            <p className={cn(
              "text-sm mb-2",
              status === "locked" ? "text-zinc-800" : "text-zinc-500",
            )}>
              {phase.subtitle}
            </p>

            {showWhy && phase.whyDescription && (
              <div className="mt-3 p-4 rounded-2xl border border-primary/20 bg-primary/2 text-xs space-y-1.5 transition-all duration-300">
                <div className="flex items-center gap-1.5 text-primary font-bold uppercase tracking-wider font-mono text-[9px]">
                  <Sparkles className="size-3 text-primary animate-pulse" />
                  {phase.whyTitle || "Pourquoi cette étape ?"}
                </div>
                <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                  {phase.whyDescription}
                </p>
              </div>
            )}
          </div>

          {/* Reward badge */}
          <div className={cn(
            "text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border shrink-0",
            status === "completed" && "bg-primary/5 text-primary/60 border-primary/10",
            status === "current" && "bg-primary/10 text-primary border-primary/20",
            status === "locked" && "bg-white/2 text-zinc-800 border-white/3",
          )}>
            {phase.reward}
          </div>
        </div>

        {/* Current phase: progress + CTA */}
        {status === "current" && (
          <div className="mt-5 space-y-4 border-t border-white/5 pt-5">
            {/* Progress indicator per phase */}
            {phase.id === 2 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Agents recrutés</span>
                  <span className="text-primary font-bold">{memberCount}/3</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (memberCount / 3) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 3 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Escouade complète</span>
                  <span className="text-primary font-bold">{memberCount}/5</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(memberCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 4 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Cohésion actuelle</span>
                  <span className="text-primary font-bold">{Math.round((squad?.cohesionScore ?? 0) * 100)}% / 50%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.cohesionScore ?? 0) / 0.5) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 5 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Streak actuel</span>
                  <span className="text-primary font-bold">{squad?.streakCount ?? 0}/3 jours</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.streakCount ?? 0) / 3) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 6 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Streak actuel</span>
                  <span className="text-primary font-bold">{squad?.streakCount ?? 0}/7 jours</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.streakCount ?? 0) / 7) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA per phase */}
            <div className="flex flex-wrap gap-3">
              {phase.id === 1 && (
                <Button
                  onClick={onCreate}
                  disabled={isCreating}
                  className="btn-primary-glow h-11 px-7 text-[11px] font-bold uppercase tracking-wide"
                >
                  {isCreating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                       Créer l'équipe
                      <ChevronRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
              {(phase.id === 2 || phase.id === 3) && squad && (
                <Button
                  onClick={onCopy}
                  variant="outline"
                  className="h-11 px-7 text-[11px] font-bold uppercase tracking-wide border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isCopying ? (
                    <><Check className="size-4 mr-2" />Copié !</>
                  ) : (
                    <><Copy className="size-4 mr-2" />Copier le lien d&apos;invitation</>
                  )}
                </Button>
              )}
              {(phase.id === 4 || phase.id === 5 || phase.id === 6) && (
                <p className="text-[11px] text-zinc-600 font-mono italic">
                  Les check-ins quotidiens de tes membres boostent automatiquement la cohésion.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Locked: show unlock hint */}
        {status === "locked" && phase.unlockHint && (
          <p className="mt-3 text-[10px] font-mono text-zinc-800 flex items-center gap-1.5">
            <Lock className="size-3" />
            {phase.unlockHint}
          </p>
        )}
      </div>
    </div>
  )
}
