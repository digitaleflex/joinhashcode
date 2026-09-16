"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import type { NavUser } from "@/lib/types"
import type { SquadData } from "@/components/dashboard/squad-journey"

interface SquadBannerProps {
  user: NavUser | null
  squad: SquadData | null
}

export function SquadBanner({ user, squad }: SquadBannerProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [squadName, setSquadName] = useState("")
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const memberCount = squad?.members?.length ?? 0
  const pseudo = user?.pseudo || user?.name?.split(" ")[0] || ""
  const inviteLink = squad
    ? `${origin}/invite/${squad.slug || pseudo.toLowerCase()}`
    : null

  const copyInvite = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    toast.success("Lien d'invitation copié !")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createSquad = async () => {
    if (!squadName.trim()) {
      toast.error("Donne un nom à ton escouade.")
      return
    }
    setIsCreating(true)
    try {
      const res = await fetch("/api/squad/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: squadName.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || "Erreur lors de la création.")
      }
      toast.success("Escouade créée !")
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création, réessaie.")
    } finally {
      setIsCreating(false)
    }
  }

  const remaining = 5 - memberCount

  return (
    <div className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
      {/* Icon + count */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Users className="size-5 text-amber-400" />
        </div>
        <div>
          <div className="text-3xs font-mono font-black uppercase text-amber-500">
            Escouade requise
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-lg font-black text-white tracking-tighter cursor-help">
                  {memberCount}
                  <span className="text-zinc-600 font-light">/5 membres</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono max-w-48">
                Une escouade complète (5) débloque des missions avancées et multiplie la vitalité de chaque membre.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Progress dots + message */}
      <div className="flex-1 space-y-2">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i < memberCount ? "bg-amber-400" : "bg-white/5"
              )}
            />
          ))}
        </div>
        <p className="text-sm-plus text-zinc-500 leading-snug">
          {!squad
            ? "Crée ton escouade pour débloquer les missions avancées et les récompenses collectives."
            : `Encore ${remaining} membre${remaining > 1 ? "s" : ""} pour activer la cohésion et les bonus de groupe.`}
        </p>
      </div>

      {/* CTA */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        {!squad ? (
          <>
            <input
              type="text"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="Nom de l'escouade"
              maxLength={40}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-xs font-bold placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all"
            />
            <Button
              onClick={createSquad}
              disabled={isCreating || !squadName.trim()}
              size="sm"
              className="btn-primary-glow h-9 rounded-xl px-5 text-xs font-black uppercase tracking-wider"
            >
              {isCreating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Créer mon escouade"
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={copyInvite}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl px-5 text-xs font-black uppercase tracking-wider border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          >
            {copied ? (
              <Check className="size-3 mr-1.5" />
            ) : (
              <Copy className="size-3 mr-1.5" />
            )}
            {copied ? "Copié !" : "Inviter"}
          </Button>
        )}
      </div>
    </div>
  )
}
