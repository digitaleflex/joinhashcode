"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Activity {
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

  // Mapper les types d'actions vers des libellés lisibles
  const getActionLabel = (action: string, className: string | null) => {
    switch (action) {
      case "USER_SIGNUP": return `[${className || 'TALENT'}] a rejoint l'infrastructure`
      case "QUIZ_COMPLETED": return `Profil détecté — ${className || 'Analyse...'}`
      case "MISSION_APPROVED": return `Mission validée avec succès`
      case "SQUAD_JOINED": return `Escouade synchronisée`
      default: return `Signal reçu`
    }
  }

  const getPrefix = (action: string) => {
    switch (action) {
      case "USER_SIGNUP": return "NOUVEAU_MEMBRE"
      case "QUIZ_COMPLETED": return "SCAN_TERMINÉ"
      case "MISSION_APPROVED": return "NODE_VALIDÉ"
      case "SQUAD_JOINED": return "SQUAD_SYNC"
      default: return "LOG_SYSTEM"
    }
  }

  const getColor = (action: string) => {
    switch (action) {
      case "USER_SIGNUP": return "text-[#B8FF3B]"
      case "QUIZ_COMPLETED": return "text-[#22D3EE]"
      case "MISSION_APPROVED": return "text-[#A855F7]"
      case "SQUAD_JOINED": return "text-[#F97316]"
      default: return "text-zinc-500"
    }
  }

  return (
    <div className="w-full bg-zinc-950 border-y border-white/5 py-2 sm:py-3 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-linear-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-linear-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 flex items-center gap-4 sm:gap-6">
        {/* Status */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
            <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-tight text-primary font-black">
            flux_temporel
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
                  <span className={`font-mono text-[9px] sm:text-[10px] font-black uppercase ${getColor(log.action)}`}>
                    {getPrefix(log.action)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 font-bold tracking-tight">
                    {getActionLabel(log.action, log.user.class)} — {log.user.city || 'Nexus'}
                  </span>
                </motion.div>
              ))
            ) : (
              <span className="font-mono text-[10px] text-zinc-700 italic">Initialisation du flux de données...</span>
            )}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 border-l border-white/10 pl-6">
          <div className="text-right">
            <div className="font-mono text-[11px] text-white font-black tracking-tighter uppercase italic">Signal_Stable</div>
            <div className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Latency: 24ms</div>
          </div>
        </div>
      </div>
    </div>
  )
}
