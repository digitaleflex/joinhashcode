"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Shield, UserPlus, Users, Activity, Zap, Trophy,
  Lock, Sparkles, Settings, EyeOff, ShieldCheck, Megaphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserTopBar } from "./user-topbar"
import { BottomNav } from "./bottom-nav"
import { PhaseNode, type Phase } from "./squad/PhaseNode"
import { SquadRosterPanel } from "./squad/SquadRosterPanel"
import { SquadJoinRequestsPanel } from "./squad/SquadJoinRequestsPanel"
import { SquadAuditPanel } from "./squad/SquadAuditPanel"
import { SquadPersonalizationPanel } from "./squad/SquadPersonalizationPanel"
import { SquadDisbandPanel } from "./squad/SquadDisbandPanel"
import { toast } from "sonner"

function buildPhases(squad: any, memberCount: number): Phase[] {
  const cohesion = squad?.cohesionScore ?? 0
  const streak = squad?.streakCount ?? 0
  const s = (completed: boolean, current: boolean) =>
    completed ? "completed" as const : current ? "current" as const : "locked" as const

  return [
    { id: 1, code: "01", title: "INITIATION", subtitle: "Créer ton escouade", reward: "+50 XP", rewardXp: 50, icon: Shield, status: s(!!squad, !squad), whyTitle: "Pourquoi créer une escouade ?", whyDescription: "Passer d'un parcours individuel à une synergie collective. C'est le premier pas pour débloquer des multiplicateurs d'XP de groupe, collaborer sur des projets réels et s'entraider au quotidien." },
    { id: 2, code: "02", title: "RECRUTEMENT", subtitle: "Recruter 3 agents", reward: "+100 XP par membre", rewardXp: 300, icon: UserPlus, status: s(memberCount >= 3, !!squad && memberCount < 3), unlockHint: "Complète d'abord la Phase 01", whyTitle: "Pourquoi viser 3 agents ?", whyDescription: "Atteindre la diversité cognitive minimale. Un groupe de 3 permet d'associer des profils complémentaires pour enrichir les idées et concevoir des solutions viables." },
    { id: 3, code: "03", title: "ESCOUADE COMPLÈTE", subtitle: "5 agents synchronisés", reward: "+200 XP · Accès Missions Co-op", rewardXp: 200, icon: Users, status: s(memberCount >= 5, memberCount >= 3 && memberCount < 5), unlockHint: "Recrute 3 agents d'abord", whyTitle: "Pourquoi 5 agents ?", whyDescription: "Le format optimal validé pour maximiser la vitesse d'exécution sans lourdeur administrative. À 5 membres, votre réseau débloque l'accès aux missions coopératives complexes." },
    { id: 4, code: "04", title: "PREMIER CYCLE", subtitle: "Atteindre 50% de cohésion", reward: "+150 XP · Badge INITIATOR", rewardXp: 150, icon: Activity, status: s(cohesion >= 0.5, memberCount >= 5 && cohesion < 0.5), unlockHint: "Complete ton escouade à 5/5 d'abord", whyTitle: "Pourquoi 50% de cohésion ?", whyDescription: "Prouver que l'escouade est active et soudée. La cohésion mesure l'assiduité collective aux check-ins journaliers." },
    { id: 5, code: "05", title: "SYNCHRONISATION", subtitle: "3 jours de streak consécutifs", reward: "+300 XP · Badge SYNC_MASTER", rewardXp: 300, icon: Zap, status: s(streak >= 3, cohesion >= 0.5 && streak < 3), unlockHint: "Atteins 50% de cohésion d'abord", whyTitle: "Pourquoi un streak de 3 jours ?", whyDescription: "Ancrer l'habitude de la régularité. Un streak de 3 jours consolide la réactivité de l'équipe et évite que les projets ne se refroidissent." },
    { id: 6, code: "06", title: "HYPER_LINK", subtitle: "7 jours consécutifs · Statut légendaire", reward: "+500 XP · Badge Légendaire HYPER_LINK", rewardXp: 500, icon: Trophy, status: s(streak >= 7, streak >= 3 && streak < 7), unlockHint: "Maintiens 3 jours de streak d'abord", whyTitle: "Pourquoi viser 7 jours consécutifs ?", whyDescription: "L'état d'alignement parfait. Maintenir l'activité pendant une semaine entière forge des réflexes de collaboration indestructibles." },
  ]
}

