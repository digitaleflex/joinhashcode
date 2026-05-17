"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const EVENTS = [
  { prefix: "PROFIL_DÉTECTÉ", color: "text-[#B8FF3B]", templates: ["[BUILDER] identifié — {city}", "[BUILDER] rejoint la guilde — {city}"] },
  { prefix: "MISSION_VALIDÉE", color: "text-[#22D3EE]", templates: ["Protocol Connexion complété — {city}", "Ancrage Initial validé — {city}"] },
  { prefix: "CLASSE_ASSIGNÉE", color: "text-[#A855F7]", templates: ["[CREATOR] activé — {city}", "[STRATEGIST] embarqué — {city}"] },
  { prefix: "NŒUD_SYNCHRONISÉ", color: "text-[#F97316]", templates: ["[CATALYST] intégré — {city}", "Réseau étendu — {city}"] },
]

const CITIES = [
  "Dakar", "Abidjan", "Lagos", "Douala", "Yaoundé",
  "Casablanca", "Tunis", "Accra", "Nairobi", "Abuja",
  "Bamako", "Lomé", "Cotonou", "Kinshasa", "Kampala",
  "Kigali", "Libreville", "Conakry", "Ouagadougou", "Antananarivo"
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function ActivityFeed() {
  const [logs, setLogs] = useState<{ id: number; text: string; prefix: string; color: string }[]>([])

  useEffect(() => {
    const generate = () => {
      const event = randomFrom(EVENTS)
      const city = randomFrom(CITIES)
      const template = randomFrom(event.templates).replace("{city}", city)
      setLogs(prev => [{ id: Date.now(), text: template, prefix: event.prefix, color: event.color }, ...prev].slice(0, 6))
    }

    generate()
    const interval = setInterval(generate, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-zinc-950 border-y border-white/5 py-3 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 flex items-center gap-6">
        {/* Status */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="w-2 h-2 bg-[#B8FF3B] rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-[#B8FF3B] rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8FF3B] font-bold">
            Réseau_Live
          </span>
        </div>

        {/* Logs */}
        <div className="flex-1 flex gap-10 overflow-hidden items-center">
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
                className="shrink-0 flex items-center gap-2"
              >
                <span className={`font-mono text-[10px] font-bold ${log.color}`}>
                  {log.prefix}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-tighter">
                  {log.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 border-l border-white/10 pl-6">
          <div className="text-right">
            <div className="font-mono text-[11px] text-white font-bold tracking-tighter">20_PAYS</div>
            <div className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Afrique & Diaspora</div>
          </div>
        </div>
      </div>
    </div>
  )
}
