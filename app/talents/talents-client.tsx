"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Globe, Compass, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  psychometrics: {
    builderScore: number
    creatorScore: number
    strategistScore: number
    catalystScore: number
  } | null
}

const CLASS_CONFIGS: Record<string, { label: string; color: string; bg: string; border: string; glow: string }> = {
  builder: {
    label: "Builder",
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20 hover:border-blue-500/50",
    glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]",
  },
  creator: {
    label: "Créateur",
    color: "text-purple-400",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20 hover:border-purple-500/50",
    glow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]",
  },
  strategist: {
    label: "Stratège",
    color: "text-amber-400",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20 hover:border-amber-500/50",
    glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]",
  },
  catalyst: {
    label: "Catalyseur",
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]",
  },
  unknown: {
    label: "Initié",
    color: "text-zinc-400",
    bg: "bg-zinc-500/5",
    border: "border-zinc-500/20 hover:border-zinc-500/50",
    glow: "hover:shadow-[0_0_20px_rgba(113,113,122,0.1)]",
  },
}

export function TalentsClient({ talents }: { talents: Talent[] }) {
  const [search, setSearch] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")

  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.pseudo && t.pseudo.toLowerCase().includes(search.toLowerCase())) ||
        t.tools.some((tool) => tool.toLowerCase().includes(search.toLowerCase()))

      const itemClass = (t.class || "unknown").toLowerCase()
      const matchesClass = selectedClass === "all" || itemClass === selectedClass

      return matchesSearch && matchesClass
    })
  }, [talents, search, selectedClass])

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 sm:pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Compass className="size-3.5 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase text-primary">Annuaire</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase italic leading-none">
            Réseau des <span className="text-primary">Talents</span>
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            Découvrez et connectez-vous avec les bâtisseurs de l'écosystème.
          </p>
        </div>
      </div>

      {/* Control Deck: Search & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, pseudo, compétence..."
            className="input-premium pl-11 h-12 rounded-2xl text-sm placeholder:text-zinc-600 border-white/10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="lg:col-span-8 flex flex-wrap gap-2.5">
          <Button
            onClick={() => setSelectedClass("all")}
            variant={selectedClass === "all" ? "default" : "outline"}
            className={`h-11 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border-white/10 ${
              selectedClass === "all" ? "bg-primary text-black" : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Tous ({talents.length})
          </Button>
          {Object.entries(CLASS_CONFIGS).map(([key, cfg]) => {
            const count = talents.filter((t) => (t.class || "unknown").toLowerCase() === key).length
            return (
              <Button
                key={key}
                onClick={() => setSelectedClass(key)}
                variant={selectedClass === key ? "default" : "outline"}
                className={`h-11 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border-white/10 ${
                  selectedClass === key
                    ? "bg-white/10 text-white border-white/30"
                    : "bg-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <span className={cfg.color}>{cfg.label}</span>
                <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Grid List */}
      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => {
            const cfg = CLASS_CONFIGS[(talent.class || "unknown").toLowerCase()] || CLASS_CONFIGS.unknown

            // Psychometric scores
            const psychometrics = talent.psychometrics || {
              builderScore: 0,
              creatorScore: 0,
              strategistScore: 0,
              catalystScore: 0,
            }

            // Detect hybrid profile on the fly
            const sortedScores = [
              { name: "builder", label: "Builder", score: psychometrics.builderScore, color: "bg-blue-500", text: "text-blue-400" },
              { name: "creator", label: "Créateur", score: psychometrics.creatorScore, color: "bg-purple-500", text: "text-purple-400" },
              { name: "strategist", label: "Stratège", score: psychometrics.strategistScore, color: "bg-amber-500", text: "text-amber-400" },
              { name: "catalyst", label: "Catalyseur", score: psychometrics.catalystScore, color: "bg-emerald-500", text: "text-emerald-400" },
            ].sort((a, b) => b.score - a.score)

            const top1 = sortedScores[0]
            const top2 = sortedScores[1]
            const gap = top1.score - top2.score
            const isHybrid = gap < 15 && top1.score > 0
            const hybridLabel = isHybrid ? `${top1.label} × ${top2.label}` : cfg.label

            return (
              <Card
                key={talent.id}
                className={`glass-card rounded-[2rem] border overflow-hidden transition-all duration-500 hover:scale-[1.02] ${cfg.border} ${cfg.glow} ${cfg.bg}`}
              >
                <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  {/* Top: Avatar & Meta */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <AvatarImage src={talent.image || ""} alt={talent.name} />
                        <AvatarFallback className="rounded-2xl bg-zinc-900 text-white font-extrabold uppercase">
                          {talent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-lg text-white uppercase italic tracking-tight truncate max-w-40 sm:max-w-48">
                          {talent.name}
                        </h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase font-medium">
                          @{talent.pseudo || "talent"}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-lg border-white/5 bg-white/2 shrink-0 ${
                        isHybrid ? "text-[#C5F441] border-[#C5F441]/30" : cfg.color
                      }`}
                    >
                      {hybridLabel}
                    </Badge>
                  </div>

                  {/* Mid: Bio snippet */}
                  <div className="flex-1">
                    <p className="text-zinc-400 text-xs font-light leading-relaxed line-clamp-2 italic">
                      {talent.bio ? `"${talent.bio}"` : "— Aucun statut défini —"}
                    </p>
                  </div>

                  {/* Psychometric percentages */}
                  <div className="space-y-2.5 border-t border-white/5 pt-4">
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                      Vecteurs comportementaux
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {[
                        { label: "Builder", value: psychometrics.builderScore, color: "bg-blue-500", text: "text-blue-400" },
                        { label: "Créateur", value: psychometrics.creatorScore, color: "bg-purple-500", text: "text-purple-400" },
                        { label: "Stratège", value: psychometrics.strategistScore, color: "bg-amber-500", text: "text-amber-400" },
                        { label: "Catalyseur", value: psychometrics.catalystScore, color: "bg-emerald-500", text: "text-emerald-400" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="text-zinc-500">{item.label}</span>
                            <span className={`font-bold ${item.text}`}>{item.value}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges: Level & Location */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-[8px] font-mono text-zinc-600 uppercase">Niveau</div>
                        <div className="text-sm font-black text-white font-mono">{talent.level}</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-zinc-600 uppercase">Expérience</div>
                        <div className="text-sm font-black text-primary font-mono italic">{talent.experience} XP</div>
                      </div>
                    </div>

                    {(talent.city || talent.country) && (
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                        <Globe className="size-3 text-primary shrink-0" />
                        <span className="truncate max-w-28">
                          {[talent.city, talent.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 cursor-pointer"
                  >
                    <Link href={`/dossier?userId=${talent.id}`} className="flex items-center justify-center gap-1">
                      Voir le Dossier <ChevronRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="p-16 rounded-[2.5rem] bg-white/1 border border-dashed border-white/5 text-center space-y-4">
          <div className="size-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto opacity-30">
            <Search className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Aucun agent détecté</h3>
            <p className="text-xs text-zinc-600">Essayez d'élargir les critères de recherche ou de filtre.</p>
          </div>
        </div>
      )}
    </div>
  )
}