export function SquadJourney({ user, squad }: { user: any; squad: any }) {
  const router = useRouter()
  const [isCopying, setIsCopying] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [localName, setLocalName] = useState<string>(squad?.name ?? "")
  const [localSlug, setLocalSlug] = useState<string>(squad?.slug ?? "")

  const pseudo = user.pseudo || user.name?.split(" ")[0] || "Agent"
  const memberRole = squad?.members?.find((m: any) => m.userId === user.id)?.role
  const memberCount = squad?.members?.length ?? 0
  const cohesion = squad?.cohesionScore ?? 0
  const streak = squad?.streakCount ?? 0

  const isLeader = useMemo(
    () => squad?.members?.some((m: any) => m.user?.id === user.id && m.role === "owner") ?? false,
    [squad, user.id]
  )

  const phases = useMemo(() => buildPhases(squad, memberCount), [squad, memberCount])
  const completedCount = useMemo(() => phases.filter((p) => p.status === "completed").length, [phases])

  const inviteLink = useMemo(
    () => typeof window !== "undefined" && squad
      ? `${window.location.origin}/invite/${localSlug || pseudo.toLowerCase()}`
      : "",
    [squad, localSlug, pseudo]
  )

  const copyInvite = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    toast.success("Lien d'invitation copié !")
    setIsCopying(true)
    setTimeout(() => setIsCopying(false), 2000)
  }

  const createSquad = async () => {
    setIsCreating(true)
    try {
      const res = await fetch("/api/squad/create", { method: "POST", headers: { "Content-Type": "application/json" } })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors de la création.")
      }
      toast.success("Escouade créée — protocole initialisé !")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline" />
        <UserTopBar user={user} squad={squad} memberRole={memberRole} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">protocol_escouade_</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-[0.9]">
                  {squad ? <>{localName || "Mon"}{" "}<span className="text-primary italic">Escouade</span></> : <>Lance ton{" "}<span className="text-primary italic">Réseau</span></>}
                </h1>
                <p className="text-zinc-500 text-sm font-medium max-w-xl">
                  {squad ? `Unité active · ${memberCount}/5 agents · Cohésion ${Math.round(cohesion * 100)}%` : "Constitue ton escouade et débloques des avantages collectifs exclusifs."}
                </p>
              </div>

              {squad && isLeader && (
                <Button asChild className="btn-primary-glow h-12 px-8 text-[11px] font-bold uppercase tracking-wider rounded-2xl group">
                  <a href="/squad/manage">
                    <Settings className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                    Gérer l&apos;unité
                  </a>
                </Button>
              )}
            </div>

            {/* Squad meta badges */}
            {squad && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {squad.description && <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">{squad.description}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  {squad.isPrivate && (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-zinc-800 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full uppercase">
                      <EyeOff className="size-2.5" /> Privée
                    </span>
                  )}
                  {squad.requiredLevel > 1 && (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">
                      <ShieldCheck className="size-2.5" /> Niv. {squad.requiredLevel}+ requis
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Pinned announcement */}
            {squad?.announcement && (
              <div className="relative p-6 rounded-2xl border-2 border-primary bg-primary/5 animate-pulse-slow my-6">
                <div className="flex items-center gap-3 mb-3">
                  <Megaphone className="size-5 text-primary drop-shadow-[0_0_8px_rgba(197,244,65,0.8)]" />
                  <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">ANNONCE ÉPINGLÉE</span>
                </div>
                <p className="text-base text-white leading-relaxed font-sans">{squad.announcement}</p>
              </div>
            )}

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

              {/* Journey path */}
              <div className="space-y-0">
                <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-zinc-800" />
                  chemin_d_ascension
                  <span className="text-primary">{completedCount}/6 phases</span>
                </div>
                {phases.map((phase, index) => (
                  <PhaseNode
                    key={phase.id}
                    phase={phase}
                    isLast={index === phases.length - 1}
                    memberCount={memberCount}
                    squad={squad}
                    isCopying={isCopying}
                    isCreating={isCreating}
                    onCopy={copyInvite}
                    onCreate={createSquad}
                  />
                ))}
              </div>

              {/* Side stats panel */}
              <div className="space-y-5 lg:sticky lg:top-24">

                {/* Cohesion gauge */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-primary" />
                      <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Cohésion</span>
                    </div>
                    <span className="text-lg font-extrabold text-white tabular-nums">
                      {Math.round(cohesion * 100)}<span className="text-primary text-base">%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(197,244,65,0.5)] transition-all duration-1000"
                      style={{ width: `${Math.round(cohesion * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {cohesion < 0.5 ? "Complète l'escouade pour booster la cohésion" : cohesion < 0.9 ? "Restez actifs pour maintenir la dynamique" : "Synchronisation quasi-parfaite !"}
                  </p>
                </div>

                {/* Streak counter */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 flex items-center gap-5">
                  <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center border-2 shrink-0",
                    streak >= 3 ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-white/2 border-white/5 text-zinc-700"
                  )}>
                    <Zap className={cn("size-6", streak >= 1 && "fill-current")} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {streak}<span className="text-zinc-500 text-sm font-medium ml-1">jours</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">streak consécutif</div>
                  </div>
                </div>

                {/* Roster */}
                {squad && <SquadRosterPanel squad={squad} user={user} isLeader={isLeader} memberCount={memberCount} />}

                {/* Join requests */}
                <SquadJoinRequestsPanel squad={squad} isLeader={isLeader} memberCount={memberCount} />

                {/* Compatibility audit */}
                <SquadAuditPanel squad={squad} isLeader={isLeader} />

                {/* Personalization — leader only */}
                {squad && isLeader && (
                  <SquadPersonalizationPanel
                    squad={squad}
                    localName={localName}
                    localSlug={localSlug}
                    onSave={(name, slug) => { setLocalName(name); setLocalSlug(slug) }}
                  />
                )}

                {/* Danger zone — leader only */}
                {squad && isLeader && <SquadDisbandPanel localName={localName} />}

                {/* V2 teaser */}
                <div className="rounded-3xl border border-white/4 bg-white/1 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-zinc-700" />
                    <span className="text-[9px] font-mono font-bold text-zinc-700 uppercase">Prochainement — V2</span>
                  </div>
                  <div className="space-y-2">
                    {["Missions collectives", "Défis inter-escouades", "Classement hebdo"].map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-zinc-700">
                        <Lock className="size-3 shrink-0" />
                        <span className="text-[10px] font-mono">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
