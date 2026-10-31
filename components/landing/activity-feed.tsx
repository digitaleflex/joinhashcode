"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Activity {
  id: string
  user: {
    name: string
    city: string | null
    class: string | null
  }
  action: string
  createdAt: string
}

export function ActivityFeed({ initialActivities }: { initialActivities?: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities || [])

  // Mapper les types d'actions vers des libellés lisibles — [Prénom], [Profil] à [Ville] a [action]
  const getActionLabel = (action: string, className: string | null) => {
    const profile = className || 'Builder'
    switch (action) {
      case "USER_SIGNUP": return `${profile} à rejoint la communauté`
      case "QUIZ_COMPLETED": return `${profile} a découvert son profil`
      case "MISSION_APPROVED": return `${profile} a validé une mission`
      case "SQUAD_JOINED": return `${profile} a rejoint une équipe`
      default: return `Action en cours`
    }
  }

  const getPrefix = (action: string) => {
    switch (action) {
      case "USER_SIGNUP": return "NOUVEAU_MEMBRE"
      case "QUIZ_COMPLETED": return "PROFIL IDENTIFIÉ"
      case "MISSION_APPROVED": return "MISSION ACCOMPLIE"
      case "SQUAD_JOINED": return "ÉQUIPE FORMÉE"
      default: return "ACTION"
    }
  }

  const getColor = (action: string) => {
    switch (action) {
      case "USER_SIGNUP": return "text-[#B8FF3B]"
      case "QUIZ_COMPLETED": return "text-[#22D3EE]"
      case "MISSION_APPROVED": return "text-[#A855F7]"
      case "SQUAD_JOINED": return "text-[#F97316]"
      default: return "text-muted-foreground"
    }
  }

  return (
    <div className="w-full bg-background border-y border-border py-2 sm:py-3 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-linear-to-r from-background to-transparent z-[var(--z-content)] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-linear-to-l from-background to-transparent z-[var(--z-content)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 flex items-center gap-4 sm:gap-6">
        {/* Status */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
            <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-mono text-3xs sm:text-xs uppercase tracking-tight text-primary font-black">
            Activité récente
          </span>
        </div>

        {/* Logs */}
        <div className="flex-1 flex gap-6 sm:gap-10 overflow-hidden items-center">
          <AnimatePresence mode="popLayout">
            {activities.length > 0 ? (
              activities.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 flex items-center gap-2"
                >
                  <span className={`font-mono text-3xs sm:text-xs font-black uppercase ${getColor(log.action)}`}>
                    {getPrefix(log.action)}
                  </span>
                  <span className="font-mono text-3xs sm:text-xs text-muted-foreground font-bold tracking-tight">
                    {log.user.name} · {getActionLabel(log.action, log.user.class)} · {log.user.city || 'Nexus'}
                  </span>
                </motion.div>
              ))
            ) : (
              <span className="font-mono text-xs text-muted-foreground italic">Chargement de l'activité...</span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
