"use client"

import * as React from "react"
import Link from "next/link"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { getLevelProgress } from "@/lib/level-utils"
import { MoreHorizontal, LogOut, Settings, FileText } from "lucide-react"
import type { NavUser } from "@/lib/types"

export function SidebarUser({ user }: { user: NavUser | null }) {
  const { data: session } = authClient.useSession()
  const currentUser = (user || session?.user) as NavUser | undefined
  const progress = getLevelProgress(currentUser?.experience || 0)

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = "/"
  }

  return (
    <SidebarFooter className="border-t border-white/5 p-4">
      <div className="px-2 pb-4 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-bold">
            Niveau {progress.level}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            {currentUser?.experience} / {progress.nextLevelXp || progress.xpInLevel} XP
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-primary shadow-[0_0_10px_rgba(197,244,65,0.4)] transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/5 h-12"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-white/10">
                  <AvatarImage src={currentUser?.image || ""} alt={currentUser?.name || ""} />
                  <AvatarFallback className="rounded-lg bg-primary/20 text-primary font-bold">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                  <span className="truncate font-semibold text-white">{currentUser?.name || "Utilisateur"}</span>
                  <span className="truncate text-xs text-muted-foreground">{currentUser?.email}</span>
                </div>
                <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-zinc-900 border-white/5 text-white"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={currentUser?.image || ""} alt={currentUser?.name || ""} />
                    <AvatarFallback className="rounded-lg bg-primary/20 text-primary">
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">{currentUser?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{currentUser?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/5 focus:text-white">
                <Link href="/settings" className="flex items-center gap-2 w-full">
                  <Settings className="size-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/5 focus:text-white">
                <Link href="/dossier" className="flex items-center gap-2 w-full">
                  <FileText className="size-4" />
                  <span>Mon Dossier</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
              >
                <LogOut className="size-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
