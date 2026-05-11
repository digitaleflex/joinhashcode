"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Zap, User } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const userClass = (session?.user as any)?.class || "builder" // Fallback to builder

  const navItems = [
    {
      name: "Accueil",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Guilde",
      href: `/community/${userClass || "builder"}`,
      icon: Users,
    },
    {
      name: "Missions",
      href: "/missions",
      icon: Zap,
    },
    {
      name: "Profil",
      href: "/settings",
      icon: User,
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all duration-200 ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium tracking-tight">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
