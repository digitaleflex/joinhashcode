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
  Command
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
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
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-card/10 backdrop-blur-xl">
      <SidebarHeader className="h-16 border-b border-border/40 flex flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)] shrink-0">
            <span className="text-primary-foreground font-black text-xl italic">H</span>
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter text-white uppercase truncate">HASHCODE</span>
        </div>
        <div className="group-data-[collapsible=icon]:mx-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-11 transition-all hover:bg-primary/10 data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  tooltip="Retour au site"
                  className="h-11 text-muted-foreground hover:text-primary hover:bg-primary/5"
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

      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
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
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card/95 backdrop-blur-xl border-border/40"
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
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dossier" className="flex items-center gap-2">
                    <FileText className="size-4" />
                    <span>Mon Dossier</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
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
