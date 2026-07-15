"use client"

import { useState } from "react"
import { 
  BookOpen, Activity, Users, Target, Zap, HelpCircle, CheckCircle2, AlertCircle, 
  Award, Sparkles, TrendingUp, MessageSquare, ShieldAlert, LifeBuoy, Rocket, Trophy,
  Compass, UserPlus, Megaphone, Bell, LogOut, Trash2
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EvolutionRadar } from "@/components/dashboard/evolution-radar"
import { cn } from "@/lib/utils"

function HudCorners({ className }: { className?: string }) {
  return (
    <>
      <div className={cn("absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none", className)} aria-hidden="true" />
    </>
  )
}

const TAB_SECTIONS: Record<string, { id: string; label: string }[]> = {
  fondations: [
    { id: "benefits", label: "Bénéfices" },
    { id: "premier-jour", label: "Premier Jour" },
    { id: "profils", label: "Profils" },
    { id: "quiz", label: "Quiz" },
    { id: "glossaire", label: "Glossaire" },
    { id: "mobile", label: "Mobile" },
  ],
  evolution: [
    { id: "radar", label: "Radar" },
    { id: "moteur", label: "Moteur Évolution" },
    { id: "impact", label: "Impact" },
    { id: "rangs", label: "Rangs" },
  ],
  squads: [
    { id: "creation", label: "Création" },
    { id: "roles", label: "Rôles & Permissions" },
    { id: "matching", label: "Matching" },
    { id: "health", label: "Health Score" },
    { id: "synergie", label: "Synergie" },
    { id: "invites", label: "Invitations" },
    { id: "recruitment", label: "Recrutement" },
    { id: "gestion", label: "Gestion" },
    { id: "parcours", label: "Parcours" },
  ],
  missions: [
    { id: "types", label: "Types" },
    { id: "reviewer", label: "Reviewer" },
    { id: "criteres", label: "Critères" },
  ],
  cohesion: [
    { id: "groupe", label: "Cohésion" },
    { id: "badges", label: "Badges" },
    { id: "reputation", label: "Réputation" },
    { id: "xp", label: "Barème XP" },
  ],
  entraide: [
    { id: "bloque", label: "Bloqué" },
    { id: "ambassadeur", label: "Ambassadeur" },
    { id: "reussite", label: "Réussite" },
    { id: "faq", label: "FAQ" },
  ],
}

