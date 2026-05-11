"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, Mail, Globe, Briefcase, 
  Target, Github, Link as LinkIcon, 
  Search, Save, Loader2, ChevronLeft, Camera,
  Shield, Bell, Sparkles,
  Linkedin, Twitter, Settings
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
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

export default function SettingsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => setLoading(false))
  }, [])

  const [toolSearch, setToolSearch] = useState("")

  const allTools = [
    "GitHub", "VS Code", "Docker", "Figma", "Cursor", 
    "ChatGPT", "Vercel", "Linux", "PostgreSQL", "Next.js",
    "React", "Tailwind", "Prisma", "Node.js", "Python",
    "Kubernetes", "AWS", "Google Cloud", "Supabase", "Redis",
    "TypeScript", "Go", "Rust", "Swift", "Flutter",
    "Unity", "Blender", "Postman", "Snyk", "Jira"
  ].sort()

  const filteredTools = allTools.filter(t => 
    t.toLowerCase().includes(toolSearch.toLowerCase())
  )

  const handleSave = async () => {
    // Client-side pseudo validation
    if (userData?.pseudo) {
      const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!pseudoRegex.test(userData.pseudo)) {
        toast.error("Format de pseudo invalide (3-20 caractères, alphanumérique).");
        return;
      }
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        body: JSON.stringify(userData),
      })
      if (res.ok) {
        toast.success("Profil mis à jour !")
      } else if (res.status === 409) {
        toast.error("Ce pseudo est déjà utilisé.")
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <BottomNav />
 
      <SidebarInset className="bg-background">
        <UserTopBar user={userData} />
        
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 overflow-y-auto scrollbar-none">
          <div className="max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest mb-1">
                <Settings className="w-3 h-3" />
                Configuration du Système
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Paramètres du Compte</h1>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="btn-primary-glow px-8 h-12 rounded-xl font-bold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer les modifications
            </Button>
          </div>

          <div className="space-y-12">
            {/* Profile Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-mono uppercase tracking-wider">Identité</h2>
              </div>
              
              <div className="grid md:grid-cols-[200px_1fr] gap-8 bg-card/20 border border-border/40 p-8 rounded-3xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-muted overflow-hidden border-2 border-border/40">
                      {userData?.image ? (
                        <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                          {userData?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase text-center leading-tight">
                    Cliquez pour modifier<br/>votre avatar
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Nom Complet</label>
                      <Input 
                        value={userData?.name || ""} 
                        onChange={e => setUserData({...userData, name: e.target.value})}
                        className="bg-card/30 border-border/40 h-12 rounded-xl text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Pseudo</label>
                      <Input 
                        value={userData?.pseudo || ""} 
                        onChange={e => setUserData({...userData, pseudo: e.target.value})}
                        className="bg-card/30 border-border/40 h-12 rounded-xl text-white"
                        placeholder="@votre_pseudo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Bio / Présentation</label>
                    <textarea 
                      value={userData?.bio || ""} 
                      onChange={e => setUserData({...userData, bio: e.target.value})}
                      className="w-full bg-card/30 border border-border/40 min-h-[100px] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none text-white"
                      placeholder="Explique brièvement qui tu es..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Email (Non modifiable)</label>
                    <div className="flex items-center gap-3 px-4 h-12 bg-muted/30 border border-border/20 rounded-xl text-muted-foreground text-sm cursor-not-allowed">
                      <Mail className="w-4 h-4" />
                      {userData?.email}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Objectives Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                <h2 className="text-lg font-mono uppercase tracking-wider">Objectif Principal</h2>
              </div>

              <div className="bg-card/20 border border-border/40 p-8 rounded-3xl space-y-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    "Trouver un emploi", "Créer un SaaS", "Freelance", "Créer une startup", 
                    "Cybersécurité", "Maîtriser l'IA", "Cloud Computing", "Produits digitaux"
                  ].map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setUserData({...userData, mainObjective: obj})}
                      className={cn(
                        "px-5 py-3 rounded-2xl text-xs font-bold transition-all border",
                        userData?.mainObjective === obj
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                          : "bg-card/30 border-border/40 text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Context Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5" />
                <h2 className="text-lg font-mono uppercase tracking-wider">Contexte & Localisation</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 bg-card/20 border border-border/40 p-8 rounded-3xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Pays de résidence</label>
                  <CountrySelector 
                    value={userData?.country || ""} 
                    onChange={val => setUserData({...userData, country: val})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Situation Actuelle</label>
                  <select 
                    value={userData?.currentSituation || ""} 
                    onChange={e => setUserData({...userData, currentSituation: e.target.value})}
                    className="w-full bg-card/30 border border-border/40 h-14 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none text-white"
                  >
                    <option value="" disabled className="bg-zinc-900">Sélectionner...</option>
                    {Object.values(UserSituation).map(sit => (
                      <option key={sit} value={sit} className="bg-zinc-900">{sit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Specialization Tags */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-mono uppercase tracking-wider">Spécialisations & Outils</h2>
              </div>

              <div className="bg-card/20 border border-border/40 p-8 rounded-3xl space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Domaines d'Expertise</label>
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
                          setUserData({...userData, domains: next});
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-mono border transition-all",
                          userData?.domains?.includes(domain)
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-card/30 border-border/40 text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Outils Favoris</label>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input 
                        value={toolSearch}
                        onChange={e => setToolSearch(e.target.value)}
                        placeholder="Filtrer les outils..."
                        className="bg-card/30 border-border/40 h-9 pl-9 text-xs rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-primary/20">
                    {filteredTools.map(tool => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => {
                          const current = userData?.tools || [];
                          const next = current.includes(tool) 
                            ? current.filter((t: string) => t !== tool)
                            : [...current, tool];
                          setUserData({...userData, tools: next});
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all",
                          userData?.tools?.includes(tool)
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-card/30 border-border/40 text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Links Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <LinkIcon className="w-5 h-5" />
                <h2 className="text-lg font-mono uppercase tracking-wider">Liens Sociaux</h2>
              </div>

              <div className="grid gap-4 bg-card/20 border border-border/40 p-8 rounded-3xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">URL GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={userData?.githubUrl || ""} 
                      onChange={e => setUserData({...userData, githubUrl: e.target.value})}
                      className="bg-card/30 border-border/40 h-12 rounded-xl pl-12 text-white"
                      placeholder="https://github.com/votre-user"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0077B5]" />
                    <Input 
                      value={userData?.linkedinUrl || ""} 
                      onChange={e => setUserData({...userData, linkedinUrl: e.target.value})}
                      className="bg-card/30 border-border/40 h-12 rounded-xl pl-12 text-white"
                      placeholder="https://linkedin.com/in/votre-profil"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">X (Twitter)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-white">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                      </svg>
                    </div>
                    <Input 
                      value={userData?.twitterUrl || ""} 
                      onChange={e => setUserData({...userData, twitterUrl: e.target.value})}
                      className="bg-card/30 border-border/40 h-12 rounded-xl pl-12 text-white"
                      placeholder="https://x.com/votre-user"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Portfolio / Site Web</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      value={userData?.portfolioUrl || ""} 
                      onChange={e => setUserData({...userData, portfolioUrl: e.target.value})}
                      className="bg-card/30 border-border/40 h-12 rounded-xl pl-12 text-white"
                      placeholder="https://votre-site.com"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="pt-12 border-t border-border/40 pb-20">
              <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-destructive font-bold">Zone de Danger</h3>
                  <p className="text-xs text-muted-foreground">Supprimer votre compte et toutes vos données de progression. Cette action est irréversible.</p>
                </div>
                <Button variant="destructive" className="font-bold">Supprimer mon compte</Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
  )
}
