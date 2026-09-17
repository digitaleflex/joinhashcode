"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShieldAlert,
  ClipboardCheck,
  Activity,
  CircleHelp,
} from "lucide-react"
import { TOUR_NAMES } from "@/components/tour/tour-config"
import { useNextStepSafe } from "@/components/tour/use-next-step-safe"

import {
  Sidebar,
  SidebarContent,
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
import { authClient } from "@/lib/auth-client"
import { BetaFeedbackDialog } from "./beta-feedback-dialog"
import { mainNavItems } from "./sidebar-nav-config"
import { SidebarUser } from "./sidebar-user"
import { ThemeToggle } from "./theme-toggle"
import type { NavUser } from "@/lib/types"

export function AppSidebar({ user, hasSquad: _hasSquad }: { user: NavUser | null; hasSquad?: boolean }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const currentUser = (user || session?.user) as NavUser | undefined
  const { startNextStep } = useNextStepSafe()

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
            <span className="text-sm-plus font-mono text-primary font-bold tracking-tight">réseau_actif</span>
          </div>
        </Link>
        <div className="group-data-[collapsible=icon]:mx-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent id="tour-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.tooltip}
                    className="h-10 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* SidebarSquad gelé (pivot pipeline cyber) */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* LEADERSHIP SECTION (CONDITIONAL) */}
        {(isReviewerEligible || ["ADMIN", "MODERATOR", "OPERATOR"].includes(currentUser?.role ?? "")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Leadership</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* REVIEWER */}
                {isReviewerEligible && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/reviewer"}
                      tooltip="Analyse et valide les preuves de missions de la communauté."
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
                      tooltip="Panneau de contrôle global : membres, missions et système."
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
          <SidebarGroupLabel className="text-xs font-medium tracking-wider text-zinc-600 uppercase mb-1 px-2">Général</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => startNextStep(TOUR_NAMES.DASHBOARD)}
                  tooltip="Revoir le guide interactif du dashboard."
                  className="h-10 transition-all hover:bg-white/5"
                >
                  <CircleHelp className="size-4" />
                  <span className="font-medium">Revoir le tour</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <BetaFeedbackDialog />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ThemeToggle />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarUser user={user} />
      <SidebarRail />
    </Sidebar>
  )
}
