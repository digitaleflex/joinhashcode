"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Loader2, UserCheck, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface SquadJoinRequestsPanelProps {
  squad: any
  isLeader: boolean
  memberCount: number
}

export function SquadJoinRequestsPanel({ squad, isLeader, memberCount }: SquadJoinRequestsPanelProps) {
  const router = useRouter()
  const [joinRequests, setJoinRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [respondingId, setRespondingId] = useState<string | null>(null)

  const fetchJoinRequests = useCallback(async () => {
    if (!squad?.id || !isLeader) return
    setLoadingRequests(true)
    try {
      const res = await fetch(`/api/squad/join-request?organizationId=${squad.id}`)
      if (res.ok) setJoinRequests(await res.json())
    } catch {}
    finally { setLoadingRequests(false) }
  }, [squad?.id, isLeader])

  const respondToRequest = async (requestId: string, action: "accept" | "reject") => {
    setRespondingId(requestId)
    try {
      const res = await fetch("/api/squad/join-request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success(action === "accept" ? "Membre accepté !" : "Demande refusée.")
      setJoinRequests(prev => prev.filter(r => r.id !== requestId))
      if (action === "accept") router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Erreur.")
    } finally {
      setRespondingId(null)
    }
  }

  useEffect(() => {
    fetchJoinRequests()
  }, [fetchJoinRequests])

  if (!squad || !isLeader) return null

  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-primary" />
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Candidatures</span>
          {joinRequests.length > 0 && (
            <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-mono">
              {joinRequests.length}
            </span>
          )}
        </div>
        <button
          onClick={fetchJoinRequests}
          disabled={loadingRequests}
          className="text-[10px] font-mono text-zinc-600 hover:text-primary transition-colors"
        >
          {loadingRequests ? <Loader2 className="size-3.5 animate-spin" /> : "↻"}
        </button>
      </div>

      {loadingRequests ? (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-zinc-600" />
        </div>
      ) : joinRequests.length === 0 ? (
        <p className="text-[11px] text-zinc-600 font-mono">Aucune demande en attente.</p>
      ) : (
        <div className="space-y-2.5">
          {joinRequests.map((req: any) => (
            <div key={req.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-white/5 bg-white/1">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-8 rounded-xl border border-white/10 shrink-0">
                  <AvatarImage src={req.user.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xs rounded-xl">
                    {(req.user.name || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{req.user.name}</div>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">
                    LVL {req.user.level ?? 1} · {req.user.class || "Agent"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => respondToRequest(req.id, "accept")}
                  disabled={respondingId === req.id || memberCount >= 5}
                  title={memberCount >= 5 ? "Escouade complète" : "Accepter"}
                  className="p-1.5 rounded-lg text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all disabled:opacity-40"
                >
                  {respondingId === req.id ? <Loader2 className="size-3.5 animate-spin" /> : <UserCheck className="size-3.5" />}
                </button>
                <button
                  onClick={() => respondToRequest(req.id, "reject")}
                  disabled={respondingId === req.id}
                  title="Refuser"
                  className="p-1.5 rounded-lg text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all disabled:opacity-40"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
