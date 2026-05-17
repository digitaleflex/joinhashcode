import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Brain, 
  User as UserIcon, 
  Github, 
  Linkedin, 
  Globe, 
  Target, 
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Button } from "@/components/ui/button";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { MemberCard } from "@/components/ui/member-card";

export default async function DossierPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
    },
  });

  if (!user) return null;

  const quizResult = user.quizResults?.[0];
  const answers = quizResult?.answers as any || {};

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <BottomNav />
      
      <SidebarInset className="bg-background">
        <UserTopBar user={user} />
        
        <main className="flex-1 p-4 md:p-8 pb-(--bottom-nav-height) md:pb-8 overflow-y-auto scrollbar-none">
          <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Dossier */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em]">
                <FileText className="w-4 h-4" />
                Dossier de Talent Confidentiel
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                {user.name} <span className="text-primary/40 font-light">#{user.pseudo || "TALENT"}</span>
              </h1>
              <p className="text-muted-foreground max-w-xl italic">
                "{user.bio || "Aucune bio renseignée."}"
              </p>
            </div>
            
            <Badge variant="outline" className="h-10 px-6 border-primary/30 text-primary font-mono text-sm bg-primary/5">
              ID: {user.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personality & Quiz Results */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personality Card */}
              <Card className="border-primary/20 bg-card overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain className="w-32 h-32" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Brain className="w-5 h-5" />
                    Analyse de Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-white">
                      Type: <span className="text-primary">{quizResult?.profileType || "Non défini"}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      L'analyse comportementale indique un profil de type {quizResult?.profileType || "inconnu"}. 
                      Ce profil se distingue par ses capacités d'adaptation et son approche méthodique des problèmes complexes.
                    </p>
                  </div>

                  {/* Raw Answers (Simplified View) */}
                  {quizResult && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest border-b border-border/40 pb-2">Réponses au Protocole d'Onboarding</h4>
                      <div className="grid gap-3">
                        {Object.entries(answers).slice(0, 5).map(([key, value]: any) => (
                          <div key={key} className="flex justify-between items-center text-xs p-3 rounded-xl bg-background/40 border border-border/20">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-medium text-primary">{String(value)}</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-center text-muted-foreground pt-2">... et plusieurs autres points de données analysés.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tech Stack Card */}
              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-primary" />
                    Arsenal Technique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase text-muted-foreground">Domaines d'Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.domains?.length > 0 ? (
                        user.domains.map((d: string) => (
                          <Badge key={d} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{d}</Badge>
                        ))
                      ) : (
                        <span className="text-xs italic text-muted-foreground">Aucun domaine sélectionné.</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase text-muted-foreground">Outils & Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.tools?.length > 0 ? (
                        user.tools.map((t: string) => (
                          <Badge key={t} variant="outline" className="border-border/60">{t}</Badge>
                        ))
                      ) : (
                        <span className="text-xs italic text-muted-foreground">Aucun outil sélectionné.</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Identity & Metadata */}
            <div className="space-y-8">
              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase text-white">Statut Personnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Objectif Actuel</div>
                    <div className="text-sm font-bold text-primary">{user.mainObjective || "Non défini"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Situation</div>
                    <div className="text-sm font-medium text-white">{user.currentSituation || "Non défini"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Localisation</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      <Globe className="w-3 h-3 text-primary" />
                      {user.city || "N/A"}, {user.country || "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase text-white">Canaux Externes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={user.githubUrl || "#"} className="flex items-center justify-between p-3 rounded-xl bg-background/40 hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Github className="w-4 h-4" />
                      <span className="text-xs text-white">GitHub</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link href={user.linkedinUrl || "#"} className="flex items-center justify-between p-3 rounded-xl bg-background/40 hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" />
                      <span className="text-xs text-white">LinkedIn</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link href={user.twitterUrl || "#"} className="flex items-center justify-between p-3 rounded-xl bg-background/40 hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                      </svg>
                      <span className="text-xs text-white">X (Twitter)</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </CardContent>
              </Card>

              <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase font-mono tracking-tighter">Profil Vérifié</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Ce dossier constitue la base de ton habilitation HASHCODE. Complète tes missions pour augmenter ton rang technique.
                </p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11">
                  <Link href="/settings">Mettre à jour le dossier</Link>
                </Button>
              </div>

              {/* Carte membre */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Carte de Membre
                </p>
                <MemberCard
                  userId={user.id}
                  pseudo={user.pseudo ?? user.name}
                  memberNumber={user.memberNumber}
                  userClass={user.class}
                  level={user.level}
                  experience={user.experience}
                  createdAt={user.createdAt}
                />
              </div>
            </div>
          </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
