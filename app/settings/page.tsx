"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Globe, Briefcase,
  Target, Github, Link as LinkIcon,
  Search, Save, Loader2, Camera,
  Shield, Bell, Sparkles,
  Linkedin, Twitter, Settings, Check,
  ChevronRight, Fingerprint, AtSign,
  Languages, Palette, Layout, Cpu, Activity
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { UserSituation, MainObjective } from "@/lib/types"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { authClient } from "@/lib/auth-client"
import { ExpertiseDiagnostic } from "@/components/settings/expertise-diagnostic"

const TABS = [
  { id: "profile", label: "Profilage", icon: User, desc: "Identité et informations de base" },
  { id: "expertise", label: "Spécialisation", icon: Sparkles, desc: "Tes domaines et outils favoris" },
  { id: "links", label: "Connectivité", icon: LinkIcon, desc: "Tes points d'ancrage externes" },
  { id: "account", label: "Sécurité", icon: Shield, desc: "Gestion du compte et accès" },
]

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [toolSearch, setToolSearch] = useState("")

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => toast.error("Impossible de charger les données"))
  }, [])

  const save = useCallback(async (data: any, silent = false) => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSavedAt(new Date());
        setIsDirty(false);
        if (!silent) toast.success("Données synchronisées.");
        return true;
      }
      if (!silent) toast.error("Erreur de synchronisation");
    } catch {
      if (!silent) toast.error("Erreur réseau");
    }
    return false;
  }, []);

  const updateData = useCallback((next: any) => {
    setUserData(next);
    setIsDirty(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAutoSaving(true);
      await save(next, true);
      setAutoSaving(false);
    }, 2000);
  }, [save]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      })

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
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-primary/60">Initialisation_Console_Settings...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <BottomNav />
 
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={userData} />
        
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Context Header - Tactical Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Cpu className="size-3.5 text-primary" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">System_Preferences_v2.2</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Configuration <span className="text-primary italic">.System</span>
                </h1>
                <p className="text-zinc-500 max-w-xl font-light text-sm md:text-base leading-relaxed">
                    Ajuste tes paramètres d&apos;habilitation et synchronise ton arsenal technique avec le réseau.
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                {isDirty && !autoSaving && (
                  <Button
                    onClick={() => { setLoading(true); save(userData).finally(() => setLoading(false)); }}
                    disabled={loading}
                    className="btn-primary-glow h-12 rounded-xl px-6 text-[11px] uppercase font-black tracking-widest gap-2"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Sauvegarder_Manuellement
                  </Button>
                )}
                <div className="flex items-center gap-4 bg-zinc-900/40 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-xl">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-tighter">Status_Lien</span>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest", autoSaving ? "text-primary" : isDirty ? "text-amber-500" : "text-emerald-500")}>
                      {autoSaving ? "SYNCING..." : isDirty ? "MODIFIÉ" : "OPÉRATIONNEL"}
                    </span>
                  </div>
                  <div className={cn("size-2 rounded-full", autoSaving ? "bg-primary animate-pulse" : isDirty ? "bg-amber-500" : "bg-emerald-500 shadow-[0_0_15px_#10b981]")} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
              
              {/* Tactical Navigation Sidebar */}
              <aside className="space-y-3">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-start gap-5 p-5 rounded-[1.5rem] transition-all duration-500 border group text-left relative overflow-hidden",
                        isActive 
                        ? "bg-primary/10 border-primary/30 text-white shadow-[0_0_30px_rgba(var(--primary),0.05)]" 
                        : "bg-white/[0.01] border-white/5 text-zinc-500 hover:bg-white/[0.03] hover:border-white/10"
                      )}
                    >
                      {isActive && (
                          <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full shadow-[0_0_10px_#C5F441]" />
                      )}
                      <div className={cn(
                        "p-3 rounded-xl transition-all duration-500",
                        isActive ? "bg-primary text-black shadow-[0_0_15px_#C5F441]" : "bg-zinc-900 border border-white/5 group-hover:text-primary"
                      )}>
                        <tab.icon className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-black uppercase tracking-widest transition-colors", isActive ? "text-white" : "group-hover:text-zinc-300")}>
                            {tab.label}
                        </p>
                        <p className="text-[10px] opacity-60 leading-tight font-light tracking-tight">{tab.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </aside>

              {/* Immersive Active Content Area */}
              <div className="glass-card rounded-[2.5rem] overflow-hidden min-h-[650px] relative group/content">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/content:opacity-[0.06] transition-opacity duration-1000">
                    <Activity className="size-64" />
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
                      <div className="space-y-12">
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start border-b border-white/5 pb-12">
                          <div className="relative group/avatar shrink-0">
                            <div className="size-32 md:size-40 rounded-[2.5rem] bg-zinc-800 overflow-hidden border-2 border-white/10 shadow-2xl group-hover/avatar:border-primary/50 transition-all duration-700 rotate-3 group-hover/avatar:rotate-0 flex items-center justify-center">
                              {uploadingAvatar ? (
                                <Loader2 className="size-10 animate-spin text-primary" />
                              ) : userData?.image ? (
                                <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10 bg-linear-to-br from-white/5 to-transparent uppercase">
                                  {userData?.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleAvatarUpload} 
                              className="hidden" 
                              accept="image/png, image/jpeg, image/webp"
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingAvatar}
                              className="absolute -bottom-3 -right-3 p-3 rounded-2xl bg-primary text-black shadow-[0_0_20px_#C5F441] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 z-20"
                            >
                              <Camera className="size-5" />
                            </button>
                            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-700 pointer-events-none" />
                          </div>

                          <div className="flex-1 space-y-6 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.3em]"><User className="size-3"/> Nom_Identité</label>
                                <Input 
                                  value={userData?.name || ""} 
                                  onChange={e => updateData({...userData, name: e.target.value})}
                                  className="input-premium h-14 rounded-2xl text-base px-5 font-bold"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.3em]"><AtSign className="size-3"/> Pseudo_System</label>
                                <Input 
                                  value={userData?.pseudo || ""} 
                                  onChange={e => updateData({...userData, pseudo: e.target.value})}
                                  className="input-premium h-14 rounded-2xl text-base px-5 font-bold font-mono"
                                  placeholder="votre_pseudo"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.3em]">Bio_Signature</label>
                              <textarea 
                                value={userData?.bio || ""} 
                                onChange={e => updateData({...userData, bio: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 min-h-[120px] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all resize-none text-white leading-relaxed font-light italic"
                                placeholder="Ta signature communautaire..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.3em]"><Languages className="size-3"/> Langue_Code</label>
                              <div className="relative">
                                <select 
                                    value={userData?.language || "fr"} 
                                    onChange={e => updateData({...userData, language: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 h-14 rounded-2xl px-5 text-base focus:outline-none focus:border-primary/40 appearance-none text-white font-bold"
                                >
                                    <option value="fr" className="bg-zinc-900">Français (FR)</option>
                                    <option value="en" className="bg-zinc-900">English (EN)</option>
                                </select>
                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 rotate-90 pointer-events-none" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.3em]"><Globe className="size-3"/> Localisation_Géo</label>
                              <CountrySelector 
                                value={userData?.country || ""} 
                                onChange={val => updateData({...userData, country: val})}
                              />
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "expertise" && (
                      <ExpertiseDiagnostic userData={userData} updateData={updateData} />
                    )}

                    {activeTab === "links" && (
                      <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.4em]">Canaux_Externes</p>
                            <p className="text-zinc-600 text-xs font-light">Lier tes réseaux renforce ton autorité et ton score de confiance.</p>
                        </div>
                        <div className="grid gap-6">
                          {[
                            { id: "githubUrl", icon: Github, label: "GitHub_Repo", placeholder: "github.com/votre-user", color: "group-focus-within:text-white" },
                            { id: "linkedinUrl", icon: Linkedin, label: "LinkedIn_Network", placeholder: "linkedin.com/in/profil", color: "group-focus-within:text-[#0077B5]" },
                            { id: "twitterUrl", icon: Twitter, label: "X_Twitter_Signal", placeholder: "x.com/votre-user", color: "group-focus-within:text-white" },
                            { id: "portfolioUrl", icon: Globe, label: "Portfolio_Dossier", placeholder: "votre-site.com", color: "group-focus-within:text-primary" },
                          ].map((link) => (
                            <div key={link.id} className="space-y-3">
                              <label className="text-[9px] font-mono font-black uppercase text-zinc-600 ml-1 tracking-[0.2em]">{link.label}</label>
                              <div className="relative group/link">
                                <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors duration-500", link.color)}>
                                  <link.icon className="size-5" />
                                </div>
                                <Input 
                                  value={userData[link.id] || ""} 
                                  onChange={e => updateData({...userData, [link.id]: e.target.value})}
                                  className="input-premium h-14 rounded-2xl pl-14 text-sm font-bold"
                                  placeholder={link.placeholder}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "account" && (
                      <div className="space-y-12">
                        <div className="space-y-6">
                           <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.4em]"><Fingerprint className="size-4 text-primary"/> Accès_Système_Autorisé</label>
                           <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 space-y-4 relative overflow-hidden group/acc">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/acc:opacity-10 transition-opacity">
                                <Shield className="size-16" />
                              </div>
                              <div className="space-y-1 relative z-10">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{userData?.email}</p>
                                <p className="text-[10px] text-zinc-600 font-mono tracking-widest italic">USER_ID: {userData?.id}</p>
                              </div>
                              <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                                  <div className="size-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[9px] font-mono text-emerald-500/60 uppercase font-bold tracking-widest">Compte_Vérifié_Par_Google</span>
                              </div>
                           </div>
                        </div>

                        <div className="pt-12 border-t border-white/5 space-y-6">
                           <div className="p-8 md:p-10 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-8 group/del">
                            <div className="space-y-2 text-center sm:text-left">
                              <h3 className="text-base font-black text-red-500 uppercase tracking-[0.2em] italic">Destruction du Profil</h3>
                              <p className="text-xs text-zinc-600 max-w-sm font-light leading-relaxed">
                                Supprime définitivement ton dossier, tes habilitations et toute ta progression de build. Cette action est irréversible et effacera ton signal du réseau.
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              className="h-14 rounded-2xl font-black px-10 text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 shrink-0"
                              onClick={async () => {
                                if (!confirm("Supprimer ton profil HASHCODE ? Toutes tes données seront effacées du réseauneuronal.")) return;
                                const res = await fetch("/api/user/delete", { method: "DELETE" });
                                if (res.ok) {
                                  await authClient.signOut();
                                  window.location.href = "/";
                                } else {
                                  toast.error("Erreur lors de la désactivation");
                                }
                              }}
                            >
                              Désactiver_Profil
                            </Button>
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
