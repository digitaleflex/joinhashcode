"use client"

import { motion } from "framer-motion"
import { Check, Zap, Users, Target, UserCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  icon: React.ElementType
  title: string
  desc: string
  href: string
  done: boolean
  xp: number
}

interface NextStepsCardProps {
  hasMissions: boolean
  hasSquad: boolean
  hasCheckin: boolean
  hasProfile: boolean // pseudo + country filled
}

export function NextStepsCard({ hasMissions, hasSquad, hasProfile }: Omit<NextStepsCardProps, "hasCheckin">) {
  const steps: Step[] = [
    {
      id: "profile",
      icon: UserCircle,
      title: "Calibrer ton identité",
      desc: "Pseudo, pays, spécialités — finalise ta configuration pour que le réseau te reconnaisse.",
      href: "/settings",
      done: hasProfile,
      xp: 50,
    },
    {
      id: "squad",
      icon: Users,
      title: "Rejoindre une unité",
      desc: "Ne build pas en solo. Rallie une squad active de 5 membres pour multiplier ta progression.",
      href: "/squad",
      done: hasSquad,
      xp: 100,
    },
    {
      id: "mission",
      icon: Target,
      title: "Première preuve de travail",
      desc: "Choisis ta mission d'initialisation. Soumets ton travail, sois reviewé, gagne ton grade.",
      href: "/missions",
      done: hasMissions,
      xp: 200,
    },
  ]

  const doneCount = steps.filter(s => s.done).length
  const totalCount = steps.length
  const progress = Math.round((doneCount / totalCount) * 100)

  // All done → hide the card
  if (doneCount === totalCount) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl bg-white/2 border border-white/8 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-white">Prochaines étapes</h3>
              <p className="text-[10px] text-zinc-500 font-mono">{doneCount}/{totalCount} complétées</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-zinc-600 font-mono uppercase mb-1">Activation</div>
            <div className="text-lg font-black text-primary">{progress}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-white/5">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={step.done ? "#" : step.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 transition-colors group",
                  step.done
                    ? "opacity-50 cursor-default"
                    : "hover:bg-white/3 cursor-pointer"
                )}
              >
                {/* Status circle */}
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  step.done
                    ? "bg-primary border-primary"
                    : "border-white/15 bg-transparent group-hover:border-primary/40"
                )}>
                  {step.done
                    ? <Check className="w-3.5 h-3.5 text-black" />
                    : <Icon className="w-3 h-3 text-zinc-600 group-hover:text-primary/60 transition-colors" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold leading-tight",
                    step.done ? "line-through text-zinc-500" : "text-white"
                  )}>
                    {step.title}
                  </p>
                  {!step.done && (
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  )}
                </div>

                {/* XP badge + arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  {!step.done && (
                    <span className="text-[9px] font-mono font-bold text-primary/60 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                      +{step.xp} XP
                    </span>
                  )}
                  {!step.done && (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