export function GuideClient() {
  const [activeTab, setActiveTab] = useState("fondations")

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 sm:pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <BookOpen className="size-3.5 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase text-primary">Manuel de l&apos;Agent</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase italic leading-none">
            Guide de <span className="text-primary">l&apos;Utilisateur</span>
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            Décodez les protocoles, maximisez vos synergies cognitives et maîtrisez l&apos;ascension HASHCODE.
          </p>
        </div>
      </div>

      {/* Le Manifeste de l'Agent */}
      <div className="p-6 md:p-8 rounded-[2rem] bg-emerald-950/10 border border-emerald-500/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
        <HudCorners className="border-emerald-500/25" />
        <div className="space-y-4 relative z-10">
          <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
            // MANIFESTE_DE_L_AGENT
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase italic">
            Propulser la force collective par l&apos;intelligence partagée
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light max-w-4xl">
            HASHCODE n&apos;est pas qu&apos;une plateforme technique ; c&apos;est un écosystème d&apos;ascension conçu pour les talents de la tech africaine. Ici, aucun agent n&apos;évolue seul. Notre algorithme comportemental cartographie vos forces individuelles (Builder, Créateur, Stratège, Catalyseur) afin de bâtir des escouades complémentaires d&apos;élite. Votre mission est de concevoir, d&apos;apprendre mutuellement et de repousser les frontières du possible à chaque livrable. L&apos;avenir de la tech s&apos;écrit en groupe.
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="fondations" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-zinc-900/80 border border-white/5 p-1 h-auto flex flex-wrap gap-1 rounded-2xl w-full">
          <TabsTrigger value="fondations" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <Sparkles className="size-3.5 mr-1.5" /> Débuter
          </TabsTrigger>
          <TabsTrigger value="evolution" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <Activity className="size-3.5 mr-1.5" /> Évolution
          </TabsTrigger>
          <TabsTrigger value="squads" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <Users className="size-3.5 mr-1.5" /> Escouades
          </TabsTrigger>
          <TabsTrigger value="missions" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <Target className="size-3.5 mr-1.5" /> Missions
          </TabsTrigger>
          <TabsTrigger value="cohesion" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <Zap className="size-3.5 mr-1.5" /> Cohésion & Réputation
          </TabsTrigger>
          <TabsTrigger value="entraide" className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all">
            <LifeBuoy className="size-3.5 mr-1.5" /> Communauté & Entraide
          </TabsTrigger>
        </TabsList>

        {/* Sticky Section Navigation */}
        <div className="sticky top-14 md:top-16 z-20 -mx-4 px-4 py-2 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 whitespace-nowrap">
            {TAB_SECTIONS[activeTab]?.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="h-7 px-3 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider border border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-white/20 transition-all shrink-0"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAB CONTENT: FONDATIONS (DEBUTER) --- */}
        <TabsContent value="fondations" className="space-y-8 animate-in fade-in duration-300">
          {/* Ce que JoinHashcode peut vous apporter */}
          <Card id="benefits" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Trophy className="size-5 text-[#C5F441]" /> Ce que JoinHashcode peut vous apporter
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Bien plus qu&apos;une plateforme, c&apos;est un accélérateur pour votre carrière et vos ambitions techniques.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-light">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1.5">
                  <h4 className="font-mono font-bold text-white uppercase">Compétences</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Développez des hard-skills et soft-skills via des défis réels.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1.5">
                  <h4 className="font-mono font-bold text-white uppercase">Réseau</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Connectez-vous avec les meilleurs talents de la tech africaine.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1.5">
                  <h4 className="font-mono font-bold text-white uppercase">Portfolio</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Constituez un dossier public de réalisations vérifiées par des pairs.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1.5">
                  <h4 className="font-mono font-bold text-white uppercase">Opportunités</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Accédez à des missions exclusives et des partenaires de recrutement.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1.5">
                  <h4 className="font-mono font-bold text-white uppercase">Leadership</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Pilotez des escouades et devenez Reviewer pour guider la communauté.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mon premier jour sur JoinHashcode */}
          <div id="premier-jour" className="space-y-4 scroll-mt-24">
            <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase flex items-center gap-3">
              <span className="h-px w-8 bg-zinc-800" />
              Mon premier jour (Parcours d'Ancrage & Focus Flow)
            </div>
            
            {/* Focus Flow Alert */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="size-4 text-primary" />
                <h4 className="text-[11px] font-black uppercase text-primary font-mono tracking-tighter">Activation du Tunnel Attentionnel (Focus Flow)</h4>
              </div>
              <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                Pour garantir une immersion optimale, l&apos;interface HASHCODE utilise le <strong className="text-white">Focus Flow</strong>. Certaines sections avancées seront estompées jusqu&apos;à ce que vous complétiez votre première mission d&apos;ancrage. Concentrez-vous sur l&apos;essentiel pour débloquer votre plein potentiel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-3 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">ÉTAPE 01</span>
                  <span className="text-[9px] font-mono text-zinc-600">MANDATAIRE</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Configuration de l&apos;Identité</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Complétez votre profil (technos, réseaux, ville). C&apos;est la base de votre carte de membre HASHCODE.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-3 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-[#C5F441] bg-[#C5F441]/10 border border-[#C5F441]/20 px-2 py-0.5 rounded">ÉTAPE 02</span>
                  <span className="text-[9px] font-mono text-zinc-600">COMPORTEMENT</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Diagnostic Psychométrique</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Répondez au quiz pour évaluer votre profil dominant (Builder, Créateur, Stratège ou Catalyseur).
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-primary/10 border-primary/30 space-y-3 relative overflow-hidden group shadow-[0_0_20px_rgba(var(--primary),0.05)]">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-white bg-primary px-2 py-0.5 rounded">ÉTAPE 03</span>
                  <span className="text-[9px] font-mono text-primary/70 italic">CRITIQUE</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight italic">Mission: &quot;Signal d&apos;Ouverture&quot;</h4>
                  <p className="text-[10px] text-primary-foreground/70 leading-relaxed font-medium">
                    Validez cette micro-mission à succès immédiat pour lever le Focus Flow et débloquer l&apos;intégralité de la console.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-3 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">ÉTAPE 04</span>
                  <span className="text-[9px] font-mono text-zinc-600">COOPÉRATION</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Recrutement de Squad</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Rejoignez une unité complémentaire de 5 agents pour activer les bonus de cohésion et les missions Co-op.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-3 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">ÉTAPE 05</span>
                  <span className="text-[9px] font-mono text-zinc-600">ACTION</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Défi de Spécialisation</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Lancez votre première mission technique ou stratégique pour commencer à faire grimper votre XP.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-3 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded">ÉTAPE 06</span>
                  <span className="text-[9px] font-mono text-zinc-600">ASCENSION</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Validation & Grade</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Soumettez vos livrables, recevez les feedbacks des Reviewers et montez en grade (Opérateur → Légende).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Les profils expliqués simplement */}
          <Card id="profils" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Users className="size-5 text-emerald-500" /> Les Profils expliqués simplement
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Le rôle que vous occupez détermine votre mode de contribution privilégié dans vos projets d&apos;équipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-blue-500/10 bg-blue-500/3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono font-black text-blue-400 uppercase">Builder</h4>
                    <span className="text-[10px] font-mono text-blue-500/70 italic">&ldquo;Je construis&rdquo;</span>
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    L&apos;artisan technique. Vous vous concentrez sur l&apos;implémentation du code, le fonctionnement des bases de données et la solidité opérationnelle des systèmes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-purple-500/10 bg-purple-500/3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono font-black text-purple-400 uppercase">Créateur</h4>
                    <span className="text-[10px] font-mono text-purple-500/70 italic">&ldquo;Je conçois&rdquo;</span>
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    Le designer d&apos;expérience. Vous soignez les interfaces, l&apos;ergonomie visuelle, l&apos;harmonie esthétique et l&apos;impact interactif (effet &quot;wow&quot;) sur les utilisateurs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/10 bg-amber-500/3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono font-black text-amber-400 uppercase">Stratège</h4>
                    <span className="text-[10px] font-mono text-amber-500/70 italic">&ldquo;J&apos;organise&rdquo;</span>
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    L&apos;architecte produit. Vous analysez la viabilité d&apos;un projet par rapport au marché, structurez les priorités logiques et cadrez l&apos;alignement stratégique des solutions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono font-black text-emerald-400 uppercase">Catalyseur</h4>
                    <span className="text-[10px] font-mono text-emerald-500/70 italic">&ldquo;Je rassemble&rdquo;</span>
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    Le ciment de la communauté. Vous fédérez les énergies, facilitez l&apos;entraide, coordonnez la communication et valorisez les projets au sein du réseau d&apos;utilisateurs.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-5 space-y-2 text-xs font-light text-zinc-400 leading-relaxed">
                <h4 className="font-mono font-bold text-white uppercase text-[10px]">Quel profil êtes-vous ?</h4>
                <p>
                  Votre profil initial est estimé lors du quiz de diagnostic. Cependant, JoinHashcode mesure continuellement les actions et les types de livrables que vous validez. Si un Visionnaire se met à livrer majoritairement du code, son radar évoluera naturellement pour refléter ses nouvelles capacités réelles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnement du Quiz */}
          <Card id="quiz" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Activity className="size-5 text-primary" /> Fonctionnement du Quiz Psychométrique
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Le diagnostic qui détermine votre profil comportemental dominant parmi les 4 classes HASHCODE.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="text-xs text-zinc-400 leading-relaxed font-light space-y-3">
                <p>
                  Le quiz se compose de <strong className="text-white">13 questions</strong> à choix unique couvrant 8 dimensions (comportement, résolution de problème, motivation, environnement, scénario, vision, travail, technologie, identité, crise).
                </p>
                <p>
                  Chaque question est pondérée (de 2 à 5 points). Votre réponse attribue <strong className="text-white">l&apos;intégralité du poids</strong> de la question au profil correspondant. Le score total de chaque profil détermine votre classement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">Les 4 profils possibles</h4>
                  <ul className="text-[10px] text-zinc-400 font-light space-y-1">
                    <li><strong className="text-blue-400">Builder</strong> — orienté construction et exécution</li>
                    <li><strong className="text-purple-400">Créateur</strong> — orienté design et expérience</li>
                    <li><strong className="text-amber-400">Stratège</strong> — orienté analyse et planification</li>
                    <li><strong className="text-emerald-400">Catalyseur</strong> — orienté communauté et coordination</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">Profil hybride</h4>
                  <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                    Si l&apos;écart entre votre profil principal et secondaire est inférieur à 15%, le système vous reconnaît comme <strong className="text-primary">profil hybride</strong> (ex: Builder × Créateur). Vous recevez alors des recommandations de missions adaptées à vos deux spécialités.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-5 space-y-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase">Quand repasser le quiz ?</h4>
                <div className="space-y-3 text-[11px] text-zinc-400 font-light leading-relaxed">
                  <div className="flex gap-3">
                    <span className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-400 shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">Compte de moins de 24h :</strong> Vous pouvez repasser le quiz immédiatement et sans limite pour corriger une erreur de diagnostic. Aucun cooldown n&apos;est appliqué.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="size-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[9px] font-mono font-bold text-amber-400 shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">Évolution naturelle constatée :</strong> Si vous sentez que vos centres d&apos;intérêt ou votre façon de travailler ont changé (vous validez des missions d&apos;un autre profil, votre radar se déforme), vous pouvez repasser le quiz pour officialiser ce changement. Un <strong className="text-zinc-300">cooldown de 14 jours</strong> s&apos;applique entre chaque recalibrage.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="size-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[9px] font-mono font-bold text-blue-400 shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">Doute sur votre profil actuel :</strong> Vous avez été classé dans un profil qui ne vous correspond pas ou le résultat vous a surpris. Dans ce cas, repassez le quiz durant vos premières 24h (gratuit) ou attendez le reset de 14 jours.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-zinc-400 font-light leading-relaxed flex items-start gap-2">
                  <AlertCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Important :</strong> Repasser le quiz change votre classe et donc votre affectation de guild. Si vous êtes dans une escouade, prévenez vos coéquipiers avant de recalibrer — votre départ peut impacter l&apos;équilibre cognitif du groupe.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Glossaire Tactique */}
          <Card id="glossaire" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <BookOpen className="size-5 text-primary" /> Glossaire Tactique des Concepts
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Le vocabulaire indispensable pour décoder la console et naviguer dans l&apos;écosystème HASHCODE.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <Activity className="size-3 text-primary" /> Vibrance
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Représente votre <strong className="text-zinc-300">énergie vitale</strong> sur la plateforme. Elle augmente par l&apos;action (missions, check-ins) et diminue par l&apos;inaction. Une vibrance élevée augmente vos gains d&apos;XP.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <ShieldAlert className="size-3 text-blue-400" /> Confiance
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Votre <strong className="text-zinc-300">cote de fiabilité</strong> communautaire. Elle se bâtit par la régularité et la qualité de vos livrables. Une confiance basse peut restreindre l&apos;accès à certaines unités d&apos;élite.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <TrendingUp className="size-3 text-emerald-400" /> Alignement
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Mesure l&apos;adéquation entre vos <strong className="text-zinc-300">intentions déclarées</strong> (profil) et vos <strong className="text-zinc-300">actions réelles</strong>. Un alignement parfait débloque des bonus de synergie uniques.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <Zap className="size-3 text-[#C5F441]" /> Cohésion
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    La force de <strong className="text-zinc-300">votre escouade</strong>. Elle exprime la capacité du groupe à rester synchronisé. Une cohésion de 100% active des multiplicateurs de gains massifs pour toute l&apos;équipe.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-primary" /> Check-in
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    L&apos;acte quotidien de <strong className="text-zinc-300">signaler sa présence</strong> et sa disponibilité. C&apos;est le carburant principal de la cohésion de votre escouade.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <Award className="size-3 text-amber-500" /> Reviewer
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Un agent de grade supérieur habilité à <strong className="text-zinc-300">auditer et valider</strong> les livrables de ses pairs. C&apos;est le garant de la qualité sur la plateforme.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                    <Trophy className="size-3 text-purple-400" /> Dossier
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Votre <strong className="text-zinc-300">archive centrale</strong> d&apos;évolution. Il regroupe votre carte de membre, vos badges, vos rapports de missions et votre historique de carrière.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils pour les Agents Nomades (Mobile) */}
          <div id="mobile" className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3 scroll-mt-24">
            <h4 className="text-[11px] font-black text-blue-400 uppercase font-mono flex items-center gap-1.5">
              <Compass className="size-3.5" /> Guide de l&apos;Agent Nomade (Optimisation Mobile)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-zinc-500 font-light leading-relaxed">
              <p>
                <strong className="text-zinc-300">Aide au toucher :</strong> Sur mobile, les tooltips classiques sont remplacés par des icônes <strong className="text-primary">(i)</strong>. Touchez-les pour faire apparaître les explications tactiques de chaque métrique.
              </p>
              <p>
                <strong className="text-zinc-300">Navigation Rapide :</strong> Utilisez la barre de navigation basse pour basculer instantanément entre votre Console, vos Missions et votre Escouade sans repasser par le menu principal.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB CONTENT: EVOLUTION --- */}
        <TabsContent value="evolution" className="space-y-6 animate-in fade-in duration-300">
          {/* Annotated Radar HUD Section */}
          <Card id="radar" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white">Simulation du Radar de Compétences</CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Voici le simulateur interactif du radar. Survolez ses différents sommets pour en analyser les facettes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-8">
              <div className="flex-1 w-full flex justify-center bg-zinc-950/30 rounded-2xl p-4 border border-white/3">
                <EvolutionRadar 
                  builderScore={80} 
                  creatorScore={65} 
                  strategistScore={45} 
                  catalystScore={30} 
                  userClass="builder"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-mono font-bold text-primary uppercase">Comment lire ton radar ?</h4>
                <div className="space-y-3.5 text-xs text-zinc-400 font-light leading-relaxed">
                  <p>
                    <strong className="text-white">1. Sommets & Axes :</strong> Chaque sommet représente un des quatre rôles comportementaux. Plus ton polygone s&apos;étend vers un sommet, plus ta spécialisation et ton expérience dans cette classe sont élevées.
                  </p>
                  <p>
                    <strong className="text-white">2. Déformation Dynamique :</strong> Ce radar n&apos;est pas figé. À chaque soumission de mission approuvée par les pairs, les scores se recalculent en temps réel, modifiant la forme de ton polygone holographique.
                  </p>
                  <p>
                    <strong className="text-white">3. Force principale & Secondaire :</strong> Votre rôle dominant est affiché avec son pourcentage exact. Si un second rôle s&apos;approche à moins de 15% d&apos;écart, le système active automatiquement un <strong className="text-primary">Profil Hybride</strong> (ex: Artisan : 78% | Visionnaire : 62%).
                  </p>
                </div>
              </div>
            </CardContent>
            
            {/* Hybrid Bar Progress Example */}
            <div className="p-6 bg-zinc-950/40 border-t border-white/5 space-y-6">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">Visualisation de la Précision (P1)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono uppercase">
                      <span className="text-blue-400 font-bold">Artisan (Principal)</span>
                      <span className="text-white">78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono uppercase">
                      <span className="text-amber-400 font-bold">Visionnaire (Secondaire)</span>
                      <span className="text-white">62%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: "62%" }} />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center">
                  <h5 className="text-[11px] font-black text-primary uppercase font-mono mb-2 flex items-center gap-1.5">
                    <Sparkles className="size-3" /> Impact de l&apos;Hybridité
                  </h5>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-light">
                    Les profils hybrides bénéficient d&apos;un <strong className="text-white">Matching Intelligent</strong> : vous recevez des recommandations de missions pour vos deux classes et votre profil est mis en avant auprès des escouades recherchant l&apos;une ou l&apos;autre de vos spécialités.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card id="moteur" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white">Le Moteur d&apos;Évolution</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Chaque agent possède un profil psychométrique unique basé sur 4 piliers comportementaux fondamentaux.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">Profils Hybrides</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Si votre évaluation révèle deux scores dominants très proches (écart inférieur à 15%), vous débloquez un profil hybride (ex : <span className="text-[#C5F441] font-bold">Builder × Créateur</span>). Les profils hybrides sont de véritables couteaux suisses technologiques dans l&apos;écosystème.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">Recalibrage de Profil (Quiz)</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Vous avez fait une erreur lors de votre premier diagnostic ou vos compétences ont évolué ? Durant les <strong className="text-white">premières 24 heures</strong> suivant la création de votre compte, vous pouvez repasser le quiz de diagnostic immédiatement et sans limite.
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Passé ce délai, le recalibrage est soumis à un <strong className="text-white">cooldown de 14 jours</strong> (limité à un passage toutes les 2 semaines). Cela permet de stabiliser votre rôle dans l&apos;escouade tout en privilégiant l&apos;évolution naturelle par l&apos;action en accomplissant des missions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card id="impact" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Science de l&apos;Impact (Impact Engine)</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                    <div className="text-[10px] font-bold text-primary uppercase font-mono flex items-center gap-1.5">
                      <TrendingUp className="size-3" /> Formule de l&apos;Impact Score
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono text-zinc-500">
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span>Production</span><span className="text-zinc-300">35%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span>Qualité (IRT)</span><span className="text-zinc-300">25%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span>Collaboration</span><span className="text-zinc-300">15%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span>Fiabilité (Glicko)</span><span className="text-zinc-300">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Leadership</span><span className="text-zinc-300">10%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white uppercase font-mono">Niveau Latent (Score θ)</div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                      Basé sur l&apos;Item Response Theory (IRT), votre niveau n&apos;est pas qu&apos;un cumul d&apos;XP, mais une évaluation de votre compétence réelle face à la difficulté des défis relevés.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white uppercase font-mono">Indice de Confiance (σ)</div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                      Inspiré du Glicko-2, cet indice mesure la stabilité de votre performance. Plus il est faible, plus votre grade est considéré comme &quot;incontestable&quot; par le réseau.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-emerald-400 uppercase font-mono">Alignement Psychométrique</div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                      Mesure la synergie entre votre profil déclaré et vos actions réelles. Un alignement total débloque les missions de rang &quot;Légende&quot;.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Échelle des Rangs et Progression */}
          <Card id="rangs" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <Award className="size-5 text-[#C5F441]" /> L&apos;Échelle des Rangs & Titres Honorifiques
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Votre grade n&apos;est pas qu&apos;un chiffre, c&apos;est un marqueur de votre autorité technique et de votre impact au sein de la communauté.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full border-collapse text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500">
                    <th className="pb-3 font-semibold uppercase">Rang</th>
                    <th className="pb-3 font-semibold uppercase">Titre</th>
                    <th className="pb-3 font-semibold uppercase">Habilitations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-400">ASPIRANT (INIT)</td>
                    <td className="py-4">Niveau 1</td>
                    <td className="py-4 text-zinc-500 font-light">Accès au diagnostic initial, création d&apos;escouade et missions d&apos;ancrage.</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-emerald-400">TECHNICIEN</td>
                    <td className="py-4 text-emerald-400">Niveaux 2 - 4</td>
                    <td className="py-4 text-zinc-400 font-light">Accès au rôle de <strong className="text-white">Reviewer</strong> (à partir de 3 missions validées), déblocage des missions coopératives complexes.</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-blue-400">ARCHITECTE</td>
                    <td className="py-4 text-blue-400">Niveaux 5 - 9</td>
                    <td className="py-4 text-zinc-400 font-light">Accès au canal de gouvernance privée. Vos votes de revues sur les livrables doublent de poids (facteur de confiance de 0.5+).</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-[#C5F441]">LÉGENDE</td>
                    <td className="py-4 text-[#C5F441]">Niveau 10+</td>
                    <td className="py-4 text-zinc-400 font-light">Habilitation de vote direct sur les propositions de nouvelles missions (Missions Architect). Statut honorifique public.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB CONTENT: SQUADS --- */}
        <TabsContent value="squads" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card id="matching" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Users className="size-5 text-primary" /> Talent Matching Engine
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  HASHCODE utilise des protocoles issus des recherches du MIT et de Google (Project Aristotle) pour assembler les escouades les plus performantes.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white uppercase">Le Protocole de Match Score</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                      Chaque profil est analysé selon <strong className="text-white">7 piliers de compatibilité</strong> pour maximiser vos chances de réussite collective :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-mono">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">1. Complémentarité Cognitive</span>
                        <span className="text-primary font-bold">40%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">2. Alignement des Objectifs</span>
                        <span className="text-emerald-400">15%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">3. Synergie Technique</span>
                        <span className="text-blue-400">15%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">4. Fiabilité (Trust Score)</span>
                        <span className="text-amber-400">10%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">5. Activité Récente</span>
                        <span className="text-zinc-300">10%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-zinc-500">6. Disponibilité & Langue</span>
                        <span className="text-zinc-300">10%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">1</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Approche Hybride : Match vs Recherche</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Vous gardez le contrôle. Consultez vos <strong className="text-white">Recommandations d&apos;Élite</strong> basées sur le Matching Engine, ou utilisez la <strong className="text-white">Recherche Avancée</strong> pour trouver un agent spécifique par stack ou localisation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">2</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Équilibre Cognitif (Hard Cap)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Pour garantir la diversité, le système interdit d&apos;avoir plus de **2 représentants de la même classe** (ex: pas plus de 2 Artisans) au sein d&apos;une unité de 5.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">3</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Gestion & Leadership (V2)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Panel de contrôle étendu pour les leaders : transfert de commandement, dissolution destructive et gestion de la visibilité tactique (Public/Privé).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="health" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Squad Health Score</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Vitalité Collective</div>
                    <p className="text-[9px] text-zinc-500">Moyenne de la vibrance active des membres.</p>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="text-[10px] font-bold text-blue-400 uppercase font-mono">Cohésion Cognitive</div>
                    <p className="text-[9px] text-zinc-500">Niveau d&apos;équilibre et de synergie des rôles.</p>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="text-[10px] font-bold text-amber-400 uppercase font-mono">Fiabilité Groupe</div>
                    <p className="text-[9px] text-zinc-500">Respect historique des engagements de l&apos;unité.</p>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-primary/5 border border-primary/10 text-[11px] text-primary-foreground/70 leading-relaxed">
                  <AlertCircle className="size-4 mb-2 text-primary" />
                  **Analyse Prédictive** : Une escouade avec un Health Score &gt; 85% a une probabilité de succès de 92% sur les missions complexes.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocole de Communication et Synergies Cognitives */}
          <Card id="synergie" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <MessageSquare className="size-5 text-emerald-500" /> Protocole de Synergie & Frictions
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Résoudre des défis en équipe requiert une collaboration étroite entre des profils aux modes de pensée radicalement opposés.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-light">
                <div className="space-y-3 p-5 rounded-2xl bg-zinc-950/40 border border-white/5">
                  <h4 className="font-bold text-white uppercase font-mono text-[11px] flex items-center gap-1.5 text-blue-400">
                    <TrendingUp className="size-3.5" /> Analytiques (Builder & Stratège)
                  </h4>
                  <p className="text-zinc-400">
                    <strong className="text-white">Leur force :</strong> Précision technique, métriques froides, faisabilité et optimisation.
                  </p>
                  <p className="text-zinc-500">
                    <strong className="text-zinc-300">Comment collaborer :</strong> Fournissez-leur des données chiffrées et des spécifications claires. Évitez les concepts flous. Concentrez-vous sur la résolution d&apos;étapes logiques et reproductibles.
                  </p>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-zinc-950/40 border border-white/5">
                  <h4 className="font-bold text-white uppercase font-mono text-[11px] flex items-center gap-1.5 text-purple-400">
                    <Sparkles className="size-3.5" /> Créatifs & Sociaux (Créateur & Catalyseur)
                  </h4>
                  <p className="text-zinc-400">
                    <strong className="text-white">Leur force :</strong> Expérience utilisateur &ldquo;wow&rdquo;, cohésion d&apos;équipe, communication et adhésion du public.
                  </p>
                  <p className="text-zinc-500">
                    <strong className="text-zinc-300">Comment collaborer :</strong> Donnez-leur de la flexibilité visuelle et encouragez l&apos;exploration d&apos;idées. Valorisez l&apos;impact humain du projet et l&apos;émotion suscitée par le livrable.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-xs text-zinc-400 leading-relaxed font-light space-y-2">
                <span className="text-[#C5F441] font-mono font-bold uppercase text-[10px] block">Régulation des Frictions :</span>
                <p>
                  En cas de désaccord sur un livrable, appliquez la règle de l&apos;arbitrage par le rôle : le <strong className="text-white">Stratège</strong> tranche sur l&apos;opportunité marché, le <strong className="text-white">Builder</strong> sur la complexité et faisabilité technique, le <strong className="text-white">Créateur</strong> sur la fidélité de l&apos;expérience utilisateur, et le <strong className="text-white">Catalyseur</strong> sur la coordination de la livraison.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guide Pratique : Recrutement & Communication */}
          <Card id="recruitment" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <UserPlus className="size-5 text-amber-400" /> Recrutement & Communication
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Comment recruter des agents dans ton escouade et comment les membres communiquent entre eux.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase font-mono">Inviter un Membre dans Ton Escouade</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Il existe <strong className="text-white">trois méthodes</strong> pour recruter un agent dans ton escouade :
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                    <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0">1</div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white">Lien d&apos;Invitation Partageable</h5>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Depuis le salon de ton escouade ou la bannière, copie ton lien unique et envoie-le à n&apos;importe qui (Discord, WhatsApp, email). Le destinataire clique, accepte et rejoint directement.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                    <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0">2</div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white">Invitation par Email</h5>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Dans la page <strong className="text-zinc-300">Gérer l&apos;escouade</strong> → onglet "Inviter", saisis l&apos;email du futur membre. Un email lui est envoyé avec un lien sécurisé pour accepter l&apos;invitation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                    <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0">3</div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white">Invitation depuis le Dossier d&apos;un Membre</h5>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Depuis la page <strong className="text-zinc-300">Talents</strong>, explore les profils des agents. Quand tu trouves un candidat, clique sur <strong className="text-zinc-300">"Voir le Dossier"</strong>. Si tu es Chef ou Admin d&apos;une escouade, un bouton <strong className="text-zinc-300">"Inviter dans mon escouade"</strong> apparaît. L&apos;agent reçoit une notification in-app avec un lien pour accepter ou refuser.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 text-[11px] text-zinc-400 leading-relaxed space-y-1">
                  <span className="text-amber-400 font-mono font-bold text-[10px] uppercase block">Équilibre Cognitif</span>
                  <p>Le système vérifie automatiquement que ta n&apos;escouade n&apos;atteint pas plus de <strong className="text-white">2 représentants d&apos;une même classe</strong> avant d&apos;envoyer l&apos;invitation. Si la limite est atteinte, une confirmation supplémentaire te sera demandée.</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase font-mono">Communiquer avec ton Escouade</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  La communication au sein d&apos;une escouade se fait via plusieurs canaux :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Megaphone className="size-3.5 text-primary" /> Annonce du Chef
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Le Chef peut rédiger une annonce épinglée dans les paramètres de l&apos;escouade. Elle est visible par tous les membres sur la page principale.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Activity className="size-3.5 text-emerald-400" /> Journal d&apos;Activité
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Toutes les actions importantes (mission soumise, check-in, nouveau membre) sont visibles dans le flux d&apos;activité de l&apos;escouade.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell className="size-3.5 text-blue-400" /> Notifications
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Les membres reçoivent des notifications in-app pour les événements clés : invitation reçue, candidature acceptée, nouveau membre.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-zinc-400 leading-relaxed">
                  <span className="text-emerald-400 font-mono font-bold text-[10px] uppercase block mb-1">✓ Disponible</span>
                  <p>Le chat d&apos;escouade est actif ! Tous les membres peuvent discuter en temps réel directement depuis la page de l&apos;escouade. Rafraîchissement automatique toutes les 15 secondes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Création d'une escouade */}
          <Card id="creation" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Users className="size-5 text-emerald-500" /> Création d&apos;une Escouade
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Lance ta propre unité et deviens Leader d&apos;une squad HASHCODE.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Accès à la création</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Rendez-vous sur la page <strong className="text-white">Escouade</strong> depuis le menu latéral. Si tu n&apos;es dans aucune escouade, un panneau de création s&apos;affiche. Clique sur <strong className="text-zinc-300">"Créer mon Escouade"</strong> pour débuter.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Configurer l&apos;identité</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Choisis un <strong className="text-white">nom</strong> pour ton escouade et un <strong className="text-white">slug</strong> (identifiant unique) qui servira pour le lien d&apos;invitation. Le slug doit comporter 3 à 30 caractères (minuscules, chiffres, tirets).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Lien d&apos;invitation</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Une fois créée, un lien unique <strong className="text-zinc-300"><code>/invite/&lt;slug&gt;</code></strong> est généré. Partage-le avec les agents que tu souhaites recruter. Tu peux modifier le nom et le slug depuis la page <strong className="text-zinc-300">Gérer l&apos;escouade</strong>.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-emerald-400 font-mono font-bold text-[10px] uppercase block mb-1">Limite de taille</span>
                <p>Une escouade peut compter jusqu&apos;à <strong className="text-white">5 membres</strong> maximum. Cette limite garantit une agilité de communication optimale et une dynamique d&apos;équipe efficace, inspirée des recherches de Google sur les team sizes idéales.</p>
              </div>
            </CardContent>
          </Card>

          {/* Rôles et permissions */}
          <Card id="roles" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-400" /> Rôles & Permissions
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Chaque escouade fonctionne avec une hiérarchie claire pour garantir une coordination efficace.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500">
                      <th className="pb-3 font-semibold uppercase pr-4">Rôle</th>
                      <th className="pb-3 font-semibold uppercase pr-4">Attribué à</th>
                      <th className="pb-3 font-semibold uppercase">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/2 transition-colors">
                      <td className="py-4 font-bold text-emerald-400 pr-4">LEADER</td>
                      <td className="py-4 text-zinc-400 pr-4">Créateur de l&apos;escouade</td>
                      <td className="py-4 text-zinc-500 font-light">Inviter/expulser des membres, modifier le nom et le slug, transférer le leadership, dissoudre l&apos;escouade, gérer les paramètres.</td>
                    </tr>
                    <tr className="hover:bg-white/2 transition-colors">
                      <td className="py-4 font-bold text-blue-400 pr-4">ADMIN</td>
                      <td className="py-4 text-zinc-400 pr-4">Membre promu par le LEADER</td>
                      <td className="py-4 text-zinc-500 font-light">Inviter des membres, gérer les demandes d&apos;adhésion, modifier certaines informations. Ne peut pas dissoudre ni transférer le leadership.</td>
                    </tr>
                    <tr className="hover:bg-white/2 transition-colors">
                      <td className="py-4 font-bold text-zinc-300 pr-4">MEMBER</td>
                      <td className="py-4 text-zinc-400 pr-4">Membre standard</td>
                      <td className="py-4 text-zinc-500 font-light">Participer aux missions, utiliser le chat, effectuer son check-in quotidien, consulter le tableau de bord de l&apos;escouade. Ne peut pas inviter de nouveaux membres.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Système d'invitations avec analyse */}
          <Card id="invites" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> Système d&apos;Invitation Intelligent
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Avant d&apos;inviter un talent, un diagnostic de compatibilité est automatiquement généré pour maximiser la réussite collective.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-primary" /> Score de Synergie
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Un score de 0 à 100% est calculé en comparant les scores psychométriques du candidat avec la composition actuelle de l&apos;escouade. Plus le score est élevé, meilleure est la complémentarité.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="size-3.5 text-blue-400" /> Chevauchement d&apos;Outils
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Les outils techniques du candidat sont comparés à ceux de l&apos;escouade. Les outils déjà maîtrisés par l&apos;équipe sont affichés, ainsi que les nouveaux outils que le candidat apporte (surlignés en vert).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-emerald-400" /> Conseil Coach
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Un conseil contextuel est affiché : <strong className="text-emerald-400">Recommandé</strong> (synergie &ge; 70%), <strong className="text-amber-400">Prudence</strong> (45–69%), ou <strong className="text-red-400">Déconseillé</strong> (&lt; 45%).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Accès depuis la page Talents</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Depuis la page <strong className="text-white">Talents</strong>, explore les profils des agents. Si tu es <strong className="text-zinc-300">LEADER</strong> ou <strong className="text-zinc-300">ADMIN</strong> d&apos;une escouade, le bouton <strong className="text-primary">"Inviter dans mon escouade"</strong> apparaît à la place de "Voir le Dossier" pour les autres utilisateurs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Analyse avant envoi</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Un dialogue d&apos;analyse s&apos;ouvre avec le score de synergie, la composition des classes de l&apos;escouade, les outils partagés et le conseil coach. Tu peux visualiser l&apos;impact potentiel sur l&apos;équilibre de l&apos;escouade avant de confirmer l&apos;invitation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Confirmation et notification</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Une fois l&apos;invitation confirmée, le talent reçoit une <strong className="text-white">notification in-app</strong> et un <strong className="text-white">email</strong> avec un lien pour accepter ou refuser. Tu peux suivre l&apos;état de l&apos;invitation depuis ton tableau de bord.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-amber-400 font-mono font-bold text-[10px] uppercase block mb-1">Équilibre Cognitif — Hard Cap</span>
                <p>Le système vérifie automatiquement que l&apos;escouade ne dépasse pas <strong className="text-white">2 représentants de la même classe</strong> avant d&apos;envoyer l&apos;invitation. Si la limite est atteinte, l&apos;invitation est bloquée. Cette règle garantit la diversité cognitive nécessaire aux performances optimales.</p>
              </div>
            </CardContent>
          </Card>

          {/* Gestion de l'escouade */}
          <Card id="gestion" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Activity className="size-5 text-blue-400" /> Gestion de l&apos;Escouade
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Les actions disponibles pour le LEADER et les ADMIN pour gérer la vie de l&apos;escouade.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="size-3.5 text-emerald-400" /> Modifier le nom et le slug
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Le LEADER peut modifier le nom et le slug de l&apos;escouade depuis la page <strong className="text-zinc-300">Gérer l&apos;escouade</strong>. Le lien d&apos;invitation existant reste valide après le changement.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <LogOut className="size-3.5 text-red-400" /> Quitter l&apos;escouade
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Tout membre peut quitter l&apos;escouade. Le départ réduit temporairement la cohésion. Si le LEADER quitte, le leadership est transféré automatiquement à un ADMIN ou au membre le plus ancien.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5 text-amber-400" /> Transférer le leadership
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Le LEADER peut transférer son rôle à un autre membre de l&apos;escouade. Le nouveau LEADER hérite de toutes les permissions de gestion.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Trash2 className="size-3.5 text-red-500" /> Dissoudre l&apos;escouade
                  </h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Seul le LEADER peut dissoudre l&apos;escouade. Cette action est irréversible : tous les membres sont libérés, les données de cohésion sont perdues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcours Squad Journey */}
          <Card id="parcours" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Rocket className="size-5 text-primary" /> Parcours de l&apos;Escouade (Squad Journey)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Les 6 phases de progression qui jalonnent la vie de ton unité, visibles depuis la page Escouade.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-light">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-zinc-400 uppercase">Phase 1</h4>
                    <span className="text-[9px] font-mono text-zinc-600">FORMATION</span>
                  </div>
                  <p className="text-zinc-500">L&apos;escouade est créée. Les premiers membres rejoignent et commencent à interagir.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-zinc-400 uppercase">Phase 2</h4>
                    <span className="text-[9px] font-mono text-zinc-600">STABILISATION</span>
                  </div>
                  <p className="text-zinc-500">L&apos;équipe atteint 5 membres. Les check-ins réguliers construisent la cohésion.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-zinc-400 uppercase">Phase 3</h4>
                    <span className="text-[9px] font-mono text-zinc-600">COHÉSION</span>
                  </div>
                  <p className="text-zinc-500">La cohésion dépasse 70%. Les bonus collectifs commencent à s&apos;activer.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-zinc-400 uppercase">Phase 4</h4>
                    <span className="text-[9px] font-mono text-zinc-600">SYNCHRONISATION</span>
                  </div>
                  <p className="text-zinc-500">Streak de cohésion activé. L&apos;équipe débloque les badges Sync Master.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-zinc-400 uppercase">Phase 5</h4>
                    <span className="text-[9px] font-mono text-zinc-600">MAÎTRISE</span>
                  </div>
                  <p className="text-zinc-500">L&apos;escouade valide des missions Co-op. La réputation collective augmente.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-emerald-400 uppercase">Phase 6</h4>
                    <span className="text-[9px] font-mono text-emerald-400">LÉGENDE</span>
                  </div>
                  <p className="text-zinc-500">Escouade d&apos;élite. Cohésion maximale, streaks records, impact visible sur le leaderboard.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB CONTENT: MISSIONS --- */}
        <TabsContent value="missions" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card id="types" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white">Types de Missions & Soumission</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Les missions sont des défis conçus pour valider des compétences pratiques réelles dans un cadre professionnel.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase">Missions Ancrage (INIT)</span>
                      <span className="text-[10px] font-mono text-primary font-bold">Niveau Débutant</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Conçues pour la prise en main du protocole HASHCODE, la complétion du profil ou la création de votre première escouade.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase">Missions Spécialisation</span>
                      <span className="text-[10px] font-mono text-[#C5F441] font-bold">Niveau Intermédiaire / Expert</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Défis orientés métier (développement d&apos;une API, refactoring, design d&apos;UI, audit SEO, etc.). Ils ciblent directement vos compétences réelles pour faire évoluer votre radar.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase">Missions Co-op (Collectives)</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">Niveau Escouade</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Missions nécessitant la synchronisation de plusieurs rôles au sein de l&apos;escouade. Chaque membre doit soumettre son livrable lié à son domaine de prédilection.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-5 space-y-3">
                  <h4 className="text-sm font-bold text-white">Processus de Validation (Mode Concierge)</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    JoinHashcode utilise désormais le <strong className="text-white">Concierge Moderation Mode</strong>. Chaque soumission suit une timeline transparente de révision : <strong className="text-zinc-300">Claim</strong> (prise en charge par un Reviewer), <strong className="text-zinc-300">Review</strong> (analyse multi-étapes) et <strong className="text-zinc-300">Decision</strong>. Vous pouvez suivre chaque étape en temps réel sur votre carte de mission.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card id="reviewer" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Devenir Reviewer</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6 text-xs text-zinc-400 leading-relaxed font-light">
                <p>
                  Le statut de <strong className="text-white">Reviewer</strong> n&apos;est pas acquis, il se mérite. Une fois le rang de Technicien atteint, vous pouvez postuler pour devenir auditeur.
                </p>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2.5">
                  <div className="font-bold text-primary font-mono uppercase text-[10px]">Conditions d&apos;habilitation :</div>
                  <ul className="space-y-1.5 list-disc pl-4 text-zinc-400 font-mono text-[10px]">
                    <li>Atteindre le grade de <strong className="text-white">Technicien</strong>.</li>
                    <li>Avoir validé au moins <strong className="text-white">3 missions</strong> de spécialisation.</li>
                  </ul>
                </div>
                <p>
                  Une fois habilité, l&apos;onglet « Reviewer » apparaît dans votre console, vous permettant de guider les nouveaux agents et de gagner des bonus d&apos;XP par audit.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Critères de Qualité des Livrables */}
          <Card id="criteres" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <Sparkles className="size-5 text-emerald-500" /> Critères de Validation par Profil
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Pour réduire le taux de rejet de vos missions, assurez-vous que vos livrables respectent les exigences de qualité propres à votre rôle.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-blue-400 uppercase">Livrables Builder</h4>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Lien vers un repository GitHub/GitLab public.</li>
                    <li>Fichier `README.md` expliquant l&apos;architecture et la procédure de lancement.</li>
                    <li>Code propre, commenté et sans secrets ou clés d&apos;API en dur.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-purple-400 uppercase">Livrables Créateur</h4>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Lien vers un fichier Figma en mode consultation publique.</li>
                    <li>Captures d&apos;écran HD des parcours clés ou prototypes animés.</li>
                    <li>Justification des choix typographiques, couleurs et design tokens.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-amber-400 uppercase">Livrables Stratège</h4>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Lien vers un document Google Doc/Notion ou tableur public.</li>
                    <li>Rapport d&apos;analyse structuré avec métriques (ex. ROI, conversion).</li>
                    <li>Plan d&apos;action clair avec priorités (KPIs, objectifs SMART).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-emerald-400 uppercase">Livrables Catalyseur</h4>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Plan de communication rédigé ou captures de publications communautaires.</li>
                    <li>Lien de diffusion (posts X, LinkedIn, forums d&apos;entraide).</li>
                    <li>Statistiques d&apos;impact d&apos;audience (vues, partages, messages générés).</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB CONTENT: COHESION --- */}
        <TabsContent value="cohesion" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card id="groupe" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white">Cohésion de Groupe & Streaks</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  L&apos;activité régulière est le moteur de la réussite de votre équipe.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">A</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">L&apos;Indice de Cohésion</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        La cohésion exprime la présence active de votre équipe. Elle est alimentée par les check-ins journaliers de chaque agent et par l&apos;acceptation de nouveaux membres.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">B</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">La Dégradation Temporelle (Decay)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Chaque nuit, un protocole d&apos;usure (cron de decay) réduit la cohésion de l&apos;escouade. Si l&apos;équipe n&apos;effectue pas ses check-ins régulièrement, la cohésion s&apos;effondre, bloquant les avantages collectifs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">C</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Les Séries de Synchronisation (Streaks)</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Si la cohésion de votre escouade est maintenue au-dessus de 90%, vous enclenchez un compteur de streak de synchronisation (en jours).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="badges" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Badges Consécutifs</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-[#C5F441] uppercase">Sync Master (Streak 3j)</span>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                      Récompensé après 3 jours de cohésion maximale consécutive. Offre un bonus de +300 XP à tous les membres.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">Hyper Link (Streak 7j)</span>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                      Statut légendaire débloqué après une semaine complète d&apos;alignement parfait. Offre +500 XP et décore le profil public de tous les membres avec un insigne légendaire.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 text-[11px] text-zinc-500 leading-relaxed">
                  <span className="text-primary font-bold">Rappel :</span> Un seul jour d&apos;inactivité totale de l&apos;équipe brise le streak et réinitialise le compteur à zéro.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Votre réputation compte */}
          <Card id="reputation" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <TrendingUp className="size-5 text-[#C5F441]" /> Votre réputation compte (Indice de Confiance)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Au-delà de l&apos;XP, JoinHashcode mesure votre rigueur et le respect de vos engagements envers la communauté.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-light">
                <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                  <h4 className="font-mono font-bold text-emerald-400 uppercase text-[11px]">Comment faire augmenter sa réputation :</h4>
                  <ul className="list-disc pl-4 space-y-2 text-zinc-400">
                    <li><strong className="text-white">Livrer à temps :</strong> Soumettre des livrables de haute qualité avant la deadline estimée de la mission.</li>
                    <li><strong className="text-white">Soutenir les pairs :</strong> Participer à l&apos;audit des autres agents (revues) avec des commentaires constructifs.</li>
                    <li><strong className="text-white">Garder le Streak :</strong> Assurer son check-in quotidien pour maintenir l&apos;indice de cohésion de sa squad.</li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                  <h4 className="font-mono font-bold text-amber-500 uppercase text-[11px]">Ce qui dégrade la réputation :</h4>
                  <ul className="list-disc pl-4 space-y-2 text-zinc-400">
                    <li><strong className="text-white">Abandons fréquents :</strong> S&apos;inscrire à des missions et les abandonner de manière répétée.</li>
                    <li><strong className="text-white">Soumissions abusives :</strong> Envoyer des preuves d&apos;exécution vides ou des repos Github n&apos;ayant aucun rapport avec le sujet.</li>
                    <li><strong className="text-white">Inactivité prolongée :</strong> Briser les séries de streaks de l&apos;escouade sans motif.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau de gains d'XP */}
          <Card id="xp" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6 scroll-mt-24">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <Zap className="size-5 text-[#C5F441]" /> Barème des Récompenses d&apos;XP
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Voici les actions récompensées permettant d&apos;accumuler de l&apos;expérience pour monter de niveau.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full border-collapse text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500">
                    <th className="pb-3 font-semibold uppercase">Action de l&apos;Agent</th>
                    <th className="pb-3 font-semibold uppercase">Gain d&apos;XP</th>
                    <th className="pb-3 font-semibold uppercase">Fréquence / Limite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-300">Check-in journalier d&apos;escouade</td>
                    <td className="py-4 text-[#C5F441]">+50 XP</td>
                    <td className="py-4 text-zinc-500">Une fois par jour</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-300">Validation de mission (Individuelle)</td>
                    <td className="py-4 text-[#C5F441]">+500 à +1200 XP</td>
                    <td className="py-4 text-zinc-500">Selon la complexité de la mission</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-300">Validation de mission (Co-op)</td>
                    <td className="py-4 text-[#C5F441]">+1500 XP</td>
                    <td className="py-4 text-zinc-500">Par membre participant</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-300">Effectuer une revue de livrable (Reviewer)</td>
                    <td className="py-4 text-[#C5F441]">+150 XP</td>
                    <td className="py-4 text-zinc-500">Illimité (si éligible)</td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold text-zinc-300">Ancrage du dossier (Profil 100% complété)</td>
                    <td className="py-4 text-[#C5F441]">+300 XP</td>
                    <td className="py-4 text-zinc-500">Unique (à l&apos;onboarding)</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB CONTENT: ENTRAIDE (FAQ, VISION & BLOQUE) --- */}
        <TabsContent value="entraide" className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Je suis bloqué ? */}
            <Card id="bloque" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-7 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                  <LifeBuoy className="size-5 text-emerald-500" /> Je suis bloqué : Que faire ?
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Chaque problème a sa solution sur JoinHashcode. Suivez le protocole de secours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5 text-xs font-light leading-relaxed">
                <div className="space-y-3">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">1. Je ne comprends pas l&apos;énoncé d&apos;une mission</h4>
                  <p className="text-zinc-400">
                    Ouvrez le chat de la mission ou posez une question dans le forum d&apos;entraide. La communauté et les Reviewers expérimentés sont là pour clarifier les points techniques.
                  </p>
                </div>
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">2. Je n&apos;arrive pas à trouver une escouade</h4>
                  <p className="text-zinc-400">
                    Assurez-vous que votre profil est complété à 100%. Rendez-vous dans la section « Recrutement » ou partagez votre profil public dans le salon général Discord/Telegram pour signaler que vous recherchez des partenaires de synergie.
                  </p>
                </div>
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">3. Je n&apos;ai pas le temps cette semaine</h4>
                  <p className="text-zinc-400">
                    Prévenez votre escouade dans le canal privé. Une absence signalée permet à vos équipiers d&apos;adapter la planification ou de temporiser leur check-in pour minimiser la baisse de cohésion de l&apos;escouade.
                  </p>
                </div>
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <h4 className="font-mono font-bold text-white uppercase text-[11px]">4. Je pense avoir choisi le mauvais profil comportemental</h4>
                  <p className="text-zinc-400">
                    Vous pouvez recalibrer votre diagnostic depuis l&apos;onglet Profil dans vos paramètres. C&apos;est gratuit durant vos premières 24h, puis soumis à un cooldown de 14 jours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Programme Ambassadeur / Parrainage */}
            <Card id="ambassadeur" className="glass-card bg-indigo-950/20 border-indigo-500/10 rounded-3xl lg:col-span-5 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                  <Award className="size-4" /> Programme Ambassadeur
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Parrainez vos pairs et gagnez des récompenses en XP.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-xs font-light leading-relaxed">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-white uppercase text-[10px]">Comment ça marche ?</h4>
                  <p className="text-zinc-400">
                    Chaque membre possède un <strong className="text-white">lien de parrainage unique</strong> accessible depuis le tableau de bord. Partagez-le sur vos réseaux, forums ou directement à vos contacts.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-2">
                  <h4 className="font-mono font-bold text-white uppercase text-[10px]">Récompenses</h4>
                  <ul className="space-y-1.5 text-zinc-400">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">+50 XP</span>
                      <span>par filleul qui rejoint et complète son onboarding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono text-[10px]">Badge Ambassadeur</span>
                      <span>après 5 filleuls parrainés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-[10px]">Badge Émissaire</span>
                      <span>après 20 filleuls parrainés</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                  <h4 className="font-mono font-bold text-primary uppercase text-[10px]">Astuce</h4>
                  <p className="text-zinc-400">
                    Partagez votre lien dans vos stories WhatsApp, groupes Telegram ou sur LinkedIn après avoir terminé le quiz — vos résultats de profil sont un excellent argument de recommandation !
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Histoires de réussite */}
            <Card id="reussite" className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-5 p-6 space-y-6 scroll-mt-24">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-[#C5F441] uppercase flex items-center gap-1.5">
                  <Sparkles className="size-4" /> Success Stories (Parcours Membre)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6 text-xs font-light leading-relaxed">
                <div className="p-4.5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                  <div className="font-bold text-white font-mono uppercase text-[10px] text-emerald-400">// JOANICE · DE BUILDER À LEAD QA</div>
                  <p className="text-zinc-400">
                    &ldquo;Je suis arrivée sur Hashcode sans expérience projet solide. Mon quiz de départ m&apos;a orientée en tant que Builder. Après avoir validé 3 missions de refactoring et d&apos;architecture d&apos;API, une lacune majeure en QA a été détectée dans un projet collaboratif. 
                  </p>
                  <p className="text-zinc-500 italic">
                    Grâce aux feedbacks constructifs et à mes synergies de groupe, j&apos;ai été invitée à rejoindre le Founders Lab. Aujourd&apos;hui, je supervise les critères de qualité des projets internes.&rdquo;
                  </p>
                </div>

                {/* Les 7 erreurs fréquentes des nouveaux */}
                <div className="p-4.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
                  <div className="font-bold text-amber-500 font-mono uppercase text-[10px] flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" /> Les 7 erreurs courantes à éviter :
                  </div>
                  <ul className="list-decimal pl-4 space-y-1 text-zinc-400 text-[11px] font-mono">
                    <li>Rejoindre une escouade sans comprendre sa classe.</li>
                    <li>Courir après l&apos;XP au détriment de la qualité.</li>
                    <li>Ne jamais participer aux discussions d&apos;équipe.</li>
                    <li>Soumettre des preuves d&apos;exécution incomplètes.</li>
                    <li>Ignorer les feedbacks de révision des Reviewers.</li>
                    <li>Changer constamment d&apos;objectifs de spécialisation.</li>
                    <li>Abandonner une mission sans notifier sa squad.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Où va Hashcode (Vision & Futur) */}
          <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold uppercase text-white flex items-center gap-2 font-mono">
                <Rocket className="size-5 text-emerald-500" /> Où va Hashcode ? (Vision & Futur)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-light">
                Vous n&apos;entrez pas sur une simple console de missions, vous rejoignez un écosystème en pleine expansion.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-light">
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
                  <h5 className="font-mono font-bold text-white uppercase text-[11px]">Academy</h5>
                  <p className="text-zinc-500">Parcours certifiants validés par des leaders de l&apos;industrie.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
                  <h5 className="font-mono font-bold text-white uppercase text-[11px]">Labs</h5>
                  <p className="text-zinc-500">Incubateur pour financer les meilleures solutions nées en escouade.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
                  <h5 className="font-mono font-bold text-white uppercase text-[11px]">Guildes</h5>
                  <p className="text-zinc-500">Échanges de bonnes pratiques et opportunités d&apos;emploi.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
                  <h5 className="font-mono font-bold text-white uppercase text-[11px]">Mentorat</h5>
                  <p className="text-zinc-500">Accompagnement personnalisé par des agents de grade Légende.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
                  <h5 className="font-mono font-bold text-white uppercase text-[11px]">Missions Réelles</h5>
                  <p className="text-zinc-500">Défis concrets rémunérés issus de partenaires technologiques.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div id="faq" className="border-t border-white/5 pt-10 space-y-6 scroll-mt-24">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold uppercase text-white flex items-center gap-2">
                <HelpCircle className="size-5 text-primary" /> Questions Fréquentes
              </h2>
              <p className="text-xs text-zinc-500 font-light">
                Les réponses rapides aux interrogations les plus courantes.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2 border-none">
              <AccordionItem value="item-1" className="border border-white/5 bg-zinc-900/20 px-6 py-2 rounded-2xl">
                <AccordionTrigger className="text-sm font-bold text-white hover:text-primary transition-colors hover:no-underline">
                  Comment puis-je recalibrer mon profil ou changer de classe ?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light space-y-2">
                  <p>
                    Il existe deux manières d&apos;ajuster votre profil comportemental :
                  </p>
                  <p>
                    <strong>1. Recalibrage Manuel (Quiz) :</strong> Vous pouvez repasser le quiz de diagnostic depuis l&apos;onglet Profil dans vos paramètres. Ce processus est gratuit et instantané pendant les premières 24 heures de votre compte. Au-delà, un délai de carence (cooldown) de 14 jours s&apos;applique entre chaque tentative pour éviter les changements intempestifs.
                  </p>
                  <p>
                    <strong>2. Évolution par l&apos;action :</strong> Votre radar n&apos;est pas figé. À mesure que vous validez des missions orientées vers d&apos;autres spécialités (par exemple, un Stratège réalisant des missions de Builder), vos scores de compétences s&apos;adaptent automatiquement et votre classe principale peut changer d&apos;elle-même.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-white/5 bg-zinc-900/20 px-6 py-2 rounded-2xl">
                <AccordionTrigger className="text-sm font-bold text-white hover:text-primary transition-colors hover:no-underline">
                  Que se passe-t-il si je quitte mon escouade ?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light">
                  Si vous quittez votre escouade, vous perdez les bonus de cohésion accumulés et l&apos;accès aux missions collectives en cours. Les membres restants voient également leur indicateur de cohésion temporairement affecté. Vous pouvez rejoindre une nouvelle escouade immédiatement après.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-white/5 bg-zinc-900/20 px-6 py-2 rounded-2xl">
                <AccordionTrigger className="text-sm font-bold text-white hover:text-primary transition-colors hover:no-underline">
                  Combien de temps prend la validation d&apos;une mission ?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light">
                  Le protocole d&apos;audit des Reviewers prend généralement entre 12 et 48 heures. Dès qu&apos;une action est prise sur votre soumission (approbation ou demande de révision), vous recevez une notification en temps réel sur votre console.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-white/5 bg-zinc-900/20 px-6 py-2 rounded-2xl">
                <AccordionTrigger className="text-sm font-bold text-white hover:text-primary transition-colors hover:no-underline">
                  Qu&apos;est-ce qu&apos;une Passkey et comment l&apos;utiliser ?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light space-y-2">
                  <p>
                    Les <strong className="text-white">Passkeys</strong> sont un nouveau standard de sécurité remplaçant les mots de passe par une authentification biométrique (FaceID, empreinte digitale) ou une clé matérielle.
                  </p>
                  <p>
                    Pour l&apos;activer, rendez-vous dans vos <strong className="text-white">Paramètres &gt; Sécurité</strong> et cliquez sur &quot;Ajouter une Passkey&quot;. C&apos;est la méthode la plus rapide et la plus sûre pour accéder à votre console HASHCODE.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-white/5 bg-zinc-900/20 px-6 py-2 rounded-2xl">
                <AccordionTrigger className="text-sm font-bold text-white hover:text-primary transition-colors hover:no-underline">
                  Puis-je lier mon compte Google à mon compte Email actuel ?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light">
                  Oui, grâce au <strong className="text-white">Account Linking</strong>, si vous vous connectez via Google avec la même adresse e-mail que votre compte existant, les deux seront automatiquement fusionnés. Vous pourrez ensuite utiliser indifféremment l&apos;un ou l&apos;autre pour vous authentifier.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
