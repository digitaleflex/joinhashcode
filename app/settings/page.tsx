"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Globe, Github, Link as LinkIcon,
  Save, Loader2, Camera,
  Shield, Sparkles, Activity,
  Linkedin, Twitter, Settings,
  Fingerprint, AtSign,
  Languages,
  Lock,
  AlertTriangle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { authClient } from "@/lib/auth-client"
import { ExpertiseDiagnostic } from "@/components/settings/expertise-diagnostic"
import { CLASS_COLORS } from "@/lib/member-card-constants"
import { TwoFactorSetup } from "@/components/settings/TwoFactorSetup"


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

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("require2fa") === "1") {
      toast.error("La double authentification (2FA) est obligatoire pour accéder au panel admin. Active-la dans l'onglet Sécurité.", { duration: 10000 })
      setActiveTab("account")
    }
  }, [])

  useEffect(() => {
    fetch("/api/user/me")
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setUserData(data))
      .catch(() => toast.error("Impossible de charger tes données. Recharge la page."))
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

                    {/* ── PROFILE TAB ── */}
                    {activeTab === "profile" && (
                      <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/5 pb-12">

                          {/* Avatar dock */}
                          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/40 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group/avatar-dock min-h-70">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" aria-hidden="true" />
                            <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': '#10B981' } as React.CSSProperties} aria-hidden="true" />
                            <HudCorners className="border-emerald-500/30" />

                            <div className="relative group/avatar shrink-0 my-4">
                              <div className="size-32 md:size-40 bg-zinc-900 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-emerald-500/60 transition-all duration-700 cyber-notch">
                                {uploadingAvatar ? (
                                  <Loader2 className="size-10 animate-spin text-emerald-400" />
                                ) : userData?.image ? (
                                  <Image src={userData.image} alt="Avatar" fill className="object-cover" sizes="(max-width: 768px) 128px, 160px" />
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
                                className="w-full input-premium min-h-30 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/60 resize-none text-white leading-relaxed font-light italic"
                                placeholder="Présente-toi en quelques mots..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><Languages className="size-3.5 text-emerald-500" /> Langue d'affichage</label>
                            <Select
                              value={userData?.language || "fr"}
                              onValueChange={val => updateData({ ...userData, language: val })}
                            >
                              <SelectTrigger className="input-premium h-14 rounded-2xl text-base px-5 font-bold text-white cyber-notch">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fr">Français (FR)</SelectItem>
                                <SelectItem value="en">English (EN)</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <div key={link.id} className="relative p-5 bg-zinc-950/40 border border-cyan-500/10 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-5 group/uplink">
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
                      void baseColor

                      return (
                        <div className="space-y-6">
                          <div className="border-b border-white/5 pb-6">
                            <h2 className="text-lg font-bold text-white">Carte de membre</h2>
                            <p className="text-xs text-zinc-500 mt-1 font-mono">Ta carte partageable — visible sur ton dossier.</p>
                          </div>

                          <div className="space-y-4">
                            <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/30">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/api/card/${userData?.id}`}
                                alt="Ta carte de membre HASHCODE"
                                className="w-full"
                              />
                            </div>
                            <Button asChild className="w-full h-12 rounded-xl btn-primary-glow font-black uppercase text-[10px]">
                              <a href="/dossier">Voir mon dossier et partager →</a>
                            </Button>
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

                        {/* 2FA Section */}
                        <div className="pt-4 border-t border-white/5 space-y-6">
                          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                            <Lock className="size-4 text-primary" /> Protection du compte (2FA)
                          </label>
                          <TwoFactorSetup user={userData} />
                        </div>

                        {/* Export data */}
                        <div className="pt-4 border-t border-white/5 space-y-6">
                          <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-zinc-700/30 to-zinc-900/10 overflow-hidden">
                            <div className="p-8 md:p-10 bg-zinc-950/90 cyber-notch flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
                              <div className="absolute top-3 left-3 size-3 border-t border-l border-zinc-500/30 pointer-events-none" aria-hidden="true" />
                              <div className="absolute top-3 right-3 size-3 border-t border-r border-zinc-500/30 pointer-events-none" aria-hidden="true" />
                              <div className="absolute bottom-3 left-3 size-3 border-b border-l border-zinc-500/30 pointer-events-none" aria-hidden="true" />
                              <div className="absolute bottom-3 right-3 size-3 border-b border-r border-zinc-500/30 pointer-events-none" aria-hidden="true" />
                              <div className="space-y-2 text-center sm:text-left relative z-10 flex-1">
                                <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider">Télécharger mes données</h3>
                                <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
                                  Exporte toutes tes données personnelles conformément au RGPD (Art. 20). Profil, missions, check-ins, activité.
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 z-10">
                                <a
                                  href="/api/user/export?format=json"
                                  download
                                  className="h-10 px-5 inline-flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-wider cyber-notch-sm border border-zinc-600 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                  JSON
                                </a>
                                <a
                                  href="/api/user/export?format=zip"
                                  download
                                  className="h-10 px-5 inline-flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-wider cyber-notch-sm border border-zinc-600 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                  ZIP
                                </a>
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
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
