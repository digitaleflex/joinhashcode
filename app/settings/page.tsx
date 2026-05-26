"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Globe, Github, Link as LinkIcon,
  Save, Loader2, Camera,
  Shield, Sparkles, Activity, Wifi,
  Linkedin, Twitter, Settings, Check,
  ChevronRight, Fingerprint, AtSign,
  Languages, Cpu,
  Copy, Lock,
  Eye, EyeOff, Sliders, Zap,
  RefreshCw, AlertTriangle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { authClient } from "@/lib/auth-client"
import { ExpertiseDiagnostic } from "@/components/settings/expertise-diagnostic"
import { CLASS_COLORS, XP_MAX } from "@/lib/member-card-constants"

function DecryptingText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-="

  useEffect(() => {
    if (!text) return
    let currentIteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text.split("").map((char, index) => {
          if (index < currentIteration) return text[index]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      )
      if (currentIteration >= text.length) clearInterval(interval)
      currentIteration += 1 / 3
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return <span className="font-mono tracking-wide">{displayText}</span>
}

function SvgBarcode({ value }: { value: string }) {
  const chars = value || "HC-M-000001"
  let hash = 0
  for (let i = 0; i < chars.length; i++) {
    hash = (hash << 5) - hash + chars.charCodeAt(i)
    hash |= 0
  }
  const seed = Math.abs(hash)
  const bars: number[] = []
  let totalWidth = 0
  for (let i = 0; i < 28; i++) {
    const width = ((seed >> i) & 2) || 1
    bars.push(width)
    totalWidth += width + 1
  }
  return (
    <div className="flex flex-col items-center gap-1 select-none pointer-events-none" aria-hidden="true">
      <svg className="h-6 w-28 text-white/50" viewBox={`0 0 ${totalWidth} 20`} fill="currentColor">
        {bars.map((w, idx) => {
          const x = bars.slice(0, idx).reduce((sum, curr) => sum + curr + 1, 0)
          return <rect key={idx} x={x} y="0" width={w} height="20" />
        })}
      </svg>
      <span className="text-[5.5px] font-mono text-zinc-500 font-black">{chars}</span>
    </div>
  )
}

function ClassBackground({ userClass, tierColor }: { userClass: string; tierColor: string }) {
  const cl = (userClass || "builder").toLowerCase()
  if (cl === "builder") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(184,255,59,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(184,255,59,0.08)_1px,transparent_1px)] bg-size-[12px_12px]" />
        <div className="absolute bottom-0 right-0 w-24 h-6 bg-[repeating-linear-gradient(45deg,rgba(184,255,59,0.25),rgba(184,255,59,0.25)_8px,transparent_8px,transparent_16px)]" />
        <svg className="absolute top-4 right-4 w-12 h-12 text-[#B8FF3B]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 10 50 H 90 M 50 10 V 90" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    )
  }
  if (cl === "creator") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25" aria-hidden="true">
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)] blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.1),transparent_50%)] blur-2xl" />
        <svg className="absolute inset-0 w-full h-full text-purple-400/40" viewBox="0 0 300 200">
          <circle cx="240" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="240" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="240,85 243,97 255,100 243,103 240,115 237,103 225,100 237,97" fill="currentColor" className="opacity-40" />
        </svg>
      </div>
    )
  }
  if (cl === "strategist") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" aria-hidden="true">
        <svg className="absolute -left-10 -bottom-10 w-48 h-48 text-[#22D3EE]/30" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    )
  }
  if (cl === "catalyst") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25" aria-hidden="true">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-2xl" />
        <svg className="absolute inset-0 w-full h-full text-orange-400/30" viewBox="0 0 300 200">
          <path d="M150,200 L0,50 M150,200 L50,0 M150,200 L150,0 M150,200 L250,0 M150,200 L300,50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 15" />
          <circle cx="150" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      </div>
    )
  }
  return null
}

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "VIDE", color: "bg-zinc-800", text: "text-zinc-500" }
  if (password.length < 8) return { score: 1, label: "TROP COURT", color: "bg-rose-500", text: "text-rose-500" }
  if (password.length < 12) return { score: 2, label: "FAIBLE", color: "bg-amber-500", text: "text-amber-500" }
  if (password.length < 16) return { score: 3, label: "MOYEN", color: "bg-cyan-500", text: "text-cyan-400" }
  return { score: 4, label: "FORT", color: "bg-emerald-500", text: "text-emerald-400" }
}

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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false)
  const [biometricState, setBiometricState] = useState<"STANDBY" | "SCANNING" | "SUCCESS" | "FAILED">("STANDBY")

  const [customSecretCode, setCustomSecretCode] = useState("")
  const [customSignature, setCustomSignature] = useState("")
  const [cardTier, setCardTier] = useState("STANDARD")
  const [showSecretCode, setShowSecretCode] = useState(false)
  const [isSavingCustomCard, setIsSavingCustomCard] = useState(false)
  const [activeVaultMode, setActiveVaultMode] = useState("auto")

  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userData) {
      setCustomSignature(userData.cardSignature || "")
      setCardTier(userData.cardTier || "STANDARD")
    }
  }, [userData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveCustomCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCustomCard(true)
    try {
      const res = await fetch("/api/user/card/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customSecretCode: customSecretCode || undefined,
          customSignature: customSignature || undefined,
          cardTier: cardTier || undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setUserData({ ...userData, cardSignature: data.cardSignature, cardIssuedAt: data.cardIssuedAt, cardTier: data.cardTier, memberNumber: data.memberNumber })
        setCustomSecretCode("")
        toast.success("Coffre-fort et carte membre mis à jour avec succès !")
      } else {
        toast.error(await res.text() || "Échec de la mise à jour du coffre-fort.")
      }
    } catch {
      toast.error("Erreur réseau lors de la mise à jour.")
    } finally {
      setIsSavingCustomCard(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRotate({
      x: -((y - rect.height / 2) / (rect.height / 2)) * 10,
      y: ((x - rect.width / 2) / (rect.width / 2)) * 10,
    })
    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  }

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Code secret copié dans le presse-papiers !")
    setTimeout(() => setCopied(false), 2000)
  }

  const openBiometricScanner = () => {
    setIsBiometricModalOpen(true)
    setBiometricState("STANDBY")
  }

  const triggerBiometricScan = async () => {
    setBiometricState("SCANNING")
    await new Promise(resolve => setTimeout(resolve, 1600))
    try {
      const res = await fetch("/api/user/card/generate", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        setSecretKey(data.secretKey)
        setUserData((prev: any) => ({ ...prev, cardSignature: data.cardSignature, cardIssuedAt: data.cardIssuedAt, cardTier: data.cardTier, memberNumber: data.memberNumber }))
        setBiometricState("SUCCESS")
        toast.success("Nouveau Code Secret généré avec succès !")
      } else {
        throw new Error()
      }
    } catch {
      setBiometricState("FAILED")
      toast.error("Échec de la génération du code secret.")
    }
  }

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => toast.error("Impossible de charger les données"))
  }, [])

  const save = useCallback(async (data: any, silent = false) => {
    try {
      const payload = {
        name: data.name || undefined,
        pseudo: data.pseudo || undefined,
        bio: data.bio || undefined,
        image: data.image || undefined,
        country: data.country || undefined,
        city: data.city || undefined,
        currentSituation: data.currentSituation || undefined,
        githubUrl: data.githubUrl || undefined,
        portfolioUrl: data.portfolioUrl || undefined,
        twitterUrl: data.twitterUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        domains: data.domains || undefined,
        tools: data.tools || undefined,
        mainObjective: data.mainObjective || undefined,
        secondaryObjectives: data.secondaryObjectives || undefined,
      }
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: formData })
      if (!res.ok) throw new Error(await res.text())
      const { url } = await res.json()
      setUserData({ ...userData, image: url })
      toast.success("Avatar mis à jour !")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload")
    } finally {
      setUploadingAvatar(false)
    }
  }

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
                    className="btn-primary-glow h-12 rounded-xl px-6 text-[11px] uppercase font-black tracking-wide gap-2"
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
                        isActive ? "text-white backdrop-blur-md z-10" : "bg-white/[0.01] border-white/5 text-zinc-500 hover:bg-white/[0.03] hover:border-white/10 z-0"
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
              {(() => {
                const activeColor = TAB_COLORS[activeTab] || TAB_COLORS.profile
                return (
                  <div
                    className="glass-card rounded-[2.5rem] overflow-hidden min-h-[650px] relative group/content transition-all duration-700 w-full"
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

                        {/* ── PROFILE TAB ── */}
                        {activeTab === "profile" && (
                          <div className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/5 pb-12">

                              {/* Avatar dock */}
                              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/40 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group/avatar-dock min-h-[280px]">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" aria-hidden="true" />
                                <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': '#10B981' } as React.CSSProperties} aria-hidden="true" />
                                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-emerald-500/30 pointer-events-none" aria-hidden="true" />

                                <div className="relative group/avatar shrink-0 my-4">
                                  <div className="size-32 md:size-40 bg-zinc-900 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-emerald-500/60 transition-all duration-700 cyber-notch">
                                    {uploadingAvatar ? (
                                      <Loader2 className="size-10 animate-spin text-emerald-400" />
                                    ) : userData?.image ? (
                                      <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-5xl font-black text-emerald-500/10 uppercase">
                                        {userData?.name?.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/png, image/jpeg, image/webp" />
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 z-20 cursor-pointer"
                                    aria-label="Changer l'avatar"
                                  >
                                    <Camera className="size-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Profile fields */}
                              <div className="lg:col-span-7 flex flex-col justify-center space-y-6 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><User className="size-3.5 text-emerald-500" /> Nom complet</label>
                                    <Input value={userData?.name || ""} onChange={e => updateData({ ...userData, name: e.target.value })} className="input-premium h-14 rounded-2xl text-base px-5 font-medium focus:border-emerald-500/60" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><AtSign className="size-3.5 text-emerald-500" /> Nom d'utilisateur</label>
                                    <Input value={userData?.pseudo || ""} onChange={e => updateData({ ...userData, pseudo: e.target.value })} className="input-premium h-14 rounded-2xl text-base px-5 font-medium font-mono focus:border-emerald-500/60" placeholder="votre_pseudo" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-zinc-400">Présentation / Bio</label>
                                  <textarea
                                    value={userData?.bio || ""}
                                    onChange={e => updateData({ ...userData, bio: e.target.value })}
                                    className="w-full input-premium min-h-[120px] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/60 resize-none text-white leading-relaxed font-light italic"
                                    placeholder="Présente-toi en quelques mots..."
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><Languages className="size-3.5 text-emerald-500" /> Langue d'affichage</label>
                                <div className="relative" ref={dropdownRef}>
                                  <button
                                    type="button"
                                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    className="w-full input-premium h-14 px-5 text-base focus:outline-none flex justify-between items-center text-white font-bold transition-all text-left cyber-notch"
                                  >
                                    <span>{userData?.language === "en" ? "English (EN)" : "Français (FR)"}</span>
                                    <ChevronRight className={cn("size-4 text-zinc-400 transition-transform duration-300", langDropdownOpen ? "-rotate-90 text-emerald-400" : "rotate-90")} />
                                  </button>
                                  <AnimatePresence>
                                    {langDropdownOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-16 left-0 right-0 bg-zinc-950/90 border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-1.5 backdrop-blur-2xl cyber-notch"
                                      >
                                        {[
                                          { value: "fr", label: "Français (FR)" },
                                          { value: "en", label: "English (EN)" },
                                        ].map(lang => (
                                          <button
                                            key={lang.value}
                                            type="button"
                                            onClick={() => { updateData({ ...userData, language: lang.value }); setLangDropdownOpen(false) }}
                                            className={cn(
                                              "w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between cyber-notch-sm mb-1",
                                              userData?.language === lang.value || (!userData?.language && lang.value === "fr")
                                                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                            )}
                                          >
                                            <span>{lang.label}</span>
                                            {(userData?.language === lang.value || (!userData?.language && lang.value === "fr")) && <Check className="size-4" />}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><Globe className="size-3.5 text-emerald-500" /> Pays de résidence</label>
                                <CountrySelector value={userData?.country || ""} onChange={val => updateData({ ...userData, country: val })} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── EXPERTISE TAB ── */}
                        {activeTab === "expertise" && (
                          <ExpertiseDiagnostic key={userData?.id || "loading"} userData={userData} updateData={updateData} />
                        )}

                        {/* ── LINKS TAB ── */}
                        {activeTab === "links" && (
                          <div className="space-y-8">
                            <div className="space-y-1 border-b border-white/5 pb-4">
                              <p className="text-sm font-semibold text-cyan-400">Réseaux & Liens</p>
                              <p className="text-zinc-400 text-xs font-light">Lier tes réseaux renforce ton profil et ton score de confiance.</p>
                            </div>
                            <div className="grid gap-5">
                              {[
                                { id: "githubUrl", icon: Github, label: "Lien GitHub", placeholder: "github.com/votre-user" },
                                { id: "linkedinUrl", icon: Linkedin, label: "Profil LinkedIn", placeholder: "linkedin.com/in/profil" },
                                { id: "twitterUrl", icon: Twitter, label: "Compte X (Twitter)", placeholder: "x.com/votre-user" },
                                { id: "portfolioUrl", icon: Globe, label: "Site Web / Portfolio", placeholder: "votre-site.com" },
                              ].map((link) => {
                                const isLinked = !!userData[link.id]
                                return (
                                  <div key={link.id} className="relative p-5 bg-zinc-950/40 border border-cyan-500/10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-5 group/uplink">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                      <div className="flex items-center justify-center size-10 rounded-xl bg-zinc-900 border border-white/5 shrink-0">
                                        <link.icon className="size-5 text-zinc-400 group-focus-within/uplink:text-cyan-400 transition-colors" />
                                      </div>
                                      <div className="space-y-0.5">
                                        <span className="text-xs font-semibold text-zinc-400 block">{link.label}</span>
                                        <div className="flex items-center gap-2">
                                          <div className={cn("size-1.5 rounded-full", isLinked ? "bg-cyan-400 shadow-[0_0_10px_#06b6d4]" : "bg-zinc-600")} />
                                          <span className={cn("text-[9px] font-mono font-bold uppercase tracking-wider", isLinked ? "text-cyan-400" : "text-zinc-500")}>
                                            {isLinked ? "Connecté" : "Non connecté"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative w-full md:w-80">
                                      <Input
                                        value={userData[link.id] || ""}
                                        onChange={e => updateData({ ...userData, [link.id]: e.target.value })}
                                        className="input-premium h-12 rounded-xl text-xs font-bold pl-4 focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                        placeholder={link.placeholder}
                                      />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* ── VAULT TAB ── */}
                        {activeTab === "vault" && (() => {
                          const cl = (userData?.class || "builder").toLowerCase()
                          const baseColor = CLASS_COLORS[cl] || "#B8FF3B"
                          const activeTier = activeVaultMode === "manual" ? cardTier : (userData?.cardTier || "STANDARD")
                          const tierColor = activeTier === "FOUNDER" ? "#F59E0B" : activeTier === "PREMIUM" ? "#22D3EE" : baseColor
                          const strength = getPasswordStrength(customSecretCode)
                          const signatureRegex = /^[A-Z0-9-]*$/
                          const isSignatureValid = signatureRegex.test(customSignature)

                          return (
                            <div className="space-y-10">
                              <div className="space-y-2 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-2">
                                  <div className="size-2 rounded-full animate-pulse" style={{ backgroundColor: tierColor }} />
                                  <h2 className="text-lg font-bold text-white">Sécurité du coffre-fort</h2>
                                </div>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                                  Configure ton identité HASHCODE unifiée. Enregistre une signature unique et tes clés d&apos;habilitation pour te connecter de manière sécurisée à l&apos;ensemble de nos réseaux.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                                {/* Member card dock */}
                                <div className="lg:col-span-6 relative rounded-[2.5rem] bg-zinc-950/40 border border-white/5 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[380px] group/dock">
                                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[16px_16px] opacity-45 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': tierColor } as React.CSSProperties} aria-hidden="true" />
                                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 pointer-events-none" aria-hidden="true" />

                                  <div className="w-full max-w-[390px] relative group/card-wrapper z-10 hover:scale-[1.01] transition-transform duration-500">
                                    <div className="absolute -inset-1.5 rounded-[2.2rem] blur-2xl opacity-25 group-hover/card-wrapper:opacity-50 transition-all duration-1000" style={{ backgroundColor: tierColor }} aria-hidden="true" />
                                    <div
                                      ref={cardRef}
                                      onMouseMove={handleMouseMove}
                                      onMouseLeave={handleMouseLeave}
                                      className="relative w-full aspect-[1.586/1] rounded-[2rem] p-5 text-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border transition-all duration-200 select-none cursor-pointer holographic-sheen"
                                      style={{
                                        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                                        borderColor: `${tierColor}33`,
                                        background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(26,26,26,0.96) 0%, rgba(4,4,4,0.99) 100%)`,
                                        boxShadow: `0 0 45px ${tierColor}10, inset 0 0 20px ${tierColor}05`,
                                      }}
                                    >
                                      <ClassBackground userClass={userData?.class} tierColor={tierColor} />
                                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[12px_12px] opacity-40 pointer-events-none" aria-hidden="true" />
                                      <div className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay transition-opacity duration-300" style={{ background: `radial-gradient(circle at ${50 + rotate.y * 3.5}% ${50 - rotate.x * 3.5}%, rgba(255,255,255,0.3) 0%, transparent 60%)` }} aria-hidden="true" />
                                      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-30 transition-all duration-300" style={{ background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18) 0%, transparent 40%), radial-gradient(circle at calc(var(--mx, 50%) - 10%) calc(var(--my, 50%) - 10%), ${tierColor}1a 0%, transparent 60%)` }} aria-hidden="true" />

                                      {/* HUD corner sights */}
                                      {[
                                        { className: "absolute top-4 left-4 size-6", d: "M 2 12 V 2 H 12", cx: 2, cy: 2, label: "x:0.45", tx: 5, ty: 10 },
                                        { className: "absolute top-4 right-4 size-6", d: "M 22 12 V 2 H 12", cx: 22, cy: 2, label: "y:0.29", tx: 12, ty: 10 },
                                        { className: "absolute bottom-4 left-4 size-6", d: "M 2 12 V 22 H 12", cx: 2, cy: 22, label: "z:8.91", tx: 5, ty: 18 },
                                        { className: "absolute bottom-4 right-4 size-6", d: "M 22 12 V 22 H 12", cx: 22, cy: 22, label: "w:1.02", tx: 12, ty: 18 },
                                      ].map((s, i) => (
                                        <svg key={i} className={`${s.className} pointer-events-none opacity-60`} viewBox="0 0 24 24" fill="none" style={{ color: tierColor }} aria-hidden="true">
                                          <path d={s.d} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                          <circle cx={s.cx} cy={s.cy} r="1" fill="currentColor" />
                                          <text x={s.tx} y={s.ty} className="text-[5px] font-mono fill-current font-black opacity-75">{s.label}</text>
                                        </svg>
                                      ))}

                                      {/* Top line */}
                                      <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <Wifi className="size-2.5 text-zinc-600 animate-pulse" aria-hidden="true" />
                                            <span className="text-[7px] font-mono text-zinc-500 font-bold uppercase">SSO_INTEGRITY_SECURED</span>
                                          </div>
                                          <h3 className="text-xs font-black tracking-wider text-white uppercase italic">{"HASHCODE // CODESPACE"}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-black/60 backdrop-blur-md" style={{ borderColor: `${tierColor}33` }}>
                                          <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: tierColor, boxShadow: `0 0 10px ${tierColor}` }} />
                                          <span className="text-[7px] font-mono tracking-wider font-bold uppercase" style={{ color: tierColor }}>{activeTier}</span>
                                        </div>
                                      </div>

                                      {/* User info */}
                                      <div className="grid grid-cols-[56px_1fr] gap-3 items-center relative z-10 mb-2">
                                        <div className="relative shrink-0">
                                          <div className="size-14 rounded-[1.25rem] bg-zinc-950/90 overflow-hidden border flex items-center justify-center shadow-xl" style={{ borderColor: `${tierColor}44` }}>
                                            {userData?.image ? (
                                              <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/10 uppercase">
                                                {userData?.name?.charAt(0)}
                                              </div>
                                            )}
                                          </div>
                                          <div className="absolute inset-0 rounded-[1.25rem] blur-md opacity-20 pointer-events-none" style={{ backgroundColor: tierColor }} aria-hidden="true" />
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                          <div>
                                            <h4 className="text-xs font-black tracking-tight text-white uppercase truncate leading-none">
                                              <DecryptingText text={userData?.name || "ANONYMOUS"} />
                                            </h4>
                                            <p className="text-[8px] font-mono text-zinc-500 tracking-wider mt-0.5">@{userData?.pseudo || "non_defini"}</p>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                              <span className="text-[5px] font-mono text-zinc-600 uppercase tracking-wide leading-none block">Profile</span>
                                              <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: CLASS_COLORS[cl] || "#B8FF3B" }}>
                                                {userData?.class || "BUILDER"}{" // SQUAD"}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                              <svg className="size-7" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                                                <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#chip-grad)" stroke={tierColor} strokeWidth="1.5" />
                                                <path d="M 35 20 V 80 M 50 20 V 80 M 65 20 V 80 M 20 35 H 80 M 20 50 H 80 M 20 65 H 80" stroke={`${tierColor}40`} strokeWidth="1" />
                                                <circle cx="50" cy="50" r="10" fill="#0c0a09" stroke={tierColor} strokeWidth="1" />
                                                <defs>
                                                  <linearGradient id="chip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    {activeTier === "FOUNDER" ? (
                                                      <><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></>
                                                    ) : activeTier === "PREMIUM" ? (
                                                      <><stop offset="0%" stopColor="#67e8f9" /><stop offset="100%" stopColor="#0891b2" /></>
                                                    ) : (
                                                      <><stop offset="0%" stopColor="#e5e7eb" /><stop offset="100%" stopColor="#4b5563" /></>
                                                    )}
                                                  </linearGradient>
                                                </defs>
                                              </svg>
                                              <SvgBarcode value={userData?.memberNumber ? `HC-M-${String(userData.memberNumber).padStart(6, '0')}` : "HC-M-000001"} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* XP progress */}
                                      {(() => {
                                        const currentXp = userData?.experience || 0
                                        const maxXp = XP_MAX[userData?.level || 1] || 100
                                        const pct = Math.min(100, Math.max(0, (currentXp / maxXp) * 100))
                                        return (
                                          <div className="w-full relative z-10 px-0.5 my-1.5">
                                            <div className="flex justify-between items-center text-[5.5px] font-mono text-zinc-500 uppercase tracking-wide mb-1 leading-none">
                                              <span className="flex items-center gap-1"><Cpu className="size-2" aria-hidden="true" /> EVOLUTION ENGINE</span>
                                              <span>{currentXp} / {maxXp} XP</span>
                                            </div>
                                            <div className="flex gap-0.5 h-1 w-full bg-zinc-950/80 p-px rounded-xs border border-white/5 overflow-hidden">
                                              {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className="flex-1 h-full rounded-2xs transition-all duration-500" style={{ backgroundColor: (i / 12) * 100 < pct ? tierColor : "rgba(255,255,255,0.05)", boxShadow: (i / 12) * 100 < pct ? `0 0 6px ${tierColor}` : "none" }} />
                                              ))}
                                            </div>
                                          </div>
                                        )
                                      })()}

                                      {/* Card footer */}
                                      <div className="absolute bottom-3 left-5 right-5 flex justify-between items-end border-t border-white/5 pt-1.5 z-10">
                                        <div className="flex items-center gap-2.5">
                                          <div>
                                            <span className="text-[5px] font-mono text-zinc-600 uppercase block leading-none">Access_Lvl</span>
                                            <div className="text-[7.5px] font-mono font-bold text-zinc-300 leading-none mt-0.5">LVL {userData?.level || 1}</div>
                                          </div>
                                          <div>
                                            <span className="text-[5px] font-mono text-zinc-600 uppercase block leading-none">SSO_Integrity</span>
                                            <div className="text-[7.5px] font-mono font-bold text-emerald-400 flex items-center gap-0.5 leading-none mt-0.5">
                                              <span className="size-1 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" /> 98%
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-[4.5px] font-mono text-zinc-700 tracking-tighter uppercase leading-none">Security_Signature</span>
                                          <span className="text-[7px] font-mono font-black text-white tracking-wide leading-none mt-0.5" style={{ textShadow: `0 0 8px ${tierColor}40` }}>
                                            {activeVaultMode === "manual" && customSignature ? customSignature.trim().toUpperCase() : (userData?.cardSignature || "AUCUNE_SIGNATURE")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* SSO Console */}
                                <div className="lg:col-span-6 relative rounded-[2.5rem] bg-zinc-950/40 border border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
                                  <div className="space-y-6 w-full">
                                    {/* Mode switcher */}
                                    <div className="flex p-1 bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden">
                                      {[
                                        { id: "auto", icon: RefreshCw, label: "Génération Auto" },
                                        { id: "manual", icon: Sliders, label: "Liaison Manuelle" },
                                      ].map(mode => (
                                        <button
                                          key={mode.id}
                                          type="button"
                                          onClick={() => setActiveVaultMode(mode.id)}
                                          className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 cursor-pointer", activeVaultMode === mode.id ? "text-black font-extrabold" : "text-zinc-500 hover:text-zinc-300")}
                                        >
                                          {activeVaultMode === mode.id && (
                                            <motion.div layoutId="activeVaultPill" className="absolute inset-0 bg-primary rounded-xl z-[-1] shadow-[0_0_20px_rgba(197,244,65,0.4)]" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                          )}
                                          <mode.icon className="size-3.5" aria-hidden="true" />
                                          {mode.label}
                                        </button>
                                      ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                      {activeVaultMode === "auto" ? (
                                        <motion.div key="auto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className="space-y-6">
                                          <div className="flex items-center gap-4 bg-zinc-900/30 border border-white/[0.03] p-5 rounded-2xl">
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: `${tierColor}15`, border: `1px solid ${tierColor}30` }}>
                                              <Shield className="size-6" style={{ color: tierColor }} />
                                            </div>
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: tierColor }} aria-hidden="true" />
                                                <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Connexion SSO Chiffrée</span>
                                              </div>
                                              <p className="text-[9.5px] text-zinc-500 font-light leading-relaxed">
                                                Signature numérique unifiée active et sécurisée contre les intrusions réseau.
                                              </p>
                                            </div>
                                          </div>
                                          <div className="pt-2">
                                            <Button
                                              type="button"
                                              onClick={openBiometricScanner}
                                              className="w-full h-12 rounded-xl font-mono font-black uppercase text-[10px] tracking-wider gap-2 border"
                                              style={{ backgroundColor: `${tierColor}15`, borderColor: `${tierColor}44`, color: 'white' }}
                                            >
                                              <Zap className="size-3.5" aria-hidden="true" />
                                              {userData?.cardSecretHash ? "Générer_Nouveau_Code" : "Générer_Code_Secret"}
                                            </Button>
                                          </div>
                                        </motion.div>
                                      ) : (
                                        <motion.div key="manual" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="space-y-5">
                                          <form onSubmit={saveCustomCard} className="space-y-5">
                                            {/* Secret code */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 flex items-center justify-between">
                                                <span>Code Secret SSO</span>
                                                <span className={cn("text-[8px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5", strength.text)}>{strength.label}</span>
                                              </label>
                                              <div className="relative group/secret">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within/secret:text-primary transition-colors" aria-hidden="true" />
                                                <input
                                                  type={showSecretCode ? "text" : "password"}
                                                  value={customSecretCode}
                                                  onChange={e => setCustomSecretCode(e.target.value)}
                                                  placeholder={userData?.cardSecretHash ? "••••••••••••••••••••" : "Définir ton code secret SSO..."}
                                                  className="w-full input-premium h-12 rounded-xl pl-11 pr-11 text-xs focus:outline-none font-mono font-bold"
                                                />
                                                <button type="button" onClick={() => setShowSecretCode(!showSecretCode)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors" aria-label={showSecretCode ? "Masquer le code" : "Afficher le code"}>
                                                  {showSecretCode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                </button>
                                              </div>
                                              {customSecretCode && (
                                                <div className="flex gap-1.5 items-center px-0.5">
                                                  {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", i < strength.score ? strength.color : "bg-zinc-800")} />
                                                  ))}
                                                  <span className={cn("text-[8px] font-mono tracking-wider ml-1 shrink-0", strength.text)}>{strength.label}</span>
                                                </div>
                                              )}
                                            </div>

                                            {/* Signature */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 flex justify-between items-center">
                                                <span>Signature Unique Gravée</span>
                                                {customSignature && (
                                                  <span className={cn("text-[8px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5", isSignatureValid ? "text-emerald-400" : "text-rose-500")}>
                                                    {isSignatureValid ? "FORMAT_VALIDE" : "ALPHANUM_ONLY"}
                                                  </span>
                                                )}
                                              </label>
                                              <div className="relative group/sig">
                                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within/sig:text-primary transition-colors" aria-hidden="true" />
                                                <input
                                                  type="text"
                                                  value={customSignature}
                                                  onChange={e => { const val = e.target.value.toUpperCase(); if (signatureRegex.test(val) || val === "") setCustomSignature(val) }}
                                                  placeholder="Ex: ALPHA-DRUID-09"
                                                  className="w-full input-premium h-12 rounded-xl pl-11 pr-5 text-xs focus:outline-none font-bold uppercase font-mono tracking-wider"
                                                />
                                              </div>
                                            </div>

                                            {/* Tier selector */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 block">Niveau d&apos;Habilitation (Tier)</label>
                                              <div className="grid grid-cols-3 gap-3">
                                                {[
                                                  { id: "STANDARD", title: "STANDARD", desc: "Base", color: "#B8FF3B" },
                                                  { id: "PREMIUM", title: "PREMIUM", desc: "Pro Hub", color: "#22D3EE" },
                                                  { id: "FOUNDER", title: "FOUNDER", desc: "Elite", color: "#F59E0B" },
                                                ].map((t) => {
                                                  const isSelected = cardTier === t.id
                                                  return (
                                                    <button
                                                      key={t.id}
                                                      type="button"
                                                      onClick={() => setCardTier(t.id)}
                                                      className={cn("p-3 text-left font-mono transition-all duration-500 relative overflow-hidden flex flex-col justify-between aspect-[1.3/1] cursor-pointer cyber-notch border", isSelected ? "text-white" : "bg-black/50 border-white/5 text-zinc-500 hover:border-white/10")}
                                                      style={isSelected ? { borderColor: t.color, backgroundColor: `${t.color}05`, boxShadow: `0 0 20px ${t.color}26` } : {}}
                                                    >
                                                      <div className="flex justify-between items-start w-full">
                                                        <span className="text-[8.5px] font-black tracking-wider uppercase">{t.title}</span>
                                                        {isSelected && <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: t.color }} aria-hidden="true" />}
                                                      </div>
                                                      <div className="space-y-0.5">
                                                        <span className="text-[7.5px] font-bold opacity-60 block leading-none">{t.desc}</span>
                                                        <span className="text-[5.5px] opacity-40 font-mono tracking-tighter uppercase block">AUTH_LEVEL</span>
                                                      </div>
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </div>

                                            <div className="pt-2">
                                              <Button type="submit" disabled={isSavingCustomCard || !isSignatureValid} className="w-full h-12 rounded-xl font-mono font-black uppercase text-[10px] tracking-wider gap-2 btn-primary-glow">
                                                {isSavingCustomCard ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                                                Sauvegarder_Coffre_Fort
                                              </Button>
                                            </div>
                                          </form>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Secret key reveal */}
                                <AnimatePresence>
                                  {secretKey && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                      className="lg:col-span-12 p-6 md:p-8 rounded-[2.5rem] bg-emerald-950/10 border border-emerald-500/20 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]"
                                    >
                                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500/30 pointer-events-none" aria-hidden="true" />
                                      <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#10b981,#10b981_10px,#022c22_10px,#022c22_20px)] rounded-full pointer-events-none opacity-80 animate-pulse" aria-hidden="true" />

                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-4">
                                        <div className="flex items-center gap-3">
                                          <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <Shield className="size-5 text-emerald-400" />
                                          </div>
                                          <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
                                              <span className="text-[7px] font-mono text-emerald-500 font-bold uppercase tracking-wider">CONFINEMENT_CRITICAL_AREA</span>
                                            </div>
                                            <h3 className="text-sm font-black uppercase text-white italic">Coffre Cryptographique Sécurisé</h3>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[7.5px] font-mono text-emerald-500/60 uppercase">
                                          <span>ALGO: AES-GCM-256</span>
                                          <span className="hidden sm:inline">•</span>
                                          <span>BITS: 256</span>
                                        </div>
                                      </div>

                                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                                        Recopie immédiatement ce code dans un endroit sûr. Pour des raisons de sécurité, <strong className="text-emerald-400 font-bold">cette clé ne sera plus jamais visible</strong> après fermeture de cet écran.
                                      </p>

                                      <div className="flex items-center gap-4 bg-black/85 border border-emerald-500/20 p-5 rounded-2xl font-mono text-sm font-bold text-white shadow-inner relative overflow-hidden">
                                        <span className="text-emerald-400 select-all truncate pr-28 font-mono tracking-wide w-full">
                                          <DecryptingText text={secretKey} />
                                        </span>
                                        <Button
                                          onClick={() => copyToClipboard(secretKey)}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] font-mono font-black text-[9px] uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer"
                                        >
                                          {copied ? <><Check className="size-3.5" />Copié</> : <><Copy className="size-3.5 animate-pulse" />Copier_Clé</>}
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          )
                        })()}

                        {/* ── ACCOUNT TAB ── */}
                        {activeTab === "account" && (
                          <div className="space-y-8">
                            {/* Email / connection info */}
                            <div className="space-y-6">
                              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                                <Fingerprint className="size-4 text-emerald-500" /> Informations de connexion
                              </label>
                              <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-emerald-500/20 via-emerald-500/5 to-transparent">
                                <div className="p-8 bg-black/85 cyber-notch space-y-6 relative overflow-hidden group/acc">
                                  <div className="absolute inset-0 cyber-grid-emerald pointer-events-none opacity-40" aria-hidden="true" />
                                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/acc:opacity-10 transition-opacity" aria-hidden="true">
                                    <Shield className="size-16 text-emerald-400" />
                                  </div>
                                  <div className="space-y-3 relative z-10">
                                    <div className="flex items-center gap-2">
                                      <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" aria-hidden="true" />
                                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Connexion sécurisée</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                                      <span className="text-emerald-400">{userData?.email?.split("@")[0]}</span>
                                      <span className="text-zinc-600 font-light">@</span>
                                      <span className="text-zinc-400 text-sm">{userData?.email?.split("@")[1]}</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                                      Identifiant unifié : <span className="text-zinc-400 font-bold select-all">{userData?.id}</span>
                                    </p>
                                  </div>
                                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 relative z-10">
                                    <div className="flex items-center gap-2">
                                      <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" aria-hidden="true" />
                                      <span className="text-[9px] font-mono text-emerald-400/80 uppercase font-bold tracking-wider">Authentification gérée par Better Auth</span>
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-500">STATUT : VÉRIFIÉ</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delete account */}
                            <div className="pt-4 border-t border-white/5 space-y-6">
                              <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-red-500/30 to-red-950/10 overflow-hidden">
                                <div className="absolute inset-x-0 h-[1.5px] bg-red-500 opacity-30 shadow-[0_0_12px_#ef4444] animate-laser-sweep z-10 pointer-events-none" style={{ '--laser-color': '#ef4444' } as React.CSSProperties} aria-hidden="true" />
                                <div className="p-8 md:p-10 bg-zinc-950/90 cyber-notch flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
                                  <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#450a0a_10px,#450a0a_20px)] pointer-events-none" aria-hidden="true" />
                                  <div className="absolute top-3 left-3 size-3 border-t border-l border-red-500/50 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute top-3 right-3 size-3 border-t border-r border-red-500/50 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute bottom-3 left-3 size-3 border-b border-l border-red-500/50 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute bottom-3 right-3 size-3 border-b border-r border-red-500/50 pointer-events-none" aria-hidden="true" />
                                  <div className="absolute inset-0 cyber-grid-red pointer-events-none opacity-20" aria-hidden="true" />

                                  <div className="space-y-4 text-center sm:text-left relative z-10 flex-1">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                      <div className="size-1.5 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
                                      <h3 className="text-base font-bold text-red-500 uppercase tracking-wider">Suppression du profil</h3>
                                    </div>
                                    <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
                                      Supprime définitivement ton dossier, tes habilitations et toute ta progression. Cette action est irréversible.
                                    </p>
                                    <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl flex items-start gap-3 w-full mt-4">
                                      <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                                      <div className="space-y-1 font-mono text-[9px] text-left">
                                        <div className="text-red-400 font-black uppercase tracking-wider">ACTION IRRÉVERSIBLE</div>
                                        <div className="text-zinc-500 leading-normal">
                                          Ton profil, score d&apos;évolution et permissions communautaires seront définitivement effacés.
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="relative shrink-0 z-10">
                                    <Button
                                      variant="destructive"
                                      className="h-14 font-mono font-black px-8 text-[10px] uppercase cyber-notch-sm bg-red-950/80 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer"
                                      onClick={async () => {
                                        if (!confirm("Supprimer ton profil HASHCODE ? Toutes tes données seront effacées.")) return
                                        const res = await fetch("/api/user/delete", { method: "DELETE" })
                                        if (res.ok) { await authClient.signOut(); window.location.href = "/" }
                                        else toast.error("Erreur lors de la désactivation")
                                      }}
                                    >
                                      DÉSACTIVER_PROFIL
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    </AnimatePresence>
                  </div>
                )
              })()}
            </div>
          </div>
        </main>

        {/* Biometric scanner modal */}
        <AnimatePresence>
          {isBiometricModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Scanneur biométrique">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none opacity-40" aria-hidden="true" />
                <div className="scanline opacity-10 pointer-events-none" aria-hidden="true" />
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary/40 pointer-events-none" aria-hidden="true" />
                <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary/40 pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary/40 pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary/40 pointer-events-none" aria-hidden="true" />

                {/* Modal header */}
                <div className="p-8 pb-4 border-b border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary animate-pulse">
                      <Fingerprint className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary animate-ping" aria-hidden="true" />
                        <span className="text-[7.5px] font-mono text-primary font-black uppercase">SECURE_NODE: KEY_GEN_v2</span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white italic">Génération Sécurisée</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBiometricModalOpen(false)}
                    disabled={biometricState === "SCANNING"}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Fermer"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-8 flex flex-col items-center gap-6 relative z-10">
                  <div className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider">
                    CAPTEUR BIOMÉTRIQUE CAPACITIF
                  </div>

                  <button
                    type="button"
                    disabled={biometricState !== "STANDBY" && biometricState !== "FAILED"}
                    onClick={triggerBiometricScan}
                    className={cn(
                      "size-32 rounded-full border-2 transition-all duration-500 relative flex items-center justify-center overflow-hidden active:scale-95 group/scanner-pad",
                      biometricState === "STANDBY" ? "bg-zinc-950 border-primary/20 hover:border-primary/50 cursor-pointer" :
                      biometricState === "SCANNING" ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] cursor-wait" :
                      biometricState === "SUCCESS" ? "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] cursor-default" :
                      "bg-rose-950/30 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.2)] cursor-pointer"
                    )}
                    aria-label="Démarrer le scan biométrique"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8))]" aria-hidden="true" />
                    {biometricState === "SCANNING" && (
                      <motion.div animate={{ y: ['-10%', '110%', '-10%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 right-0 h-1 z-20 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" aria-hidden="true" />
                    )}
                    {biometricState === "SCANNING" && (
                      <div className="absolute inset-2 border border-white/5 rounded-full animate-spin border-dashed" aria-hidden="true" />
                    )}
                    <Fingerprint
                      className={cn(
                        "size-16 transition-all duration-700 relative z-10",
                        biometricState === "STANDBY" ? "text-primary/40 group-hover/scanner-pad:text-primary" :
                        biometricState === "SCANNING" ? "text-amber-500 animate-pulse" :
                        biometricState === "SUCCESS" ? "text-emerald-400 scale-105" :
                        "text-rose-500"
                      )}
                    />
                  </button>

                  <div className="space-y-1 text-center">
                    <span className={cn(
                      "text-[10px] font-mono font-black uppercase tracking-wider block",
                      biometricState === "STANDBY" ? "text-primary" :
                      biometricState === "SCANNING" ? "text-amber-500" :
                      biometricState === "SUCCESS" ? "text-emerald-400" :
                      "text-rose-500"
                    )}>
                      {biometricState === "STANDBY" && "PRÊT POUR LE BALAYAGE"}
                      {biometricState === "SCANNING" && "NUMÉRISATION EN COURS..."}
                      {biometricState === "SUCCESS" && "DÉVERROUILLAGE RÉUSSI"}
                      {biometricState === "FAILED" && "NUMÉRISATION ÉCHOUÉE"}
                    </span>
                    <p className="text-[9px] text-zinc-500 font-light max-w-[220px] leading-relaxed">
                      {biometricState === "STANDBY" && "Clique pour démarrer la génération sécurisée de ta clé."}
                      {biometricState === "SCANNING" && "Génération de l'entropie et synchronisation en cours..."}
                      {biometricState === "SUCCESS" && "Ta clé a été scellée dans le coffre. Tu peux la copier."}
                      {biometricState === "FAILED" && "La transaction a échoué. Veuillez réessayer."}
                    </p>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="p-8 pt-4 border-t border-white/5 flex gap-4 justify-end relative z-10">
                  {(biometricState === "STANDBY" || biometricState === "FAILED") && (
                    <Button onClick={triggerBiometricScan} className="btn-primary-glow h-11 px-8 rounded-xl text-[10px] uppercase font-black tracking-wider">
                      {biometricState === "FAILED" ? "Réessayer_Balayage" : "Démarrer_Balayage"}
                    </Button>
                  )}
                  {biometricState === "SCANNING" && (
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase font-bold pr-2">
                      <Loader2 className="size-3 animate-spin text-amber-500" /> Numérisation_En_Cours...
                    </div>
                  )}
                  {(biometricState === "SUCCESS" || biometricState === "STANDBY" || biometricState === "FAILED") && (
                    <Button onClick={() => setIsBiometricModalOpen(false)} className="h-11 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-wider text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                      Fermer
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  )
}
