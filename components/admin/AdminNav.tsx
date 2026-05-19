"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Membres", icon: Users },
  { href: "/admin/submissions", label: "Missions", icon: FileCheck },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-sm sticky top-[65px] z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-3">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-1 py-1 transition-all group relative",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  {link.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
