"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Zap, FileText } from "lucide-react"
export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Escouade", href: "/squad", icon: Users },
    { name: "Missions", href: "/missions", icon: Zap },
    { name: "Dossier", href: "/dossier", icon: FileText },
  ]

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-100">
      <nav 
        aria-label="Navigation principale mobile"
        className="relative flex items-center justify-around px-2 py-3 bg-card/60 backdrop-blur-2xl border border-white/5 rounded-4xl shadow-2xl shadow-black/40"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[60px] transition-colors duration-300 ${
                isActive ? "text-primary" : "text-zinc-400 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 transition-all duration-500" />
              )}

              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider relative z-10">
                {item.name}
              </span>

              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
