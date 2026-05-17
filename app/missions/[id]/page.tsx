import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft, CheckCircle2, Award, ExternalLink, Shield, Rocket, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { MissionSubmissionForm } from "./mission-submission-form"

export default async function MissionBriefingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/signin")
  }

  const [dbUser, mission] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        missionSubmissions: {
          where: { missionId: id },
        },
      },
    }),
    prisma.mission.findUnique({
      where: { id },
    }),
  ])

  if (!dbUser) {
    redirect("/signin")
  }

  if (!mission) {
    notFound()
  }

  const submission = dbUser.missionSubmissions[0]
  const isCompleted = submission?.status === "APPROVED"
  const isPending = submission?.status === "PENDING"

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} />
      <BottomNav />

      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />

        <main className="flex-1 p-4 md:p-8 pb-(--bottom-nav-height) md:pb-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/missions"
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              RETOUR AUX MISSIONS
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase font-mono tracking-widest text-[10px]">
                    {mission.category}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground font-mono text-[10px]">
                    NIVEAU {mission.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{mission.title}</h1>
              </div>
              <div className="flex items-center gap-4 bg-card/50 border border-border/50 p-4 rounded-2xl">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Récompense_</div>
                  <div className="text-2xl font-bold text-primary">+{mission.xp} XP</div>
                </div>
                <div className="h-10 w-[1px] bg-border/50" />
                <Award className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Mission Briefing */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Shield className="w-5 h-5" />
                    <h2 className="text-xl font-bold uppercase tracking-tight font-mono">Briefing_</h2>
                  </div>
                  <Card className="bg-card/30 border-border/40 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                        {mission.fullBriefing || mission.description}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Deliverables Checklist */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Rocket className="w-5 h-5" />
                    <h2 className="text-xl font-bold uppercase tracking-tight font-mono">Livrables Attendus_</h2>
                  </div>
                  <div className="grid gap-3">
                    {mission.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card/20 border border-border/40 group hover:border-primary/30 transition-colors"
                      >
                        <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-zinc-300">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* GitHub Instructions */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-300/80 leading-relaxed">
                    Si ton dépôt GitHub est privé, invite <span className="font-mono text-blue-400">admin@joinhashcode.com</span> pour que nous puissions valider ton travail.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Status Card */}
                <Card className="bg-card/40 border-primary/20 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-24 h-24" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Statut de la Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    {isCompleted ? (
                      <div className="flex flex-col items-center text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        <div>
                          <h3 className="font-bold text-emerald-500">MISSION VALIDÉE</h3>
                          <p className="text-xs text-emerald-400/70 mt-1">Tes compétences ont été reconnues par le système.</p>
                        </div>
                      </div>
                    ) : isPending ? (
                      <div className="flex flex-col items-center text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl gap-3">
                        <Rocket className="w-12 h-12 text-yellow-500 animate-pulse" />
                        <div>
                          <h3 className="font-bold text-yellow-500">EN COURS DE REVUE</h3>
                          <p className="text-xs text-yellow-400/70 mt-1">Nos opérateurs analysent ta transmission.</p>
                        </div>
                      </div>
                    ) : (
                      <MissionSubmissionForm 
                        missionId={mission.id} 
                        submissionMethod={mission.submissionMethod}
                      />
                    )}
                    
                    <Separator className="bg-border/40" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground uppercase font-mono">Temps estimé_</span>
                        <span className="text-zinc-300 font-mono">{mission.duration || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground uppercase font-mono">Méthode_</span>
                        <span className="text-zinc-300 font-mono">{mission.submissionMethod}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="bg-card/20 border-border/40">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Pré-requis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mission.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
