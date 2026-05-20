"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  Users, 
  Award, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

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

// Simulated data for the "alive" feeling in dev
const SIMULATED_EVENTS: NeuralEvent[] = [
  {
    id: "1",
    type: "MISSION_SUBMISSION",
    user: { name: "Neo", class: "builder" },
    meta: "Architecture Neurale",
    timestamp: "2m",
  },
  {
    id: "2",
    type: "LEVEL_UP",
    user: { name: "Trinity", class: "creator" },
    meta: "Niveau 3 reached",
    timestamp: "5m",
  },
  {
    id: "3",
    type: "SQUAD_CREATED",
    user: { name: "Morpheus" },
    meta: "Escouade 'Nebuchadnezzar'",
    timestamp: "12m",
  },
]

export function NeuralFeed() {
  const [events, setEvents] = useState<NeuralEvent[]>(SIMULATED_EVENTS)
  const [isSyncing, setIsSyncing] = useState(false)

  // Simulation of incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true)
      setTimeout(() => setIsSyncing(false), 2000)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "MISSION_SUBMISSION": return <Zap className="size-3 text-primary" />
      case "LEVEL_UP": return <Award className="size-3 text-purple-400" />
      case "SQUAD_CREATED": return <Users className="size-3 text-blue-400" />
      default: return <Activity className="size-3 text-zinc-500" />
    }
  }

  const getLabel = (event: NeuralEvent) => {
    switch (event.type) {
      case "MISSION_SUBMISSION": return `a soumis ${event.meta}`
      case "LEVEL_UP": return `est passé ${event.meta}`
      case "SQUAD_CREATED": return `a créé ${event.meta}`
      case "USER_JOINED": return `a rejoint le réseau`
      default: return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="size-4 text-primary" />
            {isSyncing && (
              <motion.div 
                layoutId="sync-ping"
                className="absolute inset-0 rounded-full bg-primary/40"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <h3 className="text-[10px] font-mono font-bold tracking-tight text-zinc-500">
            flux_neuronal_
          </h3>
        </div>
        <span className="text-[9px] font-mono text-primary font-bold">LIVE</span>
      </div>

      <div className="space-y-3">
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
                <div className="size-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                  {getIcon(event.type)}
                </div>
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
                    <div className="h-0.5 w-4 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 w-1/2" />
                    </div>
                    <span className="text-[8px] font-mono font-bold text-zinc-600 tracking-tight">
                      signal: {event.user.class}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="w-full group py-3 px-4 rounded-xl border border-dashed border-white/10 hover:border-primary/30 text-zinc-600 hover:text-primary transition-all flex items-center justify-center gap-2">
        <span className="text-[9px] font-mono font-bold tracking-tight">connectivité_globale</span>
        <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 space-y-3">
        <div className="flex items-center gap-2 text-primary/60">
          <ShieldCheck className="size-3" />
          <span className="text-[9px] font-mono font-bold tracking-tight">état_du_réseau</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-zinc-500">Node Latency</span>
            <span className="text-white">12ms</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary/40 w-[92%]" />
          </div>
        </div>
      </div>
    </div>
  )
}
