"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Users,
  Award,
  Activity,
  ChevronRight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NeuralEvent {
  id: string
  type: "MISSION_SUBMISSION" | "LEVEL_UP" | "SQUAD_CREATED" | "USER_JOINED"
  user: {
    name: string
    avatar?: string | null
    class?: string | null
  }
  meta?: string
  timestamp: string
}

export function NeuralFeed() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const r = await fetch("/api/feed")
      if (!r.ok) throw new Error(`Feed HTTP ${r.status}`)
      const d = await r.json()
      return d.events as NeuralEvent[]
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
  const events = data ?? []

  const getIcon = (type: string) => {
    switch (type) {
      case "MISSION_SUBMISSION": return <Zap className="size-3 text-primary" />
      case "LEVEL_UP": return <Award className="size-3 text-purple-400" />
      case "SQUAD_CREATED": return <Users className="size-3 text-blue-400" />
      default: return <Activity className="size-3 text-zinc-500" />
    }
  }

  const getIconDesc = (type: string) => {
    switch (type) {
      case "MISSION_SUBMISSION": return "Mission validée"
      case "LEVEL_UP": return "Montée en grade"
      case "SQUAD_CREATED": return "Nouvelle unité"
      case "USER_JOINED": return "Nouvel agent"
      default: return "Activité système"
    }
  }

  const getLabel = (event: NeuralEvent) => {
    switch (event.type) {
      case "MISSION_SUBMISSION": return `a validé une mission`
      case "LEVEL_UP": return `a franchi un nouveau palier`
      case "SQUAD_CREATED": return `a activé une nouvelle Squad`
      case "USER_JOINED": return `a synchronisé son signal`
      default: return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="size-4 text-primary" />
          </div>
          <h3 className="text-[10px] font-mono font-bold tracking-tight text-zinc-500">
            Activité récente
          </h3>
        </div>
        <span className="text-[9px] font-mono text-primary font-bold">LIVE</span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"
              >
                <div className="size-8 rounded-lg bg-zinc-800 shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-zinc-800 rounded" />
                  <div className="h-2.5 w-40 bg-zinc-800/70 rounded" />
                </div>
              </div>
            ))}
          </>
        ) : isError ? (
          <p className="text-center text-[11px] font-mono text-rose-700/80 py-6">
            Erreur de chargement — réessaie dans un instant.
          </p>
        ) : events.length === 0 ? (
          <p className="text-center text-[11px] font-mono text-zinc-600 py-6">
            Aucune activité récente
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all cursor-default overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative shrink-0 mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="size-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center cursor-help">
                          {getIcon(event.type)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                        {getIconDesc(event.type)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {idx === 0 && (
                    <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full shadow-[0_0_8px_#B8FF3B]" />
                  )}
                </div>

                <div className="relative flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                      @{event.user.name.toLowerCase().replace(" ", "_")}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600 lowercase">{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    {getLabel(event)}
                  </p>
                  {event.user.class && (
                    <div className="mt-2 flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help group/signal">
                              <div className="h-0.5 w-4 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary/40 w-1/2" />
                              </div>
                              <span className="text-[8px] font-mono font-bold text-zinc-600 tracking-tight group-hover/signal:text-zinc-400 transition-colors">
                                signal: {event.user.class}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono">
                            Vecteur d&apos;identité tech détecté.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <button className="w-full group py-3 px-4 rounded-xl border border-dashed border-white/10 hover:border-primary/30 text-zinc-600 hover:text-primary transition-all flex items-center justify-center gap-2">
        <span className="text-[9px] font-mono font-bold tracking-tight">Voir toute l&apos;activité</span>
        <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}
