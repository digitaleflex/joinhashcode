"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Link as LinkIcon,
  Save, Loader2,
  Shield, Sparkles, Activity,
  Settings, Fingerprint, ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import Link from "next/link"

// Modular Settings Subcomponents
import { ProfileTab } from "@/components/settings/tabs/ProfileTab"
import { ExpertiseDiagnostic } from "@/components/settings/expertise-diagnostic"
import { LinksTab } from "@/components/settings/tabs/LinksTab"
import { VaultTab } from "@/components/settings/tabs/VaultTab"
import { AccountTab } from "@/components/settings/tabs/AccountTab"

const TABS = [
  { id: "profile", label: "Diagnostic", icon: User, desc: "Identité et informations de base" },
  { id: "expertise", label: "Spécialisation", icon: Sparkles, desc: "Tes domaines et outils favoris" },
  { id: "links", label: "Connectivité", icon: LinkIcon, desc: "Tes points d'ancrage externes" },
  { id: "vault", label: "Coffre-fort", icon: Fingerprint, desc: "Ta carte membre & clés d'accès" },
  { id: "account", label: "Sécurité", icon: Shield, desc: "Gestion du compte et accès" },
]

const TAB_COLORS: Record<string, { color: string; border: string; glow: string; text: string; label: string }> = {
  profile: { color: "#10B981", border: "border-emerald-500/30", glow: "rgba(16, 185, 129, 0.2)", text: "text-emerald-400", label: "PROFILE_NODE" },
  expertise: { color: "#A855F7", border: "border-purple-500/30", glow: "rgba(168, 85, 247, 0.2)", text: "text-purple-400", label: "SPECIALIZATION_NODE" },
  links: { color: "#06B6D4", border: "border-cyan-500/30", glow: "rgba(6, 182, 212, 0.2)", text: "text-cyan-400", label: "CONNECTIVITY_NODE" },
  vault: { color: "#B8FF3B", border: "border-[#B8FF3B]/30", glow: "rgba(184, 255, 59, 0.2)", text: "text-[#B8FF3B]", label: "VAULT_NODE" },
  account: { color: "#EF4444", border: "border-red-500/30", glow: "rgba(239, 68, 68, 0.2)", text: "text-red-400", label: "SECURITY_NODE" },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)


  useEffect(() => {
    fetch("/api/user/me")
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setUserData(data))
      .catch(() => toast.error("Impossible de charger tes données. Recharge la page."))
  }, [])

  // Optimized Save payload picker (eliminates redundant manual mapping)
  const save = useCallback(async (data: any, silent = false) => {
    try {
      const ALLOWED_FIELDS = [
        "name", "pseudo", "bio", "image", "country", "city", "language", "currentSituation",
        "githubUrl", "portfolioUrl", "twitterUrl", "linkedinUrl", "domains",
        "tools", "mainObjective", "secondaryObjectives"
      ]

      const payload = Object.fromEntries(
        Object.entries(data).filter(
          ([key, val]) => ALLOWED_FIELDS.includes(key) && val !== null && val !== ""
        )
      )

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setIsDirty(false)
        if (!silent) toast.success("Données synchronisées.")
        return true
      }
      if (!silent) toast.error("Erreur de synchronisation")
    } catch {
      if (!silent) toast.error("Erreur réseau")
    }
    return false
  }, [])

  const updateData = useCallback((next: any) => {
    setUserData(next)
    setIsDirty(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setAutoSaving(true)
      await save(next, true)
      setAutoSaving(false)
    }, 2000)
  }, [save])

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <span className="text-[10px] font-mono uppercase text-primary/60">Chargement...</span>
        </div>
      </div>
    )
  }

  const activeColor = TAB_COLORS[activeTab] || TAB_COLORS.profile

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <BottomNav />

      <SidebarInset className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="scanline opacity-20" aria-hidden="true" />

        <UserTopBar user={userData} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Back Button */}
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors group mb-2"
            >
              <ChevronLeft className="size-3 group-hover:-translate-x-0.5 transition-transform" />
              RETOUR AU DASHBOARD
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Settings className="size-3.5 text-primary" />
                  <span className="text-[10px] font-mono font-bold text-primary">Paramètres utilisateur</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Configuration <span className="text-primary font-bold">du compte</span>
                </h1>
                <p className="text-zinc-500 max-w-xl font-light text-sm md:text-base leading-relaxed">
                  Gère tes informations personnelles, tes préférences de compte et tes intégrations.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {isDirty && !autoSaving && (
                  <Button
                    onClick={() => { setLoading(true); save(userData).finally(() => setLoading(false)) }}
                    disabled={loading}
                    className="btn-primary-glow h-12 rounded-xl px-6 text-[11px] uppercase font-black tracking-wide gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Sauvegarder
                  </Button>
                )}
                <div className="flex items-center gap-4 bg-zinc-900/40 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-xl">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-tighter">Statut</span>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-wider", autoSaving ? "text-primary" : isDirty ? "text-amber-500" : "text-emerald-500")}>
                      {autoSaving ? "SYNCING..." : isDirty ? "MODIFIÉ" : "OPÉRATIONNEL"}
                    </span>
                  </div>
                  <div className={cn("size-2 rounded-full", autoSaving ? "bg-primary animate-pulse" : isDirty ? "bg-amber-500" : "bg-emerald-500 shadow-[0_0_15px_#10b981]")} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">

              {/* Navigation sidebar */}
              <aside className="space-y-3">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  const tabColor = TAB_COLORS[tab.id] || TAB_COLORS.profile
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-start gap-5 p-5 rounded-3xl transition-all duration-500 border group text-left relative overflow-hidden cursor-pointer",
                        isActive ? "text-white backdrop-blur-md z-10" : "bg-white/1 border-white/5 text-zinc-500 hover:bg-white/3 hover:border-white/10 z-0"
                      )}
                      style={isActive ? {
                        backgroundColor: `${tabColor.color}12`,
                        borderColor: `${tabColor.color}44`,
                        boxShadow: `0 0 35px ${tabColor.color}11`,
                      } : {}}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-full" style={{ backgroundColor: tabColor.color }} aria-hidden="true" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 -z-10 pointer-events-none opacity-60" style={{ background: `radial-gradient(circle at 10% 50%, ${tabColor.color}22 0%, transparent 70%)` }} aria-hidden="true" />
                      )}
                      <div
                        className={cn("p-3 rounded-xl transition-all duration-500 relative", isActive ? "text-black" : "bg-zinc-900 border border-white/5 group-hover:text-primary")}
                        style={isActive ? { backgroundColor: tabColor.color, boxShadow: `0 0 20px ${tabColor.color}cc` } : {}}
                      >
                        {isActive && <span className="absolute -inset-1.5 rounded-xl blur-md pointer-events-none" style={{ backgroundColor: `${tabColor.color}33` }} aria-hidden="true" />}
                        <tab.icon className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-semibold tracking-tight transition-colors", isActive ? "text-white" : "group-hover:text-zinc-300")}>{tab.label}</p>
                        <p className="text-[10px] opacity-60 leading-tight font-light tracking-tight">{tab.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </aside>

              {/* Content area */}
              <div
                className="glass-card rounded-[2.5rem] overflow-hidden min-h-162.5 relative group/content transition-all duration-700 w-full"
                style={{ borderColor: `${activeColor.color}25`, boxShadow: `0 8px 32px 0 rgba(0,0,0,0.8), 0 0 40px ${activeColor.color}05` }}
              >
                {/* HUD corner brackets */}
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} aria-hidden="true" />
                <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} aria-hidden="true" />
                <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} aria-hidden="true" />
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} aria-hidden="true" />

                <div className="absolute top-6 left-16 font-mono text-[7px] text-zinc-500 uppercase tracking-widest pointer-events-none select-none flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-1 rounded-full animate-ping" style={{ backgroundColor: activeColor.color }} />
                  [{activeColor.label}]
                </div>

                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/content:opacity-[0.06] transition-opacity duration-1000" aria-hidden="true">
                  <Activity className="size-64" style={{ color: activeColor.color }} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="p-8 md:p-12 relative z-10"
                  >
                    {activeTab === "profile" && (
                      <ProfileTab userData={userData} updateData={updateData} />
                    )}

                    {activeTab === "expertise" && (
                      <ExpertiseDiagnostic key={userData?.id || "loading"} userData={userData} updateData={updateData} />
                    )}

                    {activeTab === "links" && (
                      <LinksTab userData={userData} updateData={updateData} />
                    )}

                    {activeTab === "vault" && (
                      <VaultTab userData={userData} />
                    )}

                    {activeTab === "account" && (
                      <AccountTab userData={userData} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
