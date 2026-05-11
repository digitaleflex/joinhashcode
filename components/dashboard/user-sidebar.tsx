"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  LayoutDashboard, 
  FileText, 
  Zap, 
  Settings, 
  Users, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { motion } from "framer-motion"

export function UserSidebar({ user: propUser }: { user?: any }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  
  const user = propUser || session?.user
  
  if (!user) return null
  const level = user.level || 1
  const levelMap: Record<number, string> = { 1: "INIT", 2: "CORE", 3: "PRO", 4: "ELITE" }
  const levelName = levelMap[level] || "INIT"

  const mainLinks = [
    { name: "Vue d'ensemble", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Mon Dossier", icon: FileText, href: "/dossier" },
    { name: "Missions", icon: Zap, href: "/missions" },
  ]

  const communityLinks = [
    { name: "Ma Guilde", icon: Users, href: `/community/${user.class || 'builder'}` },
    { name: "Classements", icon: TrendingUp, href: "/leaderboard" },
  ]

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
    <aside className="hidden md:flex flex-col w-72 border-r border-border/40 bg-card/10 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto scrollbar-none">
      {/* Navigation Header */}
      <div className="p-6 border-b border-border/40">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          RETOUR AU SITE
        </Link>
      </div>

      {/* User Quick Profile */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                  {user.name?.[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background border border-border/40 rounded-lg flex items-center justify-center">
              <Award className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate max-w-[140px]">{user.name}</span>
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{levelName} LEVEL</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase">
            <span>Habilitation</span>
            <span>{Math.min(100, (level / 4) * 100)}%</span>
          </div>
          <Progress value={(level / 4) * 100} className="h-1 bg-primary/10" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="space-y-2">
          <h4 className="px-3 text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em] mb-4">Système</h4>
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group relative",
                pathname === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform duration-300",
                pathname === item.href ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.name}</span>
              {pathname === item.href && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Community Section */}
        <div className="space-y-2">
          <h4 className="px-3 text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em] mb-4">Réseau</h4>
          {communityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform duration-300",
                pathname === item.href ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-4 mt-auto border-t border-border/40 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group border border-transparent",
            pathname === "/settings" 
              ? "bg-primary/10 text-primary border-primary/20" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
        >
          <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-medium">Configuration</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 w-full transition-all duration-300 group"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
