"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe, MessageSquare, CheckCircle2, ArrowLeft,
  Send, Loader2, Shield, Sparkles, Users, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { COMMUNITY_LINKS } from "@/lib/config"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

const CHANNELS = [
  {
    id: "telegram" as const,
    label: "Telegram",
    icon: Globe,
    url: COMMUNITY_LINKS.telegram,
    color: "bg-[#0088cc]",
    borderColor: "border-[#0088cc]/50",
    bgColor: "bg-[#0088cc]/10",
    placeholder: "Pseudo Telegram (ex: @mon_pseudo)",
  },
  {
    id: "discord" as const,
    label: "Discord",
    icon: MessageSquare,
    url: COMMUNITY_LINKS.discord,
    color: "bg-[#5865F2]",
    borderColor: "border-[#5865F2]/50",
    bgColor: "bg-[#5865F2]/10",
    placeholder: "Pseudo Discord (ex: mon_pseudo)",
  },
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    icon: MessageSquare,
    url: COMMUNITY_LINKS.whatsapp,
    color: "bg-[#25D366]",
    borderColor: "border-[#25D366]/50",
    bgColor: "bg-[#25D366]/10",
    placeholder: "Numéro WhatsApp (ex: +225XXXXXXXXXX)",
  },
]

type ChannelId = "telegram" | "discord" | "whatsapp"

export default function SocialConnectionPage() {
  const router = useRouter()
  const [clicks, setClicks] = useState<Record<ChannelId, boolean>>({
    telegram: false, discord: false, whatsapp: false,
  })
  const [identifiers, setIdentifiers] = useState<Record<ChannelId, string>>({
    telegram: "", discord: "", whatsapp: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const identifiersRef = useRef(identifiers)

  useEffect(() => {
    identifiersRef.current = identifiers
  }, [identifiers])

  const allClicked = Object.values(clicks).every(Boolean)

  const handleClick = useCallback((channel: ChannelId) => {
    setClicks(prev => {
      if (prev[channel]) return prev
      const next = { ...prev, [channel]: true }
      const count = Object.values(next).filter(Boolean).length
      if (count < 3) {
        toast.info(`${count}/3 canaux rejoints — continue !`)
      } else {
        toast.success("Tous les canaux rejoints ! Entre tes identifiants pour valider.")
      }
      return next
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    const { telegram, discord, whatsapp } = identifiersRef.current
    if (!telegram.trim() || !discord.trim() || !whatsapp.trim()) {
      toast.error("Remplis les 3 identifiants.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: "social-connection-protocol",
          content: "https://joinhashcode.com/social-connection",
          projectDescription: `Telegram: ${telegram.trim()}\nDiscord: ${discord.trim()}\nWhatsApp: ${whatsapp.trim()}`,
          userDifficulty: 1,
          userRating: 5,
          userFeedback: "Social connection validation — identifiers submitted",
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors de la soumission")
      }
      setIsDone(true)
      toast.success("Identifiants envoyés ! Un admin va vérifier sous 24h.")
      setTimeout(() => router.push("/missions"), 2000)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur réseau")
    } finally {
      setIsSubmitting(false)
    }
  }, [router])

  const totalChannels = CHANNELS.length
  const completedChannels = Object.values(clicks).filter(Boolean).length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Link
          href="/missions"
          className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          RETOUR AUX MISSIONS
        </Link>

        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Identifiants envoyés</h2>
              <p className="text-sm text-muted-foreground">
                Un admin va vérifier et valider ta mission sous 24h.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] rounded-md px-2 py-1">
                    MISSION // CONNEXION
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground border-border/60 font-mono text-[10px] rounded-md px-2 py-1">
                    +50 XP
                  </Badge>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
                    Rejoins la <span className="text-primary">Communauté</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Active ta présence sur les 3 canaux de la communauté HASHCODE.
                    Le réseau vit sur Telegram, Discord et WhatsApp.
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/40 border border-border/40">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground uppercase">Progression</span>
                    <span className="text-primary font-bold">{completedChannels}/{totalChannels} canaux</span>
                  </div>
                  <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedChannels / totalChannels) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Étape 1 — Rejoindre les canaux */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    Étape 1 — Rejoins les 3 canaux
                  </span>
                </div>

                <div className="grid gap-3">
                  {CHANNELS.map((channel) => {
                    const clicked = clicks[channel.id]
                    return (
                      <a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleClick(channel.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all",
                          clicked
                            ? `${channel.bgColor} ${channel.borderColor}`
                            : "bg-card/20 border-border/40 hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center",
                            clicked ? `${channel.color}/20` : "bg-muted/30"
                          )}>
                            <channel.icon className={cn("w-4 h-4", clicked ? "text-white" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{channel.label}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">
                              {clicked ? "✅ Rejoint" : "Clique pour rejoindre"}
                            </p>
                          </div>
                        </div>
                        {clicked && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Étape 2 — Identifiants */}
              {allClicked && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Étape 2 — Confirme tes identifiants
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-card/40 border border-border/40 space-y-4">
                    {CHANNELS.map((channel) => (
                      <div key={channel.id}>
                        <label className="text-[10px] font-mono text-muted-foreground mb-1.5 block">
                          {channel.label}
                        </label>
                        <Input
                          value={identifiers[channel.id]}
                          onChange={e => setIdentifiers(prev => ({ ...prev, [channel.id]: e.target.value }))}
                          placeholder={channel.placeholder}
                          className="h-11 text-sm bg-background border-border/60"
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !identifiers.telegram.trim() || !identifiers.discord.trim() || !identifiers.whatsapp.trim()}
                    className="btn-primary-glow w-full h-14 rounded-2xl text-sm font-black uppercase tracking-wider gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer pour validation
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Info card */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.03] border border-primary/10">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Un admin vérifiera tes identifiants et validera ta mission sous 24h.
                  Tu recevras <span className="text-foreground font-bold">50 XP</span> et le badge
                  {" "}<span className="text-foreground font-bold">CONNECTÉ</span>.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                <Zap className="w-3 h-3" />
                Mission disponible une seule fois
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
