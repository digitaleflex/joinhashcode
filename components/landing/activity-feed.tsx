"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Shield, Zap } from "lucide-react"

const LOG_TEMPLATES = [
  { prefix: "IDENTIFIED", color: "text-primary" },
  { prefix: "SYNC_NODE", color: "text-blue-400" },
  { prefix: "DECRYPT", color: "text-purple-400" },
  { prefix: "VALIDATE", color: "text-emerald-400" },
]

const CLASSES = ["BUILDER", "STRATEGIST", "CREATOR", "CATALYST"]
const REGIONS = ["FR", "US", "DE", "UK", "JP", "CA"]

export function ActivityFeed() {
  const [logs, setLogs] = useState<{ id: number; text: string; color: string }[]>([])

  useEffect(() => {
    const generateLog = () => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
      const profile = CLASSES[Math.floor(Math.random() * CLASSES.length)]
      const region = REGIONS[Math.floor(Math.random() * REGIONS.length)]
      const node = Math.floor(Math.random() * 9999)
      
      let text = ""
      if (template.prefix === "IDENTIFIED") {
        text = `[${profile}] detected in cluster ${region}-${node}`
      } else if (template.prefix === "SYNC_NODE") {
        text = `Node ${node} synchronized with global backbone`
      } else {
        text = `${template.prefix} protocol v4.2 active on node ${node}`
      }

      const newLog = {
        id: Date.now(),
        text: `${template.prefix}: ${text}`,
        color: template.color
      }

      setLogs(prev => [newLog, ...prev].slice(0, 5))
    }

    const interval = setInterval(generateLog, 3000)
    generateLog() // Initial log
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-zinc-950 border-y border-white/5 py-3 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-zinc-950 to-transparent z-10" />

      <div className="mx-auto max-w-6xl px-4 flex items-center gap-8">
        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            Live_Feed
          </span>
        </div>

        {/* Rolling Logs */}
        <div className="flex-1 flex gap-12 overflow-hidden items-center">
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="shrink-0 flex items-center gap-2"
              >
                <span className={`font-mono text-[10px] font-bold ${log.color}`}>
                  {log.text.split(':')[0]}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-tighter">
                  {log.text.split(':')[1]}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Counter */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 border-l border-white/10 pl-8">
          <div className="text-right">
            <div className="font-mono text-[11px] text-white font-bold tracking-tighter">421_NODES</div>
            <div className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Global Network</div>
          </div>
          <Shield className="w-4 h-4 text-zinc-700" />
        </div>
      </div>
    </div>
  )
}
