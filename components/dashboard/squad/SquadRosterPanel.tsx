"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, UserMinus, Crown, Loader2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { SquadData } from "@/components/dashboard/squad-journey"

interface RosterMember {
  id: string
  role: string
  user?: { id: string; name?: string | null; pseudo?: string | null; image?: string | null; class?: string | null; level?: number | null }
}

interface RosterUser {
  id: string
}

function getClassStyle(cls?: string | null) {
  const c = cls?.toLowerCase()
  if (c === "builder") return "text-primary bg-primary/10 border-primary/20"
  if (c === "creator") return "text-purple-400 bg-purple-500/10 border-purple-500/20"
  if (c === "strategist") return "text-blue-400 bg-blue-500/10 border-blue-500/20"
  if (c === "catalyst") return "text-amber-400 bg-amber-500/10 border-amber-500/20"
  return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
}

interface SquadRosterPanelProps {
  squad: SquadData
  user: RosterUser
  isLeader: boolean
  memberCount: number
}

export function SquadRosterPanel({ squad, user, isLeader, memberCount }: SquadRosterPanelProps) {
  const router = useRouter()
  const [kickingId, setKickingId] = useState<string | null>(null)
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  const kickMember = async (memberId: string) => {
    setKickingId(memberId)
    try {
      const res = await fetch("/api/squad/join-request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, action: "remove" }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Membre retiré de l'escouade.")
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'expulsion.")
    } finally {
      setKickingId(null)
    }
  }

  const transferOwnership = async (targetMemberId: string) => {
    setIsTransferring(true)
    try {
      const res = await fetch("/api/squad/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetMemberId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Erreur lors du transfert.")
      toast.success("Leadership transféré avec succès.")
      setTransferTargetId(null)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du transfert.")
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="size-4 text-primary" />
        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
          Roster · {memberCount}/5
        </span>
      </div>
      <div className="space-y-2.5">
        {squad.members?.map((m) => {
          const member = m as RosterMember
          const isSelf = member.user?.id === user.id
          const isOwner = m.role === "owner"
          const canActOn = isLeader && !isSelf && !isOwner

          return (
            <div key={member.user?.id} className="group flex items-center justify-between gap-3 p-3 rounded-2xl border border-white/3 bg-white/1 hover:border-white/8 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-9 rounded-xl border border-white/10 shrink-0">
                  <AvatarImage src={member.user?.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm rounded-xl">
                    {(member.user?.pseudo || member.user?.name || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                    @{member.user?.pseudo || member.user?.name?.split(" ")[0]}
                    {isSelf && (
                      <span className="text-[7px] font-bold font-mono bg-primary/20 text-primary px-1.5 py-0.2 rounded-md uppercase shrink-0">
                        Moi
                      </span>
                    )}
                    {isOwner && !isSelf && <Crown className="size-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">
                    LVL {member.user?.level ?? 1} · {isOwner ? "Chef" : member.role === "admin" ? "Admin" : "Membre"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {canActOn && (
                  <>
                    {transferTargetId === member.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => transferOwnership(member.id)}
                          disabled={isTransferring}
                          className="text-[9px] font-mono font-bold text-amber-400 border border-amber-500/30 rounded-lg px-2 py-1 hover:bg-amber-500/10 transition-colors"
                        >
                          {isTransferring ? <Loader2 className="size-3 animate-spin" /> : "Confirmer"}
                        </button>
                        <button onClick={() => setTransferTargetId(null)} className="text-zinc-600 hover:text-white transition-colors p-1">
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setTransferTargetId(member.id)}
                        title="Transférer le leadership"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                      >
                        <Crown className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => kickMember(member.id)}
                      disabled={kickingId === member.id}
                      title="Expulser de l'escouade"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      {kickingId === member.id ? <Loader2 className="size-3.5 animate-spin" /> : <UserMinus className="size-3.5" />}
                    </button>
                  </>
                )}
                <span className={cn(
                  "text-[8px] font-bold font-mono border px-2 py-0.5 rounded-full uppercase tracking-wider",
                  getClassStyle(member.user?.class)
                )}>
                  {member.user?.class || "Agent"}
                </span>
              </div>
            </div>
          )
        })}
        {Array.from({ length: 5 - memberCount }).map((_, i) => (
          <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-white/5 bg-white/0.5 opacity-30">
            <div className="size-9 rounded-xl border border-dashed border-white/15 flex items-center justify-center shrink-0">
              <UserPlus className="size-4 text-zinc-500" />
            </div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Emplacement libre</div>
          </div>
        ))}
      </div>
    </div>
  )
}
