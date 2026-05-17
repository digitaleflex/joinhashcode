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
  Languages, Palette, Layout
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

const TABS = [
  { id: "profile", label: "Profilage", icon: User, desc: "Identité et informations de base" },
  { id: "expertise", label: "Spécialisation", icon: Sparkles, desc: "Tes domaines et outils favoris" },
  { id: "links", label: "Connectivité", icon: LinkIcon, desc: "Tes points d'ancrage externes" },
  { id: "account", label: "Sécurité", icon: Shield, desc: "Gestion du compte et accès" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary/60">Initialisation de la console...</span>
        </div>
      </div>
    )
  }

  const allTools = [
    "GitHub", "VS Code", "Docker", "Figma", "Cursor", 
    "ChatGPT", "Vercel", "Linux", "PostgreSQL", "Next.js",
    "React", "Tailwind", "Prisma", "Node.js", "Python",
    "Kubernetes", "AWS", "Google Cloud", "Supabase", "Redis"
  ].sort()

  const filteredTools = allTools.filter(t => t.toLowerCase().includes(toolSearch.toLowerCase()))

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <BottomNav />
 
      <SidebarInset className="bg-background">
        <UserTopBar user={userData} />
        
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-10 overflow-y-auto scrollbar-none">
          <div className="max-w-5xl mx-auto space-y-10">
            
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.3em]">
                  <Settings className="w-3 h-3" />
                  System_Preferences_v1.0
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic">Configuration</h1>
              </div>
              
              <div className="flex items-center gap-4 bg-card/20 border border-border/40 px-4 py-2 rounded-2xl backdrop-blur-md">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground tracking-tighter">Status_</span>
                  <span className={cn("text-[10px] font-mono font-bold uppercase", isDirty ? "text-amber-500" : "text-emerald-500")}>
                    {autoSaving ? "Syncing..." : isDirty ? "Modifié" : "Synchronisé"}
                  </span>
                </div>
                <div className={cn("w-2 h-2 rounded-full", autoSaving ? "bg-primary animate-pulse" : isDirty ? "bg-amber-500" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
              
              {/* Navigation Sidebar */}
              <aside className="space-y-2">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-2xl transition-all border group text-left",
                        isActive 
                        ? "bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.05)]" 
                        : "bg-transparent border-transparent text-muted-foreground hover:bg-card/40 hover:border-border/40"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "bg-card/40 group-hover:text-primary"
                      )}>
                        <tab.icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-tight">{tab.label}</p>
                        <p className="text-[10px] opacity-60 leading-tight">{tab.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </aside>

              {/* Active Content */}
              <div className="bg-card/10 border border-border/40 rounded-[2rem] overflow-hidden backdrop-blur-sm min-h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-8 md:p-10"
                  >
                    {activeTab === "profile" && (
                      <div className="space-y-10">
                        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start border-b border-border/40 pb-10">
                          <div className="relative group">
                            <div className="size-24 rounded-full bg-muted overflow-hidden border-2 border-border/40 shadow-xl group-hover:border-primary/50 transition-colors">
                              {userData?.image ? (
                                <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                                  {userData?.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex-1 space-y-4 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><User className="w-3 h-3"/> Nom</label>
                                <Input 
                                  value={userData?.name || ""} 
                                  onChange={e => updateData({...userData, name: e.target.value})}
                                  className="bg-background/40 border-border/40 h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><AtSign className="w-3 h-3"/> Pseudo</label>
                                <Input 
                                  value={userData?.pseudo || ""} 
                                  onChange={e => updateData({...userData, pseudo: e.target.value})}
                                  className="bg-background/40 border-border/40 h-11 rounded-xl text-sm"
                                  placeholder="votre_pseudo"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Bio_</label>
                              <textarea 
                                value={userData?.bio || ""} 
                                onChange={e => updateData({...userData, bio: e.target.value})}
                                className="w-full bg-background/40 border border-border/40 min-h-[80px] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none text-white"
                                placeholder="Ta signature communautaire..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><Languages className="w-3 h-3"/> Langue</label>
                              <select 
                                value={userData?.language || "fr"} 
                                onChange={e => updateData({...userData, language: e.target.value})}
                                className="w-full bg-background/40 border border-border/40 h-11 rounded-xl px-4 text-sm focus:outline-none appearance-none text-white"
                              >
                                <option value="fr" className="bg-zinc-900">Français</option>
                                <option value="en" className="bg-zinc-900">English</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><Globe className="w-3 h-3"/> Localisation</label>
                              <CountrySelector 
                                value={userData?.country || ""} 
                                onChange={val => updateData({...userData, country: val})}
                              />
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "expertise" && (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><Layout className="w-3 h-3"/> Domaines d&apos;Expertise</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Web", "Cybersecurity", "Cloud", "IA", "Mobile", 
                              "Data", "Automation", "UI/UX", "DevOps", "Blockchain"
                            ].map(domain => (
                              <button
                                key={domain}
                                type="button"
                                onClick={() => {
                                  const current = userData?.domains || [];
                                  const next = current.includes(domain) 
                                    ? current.filter((d: string) => d !== domain)
                                    : [...current, domain];
                                  updateData({...userData, domains: next});
                                }}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-xs font-mono border transition-all",
                                  userData?.domains?.includes(domain)
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-background/40 border-border/40 text-muted-foreground hover:border-primary/40"
                                )}
                              >
                                {domain}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><Search className="w-3 h-3"/> Outils favoris</label>
                            <div className="relative w-full sm:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                              <Input 
                                value={toolSearch}
                                onChange={e => setToolSearch(e.target.value)}
                                placeholder="Filtrer l'arsenal..."
                                className="bg-background/40 border-border/40 h-9 pl-9 text-xs rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1 pr-4 scrollbar-thin">
                            {filteredTools.map(tool => (
                              <button
                                key={tool}
                                type="button"
                                onClick={() => {
                                  const current = userData?.tools || [];
                                  const next = current.includes(tool) 
                                    ? current.filter((t: string) => t !== tool)
                                    : [...current, tool];
                                  updateData({...userData, tools: next});
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all",
                                  userData?.tools?.includes(tool)
                                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                                    : "bg-background/40 border-border/40 text-muted-foreground hover:border-primary/40"
                                )}
                              >
                                {tool}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "links" && (
                      <div className="space-y-6">
                        <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-4">Canaux_Externes</p>
                        <div className="grid gap-4">
                          {[
                            { id: "githubUrl", icon: Github, label: "GitHub", placeholder: "github.com/votre-user" },
                            { id: "linkedinUrl", icon: Linkedin, label: "LinkedIn", placeholder: "linkedin.com/in/profil" },
                            { id: "twitterUrl", icon: Twitter, label: "X / Twitter", placeholder: "x.com/votre-user" },
                            { id: "portfolioUrl", icon: Globe, label: "Portfolio", placeholder: "votre-site.com" },
                          ].map((link) => (
                            <div key={link.id} className="space-y-2">
                              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">{link.label}</label>
                              <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                  <link.icon className="w-4 h-4" />
                                </div>
                                <Input 
                                  value={userData[link.id] || ""} 
                                  onChange={e => updateData({...userData, [link.id]: e.target.value})}
                                  className="bg-background/40 border-border/40 h-12 rounded-xl pl-12 text-sm"
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
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest"><Fingerprint className="w-3 h-3"/> Accès Système</label>
                           <div className="p-6 rounded-2xl bg-background/40 border border-border/40 space-y-1">
                              <p className="text-xs font-bold text-white uppercase">{userData?.email}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">ID: {userData?.id}</p>
                           </div>
                        </div>

                        <div className="pt-8 border-t border-border/40">
                           <div className="p-8 rounded-3xl bg-destructive/5 border border-destructive/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-1 text-center sm:text-left">
                              <h3 className="text-sm font-bold text-destructive uppercase tracking-wider italic">Effacement Complet</h3>
                              <p className="text-[10px] text-muted-foreground max-w-sm">Supprime toutes tes données de progression et réinitialise tes accès. Cette action est irréversible.</p>
                            </div>
                            <Button variant="destructive" className="h-11 rounded-xl font-bold px-6 text-xs uppercase tracking-widest">Réinitialiser Profil</Button>
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
