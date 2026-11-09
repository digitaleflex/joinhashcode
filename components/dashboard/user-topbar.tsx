"use client"

import { Search, User as UserIcon, Settings, LogOut, Bell, ShieldAlert } from "lucide-react"
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
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import Image from "next/image"
import dynamic from "next/dynamic"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { toast } from "sonner"
import type { NavUser } from "@/lib/types"
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

export function UserTopBar({ user }: { user: NavUser | null }) {
  const session = authClient.useSession();
  const isImpersonated = session.data?.session?.impersonatedBy;

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
        <div className="bg-amber-500 text-black py-2 px-4 flex items-center justify-between font-mono text-xs font-black uppercase tracking-widest animate-pulse relative z-[var(--z-banner)]">
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
        <SidebarTrigger id="tour-sidebar-trigger" className="md:hidden text-muted-foreground hover:text-white mr-2" />
        <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
          <Logo variant="full" size="sm" priority />
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
                <span className="text-3xs font-mono text-primary uppercase">LVL {user?.level || 1}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 rounded-2xl p-2">
            <DropdownMenuLabel className="font-mono text-xs uppercase text-muted-foreground p-3">Compte Utilisateur</DropdownMenuLabel>
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
