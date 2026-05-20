"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Layout,
  FileText,
  Target,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  ChevronRight,
  MoreHorizontal,
  User as UserIcon,
  LogOut,
  Command,
  ShieldAlert,
  MessageSquarePlus,
  Activity,
  Users,
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

const navItems = [
  {
    title: "Tableau de Bord",
    url: "/dashboard",
    icon: Layout,
  },
  {
    title: "Mon Dossier",
    url: "/dossier",
    icon: FileText,
  },
  {
    title: "Missions",
    url: "/missions",
    icon: Target,
  },
  {
    title: "Mon Escouade",
    url: "/squad",
    icon: Users,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const currentUser = user || session?.user

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = "/"
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-zinc-950">
      <SidebarHeader className="h-16 border-b border-white/5 flex flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden">
          <div className="size-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)] shrink-0">
            <Activity className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-sm tracking-[-0.05em] text-white uppercase truncate">HASHCODE</span>
            <span className="text-[10px] font-mono text-primary font-bold tracking-tight">réseau_actif</span>
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:mx-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono font-bold tracking-tight text-zinc-500 mb-2 px-2">navigation_principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-11 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/feedback"}
                  tooltip="Feedback Bêta"
                  className="h-11 transition-all hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href="/feedback">
                    <MessageSquarePlus className="size-4" />
                    <span className="font-medium">Feedback Bêta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] font-mono font-bold tracking-tight text-zinc-500 mb-2 px-2">système_global</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {["ADMIN", "MODERATOR", "OPERATOR"].includes(currentUser?.role ?? "") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Admin"
                    className="h-11 text-muted-foreground hover:text-white hover:bg-white/5"
                  >
                    <Link href="/admin">
                      <ShieldAlert className="size-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Quitter le terminal"
                  className="h-11 text-muted-foreground hover:text-white hover:bg-white/5"
                >
                  <Link href="/">
                    <ArrowLeft className="size-4" />
                    <span>Retour au site</span>
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
