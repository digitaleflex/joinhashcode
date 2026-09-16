"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Shield, UserPlus, Users, Activity, Zap, Trophy,
  Lock, Sparkles, Settings, EyeOff, ShieldCheck, Megaphone,
  Mail, Check, X, MessageCircle
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
import { SquadChat } from "./squad/SquadChat"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { authClient } from "@/lib/auth-client"
import { Card } from "@/components/ui/card"

export interface SquadMemberData {
  id: string
  userId: string
  role: string
  user?: { id: string; name: string; email: string; image: string | null; pseudo?: string; class?: string }
}

export interface SquadData {
  id: string
  name: string
  slug?: string | null
  description?: string | null
  announcement?: string | null
  isPrivate?: boolean
  requiredLevel?: number | null
  discordInviteUrl?: string | null
  cohesionScore?: number | null
  streakCount?: number | null
  streakFreezes?: number | null
  members?: SquadMemberData[]
}

export interface UserData {
  id: string
  pseudo?: string | null
  name?: string | null
}

export interface IncomingInvitation {
  id: string
  organizationId: string
  organizationName: string
  organizationDescription?: string | null
  inviterName: string
  role: string
  status: string
}

function buildPhases(squad: SquadData | null, memberCount: number): Phase[] {
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

export function SquadJourney({ user, squad, incomingInvitations = [] }: { user: UserData; squad: SquadData | null; incomingInvitations?: IncomingInvitation[] }) {
  const router = useRouter()
  const [isCopying, setIsCopying] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [squadName, setSquadName] = useState("")
  const [localName, setLocalName] = useState<string>(squad?.name ?? "")
  const [localSlug, setLocalSlug] = useState<string>(squad?.slug ?? "")
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false)
  const [invites, setInvites] = useState<IncomingInvitation[]>(incomingInvitations)

  const memberRole = squad?.members?.find((m) => m.userId === user.id)?.role
  const memberCount = squad?.members?.length ?? 0
  const cohesion = squad?.cohesionScore ?? 0
  const streak = squad?.streakCount ?? 0

  const isLeader = useMemo(
    () => squad?.members?.some((m) => m.user?.id === user.id && m.role === "owner") ?? false,
    [squad, user.id]
  )

  const phases = useMemo(() => buildPhases(squad, memberCount), [squad, memberCount])
  const completedCount = useMemo(() => phases.filter((p) => p.status === "completed").length, [phases])

  const inviteLink = useMemo(
    // ⚠️ Uniquement le vrai slug d'escouade — /invite/[slug] résout une
    // Organization par slug ; un pseudo produirait un lien mort.
    () => typeof window !== "undefined" && squad && localSlug
      ? `${window.location.origin}/invite/${localSlug}`
      : "",
    [squad, localSlug]
  )

  const copyInvite = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    toast.success("Lien d'invitation copié !")
    setIsCopying(true)
    setTimeout(() => setIsCopying(false), 2000)
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
      toast.success("Équipe créée — prête à accueillir des membres !")
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleStartInitiation = () => {
    setIsRulesDialogOpen(true)
  }

  const handleAcceptOrRejectInvitation = async (invitationId: string, action: "accept" | "reject") => {
    try {
      let error;
      if (action === "accept") {
        const res = await authClient.organization.acceptInvitation({ invitationId });
        error = res.error;
      } else {
        const res = await authClient.organization.rejectInvitation({ invitationId });
        error = res.error;
      }

      if (error) {
        toast.error(error.message || "Une erreur est survenue.");
      } else {
        toast.success(action === "accept" ? "Bienvenue dans l'escouade !" : "Invitation déclinée.");
        setInvites(prev => prev.filter(inv => inv.id !== invitationId));
        if (action === "accept") {
          router.refresh();
        }
      }
    } catch {
      toast.error("Erreur technique lors de l'action.");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline" />
        <UserTopBar user={user} squad={squad} memberRole={memberRole} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-[var(--z-content)]">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase">protocol_escouade_</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-[0.9]">
                  {squad ? <>{localName || "Mon"}{" "}<span className="text-primary italic">Escouade</span></> : <>Lance ton{" "}<span className="text-primary italic">Réseau</span></>}
                </h1>
                <p className="text-zinc-500 text-sm font-medium max-w-xl">
                  {squad ? `Unité active · ${memberCount}/5 agents · Cohésion ${Math.round(cohesion * 100)}%` : "Constitue ton escouade et débloques des avantages collectifs exclusifs."}
                </p>
              </div>

              {squad && isLeader && (
                <Button asChild className="btn-primary-glow h-12 px-8 text-sm-plus font-bold uppercase tracking-wider rounded-2xl group">
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
                    <span className="flex items-center gap-1 text-3xs font-mono font-bold bg-zinc-800 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full uppercase">
                      <EyeOff className="size-2.5" /> Privée
                    </span>
                  )}
                  {squad.requiredLevel && squad.requiredLevel > 1 && (
                    <span className="flex items-center gap-1 text-3xs font-mono font-bold bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">
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

            {/* Incoming invitations inbox */}
            {!squad && invites.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
                  <Mail className="size-3 text-primary animate-pulse" />
                  invitations_recues ({invites.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invites.map((invite) => (
                    <Card key={invite.id} className="glass-card border-white/5 bg-zinc-900/60 rounded-3xl p-6 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="text-3xs font-mono text-zinc-500 uppercase">Invitation à rejoindre l&apos;unité</div>
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{invite.organizationName}</h3>
                        {invite.organizationDescription && (
                          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{invite.organizationDescription}</p>
                        )}
                        <p className="text-xs text-zinc-400 font-mono mt-2">
                          Envoyée par <span className="text-white font-bold">{invite.inviterName}</span>
                        </p>
                      </div>
                      <div className="flex gap-2.5 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcceptOrRejectInvitation(invite.id, "reject")}
                          className="h-9 w-9 p-0 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl"
                        >
                          <X className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOrRejectInvitation(invite.id, "accept")}
                          className="h-9 px-4 bg-primary text-black hover:bg-primary/95 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 flex-1"
                        >
                          <Check className="size-4" />
                          Rejoindre l&apos;escouade
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

              {/* Journey path */}
              <div className="space-y-0">
                <div className="text-xs font-mono font-bold text-zinc-600 uppercase mb-6 flex items-center gap-3">
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
                    onCreate={handleStartInitiation}
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
                      <span className="text-sm-plus font-mono font-bold text-zinc-400 uppercase tracking-wide">Cohésion</span>
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
                  <p className="text-xs text-zinc-600 font-mono">
                    {cohesion < 0.5 ? "Complète l'escouade pour booster la cohésion" : cohesion < 0.9 ? "Restez actifs pour maintenir la dynamique" : "Synchronisation quasi-parfaite !"}
                  </p>
                </div>

                {/* Discord link */}
                {squad?.discordInviteUrl && (
                  <a
                    href={squad.discordInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex items-center gap-4 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="size-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <MessageCircle className="size-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Rejoindre le Discord</div>
                      <div className="text-xs font-mono text-zinc-500">Canal privé de l&apos;escouade</div>
                    </div>
                    <svg className="size-4 text-indigo-400/60 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}

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
                    <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider">streak consécutif</div>
                  </div>
                  {(() => {
                    const freezes = squad?.streakFreezes ?? 0
                    return (
                      <div
                        className={cn(
                          "ml-auto flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border",
                          freezes > 0 ? "bg-sky-500/10 border-sky-500/30 text-sky-300" : "bg-white/2 border-white/5 text-zinc-700"
                        )}
                        title={freezes > 0 ? "Bouclier actif : votre série est protégée en cas de jour manqué" : "Bouclier utilisé — il se recharge dans la semaine"}
                      >
                        <ShieldCheck className="size-5" />
                        <span className="text-3xs font-mono font-bold uppercase tracking-wider">
                          {freezes > 0 ? `×${freezes}` : "utilisé"}
                        </span>
                      </div>
                    )
                  })()}
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
                    <span className="text-3xs font-mono font-bold text-zinc-700 uppercase">Prochainement — V2</span>
                  </div>
                  <div className="space-y-2">
                    {["Missions collectives", "Défis inter-escouades", "Classement hebdo"].map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-zinc-700">
                        <Lock className="size-3 shrink-0" />
                        <span className="text-xs font-mono">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Squad Chat */}
            {squad && (
              <div className="pt-4">
                <SquadChat
                  organizationId={squad.id}
                  userId={user.id}
                  userRole={memberRole}
                />
              </div>
            )}
          </div>
        </main>

        <Dialog open={isRulesDialogOpen} onOpenChange={setIsRulesDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-extrabold uppercase italic tracking-tight text-white flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                 Règles de Formation d&apos;Équipe
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                 Avant de lancer ton équipe, prends connaissance des règles d&apos;alignement collectif :
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-6 text-sm">
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Taille Optimale</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">Une escouade est constituée de **5 agents maximum**. C&apos;est le format validé pour progresser avec agilité.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Équilibre Cognitif</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">Pour une synergie maximale, il est vivement conseillé de ne pas dépasser **2 représentants par classe** (Builder, Creator, Strategist, Catalyst).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Recrutement Intelligent</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">Parcours l&apos;**Annuaire des Talents** pour cibler les profils complémentaires et invite-les directement depuis leur profil.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4">
              <input
                type="text"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="Nom de ton escouade"
                maxLength={40}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRulesDialogOpen(false)}
                className="h-11 border-white/10 rounded-xl uppercase tracking-wider text-xs text-zinc-400 hover:text-white"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  setIsRulesDialogOpen(false);
                  createSquad();
                }}
                disabled={isCreating}
                className="h-11 btn-primary-glow font-black uppercase tracking-wider text-xs rounded-xl"
              >
                Créer mon escouade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
