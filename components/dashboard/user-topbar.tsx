"use client"

import { Search, User as UserIcon, Settings, LogOut, Bell, ShieldAlert, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { hoursSince } from "@/lib/dates"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { toast } from "sonner"
import type { NavUser } from "@/lib/types"
import type { SquadData } from "@/components/dashboard/squad-journey"


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
const NotificationBell = dynamic(
  () => import("./notification-bell").then(m => ({ default: m.NotificationBell })),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" size="icon" className="relative rounded-xl" disabled>
        <Bell className="w-5 h-5 text-muted-foreground/40" />
      </Button>
    )
  }
)

export function UserTopBar({ user, squad, memberRole, featureFlags = {} }: { user: NavUser | null, squad?: SquadData | null, memberRole?: string, featureFlags?: Record<string, boolean> }) {
  const session = authClient.useSession();
  const isImpersonated = session.data?.session?.impersonatedBy;
  const isOwner = memberRole === "owner";

  const handleStopImpersonation = async () => {
    try {
      await authClient.admin.stopImpersonating();
      toast.success("Retour au compte administrateur");
      window.location.href = "/admin/users";
    } catch (error: unknown) {
      toast.error("Erreur lors de l'arrêt de l'impersonation");
    }
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  }

  return (
    <>
      {isImpersonated && (
        <div className="bg-amber-500 text-black py-2 px-4 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-widest animate-pulse relative z-[var(--z-banner)]">
            <div className="flex items-center gap-2">
                <ShieldAlert className="size-3" />
                Mode Visionneuse Actif : Navigue en tant que {user?.name}
            </div>
            <button 
                onClick={handleStopImpersonation}
                className="bg-black text-white px-3 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
                Quitter le mode visionneuse
            </button>
        </div>
      )}
      <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-[var(--z-header)] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Sidebar Trigger & Logo */}
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="md:hidden text-muted-foreground hover:text-white mr-2" />
        <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
          <Image
            src="/hashcodejoin.png"
            alt="HASHCODE"
            width={120}
            height={30}
            className="h-7 w-auto object-contain relative z-[var(--z-content)]"
            priority
          />
        </Link>
        <div className="relative w-full max-w-md hidden md:block ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher une mission, un outil..." 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toast.info("Recherche bientôt disponible : Nous synchronisons les index de données.");
              }
            }}
            className="w-full bg-muted/50 border border-border/20 h-10 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Squad Management (Only for Owners) */}
        {isOwner && squad && (
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 text-zinc-400 hover:text-primary transition-all group">
            <Link href="/squad/manage" title="Gérer l'escouade">
              <Users className="size-5 group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
        )}

        {/* Squad Combo Bonus Indicator */}
        {(() => {
          const activeOrg = session.data?.session as
            | { activeOrganization?: { lastComboAt?: string | Date | null } }
            | undefined;
          const activeOrgCombo = activeOrg?.activeOrganization?.lastComboAt;
          return (squad?.lastComboAt || activeOrgCombo) && (() => {
            const lastCombo = squad?.lastComboAt || activeOrgCombo;
            const diffHours = hoursSince(lastCombo ?? new Date());
            if (diffHours < 24) {
              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-[9px] font-black uppercase tracking-tighter cursor-help"
                      >
                        <Zap className="size-3 fill-amber-500 animate-pulse" />
                        <span>Combo x1.15</span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] text-zinc-300 font-mono max-w-[200px]">
                      Toute l'escouade a fait son check-in hier ! Tu gagnes +15% d'XP sur toutes tes actions aujourd'hui.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            return null;
          })();
        })()}

        {/* Notifications */}
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 pr-3 gap-3 rounded-2xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image src={user.image ?? ""} alt={user.name ?? ""} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-xs font-bold text-white">{user?.name?.split(' ')[0]}</span>
                <span className="text-[9px] font-mono text-primary uppercase">LVL {user?.level || 1}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 rounded-2xl p-2">
            <DropdownMenuLabel className="font-mono text-[10px] uppercase text-muted-foreground p-3">Compte Utilisateur</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-3">
              <Link href="/dossier" className="flex items-center gap-3">
                <UserIcon className="w-4 h-4" />
                <span>Mon Dossier</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-3">
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Configuration</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem onClick={handleSignOut} className="rounded-xl focus:bg-destructive/10 text-destructive cursor-pointer p-3">
              <LogOut className="w-4 h-4 mr-3" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </>
  )
}
