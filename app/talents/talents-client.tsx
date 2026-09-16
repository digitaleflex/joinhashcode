"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search, Globe, ChevronRight, Sparkles, TrendingUp, Trophy,
  Cpu, Palette, BarChart3, Users, LayoutGrid, List,
  Send, Loader2, Check, AlertTriangle, Info,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface SquadMember {
  userId: string
  name: string
  class: string | null
  tools: string[]
  level: number
  scores: { builderScore: number; creatorScore: number; strategistScore: number; catalystScore: number }
}

interface ViewerSquad {
  id: string
  name: string
  role: string
  cohesionScore: number
  memberCount: number
  members: SquadMember[]
}

interface Talent {
  id: string
  name: string
  pseudo: string | null
  image: string | null
  class: string | null
  level: number
  experience: number
  city: string | null
  country: string | null
  bio: string | null
  tools: string[]
  builderScore: number
  creatorScore: number
  strategistScore: number
  catalystScore: number
  inSquad: boolean
}

const CLASS_CONFIGS: Record<string, { label: string; icon: typeof Cpu; color: string; bg: string; border: string; gradient: string }> = {
  builder: {
    label: "Builder",
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    gradient: "from-blue-600/10 via-transparent to-transparent",
  },
  creator: {
    label: "Créateur",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    gradient: "from-purple-600/10 via-transparent to-transparent",
  },
  strategist: {
    label: "Stratège",
    icon: BarChart3,
    color: "text-amber-400",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    gradient: "from-amber-600/10 via-transparent to-transparent",
  },
  catalyst: {
    label: "Catalyseur",
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    gradient: "from-emerald-600/10 via-transparent to-transparent",
  },
  unknown: {
    label: "Initié",
    icon: Sparkles,
    color: "text-zinc-400",
    bg: "bg-zinc-500/5",
    border: "border-zinc-500/20",
    gradient: "from-zinc-600/10 via-transparent to-transparent",
  },
}

const PROFILE_SCORES = [
  { key: "builderScore" as const, label: "Builder", color: "bg-blue-500", bar: "bg-gradient-to-r from-blue-500 to-blue-400" },
  { key: "creatorScore" as const, label: "Créateur", color: "bg-purple-500", bar: "bg-gradient-to-r from-purple-500 to-purple-400" },
  { key: "strategistScore" as const, label: "Stratège", color: "bg-amber-500", bar: "bg-gradient-to-r from-amber-500 to-amber-400" },
  { key: "catalystScore" as const, label: "Catalyseur", color: "bg-emerald-500", bar: "bg-gradient-to-r from-emerald-500 to-emerald-400" },
]

