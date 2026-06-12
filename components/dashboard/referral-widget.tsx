"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Users, Zap, Gift } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ReferralData {
  referralCode: string
  referralCount: number
  referrals: { id: string; name: string; pseudo: string; image: string; class: string; level: number; createdAt: string }[]
}

export function ReferralWidget() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/referral")
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const referralLink = data
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/signin?ref=${data.referralCode}`
    : ""

  const copyLink = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    toast.success("Lien de parrainage copié !")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const xpEarned = (data?.referralCount ?? 0) * 100

  return (
    <div className="space-y-4">
      <p className="text-[9px] sm:text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
        Programme de Parrainage
        <div className="h-px bg-white/5 flex-1" />
        {xpEarned > 0 && (
          <span className="text-primary font-bold">+{xpEarned} XP gagnés</span>
        )}
      </p>

      <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/3 border border-white/5 p-3 text-center space-y-1">
            <div className="text-xl font-extrabold text-white tabular-nums">{data?.referralCount ?? 0}</div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase">Filleuls</div>
          </div>
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-3 text-center space-y-1">
            <div className="text-xl font-extrabold text-primary tabular-nums">100</div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase">XP / filleul</div>
          </div>
          <div className="rounded-2xl bg-white/3 border border-white/5 p-3 text-center space-y-1">
            <div className="text-xl font-extrabold text-white tabular-nums">{xpEarned}</div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase">XP total</div>
          </div>
        </div>

        {/* How it works */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-primary/3 border border-primary/10">
          <Gift className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Partage ton lien. Quand un(e) ami(e) rejoint HASHCODE et complète son onboarding, tu gagnes automatiquement <span className="text-primary font-bold">100 XP</span>.
          </p>
        </div>

        {/* Referral link */}
        {loading ? (
          <div className="h-11 bg-zinc-800/60 rounded-2xl animate-pulse" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 bg-zinc-950 border border-white/8 rounded-2xl px-3 py-2.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-600 shrink-0">hashcode.app/signin?ref=</span>
              <span className="text-[11px] font-mono font-bold text-primary truncate">{data?.referralCode}</span>
            </div>
            <button
              onClick={copyLink}
              className={cn(
                "shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center border transition-all",
                copied
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-white/3 border-white/8 text-zinc-400 hover:border-primary/20 hover:text-primary"
              )}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
        )}

        {/* Referral list */}
        {data && data.referrals.length > 0 && (
          <div className="space-y-2.5 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
              <Users className="size-3" /> Tes filleuls
            </div>
            <div className="space-y-2">
              {data.referrals.map(r => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-white/5 bg-white/1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="size-7 rounded-xl border border-white/10 shrink-0">
                      <AvatarImage src={r.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold rounded-xl">
                        {(r.pseudo || r.name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">@{r.pseudo || r.name?.split(" ")[0]}</div>
                      <div className="text-[9px] font-mono text-zinc-600 uppercase">LVL {r.level} · {r.class || "Agent"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-primary font-bold shrink-0">
                    <Zap className="size-3" /> +100 XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
