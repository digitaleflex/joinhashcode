"use client"

import { useState, useMemo, useCallback } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Shield, UserPlus, Users, Activity, Zap, Trophy,
  Lock, Check, Copy, Loader2, Sparkles, ChevronRight,
  Pencil, X, Link as LinkIcon, HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserTopBar } from "./user-topbar"

// ─── Phase definitions ───────────────────────────────────────────────────────

type PhaseStatus = "completed" | "current" | "locked"

interface Phase {
  id: number
  code: string
  title: string
  subtitle: string
  reward: string
  rewardXp: number
  icon: LucideIcon
  status: PhaseStatus
  unlockHint?: string
  whyTitle?: string
  whyDescription?: string
}

function buildPhases(squad: any, memberCount: number): Phase[] {
  const cohesion = squad?.cohesionScore ?? 0
  const streak = squad?.streakCount ?? 0

  const s = (completed: boolean, current: boolean): PhaseStatus =>
    completed ? "completed" : current ? "current" : "locked"

  return [
    {
      id: 1,
      code: "01",
      title: "INITIATION",
      subtitle: "Créer ton escouade",
      reward: "+50 XP",
      rewardXp: 50,
      icon: Shield,
      status: s(!!squad, !squad),
      whyTitle: "Pourquoi créer une escouade ?",
      whyDescription: "Passer d'un parcours individuel à une synergie collective. C'est le premier pas pour débloquer des multiplicateurs d'XP de groupe, collaborer sur des projets réels et s'entraider au quotidien.",
    },
    {
      id: 2,
      code: "02",
      title: "RECRUTEMENT",
      subtitle: "Recruter 3 agents",
      reward: "+100 XP par membre",
      rewardXp: 300,
      icon: UserPlus,
      status: s(memberCount >= 3, !!squad && memberCount < 3),
      unlockHint: "Complète d'abord la Phase 01",
      whyTitle: "Pourquoi viser 3 agents ?",
      whyDescription: "Atteindre la diversité cognitive minimale. Un groupe de 3 permet d'associer des profils complémentaires (Builder, Créateur, Stratège, Catalyseur) pour enrichir les idées et concevoir des solutions viables.",
    },
    {
      id: 3,
      code: "03",
      title: "ESCOUADE COMPLÈTE",
      subtitle: "5 agents synchronisés",
      reward: "+200 XP · Accès Missions Co-op",
      rewardXp: 200,
      icon: Users,
      status: s(memberCount >= 5, memberCount >= 3 && memberCount < 5),
      unlockHint: "Recrute 3 agents d'abord",
      whyTitle: "Pourquoi 5 agents ?",
      whyDescription: "Le format optimal validé pour maximiser la vitesse d'exécution sans lourdeur administrative. À 5 membres, votre réseau débloque l'accès aux missions coopératives complexes et aux quêtes de guilde.",
    },
    {
      id: 4,
      code: "04",
      title: "PREMIER CYCLE",
      subtitle: "Atteindre 50% de cohésion",
      reward: "+150 XP · Badge INITIATOR",
      rewardXp: 150,
      icon: Activity,
      status: s(cohesion >= 0.5, memberCount >= 5 && cohesion < 0.5),
      unlockHint: "Complete ton escouade à 5/5 d'abord",
      whyTitle: "Pourquoi 50% de cohésion ?",
      whyDescription: "Prouver que l'escouade est active et soudée. La cohésion mesure l'assiduité collective aux check-ins journaliers. Dépasser 50% démontre que le groupe s'entraide et maintient une vraie dynamique.",
    },
    {
      id: 5,
      code: "05",
      title: "SYNCHRONISATION",
      subtitle: "3 jours de streak consécutifs",
      reward: "+300 XP · Badge SYNC_MASTER",
      rewardXp: 300,
      icon: Zap,
      status: s(streak >= 3, cohesion >= 0.5 && streak < 3),
      unlockHint: "Atteins 50% de cohésion d'abord",
      whyTitle: "Pourquoi un streak de 3 jours ?",
      whyDescription: "Ancrer l'habitude de la régularité. Un streak de 3 jours d'échanges quotidiens consolide la réactivité de l'équipe et évite que les projets ne se refroidissent par manque de suivi.",
    },
    {
      id: 6,
      code: "06",
      title: "HYPER_LINK",
      subtitle: "7 jours consécutifs · Statut légendaire",
      reward: "+500 XP · Badge Légendaire HYPER_LINK",
      rewardXp: 500,
      icon: Trophy,
      status: s(streak >= 7, streak >= 3 && streak < 7),
      unlockHint: "Maintiens 3 jours de streak d'abord",
      whyTitle: "Pourquoi viser 7 jours consécutifs ?",
      whyDescription: "L'état d'alignement parfait. Maintenir l'activité pendant une semaine entière forge des réflexes de collaboration indestructibles et débloque le multiplicateur de performance ultime.",
    },
  ]
}