function MiniPsychoBars({ scores }: { scores: { builderScore: number; creatorScore: number; strategistScore: number; catalystScore: number } }) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {PROFILE_SCORES.map((p) => (
        <div key={p.key} className="space-y-1">
          <div className="h-14 rounded-lg bg-zinc-900/80 border border-white/5 relative overflow-hidden">
            <div
              className={`absolute bottom-0 left-0 right-0 ${p.bar} transition-all duration-500`}
              style={{ height: `${scores[p.key]}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xs font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {scores[p.key]}
              </span>
            </div>
          </div>
          <span className="block text-2xs font-mono text-zinc-600 text-center uppercase tracking-wider">
            {p.label.slice(0, 3)}
          </span>
        </div>
      ))}
    </div>
  )
}

function InviteAnalysisDialog({
  talent,
  viewerSquad,
  open,
  onOpenChange,
}: {
  talent: Talent
  viewerSquad: ViewerSquad
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const targetClass = (talent.class || "unknown").toLowerCase()
  const cfg = CLASS_CONFIGS[targetClass] || CLASS_CONFIGS.unknown
  const Icon = cfg.icon || Send

  // Class counts
  const classCounts: Record<string, number> = {
    builder: 0, creator: 0, strategist: 0, catalyst: 0, unknown: 0,
  }
  viewerSquad.members.forEach((m) => {
    const cls = (m.class || "unknown").toLowerCase()
    classCounts[cls] = (classCounts[cls] || 0) + 1
  })

  const currentCount = classCounts[targetClass] || 0
  const isOverLimit = currentCount >= 2
  const missingProfiles = Object.entries(classCounts)
    .filter(([k, v]) => v === 0 && k !== "unknown")
    .map(([k]) => CLASS_CONFIGS[k]?.label)

  // Synergy score: how complementary is this talent to the squad
  const computeSynergyScore = () => {
    if (!talent.class) return 50
    const squadSize = viewerSquad.members.length
    if (squadSize === 0) return 75

    const avgScores = {
      builder: viewerSquad.members.reduce((s, m) => s + m.scores.builderScore, 0) / squadSize,
      creator: viewerSquad.members.reduce((s, m) => s + m.scores.creatorScore, 0) / squadSize,
      strategist: viewerSquad.members.reduce((s, m) => s + m.scores.strategistScore, 0) / squadSize,
      catalyst: viewerSquad.members.reduce((s, m) => s + m.scores.catalystScore, 0) / squadSize,
    }

    const talentScores = {
      builder: talent.builderScore,
      creator: talent.creatorScore,
      strategist: talent.strategistScore,
      catalyst: talent.catalystScore,
    }

    const dimensions = ["builder", "creator", "strategist", "catalyst"] as const
    let gapFillScore = 0
    for (const d of dimensions) {
      const gap = Math.max(0, avgScores[d] - talentScores[d])
      gapFillScore += Math.min(gap / 100, 1)
    }

    const balanceBonus = isOverLimit ? -25 : currentCount === 0 ? 20 : 10
    const rawScore = Math.min(100, Math.max(0, (1 - gapFillScore / 4) * 60 + 40 + balanceBonus))

    if (isOverLimit) return Math.min(rawScore, 45)
    return Math.round(rawScore)
  }

  const synergyScore = computeSynergyScore()

  // Tool overlap analysis
  const squadTools = new Set(viewerSquad.members.flatMap((m) => m.tools))
  const talentTools = talent.tools ?? []
  const newTools = talentTools.filter((t) => !squadTools.has(t))
  const sharedTools = talentTools.filter((t) => squadTools.has(t))
  const toolOverlapRate = talentTools.length > 0 ? Math.round((sharedTools.length / talentTools.length) * 100) : 0

  // Coach-style recommendation
  const getCoachAdvice = () => {
    if (!talent.class) {
      return `Profil non classifié — ${talent.name} n'a pas encore complété le quiz. Tu recrutes sur le potentiel, un pari qui peut payer.`
    }

    const label = cfg.label
    let advice = `${talent.name} est un profil **${label}**. `

    if (isOverLimit) {
      advice += `Alerte équilibre : ton escouade a déjà ${currentCount} ${label} (max 2). Ajouter un·e autre risquerait de créer un déséquilibre cognitif. `
      if (missingProfiles.length > 0) {
        advice += `L'escouade gagnerait plus à recruter un profil ${missingProfiles.join(" ou ")} pour diversifier les profils.`
      } else {
        advice += `Tous les profils sont déjà représentés — privilégie l'agent·e le·plus aligné·e avec la prochaine mission.`
      }
      return advice
    }

    if (currentCount === 0) {
      advice += `C'est exactement ce qui manque à ton escouade — aucun profil ${label} actuellement. `
      advice += `Sa perspective unique élargira le champ d'action de l'équipe.`
    } else {
      advice += `Ton escouade a ${currentCount} ${label} — ajouter ${talent.name} renforcera ce pôle sans déséquilibrer la dynamique.`
    }

    if (newTools.length > 0) {
      advice += ` Côté compétences, ${talent.name} apporte ${newTools.length} nouvel${newTools.length > 1 ? "s" : ""} outil${newTools.length > 1 ? "s" : ""} (${newTools.slice(0, 3).join(", ")}${newTools.length > 3 ? "..." : ""}) que personne ne maîtrise encore dans l'escouade.`
    }

    return advice
  }

  const coachAdvice = getCoachAdvice()

  // Synergy color
  const synergyColor = synergyScore >= 70 ? "text-emerald-400" : synergyScore >= 45 ? "text-amber-400" : "text-red-400"
  const synergyBg = synergyScore >= 70 ? "bg-emerald-500" : synergyScore >= 45 ? "bg-amber-500" : "bg-red-500"

  const handleConfirm = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/squad/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: talent.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || data.message || "Erreur")
      setSent(true)
      toast.success(data.message || "Invitation envoyée !")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur technique")
    } finally {
      setSending(false)
    }
  }

  const PROFILE_COLORS: Record<string, string> = {
    builder: "bg-blue-500", creator: "bg-purple-500",
    strategist: "bg-amber-500", catalyst: "bg-emerald-500", unknown: "bg-zinc-500",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-white/10 bg-zinc-950/95 backdrop-blur-xl p-0 gap-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <Send className="size-3 text-primary" />
              <span className="text-3xs font-mono font-black uppercase text-primary">Analyse de Recrutement</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tight text-white">
                  {talent.name}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-zinc-500 flex items-center gap-2 mt-1">
                  <span className={cfg.color}>{cfg.label}</span>
                  <span>· LV.{talent.level}</span>
                  <span>· {talent.experience.toLocaleString()} XP</span>
                </DialogDescription>
              </div>
              {/* Synergy gauge */}
              {talent.class && (
                <div className="size-16 shrink-0 relative">
                  <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(39 39 42)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
                      strokeDasharray={`${synergyScore * 0.97} 100`}
                      strokeLinecap="round"
                      className={synergyColor}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-black font-mono ${synergyColor}`}>{synergyScore}%</span>
                  </div>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Psychometric mini-bars */}
          <div className="grid grid-cols-4 gap-1.5">
            {PROFILE_SCORES.map((p) => (
              <div key={p.key} className="space-y-1">
                <div className="h-10 rounded-lg bg-zinc-900/80 border border-white/5 relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${p.bar} transition-all duration-500`}
                    style={{ height: `${talent[p.key]}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {talent[p.key]}
                    </span>
                  </div>
                </div>
                <span className="block text-2xs font-mono text-zinc-600 text-center uppercase tracking-wider">
                  {p.label.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>

          {/* Squad composition */}
          <div className="space-y-2">
            <span className="text-3xs font-mono font-black uppercase text-zinc-500 tracking-wider">
              Composition de l&apos;escouade · {viewerSquad.memberCount}/5
            </span>
            <div className="space-y-1.5">
              {Object.entries(CLASS_CONFIGS).filter(([k]) => k !== "unknown").map(([key, c]) => {
                const count = classCounts[key] || 0
                const barWidth = Math.min((count / 2) * 100, 100)
                return (
                  <div key={key} className="flex items-center gap-2 text-xs font-mono">
                    <span className={`w-16 ${c.color} font-bold uppercase tracking-wider`}>{c.label}</span>
                    <div className="flex-1 h-3 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${PROFILE_COLORS[key]}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="w-4 text-right text-zinc-400 font-bold">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tool overlap */}
          {talentTools.length > 0 && (
            <div className="space-y-2">
              <span className="text-3xs font-mono font-black uppercase text-zinc-500 tracking-wider">
                Compétences {newTools.length > 0 ? `· +${newTools.length} nouvelle${newTools.length > 1 ? "s" : ""}` : ""}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {talentTools.map((tool) => {
                  const isNew = !squadTools.has(tool)
                  return (
                    <span
                      key={tool}
                      className={`px-2 py-0.5 rounded-md text-3xs font-mono border ${
                        isNew
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-800/80 text-zinc-400 border-white/5"
                      }`}
                    >
                      {tool}
                      {isNew && <span className="ml-1 text-2xs opacity-60">nouveau</span>}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Coach advice */}
          <div className={`rounded-2xl p-4 border ${
            synergyScore >= 70 ? "bg-emerald-500/10 border-emerald-500/20" :
            synergyScore >= 45 ? "bg-amber-500/10 border-amber-500/20" :
            "bg-red-500/10 border-red-500/20"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${
                synergyScore >= 70 ? "text-emerald-400" :
                synergyScore >= 45 ? "text-amber-400" :
                "text-red-400"
              }`}>
                {sent ? <Check className="size-5" /> :
                 synergyScore >= 70 ? <Check className="size-5" /> :
                 synergyScore >= 45 ? <AlertTriangle className="size-5" /> :
                 <AlertTriangle className="size-5" />}
              </div>
              <div className="space-y-1 min-w-0">
                <p className={`text-sm-plus font-black uppercase tracking-wider ${
                  sent ? "text-primary" :
                  synergyScore >= 70 ? "text-emerald-400" :
                  synergyScore >= 45 ? "text-amber-400" :
                  "text-red-400"
                }`}>
                  {sent ? "✅ Invitation envoyée !" :
                   synergyScore >= 70 ? "Recommandé par le Coach IA" :
                   synergyScore >= 45 ? "À considérer avec précaution" :
                   "Déconseillé par le Coach IA"}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {coachAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Synergy bar */}
          {talent.class && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs-sm font-mono text-zinc-600 uppercase tracking-wider">
                <span>Synergie cognitive</span>
                <span className={synergyColor}>{synergyScore}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${synergyBg}`}
                  style={{ width: `${synergyScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 pt-0 flex gap-2">
          {sent ? (
            <>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-white/10 bg-white/[0.02] hover:bg-white/5"
                >
                  Fermer
                </Button>
              </DialogClose>
              <Button
                asChild
                className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider btn-primary-glow gap-2"
              >
                <Link href={`/dossier?userId=${talent.id}`}>
                  <Info className="size-4" />
                  Voir le dossier
                </Link>
              </Button>
            </>
          ) : (
            <>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-white/10 bg-white/[0.02] hover:bg-white/5"
                >
                  Annuler
                </Button>
              </DialogClose>
              <Button
                onClick={handleConfirm}
                disabled={sending || sent}
                className={`flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider gap-2 ${
                  synergyScore < 45
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : synergyScore < 70
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "btn-primary-glow"
                }`}
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {sending ? "Envoi..." : "Confirmer l'invitation"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TalentCard({ talent, index, viewerSquad }: { talent: Talent; index: number; viewerSquad?: ViewerSquad | null }) {
  const cfg = CLASS_CONFIGS[(talent.class || "unknown").toLowerCase()] || CLASS_CONFIGS.unknown

  const scores = { builderScore: talent.builderScore, creatorScore: talent.creatorScore, strategistScore: talent.strategistScore, catalystScore: talent.catalystScore }
  const sortedScores = PROFILE_SCORES.map((p) => ({
    ...p,
    score: talent[p.key],
  })).sort((a, b) => b.score - a.score)

  const isHybrid = sortedScores[0].score - sortedScores[1].score < 15 && sortedScores[0].score > 0
  const displayLabel = isHybrid ? `${sortedScores[0].label} × ${sortedScores[1].label}` : cfg.label

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <HoverCard openDelay={300}>
        <HoverCardTrigger asChild>
          <Card
            className={`group relative cursor-pointer overflow-hidden rounded-[1.75rem] border transition-all duration-500 hover:scale-[1.02] ${cfg.border} ${cfg.bg}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${cfg.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            <CardContent className="relative p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-12 w-12 rounded-xl border border-white/10 shadow-lg shrink-0">
                    <AvatarImage src={talent.image || ""} alt={talent.name} />
                    <AvatarFallback className="rounded-xl bg-zinc-900 text-white font-extrabold uppercase text-sm">
                      {talent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-base text-white uppercase italic tracking-tight truncate max-w-36">
                      {talent.name}
                    </h3>
                    <p className="font-mono text-3xs text-zinc-500 uppercase">
                      @{talent.pseudo || "talent"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!talent.inSquad && (
                    <Badge
                      variant="outline"
                      className="font-mono text-xs-sm uppercase tracking-wider py-1 px-2 rounded-lg border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                    >
                      <Users className="size-2.5 mr-0.5" />
                      Free
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs-sm uppercase tracking-wider py-1 px-2.5 rounded-lg border-white/5 shrink-0 ${
                      isHybrid ? "text-[#C5F441] border-[#C5F441]/30" : cfg.color
                    }`}
                  >
                    {displayLabel}
                  </Badge>
                </div>
              </div>

              <MiniPsychoBars scores={scores} />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-zinc-600">LV.{talent.level}</span>
                  <span className="text-primary font-bold">{talent.experience.toLocaleString()} XP</span>
                </div>
                {(talent.city || talent.country) && (
                  <div className="flex items-center gap-1 text-3xs text-zinc-500">
                    <Globe className="size-2.5 shrink-0" />
                    <span className="truncate max-w-20">
                      {[talent.city, talent.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {viewerSquad ? (
                <InviteDialogForCard talent={talent} viewerSquad={viewerSquad} />
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-wider border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
                >
                  <Link href={`/dossier?userId=${talent.id}`}>
                    Voir le Dossier <ChevronRight className="size-3 ml-0.5" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="center"
          className="w-72 rounded-2xl border-white/10 bg-zinc-950/95 backdrop-blur-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-lg border border-white/10">
              <AvatarImage src={talent.image || ""} alt={talent.name} />
              <AvatarFallback className="rounded-lg bg-zinc-900 text-white font-bold text-xs">
                {talent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-white">{talent.name}</p>
              <p className="font-mono text-3xs text-zinc-500">{displayLabel} · LV.{talent.level}</p>
            </div>
          </div>
          {talent.bio && (
            <p className="text-sm-plus text-zinc-400 font-light leading-relaxed line-clamp-2 italic">
              &ldquo;{talent.bio}&rdquo;
            </p>
          )}
          {(talent.tools?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1">
              {(talent.tools ?? []).slice(0, 4).map((tool) => (
                <span key={tool} className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-3xs font-mono text-zinc-400 border border-white/5">
                  {tool}
                </span>
              ))}
              {(talent.tools?.length ?? 0) > 4 && (
                <span className="text-3xs font-mono text-zinc-600">+{talent.tools.length - 4}</span>
              )}
            </div>
          )}
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  )
}

function InviteDialogForCard({ talent, viewerSquad }: { talent: Talent; viewerSquad: ViewerSquad }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-wider border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 gap-1.5"
      >
        <Send className="size-3" />
        Inviter dans mon escouade
      </Button>
      <InviteAnalysisDialog talent={talent} viewerSquad={viewerSquad} open={open} onOpenChange={setOpen} />
    </>
  )
}

function TalentRow({ talent, viewerSquad }: { talent: Talent; viewerSquad?: ViewerSquad | null }) {
  const cfg = CLASS_CONFIGS[(talent.class || "unknown").toLowerCase()] || CLASS_CONFIGS.unknown
  const Icon = cfg.icon

  const sortedScores = PROFILE_SCORES.map((p) => ({
    ...p,
    score: talent[p.key],
  })).sort((a, b) => b.score - a.score)

  const isHybrid = sortedScores[0].score - sortedScores[1].score < 15 && sortedScores[0].score > 0
  const displayLabel = isHybrid ? `${sortedScores[0].label} × ${sortedScores[1].label}` : cfg.label

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${cfg.border} ${cfg.bg}`}>
        <Link href={`/dossier?userId=${talent.id}`} className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="h-10 w-10 rounded-lg border border-white/10 shadow shrink-0">
            <AvatarImage src={talent.image || ""} alt={talent.name} />
            <AvatarFallback className="rounded-lg bg-zinc-900 text-white font-extrabold text-xs">
              {talent.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white uppercase italic truncate">{talent.name}</h3>
                <span className="font-mono text-3xs text-zinc-500 hidden sm:inline">@{talent.pseudo || "talent"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-600">
                <span className="flex items-center gap-1"><Icon className="size-3" />{displayLabel}</span>
                <span>LV.{talent.level}</span>
                <span className="text-primary font-bold">{talent.experience.toLocaleString()} XP</span>
                {(talent.city || talent.country) && (
                  <span className="hidden md:flex items-center gap-1">
                    <Globe className="size-2.5" />{[talent.city, talent.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {(talent.tools ?? []).slice(0, 3).map((tool) => (
                <span key={tool} className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-3xs font-mono text-zinc-400 border border-white/5">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="shrink-0">
          {viewerSquad ? (
            <InviteDialogForCard talent={talent} viewerSquad={viewerSquad} />
          ) : (
            <Link href={`/dossier?userId=${talent.id}`}>
              <ChevronRight className="size-4 text-zinc-600 hover:text-white transition-colors" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function TalentsClient({ talents, viewerSquad }: { talents: Talent[]; viewerSquad?: ViewerSquad | null }) {
  const [search, setSearch] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(12)
  const STEP = 12

  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.pseudo && t.pseudo.toLowerCase().includes(search.toLowerCase())) ||
        t.tools.some((tool) => tool.toLowerCase().includes(search.toLowerCase()))

      const itemClass = (t.class || "unknown").toLowerCase()
      const matchesClass =
        selectedClass === "all" || (selectedClass === "free" ? !t.inSquad : itemClass === selectedClass)

      return matchesSearch && matchesClass
    })
  }, [talents, search, selectedClass])

  const paginatedTalents = useMemo(() => filteredTalents.slice(0, visibleCount), [filteredTalents, visibleCount])

  useEffect(() => {
    setVisibleCount(12)
  }, [search, selectedClass])

  const classCounts = useMemo(() => {
    const counts: Record<string, number> = { builder: 0, creator: 0, strategist: 0, catalyst: 0, unknown: 0 }
    talents.forEach((t) => {
      const key = (t.class || "unknown").toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [talents])

  const topTalents = useMemo(() => {
    return [...talents].sort((a, b) => b.experience - a.experience).slice(0, 3)
  }, [talents])

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-[3rem] pointer-events-none" />
        <div className="relative z-[var(--z-content)] flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="size-3.5 text-primary" />
              <span className="text-3xs sm:text-xs font-mono font-black uppercase text-primary">Annuaire</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase italic leading-none">
              Carte des <span className="text-primary">Talents</span>
            </h1>
            <p className="text-zinc-500 text-sm font-light max-w-xl">
              Explorez le réseau des bâtisseurs, designers, stratèges et catalyseurs qui font la tech africaine.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Talents actifs", value: talents.length, icon: Trophy, color: "text-primary" },
            { label: "Builders", value: classCounts.builder, icon: Cpu, color: "text-blue-400" },
            { label: "Créateurs", value: classCounts.creator, icon: Palette, color: "text-purple-400" },
            { label: "Stratèges", value: classCounts.strategist, icon: BarChart3, color: "text-amber-400" },
            { label: "Catalyseurs", value: classCounts.catalyst, icon: Users, color: "text-emerald-400" },
            { label: "Initiés", value: classCounts.unknown, icon: Sparkles, color: "text-zinc-400" },
            { label: "Niveau max", value: Math.max(...talents.map((t) => t.level), 0), icon: TrendingUp, color: "text-[#C5F441]" },
            { label: "Moy. XP", value: Math.round(talents.reduce((a, t) => a + t.experience, 0) / Math.max(talents.length, 1)), icon: Trophy, color: "text-primary" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-white/5"
              >
                <div className={`size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-black text-white font-mono tabular-nums">{stat.value}</div>
                  <div className="text-xs-sm font-mono text-zinc-600 uppercase tracking-wider truncate">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spotlight — Top 3 */}
      {topTalents.length >= 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Top Talents de la Semaine
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topTalents.map((talent, i) => {
              const cfg = CLASS_CONFIGS[(talent.class || "unknown").toLowerCase()] || CLASS_CONFIGS.unknown
              const Icon = cfg.icon
              return (
                <Link key={talent.id} href={`/dossier?userId=${talent.id}`} className="group block">
                  <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 hover:scale-[1.02] ${cfg.border} ${cfg.bg}`}>
                    <div className="absolute -top-6 -right-6 size-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <span className="text-3xl font-black font-mono text-white/5">#{i + 1}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-xl border border-white/10 shadow-lg shrink-0">
                        <AvatarImage src={talent.image || ""} alt={talent.name} />
                        <AvatarFallback className="rounded-xl bg-zinc-900 text-white font-extrabold">
                          {talent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm text-white uppercase italic truncate">{talent.name}</h3>
                        <div className="flex items-center gap-2 text-3xs font-mono text-zinc-500">
                          <Icon className="size-3" />
                          <span>{cfg.label}</span>
                          <span>· LV.{talent.level}</span>
                          <span>· {talent.experience.toLocaleString()} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, pseudo, compétence..."
            className="input-premium pl-11 h-12 rounded-2xl text-sm placeholder:text-zinc-600 border-white/10"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedClass("all")}
            className={`h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedClass === "all"
                ? "bg-primary text-black border-primary"
                : "bg-transparent text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
            }`}
          >
              Tous
            </button>
          <button
            onClick={() => setSelectedClass("free")}
            className={`h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
              selectedClass === "free"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "bg-transparent text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
            }`}
          >
            <Users className="size-3.5" />
            Free Agent
          </button>
          {Object.entries(CLASS_CONFIGS).map(([key, cfg]) => {
            const Icon = cfg.icon
            const count = classCounts[key] || 0
            const isActive = selectedClass === key
            return (
              <button
                key={key}
                onClick={() => setSelectedClass(key)}
                className={`h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                    : "bg-transparent text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
                }`}
              >
                <Icon className="size-3.5" />
                {cfg.label}
                <span className="text-3xs opacity-50">({count})</span>
              </button>
            )
          })}
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-10 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-primary text-black"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
              title="Vue grille"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`h-10 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-primary text-black"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
              title="Vue liste"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Talents Grid / List */}
      {filteredTalents.length > 0 ? (
        <>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedTalents.map((talent, idx) => (
              <TalentCard key={talent.id} talent={talent} index={idx} viewerSquad={viewerSquad} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedTalents.map((talent) => (
              <TalentRow key={talent.id} talent={talent} viewerSquad={viewerSquad} />
            ))}
          </div>
        )}
        {visibleCount < filteredTalents.length && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((c) => c + STEP)}
              className="h-12 px-8 rounded-2xl text-sm-plus font-bold uppercase tracking-wider border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20"
            >
              Afficher plus ({filteredTalents.length - visibleCount} restant{filteredTalents.length - visibleCount > 1 ? "s" : ""})
            </Button>
          </div>
        )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-16 rounded-[2.5rem] bg-white/1 border border-dashed border-white/5 text-center space-y-4"
        >
          <div className="size-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto">
            <Search className="size-6 text-zinc-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Aucun agent trouvé</h3>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">
              Essayez de modifier votre recherche ou de sélectionner un autre filtre de profil.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearch(""); setSelectedClass("all") }}
            className="rounded-xl text-xs uppercase font-bold tracking-wider"
          >
            Réinitialiser les filtres
          </Button>
        </motion.div>
      )}
    </div>
  )
}
