"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cpu, Palette, BarChart3, Users, Search, ChevronRight, MapPin, Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Talent {
  pseudo: string
  class: string | null
  country: string | null
  city: string | null
  bio: string | null
  scores: Record<string, number>
  tools: string[]
  level: number
  missionsCompleted: number
  githubUrl: string | null
  portfolioUrl: string | null
}

const CLASS_META: Record<string, { label: string; icon: typeof Cpu; color: string }> = {
  builder: { label: "Builder", icon: Cpu, color: "text-blue-400" },
  creator: { label: "Créateur", icon: Palette, color: "text-purple-400" },
  strategist: { label: "Stratège", icon: BarChart3, color: "text-amber-400" },
  catalyst: { label: "Catalyseur", icon: Users, color: "text-emerald-400" },
}

export function TalentPublicPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [profileFilter, setProfileFilter] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (profileFilter) params.set("profile", profileFilter)

    fetch(`/api/public/talent?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTalents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [profileFilter])

  const filtered = search
    ? talents.filter(
        (t) =>
          t.pseudo?.toLowerCase().includes(search.toLowerCase()) ||
          t.country?.toLowerCase().includes(search.toLowerCase()) ||
          t.tools?.some((tool) => tool.toLowerCase().includes(search.toLowerCase())),
      )
    : talents

  const profiles = ["builder", "creator", "strategist", "catalyst"]

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-black uppercase tracking-tight">
            HASHCODE
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Accueil
            </Link>
            <Button asChild variant="default" size="sm" className="h-8 text-[10px] font-bold uppercase">
              <Link href="/signin">Rejoindre</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest border-primary/20 text-primary">
            Annuaire Public
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
            Talents <span className="text-primary">HASHCODE</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Profils validés par missions réelles — chaque talent listé ici a livré au moins un projet concret.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par pseudo, pays ou outil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {profiles.map((p) => {
              const meta = CLASS_META[p]
              const active = profileFilter === p
              return (
                <button
                  key={p}
                  onClick={() => setProfileFilter(active ? "" : p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    active
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-transparent border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  <meta.icon className="size-3.5" />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-muted-foreground text-sm">Aucun talent trouvé</p>
            <Button variant="outline" size="sm" onClick={() => { setProfileFilter(""); setSearch("") }}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((talent) => {
              const meta = CLASS_META[talent.class ?? ""] ?? CLASS_META.builder
              const Icon = meta.icon
              return (
                <Link
                  key={talent.pseudo}
                  href={`/u/${talent.pseudo}`}
                  className="group block p-5 rounded-2xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl ${meta.color} bg-white/5 border border-border/40 flex items-center justify-center`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{talent.pseudo}</span>
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="size-3" />
                          {talent.city ?? talent.country ?? "Inconnu"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {talent.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{talent.bio}</p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Award className="size-3" />
                      Niveau {talent.level}
                    </span>
                    <span>{talent.missionsCompleted} mission{talent.missionsCompleted > 1 ? "s" : ""}</span>
                  </div>

                  {talent.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {talent.tools.slice(0, 4).map((tool) => (
                        <span key={tool} className="px-2 py-0.5 rounded-md bg-white/5 border border-border/40 text-[10px] text-muted-foreground">
                          {tool}
                        </span>
                      ))}
                      {talent.tools.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] text-muted-foreground">+{talent.tools.length - 4}</span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Recruiter CTA */}
        <div className="mt-16 p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-4">
          <h2 className="text-xl font-bold">Tu recrutes ?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Contacte-nous pour accéder aux dossiers complets, aux scores psychométriques détaillés et aux recommandations
            personnalisées.
          </p>
          <Button asChild className="btn-primary-glow">
            <Link href="/contact">
              Contacter HASHCODE <ChevronRight className="size-4 ml-1" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-muted-foreground">
          HASHCODE — Programme de détection et d&apos;accélération de talents tech
        </div>
      </footer>
    </div>
  )
}
