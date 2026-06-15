"use client"

import { useState } from "react"
import { 
  BookOpen, Activity, Users, Target, Zap, HelpCircle, CheckCircle2, AlertCircle
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EvolutionRadar } from "@/components/dashboard/evolution-radar"

export function GuideClient() {
  const [activeTab, setActiveTab] = useState("evolution")

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

      {/* Tabs Container */}
      <Tabs defaultValue="evolution" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-zinc-900/80 border border-white/5 p-1 h-auto flex flex-wrap gap-1 rounded-2xl w-full md:w-max">
          <TabsTrigger value="evolution" className="h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            <Activity className="size-3.5 mr-1.5" /> Évolution
          </TabsTrigger>
          <TabsTrigger value="squads" className="h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            <Users className="size-3.5 mr-1.5" /> Escouades
          </TabsTrigger>
          <TabsTrigger value="missions" className="h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            <Target className="size-3.5 mr-1.5" /> Missions
          </TabsTrigger>
          <TabsTrigger value="cohesion" className="h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            <Zap className="size-3.5 mr-1.5" /> Cohésion & Streaks
          </TabsTrigger>
        </TabsList>

        {/* --- TAB CONTENT: EVOLUTION --- */}
        <TabsContent value="evolution" className="space-y-6 animate-in fade-in duration-300">
          {/* Annotated Radar HUD Section */}
          <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
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
                    <strong className="text-white">3. Force principale :</strong> Ton rôle dominant actuel est marqué d&apos;un badge spécial &quot;Force principale&quot;. Si un second rôle s&apos;approche à moins de 15%, ton badge se transforme en profil hybride.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white">Le Moteur d&apos;Évolution</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Chaque agent possède un profil psychométrique unique basé sur 4 piliers comportementaux fondamentaux.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-blue-500/10 bg-blue-500/3 rounded-2xl space-y-2">
                    <h4 className="text-sm font-black text-blue-400 uppercase font-mono">Builder</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      L&apos;artisan technique. Il concrétise les idées en lignes de code solides, configure les infrastructures et assure la viabilité technique des applications.
                    </p>
                  </div>
                  <div className="p-4 border border-purple-500/10 bg-purple-500/3 rounded-2xl space-y-2">
                    <h4 className="text-sm font-black text-purple-400 uppercase font-mono">Créateur</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Le garant de l&apos;expérience. Il soigne l&apos;ergonomie, conçoit des designs premium, peaufine le copywriting et s&apos;assure que l&apos;interface &quot;wow&quot; l&apos;utilisateur.
                    </p>
                  </div>
                  <div className="p-4 border border-amber-500/10 bg-amber-500/3 rounded-2xl space-y-2">
                    <h4 className="text-sm font-black text-amber-400 uppercase font-mono">Stratège</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      L&apos;analyste méthodique. Il aligne le projet avec les besoins réels du marché, définit les roadmaps, mesure la performance et pilote la viabilité produit.
                    </p>
                  </div>
                  <div className="p-4 border border-emerald-500/10 bg-emerald-500/3 rounded-2xl space-y-2">
                    <h4 className="text-sm font-black text-emerald-400 uppercase font-mono">Catalyseur</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Le ciment de la communauté. Il facilite l&apos;entraide au sein de l&apos;escouade, gère la communication, fédère le public et propage les solutions construites.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">Profils Hybrides</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Si votre évaluation révèle deux scores dominants très proches (écart inférieur à 15%), vous débloquez un profil hybride (ex : <span className="text-[#C5F441] font-bold">Builder × Créateur</span>). Les profils hybrides sont de véritables couteaux suisses technologiques dans l&apos;écosystème.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Indicateurs Avancés</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white uppercase font-mono">Vibrancy (Vibrance)</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Mesure de l&apos;énergie et de l&apos;activité récente de l&apos;agent. Elle diminue légèrement en cas d&apos;inactivité et augmente à chaque mission accomplie.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white uppercase font-mono">Confidence (Confiance)</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Déterminée par votre rigueur de livraison et la régularité de vos validations de tâches. Un indice élevé rassure les partenaires potentiels.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white uppercase font-mono">Drift (Dérive)</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Calcule l&apos;écart d&apos;alignement entre votre profil psychométrique déclaré et le type réel de missions que vous accomplissez.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 text-xs text-zinc-400 leading-relaxed font-light">
                  <span className="text-primary font-bold">Conseil :</span> Complétez votre profil avec vos réseaux et compétences pour rendre votre dossier public attractif et trouver plus facilement une escouade complémentaire.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB CONTENT: SQUADS --- */}
        <TabsContent value="squads" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold uppercase text-white">Le Protocole d&apos;Escouade</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-light">
                  Une escouade est une équipe complémentaire unie pour s&apos;entraider et valider des défis de groupe.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">1</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Taille Limitée à 5 Membres</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Cinq est la taille optimale pour maximiser la réactivité et la vitesse d&apos;exécution d&apos;un projet sans créer de lenteurs administratives.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">2</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Équilibre Cognitif Requis</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Pour que l&apos;escouade soit performante, elle doit réunir des profils différents. Le système interdit d&apos;avoir plus de **2 représentants de la même classe** (par exemple, pas plus de 2 Builders) afin d&apos;éviter les goulots d&apos;étranglement techniques ou créatifs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary shrink-0">3</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Régulation Automatique</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Lorsque vous postulez ou rejoignez une escouade via un lien d&apos;invitation, notre moteur de régulation valide automatiquement votre profil. S&apos;il y a déjà une sur-représentation de votre classe, l&apos;intégration est suspendue et le système vous suggère des escouades en manque de votre spécialisation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <div className="p-4.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h5 className="text-xs font-mono font-bold text-white uppercase">Synergie Builder-Créateur</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                      L&apos;alliance directe de la conception esthétique et du code technique. Assure des livraisons rapides et des interfaces léchées.
                    </p>
                  </div>
                  <div className="p-4.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h5 className="text-xs font-mono font-bold text-white uppercase">Synergie Stratège-Catalyseur</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                      Le moteur de croissance. Calcule le meilleur angle produit pendant que le catalyseur s&apos;occupe de propager et fédérer les utilisateurs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Avantages Collectifs</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="space-y-3.5">
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>Accès aux missions coopératives (Missions Co-op) exclusives à XP élevée.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>Multiplicateur d&apos;XP de groupe en fonction de l&apos;indice de cohésion de la squad.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>Canal de chat privé et forum d&apos;échange d&apos;escouade.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>Historique des contributions collectives sur le profil public.</span>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-400 leading-relaxed">
                  <AlertCircle className="size-4 mb-2" />
                  **Alerte déséquilibre** : Une escouade avec 3 profils identiques perd une partie de son bonus de cohésion et voit sa compatibilité diminuer sous le seuil d&apos;efficacité.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB CONTENT: MISSIONS --- */}
        <TabsContent value="missions" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6">
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
                  <h4 className="text-sm font-bold text-white">Comment valider une mission ?</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Pour chaque mission, vous devez soumettre une **preuve d&apos;exécution** (ex : lien d&apos;un repository GitHub, capture d&apos;écran d&apos;une maquette, lien de déploiement). La preuve est ensuite envoyée dans la file d&apos;attente des **Reviewers** pour être analysée et approuvée.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-mono font-bold text-primary uppercase">Devenir Reviewer</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6 text-xs text-zinc-400 leading-relaxed font-light">
                <p>
                  Les Reviewers sont des agents de confiance habilités à valider les preuves de missions soumises par la communauté.
                </p>
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-2.5">
                  <div className="font-bold text-white font-mono uppercase text-[10px]">Conditions d&apos;habilitation :</div>
                  <ul className="space-y-1.5 list-disc pl-4 text-zinc-500 font-mono text-[10px]">
                    <li>Être au moins Niveau 2.</li>
                    <li>Avoir validé au moins 3 missions.</li>
                  </ul>
                </div>
                <p>
                  Une fois éligible, l&apos;onglet « Reviewer » apparaît dans votre barre latérale, vous permettant de guider les nouveaux agents et de gagner des bonus d&apos;XP supplémentaires.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB CONTENT: COHESION --- */}
        <TabsContent value="cohesion" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl lg:col-span-2 p-6 space-y-6">
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

            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl p-6 space-y-6">
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
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <div className="border-t border-white/5 pt-10 space-y-6">
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
              Puis-je changer de classe de profil ?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-zinc-400 leading-relaxed pt-2 font-light">
              Oui. Votre classe initiale est déterminée par votre quiz. Cependant, au fur et à mesure que vous validez des missions de spécialisation d&apos;autres domaines, vos scores évoluent. Votre classe active s&apos;ajustera automatiquement en fonction de vos scores réels de livraison.
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
        </Accordion>
      </div>
    </div>
  )
}
