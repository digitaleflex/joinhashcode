"use client"

import { Check, User, Users, Target, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import type { UserProfile } from "@/lib/types"
interface ActivationChecklistProps {
  user: UserProfile
  hasSquad: boolean
  hasSubmission: boolean
}

export function ActivationChecklist({ user, hasSquad, hasSubmission }: ActivationChecklistProps) {
  const steps = [
    {
      id: "quiz",
      title: "Calibration terminée",
      description: "Ton profil psychométrique est actif.",
      icon: Sparkles,
      completed: true,
      href: "/quiz",
      xp: 25
    },
    {
      id: "profile",
      title: "Identité configurée",
      description: "Ajoute un pseudo et tes réseaux.",
      icon: User,
      completed: !!user.pseudo && (!!user.githubUrl || !!user.linkedinUrl),
      href: "/settings",
      xp: 50
    },
    {
      id: "squad" as const,
      title: "Unité active",
      description: "Rejoins ou crée ta première Squad.",
      icon: Users,
      completed: hasSquad,
      href: "/squad",
      xp: 50
    },
    {
      id: "mission",
      title: "Premier Build",
      description: "Soumets ta toute première mission.",
      icon: Target,
      completed: hasSubmission,
      href: "/missions",
      xp: 100
    }
  ]

  const completedCount = steps.filter(s => s.completed).length
  const allCompleted = completedCount === steps.length
  if (allCompleted) return null

  // Find the next incomplete step
  const nextStep = steps.find(s => !s.completed)

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-widest">progression</h3>
        </div>
        <span className="text-[10px] font-mono text-primary font-bold">
          {completedCount} / {steps.length} ÉTAPES
        </span>
      </div>

      {/* Compact progress bar instead of 4 cards */}
      <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-3 mb-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "size-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                step.completed 
                  ? "bg-emerald-500/20 text-emerald-500" 
                  : "bg-white/5 text-zinc-600 border border-white/10"
              )}>
                {step.completed ? (
                  <Check className="size-3" />
                ) : (
                  <span className="text-[9px] font-mono font-bold">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px",
                  step.completed ? "bg-emerald-500/30" : "bg-white/5"
                )} />
              )}
            </div>
          ))}
        </div>

        {nextStep && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <nextStep.icon className="size-4 text-zinc-500" />
              <div>
                <p className="text-xs font-bold text-white">Prochaine étape : {nextStep.title}</p>
                <p className="text-[10px] text-zinc-500">{nextStep.description}</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10">
              <Link href={nextStep.href}>
                +{nextStep.xp} XP
                <ChevronRight className="size-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}


