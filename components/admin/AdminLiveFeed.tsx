"use client"

import { useState, useEffect } from "react"
import { Activity, UserPlus, Zap, Sword, ScrollText } from "lucide-react"

interface FeedEvent {
  id: string
  type: string
  user: { name: string; image?: string }
  meta?: string
  timestamp: string
}

const FEED_ICONS: Record<string, { icon: typeof Activity; color: string }> = {
  USER_SIGNUP: { icon: UserPlus, color: "text-emerald-400" },
  MISSION_APPROVED: { icon: Zap, color: "text-primary" },
  SQUAD_CREATED: { icon: Sword, color: "text-violet-400" },
}

export function AdminLiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([])

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch("/api/feed")
        if (res.ok) {
          const data = await res.json()
          setEvents(data.events ?? [])
        }
      } catch {}
    }
    fetchFeed()
    const interval = setInterval(fetchFeed, 30000)
    return () => clearInterval(interval)
  }, [])

  if (events.length === 0) {
    return <p className="text-sm text-zinc-600 font-mono py-4 text-center italic">En attente d'événements...</p>
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
      {events.map((e) => {
        const cfg = FEED_ICONS[e.type] ?? { icon: ScrollText, color: "text-zinc-400" }
        const Icon = cfg.icon
        return (
          <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <Icon className={`size-4 shrink-0 ${cfg.color}`} />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-white">{e.user.name} </span>
              <span className="text-[10px] text-zinc-500">
                {e.type === "USER_SIGNUP" ? "vient de rejoindre" :
                 e.type === "MISSION_APPROVED" ? "a validé une mission" :
                 e.type === "SQUAD_CREATED" ? "a créé une escouade" :
                 e.type.replace(/_/g, " ").toLowerCase()}
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-700 shrink-0">
              {new Date(e.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )
      })}
    </div>
  )
}
