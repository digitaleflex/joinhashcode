"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Copy, Check, ShieldAlert, ShieldCheck, Zap, Loader2, Settings, Mail, UserSearch, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { InviteMemberForm } from "./squad/InviteMemberForm"
import { MemberList } from "./squad/MemberList"
import { OrgSettingsForm } from "./squad/OrgSettingsForm"
import { PendingInvitations } from "./squad/PendingInvitations"
import { JoinRequestsManager } from "./squad/JoinRequestsManager"
import { SquadActivityFeed } from "./squad/SquadActivityFeed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type SquadData } from "@/components/dashboard/squad-journey";
import { type UserProfile } from "@/lib/types";

export function SquadLobby({ user, squad }: { user: UserProfile; squad: SquadData | null }) {
    const router = useRouter()
    const [isCopying, setIsLocked] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [squadName, setSquadName] = useState("")
    
    // Fallback pseudo if not set
    const pseudo = user.pseudo || user.name.split(" ")[0]
    
    // Squad members (max 5 for the logic)
    const members = squad?.members || []
    const memberCount = members.length
    const slots = [0, 1, 2, 3, 4] // 5 slots total

     // Find current user membership
     const currentUserMember = members.find((m) => m.userId === user.id)
    const isOwner = currentUserMember?.role === "owner"

    // Neuromarketing: Progress-based visual state
    const themeColor = memberCount === 0 ? "text-zinc-500" : memberCount < 3 ? "text-amber-500" : memberCount < 5 ? "text-blue-500" : "text-primary"
    const glowColor = memberCount === 0 ? "bg-zinc-500/5" : memberCount < 3 ? "bg-amber-500/5" : memberCount < 5 ? "bg-blue-500/5" : "bg-primary/10"

    const inviteLink = `${window.location.origin}/invite/${squad?.slug || pseudo.toLowerCase()}`

    const copyInvite = () => {
        navigator.clipboard.writeText(inviteLink)
        toast.success("Code de recrutement copié !")
        setIsLocked(true)
        setTimeout(() => setIsLocked(false), 2000)
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
                throw new Error(data.message || data.error || "Erreur lors de la création de l'escouade.")
            }
            toast.success("Escouade créée avec succès !")
            router.refresh()
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Erreur lors de la création de l'escouade.")
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-6">
            {/* Dynamic Background Glow based on progress */}
            <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full blur-[160px] pointer-events-none transition-all duration-1000", glowColor)} />

            {/* In-app Invitations Center */}
            <div className="max-w-xl mx-auto relative z-[var(--z-elevated)]">
                <PendingInvitations />
            </div>

            {/* Header Lock Section */}
            <div className="text-center space-y-4 relative z-[var(--z-content)]">
                <div className="flex justify-center items-center gap-4">
                    <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-700",
                        memberCount === 0 ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-500" :
                        memberCount < 5 ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse" :
                        "bg-primary/10 border-primary/20 text-primary"
                    )}>
                        {memberCount < 5 ? <ShieldAlert className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                        <span className="text-xs font-mono font-bold uppercase">
                            {memberCount < 5 ? "Escouade incomplète" : "Escouade active !"}
                        </span>
                    </div>

                    {isOwner && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2 bg-zinc-900/50 border-white/10 hover:border-primary/50 text-xs font-bold uppercase font-mono">
                                    <Settings className="size-3" />
                                    Gestion
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-zinc-950 border-white/10 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold uppercase italic tracking-tight">Configuration de l&apos;Escouade</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="members" className="mt-4">
                                    <TabsList className="bg-zinc-900 border-white/5 grid grid-cols-5 h-auto p-1">
                                        <TabsTrigger value="members" className="gap-2 py-2"><Users className="size-4" /> Membres</TabsTrigger>
                                        <TabsTrigger value="journal" className="gap-2 py-2"><Activity className="size-4" /> Journal</TabsTrigger>
                                        <TabsTrigger value="requests" className="gap-2 py-2"><UserSearch className="size-4" /> Candidats</TabsTrigger>
                                        <TabsTrigger value="invite" className="gap-2 py-2"><Mail className="size-4" /> Inviter</TabsTrigger>
                                        <TabsTrigger value="settings" className="gap-2 py-2"><Settings className="size-4" /> Réglages</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="members" className="mt-6">
                                        <MemberList members={members} currentUserId={user.id} />
                                    </TabsContent>
                                    <TabsContent value="journal" className="mt-6">
                                         <SquadActivityFeed organizationId={squad?.id || ""} />
                                    </TabsContent>
                                    <TabsContent value="requests" className="mt-6">
                                         <JoinRequestsManager organizationId={squad?.id || ""} />
                                    </TabsContent>
                                    <TabsContent value="invite" className="mt-6">
                                        <InviteMemberForm />
                                    </TabsContent>
                                    <TabsContent value="settings" className="mt-6">
                                         <OrgSettingsForm organization={squad!} />
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white italic leading-[0.9]">
                    {memberCount < 5 ? (
                        <>Construis ton <span className={cn("transition-colors duration-700", themeColor)}>groupe</span></>
                    ) : (
                        <>Escouade <span className="text-primary">prête !</span></>
                    )}
                </h1>
                
                <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-light">
                    Agent <span className="text-white font-bold italic">@{pseudo}</span>, tu as besoin de 4 autres membres pour former un groupe complet et débloquer tes missions.
                </p>
            </div>

            {/* Squad Slots */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 relative z-[var(--z-content)]">
                {slots.map((index) => {
                    const member = members[index]
                    const isActive = !!member
                    const isUser = member?.userId === user.id

                    return (
                        <div key={index} className={cn(
                            "relative group rounded-4xl border-2 transition-all duration-700 overflow-hidden",
                            isActive 
                                ? "bg-zinc-900/60 border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.15)]" 
                                : "bg-black/40 border-white/5 border-dashed hover:border-white/20"
                        )}>
                            <div className="aspect-4/5 flex flex-col items-center justify-center p-4 md:p-8 space-y-6">
                                {isActive ? (
                                    <>
                                        <div className="relative">
                                            <div className="size-20 md:size-28 rounded-3xl bg-zinc-900 border-2 border-primary/60 overflow-hidden rotate-2 group-hover:rotate-0 transition-transform duration-700">
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage src={member.user?.image || ""} />
                                                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-3xl">
                                                        {member.user?.pseudo?.charAt(0) || member.user?.name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className={cn(
                                                "absolute -bottom-2 -right-2 px-2 py-0.5 text-black text-xs-sm font-bold uppercase tracking-tight -rotate-2 shadow-lg",
                                                member.role === "owner" ? "bg-primary" : "bg-zinc-400"
                                            )}>
                                                {member.role === "owner" ? "Chef" : "Actif"}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-base font-bold text-white uppercase tracking-tight italic truncate max-w-30">
                                                 {member.user?.pseudo || member.user?.name?.split(" ")[0] || "?"}
                                            </div>
                                            <div className="text-[9px] font-mono text-primary/70 uppercase tracking-wider mt-1 font-bold">
                                                 {member.user?.class || "Agent_Core"}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="size-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/2 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-500">
                                            <UserPlus className="size-6 text-zinc-800 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="text-center space-y-4 w-full">
                                            <div className="text-3xs font-mono text-zinc-600 uppercase group-hover:text-zinc-400 transition-colors">
                                                Place libre
                                            </div>
                                            {(!squad && isUser === false) ? null : (
                                                <Button 
                                                    variant="outline" 
                                                    onClick={copyInvite}
                                                    className="w-full border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 h-10 text-3xs font-bold uppercase tracking-wider transition-all active:scale-95"
                                                >
                                                    {isCopying ? <Check className="size-3 mr-2" /> : <Copy className="size-3 mr-2" />}
                                                    Recruter
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Section */}
            <div className="relative z-[var(--z-content)]">
                {!squad ? (
                    <div className="flex flex-col items-center gap-8 pt-6">
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-bold text-white uppercase">Prêt à diriger ?</h3>
                            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Choisis un nom pour ton escouade</p>
                        </div>
                        <input
                            type="text"
                            value={squadName}
                            onChange={(e) => setSquadName(e.target.value)}
                            placeholder="Ex: Équipe Fulgor, Circuit Nova..."
                            maxLength={40}
                            className="w-full max-w-sm px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-center text-sm font-bold placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                        <Button 
                            size="lg" 
                            onClick={createSquad}
                            disabled={isCreating || !squadName.trim()}
                            className="btn-primary-glow px-12 h-16 text-base font-bold uppercase group"
                        >
                            {isCreating ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-3">
                                    Devenir Chef d&apos;Escouade
                                    <Zap className="size-4 fill-primary group-hover:animate-bounce" />
                                </span>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto p-10 rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-md text-center space-y-8 shadow-2xl relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", glowColor)} />
                        
                        <div className="flex justify-center gap-3 relative z-[var(--z-content)]">
                            {[...Array(5)].map((_, i) => (
                                <Zap 
                                    key={i} 
                                    className={cn(
                                        "size-6 transition-all duration-1000", 
                                        i < memberCount ? "text-primary fill-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "text-zinc-800"
                                    )} 
                                />
                            ))}
                        </div>

                    <div className="space-y-2 relative z-[var(--z-content)]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center justify-center gap-2 cursor-help group/sync">
                                        <p className="text-lg text-white font-bold uppercase tracking-tight">
                                            Synchronisation : <span className="text-primary italic">{Math.round((memberCount / 5) * 100)}%</span>
                                        </p>
                                        <Info className="size-3 text-zinc-600 group-hover/sync:text-primary transition-colors md:hidden" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono">
                                    Le niveau de remplissage de ton escouade. Requis : 5 membres.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        {memberCount >= 1 && (
                            <div className="flex flex-col items-center gap-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 cursor-help group/unit">
                                                <div className="text-3xs text-primary/60 font-mono uppercase">Cohésion de l&apos;unité</div>
                                                <Info className="size-2 text-zinc-700 group-hover/unit:text-primary transition-colors md:hidden" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono max-w-48">
                                            Reflète l&apos;activité globale du groupe. Si un membre s&apos;arrête de build, ce score baisse.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary shadow-[0_0_10px_#C5F441] transition-all duration-1000"
                                            style={{ width: `${Math.round((squad.cohesionScore || 0.1) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-primary">{Math.round((squad.cohesionScore || 0.1) * 100)}%</span>
                                </div>
                                 {squad?.streakCount && squad.streakCount > 0 && (
                                    <div className="mt-2 flex items-center gap-2 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                        <Zap className="size-3 text-primary fill-primary" />
                                        <span className="text-xs font-bold text-white uppercase font-mono">{squad.streakCount} JOURS DE SYNC</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <p className="text-sm-plus text-zinc-500 font-mono uppercase">
                            {memberCount < 5 ? "En attente de nouveaux membres..." : "Escouade complète. Accès aux missions débloqué !"}
                        </p>
                    </div>

                        {memberCount < 5 && (
                            <div className="pt-4 relative z-[var(--z-content)]">
                                <Button 
                                    onClick={copyInvite}
                                    className="bg-white text-black hover:bg-zinc-200 h-12 px-8 font-bold uppercase tracking-wider text-xs"
                                >
                                    {isCopying ? "Code Copié !" : "Partager mon lien de recrutement"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* FOMO Section */}
            <div className="text-center py-6 border-t border-white/5 opacity-50 relative z-[var(--z-content)]">
                <p className="text-3xs font-mono text-zinc-600 uppercase">
                    Phase_Bêta_En_Cours // Écosystème_En_Expansion
                </p>
            </div>
        </div>
    )
}
