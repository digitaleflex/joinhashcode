"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Layout,
  FileText,
  Target,
  Settings,
  MoreHorizontal,
  LogOut,
  ShieldAlert,
  MessageSquarePlus,
  Activity,
  Users,
  ClipboardCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
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
import { cn } from "@/lib/utils"
import { DailyCheckinDialog } from "./daily-checkin-dialog"

export function AppSidebar({ user, hasSquad }: { user: any; hasSquad?: boolean }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const currentUser = user || session?.user

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = "/"
  }

  // User is eligible for reviewer role if Level >= 2 AND completed missions >= 3, or has admin role.
  const isReviewerEligible = currentUser && (
    ((currentUser.level ?? 1) >= 2 && (currentUser.missionsCompletedCount ?? 0) >= 3) ||
    ["ADMIN", "MODERATOR", "OPERATOR"].includes(currentUser.role ?? "")
  )

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-zinc-950">
      <SidebarHeader className="h-16 border-b border-white/5 flex flex-row items-center justify-between px-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden hover:opacity-80 transition-opacity"
        >
          <div className="size-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)] shrink-0">
            <Activity className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-base tracking-tighter text-white uppercase truncate">HASHCODE</span>
            <span className="text-[11px] font-mono text-primary font-bold tracking-tight">réseau_actif</span>
          </div>
        </Link>
        <div className="group-data-[collapsible=icon]:mx-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent id="tour-sidebar">
        <div className="px-4 pt-6 pb-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-4">
          <DailyCheckinDialog />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* CONSOLE (Ex-Accueil) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Console"
                  className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/dashboard">
                    <Layout className="size-4" />
                    <span className="font-medium">Console</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* SQUAD / MON ESCOUADE */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/squad"}
                  tooltip={hasSquad ? "Mon Escouade" : "Escouade"}
                  className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/squad" className="flex items-center gap-2">
                    <Users className="size-4 shrink-0" />
                    <span className="font-medium flex-1">
                      {hasSquad ? "Mon Escouade" : "Escouade"}
                    </span>
                    {hasSquad && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_6px_rgba(197,244,65,0.8)] group-data-[collapsible=icon]:hidden" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* MISSIONS */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/missions"}
                  tooltip="Missions"
                  className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/missions">
                    <Target className="size-4" />
                    <span className="font-medium">Missions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* MON DOSSIER */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dossier"}
                  tooltip="Mon Dossier"
                  className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/dossier">
                    <FileText className="size-4" />
                    <span className="font-medium">Mon Dossier</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* LEADERSHIP SECTION (CONDITIONAL) */}
        {(isReviewerEligible || ["ADMIN", "MODERATOR", "OPERATOR"].includes(currentUser?.role ?? "")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Leadership</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* REVIEWER */}
                {isReviewerEligible && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/reviewer"}
                      tooltip="Reviewer"
                      className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      <Link href="/reviewer">
                        <ClipboardCheck className="size-4" />
                        <span className="font-medium">Reviewer</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* ADMINISTRATION */}
                {["ADMIN", "MODERATOR", "OPERATOR"].includes(currentUser?.role ?? "") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin")}
                      tooltip="Administration"
                      className="h-10 text-muted-foreground hover:text-white hover:bg-white/5 data-[active=true]:bg-white/10 data-[active=true]:text-white"
                    >
                      <Link href="/admin">
                        <ShieldAlert className="size-4" />
                        <span className="font-medium">Administration</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Général</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* FEEDBACK */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/feedback"}
                  tooltip="Feedback"
                  className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/feedback">
                    <MessageSquarePlus className="size-4" />
                    <span className="font-medium">Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4">
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
      <SidebarRail />
    </Sidebar>
  )
}
