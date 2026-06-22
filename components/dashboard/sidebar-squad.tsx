"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users } from "lucide-react"
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarSquad({ hasSquad }: { hasSquad?: boolean }) {
  const pathname = usePathname()

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === "/squad"}
          tooltip={hasSquad ? "Gère ton équipe de 5 et progresse ensemble." : "Rejoins une escouade de développeurs complémentaires."}
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

      {!hasSquad && (
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === "/squad/discover"}
            tooltip="Découvrir des escouades actives"
            className="h-9 transition-all hover:bg-white/5 pl-10 text-zinc-500 hover:text-white"
          >
            <Link href="/squad/discover">
              <span className="font-medium text-[12px] uppercase tracking-wider">Découvrir</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </>
  )
}
