"use client"

import { CheckCircle2, User, Users, Target, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
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
      completed: true, // If they are here, quiz is done
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

  const allCompleted = steps.every(s => s.completed)
  if (allCompleted) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-widest">Guide_d&apos;activation_du_signal</h3>
        </div>
        <span className="text-[10px] font-mono text-primary font-bold">
          {steps.filter(s => s.completed).length} / {steps.length} ÉTAPES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <Card 
              key={step.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 group",
                step.completed 
                  ? "bg-emerald-500/5 border-emerald-500/20" 
                  : "glass-card hover:border-primary/30"
              )}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2 rounded-lg border transition-colors",
                    step.completed 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-white/5 border-white/5 text-zinc-500 group-hover:text-primary group-hover:border-primary/20"
                  )}>
                    <Icon className="size-4" />
                  </div>
                  {step.completed ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <div className="text-[9px] font-mono font-bold text-primary">+{step.xp} XP</div>
                  )}
                </div>

                <div className="space-y-1 mb-4 flex-1">
                  <h4 className={cn(
                    "text-xs font-black uppercase tracking-tight italic",
                    step.completed ? "text-emerald-500/80" : "text-white"
                  )}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    {step.description}
                  </p>
                </div>

                {!step.completed && (
                  <Button asChild variant="ghost" size="sm" className="w-full h-8 text-[9px] font-mono font-bold text-primary hover:text-primary hover:bg-primary/10 border border-primary/10">
                    <Link href={step.href}>
                      Initialiser <ChevronRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
              
              {/* Background accent for completed steps */}
              {step.completed && (
                <div className="absolute -bottom-4 -right-4 size-16 bg-emerald-500/10 blur-2xl rounded-full" />
              )}
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}