// ─── Main component ──────────────────────────────────────────────────────────

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,28})$/

export function SquadJourney({ user, squad }: { user: any; squad: any }) {
  const [isCopying, setIsCopying] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditDone, setAuditDone] = useState(false)

  // Local squad identity — updated optimistically after a successful save
  const [localName, setLocalName] = useState<string>(squad?.name ?? "")
  const [localSlug, setLocalSlug] = useState<string>(squad?.slug ?? "")

  // Edit panel state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const pseudo = user.pseudo || user.name?.split(" ")[0] || "Agent"
  const memberCount = squad?.members?.length ?? 0
  const cohesion = squad?.cohesionScore ?? 0
  const streak = squad?.streakCount ?? 0

  const phases = useMemo(() => buildPhases(squad, memberCount), [squad, memberCount])
  const completedCount = useMemo(() => phases.filter((p) => p.status === "completed").length, [phases])

  const auditResult = useMemo(() => {
    if (!squad) return null
    const members = squad.members || []
    if (members.length === 0) return null

    const classes = members.map((m: any) => m.user?.class?.toLowerCase()).filter(Boolean)
    const uniqueClasses = Array.from(new Set(classes))
    const hasBuilder = classes.includes("builder")
    const hasCreator = classes.includes("creator")
    const hasStrategist = classes.includes("strategist")
    const hasCatalyst = classes.includes("catalyst")

    let score = 0
    if (members.length === 1) {
      score = 25
    } else {
      score += uniqueClasses.length * 20 // max 80
      score += Math.min(5, members.length) * 4 // max 20
    }
    if (score > 100) score = 100

    const strengths: string[] = []
    const warnings: string[] = []
    const advices: string[] = []

    // Strengths
    if (uniqueClasses.length >= 3) {
      strengths.push("Grande diversité de profils : votre squad bénéficie de multiples angles de réflexion.")
    }
    if (hasBuilder && hasCreator) {
      strengths.push("Binôme d'action solide : la synergie Builder-Créateur assure un pont direct du concept au code.")
    }
    if (hasStrategist && hasCatalyst) {
      strengths.push("Moteur de croissance actif : la synergie Stratège-Catalyseur permet de cibler et diffuser efficacement.")
    }

    // Warnings & Advices
    if (!hasBuilder) {
      warnings.push("Carence technique : Aucun Builder n'est présent. Votre équipe risque de stagner au stade des idées.")
      advices.push("Recrutez en priorité un Builder (développeur ou ingénieur système) pour ancrer vos projets dans la réalité technique.")
    }
    if (!hasCreator) {
      warnings.push("Carence d'expérience : Aucun Créateur n'est présent. Vos réalisations risquent d'être complexes ou froides pour les utilisateurs.")
      advices.push("Invitez un Créateur (designer ou storyteller) pour soigner l'ergonomie et l'impact visuel.")
    }
    if (!hasStrategist) {
      warnings.push("Carence d'impact : Aucun Stratège n'est présent. Votre énergie risque de s'éparpiller sans objectifs de croissance.")
      advices.push("Recrutez un Stratège (product manager ou marketeur) pour focaliser vos efforts sur des leviers mesurables.")
    }
    if (!hasCatalyst) {
      warnings.push("Carence de cohésion : Aucun Catalyseur n'est présent. Les dynamiques de groupe risquent d'être trop transactionnelles.")
      advices.push("Intégrez un Catalyseur (ambassadeur ou animateur) pour faciliter l'entraide et décupler la diffusion du projet.")
    }

    // Monoculture warnings
    const classCounts: Record<string, number> = {}
    classes.forEach((c: string) => { classCounts[c] = (classCounts[c] || 0) + 1 })

    Object.entries(classCounts).forEach(([cls, count]) => {
      if (count > 2) {
        const nameMap: Record<string, string> = { builder: "Builders", creator: "Créateurs", strategist: "Stratèges", catalyst: "Catalyseurs" }
        warnings.push(`Hyper-concentration : Trop de ${nameMap[cls] || cls} (${count}). Cela peut créer des goulots d'étranglement ou des discussions stériles.`)
      }
    })

    if (uniqueClasses.length === 4) {
      strengths.push("Harmonie cognitive complète ! Les 4 piliers fondamentaux de HASHCODE sont représentés.")
      advices.push("Votre structure de squad est théoriquement parfaite. Utilisez les check-ins réguliers pour maintenir le streak.")
    }

    return {
      score,
      strengths,
      warnings,
      advices,
      memberCount: members.length,
    }
  }, [squad])
  const isLeader = useMemo(
    () => squad?.members?.some((m: any) => m.user?.id === user.id && m.role === "owner") ?? false,
    [squad, user.id]
  )

  const inviteLink = useMemo(
    () => typeof window !== "undefined" && squad
      ? `${window.location.origin}/invite/${localSlug || pseudo.toLowerCase()}`
      : "",
    [squad, localSlug, pseudo]
  )

  const openEdit = useCallback(() => {
    setEditName(localName)
    setEditSlug(localSlug)
    setIsEditing(true)
  }, [localName, localSlug])

  const sanitizeSlug = useCallback((value: string) =>
    value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-"), [])

  const slugError = useMemo(
    () => editSlug.length > 0 && !SLUG_REGEX.test(editSlug)
      ? "3–30 caractères · lettres, chiffres et tirets uniquement"
      : null,
    [editSlug]
  )

  const saveEdit = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      toast.error("Nom trop court (min. 2 caractères).")
      return
    }
    if (!SLUG_REGEX.test(editSlug)) {
      toast.error("Format du lien invalide.")
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch("/api/squad/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), slug: editSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de la sauvegarde.")
      setLocalName(data.name)
      setLocalSlug(data.slug)
      setIsEditing(false)
      toast.success("Escouade mise à jour !")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

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
      const res = await fetch("/api/squad/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors de la création.")
      }
      toast.success("Escouade créée — protocole initialisé !")
      window.location.reload()
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
        <UserTopBar user={user} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* ── Page header ────────────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                  protocol_escouade_
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-[0.9]">
                {squad ? (
                  <>
                    {localName || "Mon"}{" "}
                    <span className="text-primary italic">Escouade</span>
                  </>
                ) : (
                  <>
                    Lance ton{" "}
                    <span className="text-primary italic">Réseau</span>
                  </>
                )}
              </h1>
              <p className="text-zinc-500 text-sm font-medium max-w-xl">
                {squad
                  ? `Unité active · ${memberCount}/5 agents · Cohésion ${Math.round(cohesion * 100)}%`
                  : "Constitue ton escouade et débloques des avantages collectifs exclusifs."}
              </p>
            </div>

            {/* ── Main 2-col layout ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

              {/* ── Journey path ──────────────────────────────────── */}
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

              {/* ── Side stats panel ───────────────────────────────── */}
              <div className="space-y-5 lg:sticky lg:top-24">

                {/* Cohesion gauge */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-primary" />
                      <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                        Cohésion
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-white tabular-nums">
                      {Math.round(cohesion * 100)}
                      <span className="text-primary text-base">%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(197,244,65,0.5)] transition-all duration-1000"
                      style={{ width: `${Math.round(cohesion * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {cohesion < 0.5
                      ? "Complète l'escouade pour booster la cohésion"
                      : cohesion < 0.9
                      ? "Restez actifs pour maintenir la dynamique"
                      : "Synchronisation quasi-parfaite !"}
                  </p>
                </div>

                {/* Streak counter */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 flex items-center gap-5">
                  <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center border-2 shrink-0",
                    streak >= 3
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                      : "bg-white/2 border-white/5 text-zinc-700"
                  )}>
                    <Zap className={cn("size-6", streak >= 1 && "fill-current")} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {streak}
                      <span className="text-zinc-500 text-sm font-medium ml-1">jours</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                      streak consécutif
                    </div>
                  </div>
                </div>

                {/* Member roster */}
                {squad && (
                  <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="size-4 text-primary" />
                      <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                        Roster · {memberCount}/5
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {squad.members?.map((m: any) => {
                        const getClassStyle = (cls?: string) => {
                          const c = cls?.toLowerCase();
                          if (c === "builder") return "text-primary bg-primary/10 border-primary/20";
                          if (c === "creator") return "text-purple-400 bg-purple-500/10 border-purple-500/20";
                          if (c === "strategist") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
                          if (c === "catalyst") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
                          return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
                        };

                        return (
                          <div key={m.user.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-white/3 bg-white/1">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="size-9 rounded-xl border border-white/10 shrink-0">
                                <AvatarImage src={m.user.image || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm rounded-xl">
                                  {(m.user.pseudo || m.user.name || "?").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                                  @{m.user.pseudo || m.user.name?.split(" ")[0]}
                                  {m.user.id === user.id && (
                                    <span className="text-[7px] font-bold font-mono bg-primary/20 text-primary px-1.5 py-0.2 rounded-md uppercase shrink-0">
                                      Moi
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">
                                  LVL {m.user.level ?? 1} · {m.role === "owner" ? "Chef" : m.role === "admin" ? "Admin" : "Membre"}
                                </div>
                              </div>
                            </div>
                            <span className={cn(
                              "text-[8px] font-bold font-mono border px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                              getClassStyle(m.user.class)
                            )}>
                              {m.user.class || "Agent"}
                            </span>
                          </div>
                        );
                      })}
                      {Array.from({ length: 5 - memberCount }).map((_, i) => (
                        <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-white/5 bg-white/0.5 opacity-30">
                          <div className="size-9 rounded-xl border border-dashed border-white/15 flex items-center justify-center shrink-0">
                            <UserPlus className="size-4 text-zinc-500" />
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">
                            Emplacement libre
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Squad Compatibility Analyzer */}
                {squad && (
                  <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary animate-pulse" />
                        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                          Audit de compatibilité
                        </span>
                      </div>
                      {auditDone && (
                        <span className="text-[10px] font-mono text-primary font-bold">
                          Analyse complétée
                        </span>
                      )}
                    </div>

                    {!auditDone ? (
                      <div className="space-y-4">
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Évalue l&apos;équilibre cognitif, la force de frappe et la cohésion de ton équipe pour obtenir des conseils stratégiques d&apos;optimisation.
                        </p>
                        <Button
                          onClick={() => {
                            setIsAuditing(true)
                            setTimeout(() => {
                              setIsAuditing(false)
                              setAuditDone(true)
                              toast.success("Audit de cohésion de squad généré avec succès !")
                            }, 1200)
                          }}
                          disabled={isAuditing}
                          className="w-full h-10 text-[11px] font-bold uppercase tracking-wide btn-primary-glow"
                        >
                          {isAuditing ? (
                            <>
                              <Loader2 className="size-3.5 mr-2 animate-spin" />
                              Calcul de synchronicité...
                            </>
                          ) : (
                            <>
                              Lancer l&apos;audit de squad
                              <ChevronRight className="size-3.5 ml-1.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                        {/* Score Indicator */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div>
                            <div className="text-3xl font-extrabold text-white tracking-tight">
                              {auditResult?.score}
                              <span className="text-primary text-lg">%</span>
                            </div>
                            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
                              Taux de compatibilité
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono tracking-wide",
                              (auditResult?.score ?? 0) >= 80 ? "bg-primary/10 text-primary border border-primary/20" :
                              (auditResult?.score ?? 0) >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            )}>
                              {(auditResult?.score ?? 0) >= 80 ? "Synchro élevée" :
                               (auditResult?.score ?? 0) >= 50 ? "Synchro moyenne" : "Synchro critique"}
                            </span>
                          </div>
                        </div>

                        {/* Strengths */}
                        {auditResult?.strengths && auditResult.strengths.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                              Points forts
                            </h4>
                            <ul className="space-y-1.5">
                              {auditResult.strengths.map((str, idx) => (
                                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                                  <span className="text-primary shrink-0 mt-0.5">✓</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Warnings */}
                        {auditResult?.warnings && auditResult.warnings.length > 0 && (
                          <div className="space-y-2 border-t border-white/5 pt-4">
                            <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                              Points d&apos;attention
                            </h4>
                            <ul className="space-y-1.5">
                              {auditResult.warnings.map((warn, idx) => (
                                <li key={idx} className="text-xs text-amber-400 flex items-start gap-2 leading-relaxed">
                                  <span className="shrink-0 mt-0.5">⚠️</span>
                                  <span>{warn}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Advices */}
                        {auditResult?.advices && auditResult.advices.length > 0 && (
                          <div className="space-y-2 border-t border-white/5 pt-4">
                            <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                              Conseils de recrutement
                            </h4>
                            <ul className="space-y-1.5">
                              {auditResult.advices.map((adv, idx) => (
                                <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                                  <span className="text-primary shrink-0 mt-0.5">→</span>
                                  <span>{adv}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Reset button */}
                        <div className="pt-2">
                          <button
                            onClick={() => setAuditDone(false)}
                            className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors underline"
                          >
                            Réanalyser l&apos;équipe
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Personnalisation — leader only */}
                {squad && isLeader && (
                  <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-primary" />
                        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                          Personnaliser
                        </span>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={openEdit}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors"
                        >
                          <Pencil className="size-3" />
                          Modifier
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors"
                        >
                          <X className="size-3" />
                          Annuler
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Nom</div>
                          <div className="text-sm font-bold text-white">{localName}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Lien d&apos;invitation</div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-zinc-600 text-[10px] font-mono shrink-0">…/invite/</span>
                            <span className="text-primary text-[11px] font-mono font-bold truncate">{localSlug}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Name field */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                            Nom de l&apos;escouade
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            maxLength={40}
                            placeholder="Ex: Les Bâtisseurs"
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-medium placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 transition-colors"
                          />
                        </div>

                        {/* Slug field */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                            Lien d&apos;invitation
                          </label>
                          <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/40 transition-colors bg-zinc-950">
                            <span className="text-zinc-600 text-[10px] font-mono px-3 py-2 border-r border-white/5 shrink-0 bg-zinc-900/60">
                              /invite/
                            </span>
                            <input
                              type="text"
                              value={editSlug}
                              onChange={(e) => setEditSlug(sanitizeSlug(e.target.value))}
                              maxLength={30}
                              placeholder="mon-equipe"
                              className="flex-1 bg-transparent px-3 py-2 text-sm text-primary font-mono font-bold placeholder:text-zinc-700 focus:outline-none min-w-0"
                            />
                          </div>
                          {slugError && (
                            <p className="text-[10px] text-red-400 font-mono">{slugError}</p>
                          )}
                          {!slugError && editSlug.length >= 3 && (
                            <p className="text-[10px] text-primary/60 font-mono flex items-center gap-1">
                              <Check className="size-3" /> Format valide
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={saveEdit}
                          disabled={isSaving || !!slugError || editSlug.length < 3 || editName.trim().length < 2}
                          className="w-full h-9 text-[11px] font-bold uppercase tracking-wide btn-primary-glow"
                        >
                          {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* V2 teaser */}
                <div className="rounded-3xl border border-white/4 bg-white/1 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-zinc-700" />
                    <span className="text-[9px] font-mono font-bold text-zinc-700 uppercase">
                      Prochainement — V2
                    </span>
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
      </SidebarInset>
    </SidebarProvider>
  )
}

// ─── Phase node ───────────────────────────────────────────────────────────────

function PhaseNode({
  phase,
  isLast,
  memberCount,
  squad,
  isCopying,
  isCreating,
  onCopy,
  onCreate,
}: {
  phase: Phase
  isLast: boolean
  memberCount: number
  squad: any
  isCopying: boolean
  isCreating: boolean
  onCopy: () => void
  onCreate: () => void
}) {
  const { status } = phase
  const Icon = phase.icon
  const [showWhy, setShowWhy] = useState(false)

  return (
    <div className="flex gap-5 md:gap-7">
      {/* Connector line + node icon */}
      <div className="flex flex-col items-center shrink-0">
        <div className={cn(
          "size-12 md:size-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-700 shrink-0",
          status === "completed" && "bg-primary/10 border-primary text-primary",
          status === "current" && "bg-primary/5 border-primary text-primary shadow-[0_0_25px_rgba(197,244,65,0.25)] animate-pulse",
          status === "locked" && "bg-zinc-900/40 border-white/5 text-zinc-800",
        )}>
          {status === "completed" ? (
            <Check className="size-5 md:size-6" />
          ) : status === "locked" ? (
            <Lock className="size-4 md:size-5" />
          ) : (
            <Icon className="size-5 md:size-6" />
          )}
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 min-h-10 mt-1 rounded-full",
            status === "completed" ? "bg-primary/30" : "bg-white/4",
          )} />
        )}
      </div>

      {/* Phase content card */}
      <div className={cn(
        "flex-1 rounded-3xl border p-5 md:p-6 mb-3 transition-all duration-700",
        status === "completed" && "bg-zinc-900/30 border-primary/10",
        status === "current" && "bg-zinc-900/60 border-primary/30 shadow-[0_0_30px_rgba(197,244,65,0.08)]",
        status === "locked" && "bg-zinc-950/30 border-white/3 opacity-50",
      )}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1 flex-1 min-w-50">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "text-[9px] font-mono font-bold uppercase",
                status === "completed" ? "text-primary" : status === "current" ? "text-primary/70" : "text-zinc-700",
              )}>
                PHASE_{phase.code}
              </span>
              {status === "completed" && (
                <span className="text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Complété
                </span>
              )}
              {status === "current" && (
                <span className="text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono animate-pulse">
                  En cours
                </span>
              )}
            </div>
            <h3 className={cn(
              "text-md md:text-lg font-extrabold tracking-tight uppercase flex items-center gap-1.5",
              status === "locked" ? "text-zinc-700" : "text-white",
            )}>
              {phase.title}
              {phase.whyDescription && (
                <button
                  type="button"
                  onClick={() => setShowWhy(!showWhy)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-zinc-500 hover:text-primary transition-colors p-0.5 hover:bg-white/5 shrink-0",
                    showWhy && "text-primary bg-primary/10"
                  )}
                  title="Pourquoi cette étape ?"
                >
                  <HelpCircle className="size-3.5" />
                </button>
              )}
            </h3>
            <p className={cn(
              "text-sm mb-2",
              status === "locked" ? "text-zinc-800" : "text-zinc-500",
            )}>
              {phase.subtitle}
            </p>

            {showWhy && phase.whyDescription && (
              <div className="mt-3 p-4 rounded-2xl border border-primary/20 bg-primary/2 text-xs space-y-1.5 transition-all duration-300">
                <div className="flex items-center gap-1.5 text-primary font-bold uppercase tracking-wider font-mono text-[9px]">
                  <Sparkles className="size-3 text-primary animate-pulse" />
                  {phase.whyTitle || "Pourquoi cette étape ?"}
                </div>
                <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                  {phase.whyDescription}
                </p>
              </div>
            )}
          </div>

          {/* Reward badge */}
          <div className={cn(
            "text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border shrink-0",
            status === "completed" && "bg-primary/5 text-primary/60 border-primary/10",
            status === "current" && "bg-primary/10 text-primary border-primary/20",
            status === "locked" && "bg-white/2 text-zinc-800 border-white/3",
          )}>
            {phase.reward}
          </div>
        </div>

        {/* Current phase: progress + CTA */}
        {status === "current" && (
          <div className="mt-5 space-y-4 border-t border-white/5 pt-5">
            {/* Progress indicator per phase */}
            {phase.id === 2 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Agents recrutés</span>
                  <span className="text-primary font-bold">{memberCount}/3</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (memberCount / 3) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 3 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Escouade complète</span>
                  <span className="text-primary font-bold">{memberCount}/5</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(memberCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 4 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Cohésion actuelle</span>
                  <span className="text-primary font-bold">{Math.round((squad?.cohesionScore ?? 0) * 100)}% / 50%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.cohesionScore ?? 0) / 0.5) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 5 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Streak actuel</span>
                  <span className="text-primary font-bold">{squad?.streakCount ?? 0}/3 jours</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.streakCount ?? 0) / 3) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {phase.id === 6 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Streak actuel</span>
                  <span className="text-primary font-bold">{squad?.streakCount ?? 0}/7 jours</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((squad?.streakCount ?? 0) / 7) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA per phase */}
            <div className="flex flex-wrap gap-3">
              {phase.id === 1 && (
                <Button
                  onClick={onCreate}
                  disabled={isCreating}
                  className="btn-primary-glow h-11 px-7 text-[11px] font-bold uppercase tracking-wide"
                >
                  {isCreating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Initialiser le protocole
                      <ChevronRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
              {(phase.id === 2 || phase.id === 3) && squad && (
                <Button
                  onClick={onCopy}
                  variant="outline"
                  className="h-11 px-7 text-[11px] font-bold uppercase tracking-wide border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isCopying ? (
                    <><Check className="size-4 mr-2" />Copié !</>
                  ) : (
                    <><Copy className="size-4 mr-2" />Copier le lien d&apos;invitation</>
                  )}
                </Button>
              )}
              {(phase.id === 4 || phase.id === 5 || phase.id === 6) && (
                <p className="text-[11px] text-zinc-600 font-mono italic">
                  Les check-ins quotidiens de tes membres boostent automatiquement la cohésion.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Locked: show unlock hint */}
        {status === "locked" && phase.unlockHint && (
          <p className="mt-3 text-[10px] font-mono text-zinc-800 flex items-center gap-1.5">
            <Lock className="size-3" />
            {phase.unlockHint}
          </p>
        )}
      </div>
    </div>
  )
}
