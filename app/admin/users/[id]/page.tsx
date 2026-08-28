import Image from 'next/image';
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { questions } from "@/lib/questions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRowActions, type UserRowActionsProps } from "@/components/admin/UserRowActions"
import { 
  ChevronLeft, 
  BrainCircuit, 
  Target, 
  Zap, 
  BarChart3, 
  Mail, 
  Shield, 
  Clock, 
  Globe,
  Compass,
  Briefcase,
  AlertCircle,
  Sparkles,
  Layers,
  BookOpen,
  Users,
  Flame,
  ScrollText
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserDossierPage({ params }: PageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      beta: true,
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      missionSubmissions: {
        include: { mission: true },
        orderBy: { createdAt: 'desc' }
      },
      members: {
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      pseudo: true,
                      image: true,
                      class: true,
                      level: true,
                    },
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  if (!user) notFound()

  const activeOrg = user.members?.[0]?.organization ?? null;
  
  // Fetch user's own activity log
  const userActivityLogs = await prisma.activityLog.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  // Fetch squad activity logs if in a squad
  let squadMembersLogs: Array<{ id: string; action: string; createdAt: Date; user: { name: string; image: string | null; pseudo: string | null } | null }> = [];
  if (activeOrg) {
    const squadMemberIds = activeOrg.members.map((m: { userId: string }) => m.userId);
    squadMembersLogs = await prisma.activityLog.findMany({
      where: {
        userId: { in: squadMemberIds },
        action: {
          in: ["MISSION_SUBMITTED", "MISSION_APPROVED", "SQUAD_CREATED", "SQUAD_JOINED", "LEVEL_UP", "CHECKIN_COMPLETED"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            pseudo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  const quizResult = user.quizResults[0]
  const answers = quizResult?.answers as Record<number, string> || {}
  
  const blockerLabels: Record<string, string> = {
    skills: "Manque de compétences techniques",
    network: "Manque de visibilité / réseau",
    clarity: "Manque de clarté sur ma direction",
    time: "Manque de temps / organisation",
    resources: "Manque de ressources / financement",
    other: "Autre"
  }

  const focusLabels: Record<string, string> = {
    tech: "Tech / Code",
    design: "Design / UI-UX",
    business: "Business / Stratégie",
    content: "Contenu / Vidéo",
    education: "Éducation / Formation",
    health: "Santé / Bien-être",
    fintech: "Fintech / Finance",
    ecology: "Écologie / Impact",
    community: "Communauté / Réseau",
    other: "Autre"
  }

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  }

  const userClassColor = user.class ? (profileColors[user.class.toLowerCase()] || "#fff") : "#fff"

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-primary transition-colors uppercase tracking-wider group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/api/admin/users/${id}/export?format=json`}
            download
            className="h-8 px-3 inline-flex items-center text-3xs font-mono font-black uppercase tracking-wider border border-zinc-700 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors rounded"
          >
            Export JSON
          </a>
          <a
            href={`/api/admin/users/${id}/export?format=zip`}
            download
            className="h-8 px-3 inline-flex items-center text-3xs font-mono font-black uppercase tracking-wider border border-zinc-700 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors rounded"
          >
            Export ZIP
          </a>
          <UserRowActions user={user as UserRowActionsProps["user"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity & Actions */}
        <div className="space-y-8">
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <Avatar className="h-24 w-24 border-2 border-white/10 relative">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-zinc-800 text-2xl font-bold text-primary">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-white tracking-tight">{user.name}</CardTitle>
              <CardDescription className="font-mono text-xs uppercase tracking-wider text-zinc-500 flex items-center justify-center gap-2 mt-1">
                 {user.pseudo ? `@${user.pseudo}` : "ID inconnu"} · LVL {user.level ?? 1}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono uppercase text-zinc-600 leading-none mb-1">Email</p>
                    <p className="text-sm text-zinc-300 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Shield className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-xs font-mono uppercase text-zinc-600 leading-none mb-1">Rôle Système</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-300">{user.role}</p>
                       {user.banned && <Badge variant="destructive" className="text-3xs h-4">BANNI</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Globe className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-xs font-mono uppercase text-zinc-600 leading-none mb-1">Origine</p>
                    <p className="text-sm text-zinc-300">{user.country || "Non spécifié"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-xs font-mono uppercase text-zinc-600 leading-none mb-1">Membre depuis</p>
                    <p className="text-sm text-zinc-300">{new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 px-1">Classe de Profil</p>
                {user.class ? (
                  <div 
                    className="p-4 rounded-2xl border flex items-center justify-between"
                    style={{ borderColor: `${userClassColor}30`, background: `${userClassColor}05` }}
                  >
                    <span className="font-bold text-lg uppercase tracking-tighter" style={{ color: userClassColor }}>{user.class}</span>
                    <Zap className="h-5 w-5" style={{ color: userClassColor }} />
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-center italic text-zinc-600 text-sm">
                    Quiz non effectué
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Stats Card */}
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-mono uppercase tracking-wide text-primary flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Vecteurs de Compétences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Builder", value: user.builderScore ?? 0, color: profileColors.builder },
                { label: "Creator", value: user.creatorScore ?? 0, color: profileColors.creator },
                { label: "Strategist", value: user.strategistScore ?? 0, color: profileColors.strategist },
                { label: "Catalyst", value: user.catalystScore ?? 0, color: profileColors.catalyst },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between items-end text-xs font-mono">
                    <span className="text-zinc-400 uppercase tracking-wide">{stat.label}</span>
                    <span style={{ color: stat.color }}>{stat.value} PTS</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (stat.value / 50) * 100)}%`, background: stat.color }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-xs font-mono text-zinc-600 uppercase mb-1">Missions</p>
                   <p className="text-xl font-bold text-white">{user.missionsCompletedCount ?? 0}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-xs font-mono text-zinc-600 uppercase mb-1">XP Total</p>
                   <p className="text-xl font-bold text-primary">{user.experience ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding & Context Card */}
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-mono uppercase tracking-wide text-primary flex items-center gap-2">
                <Compass className="h-4 w-4" /> Contexte & Objectifs
              </CardTitle>
              <CardDescription className="text-zinc-500 font-mono text-3xs uppercase tracking-wider">
                Données d&apos;onboarding & post-quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Situation Actuelle */}
              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-zinc-600" /> Situation Actuelle
                </p>
                <p className="text-sm text-zinc-200 font-medium pl-4">
                  {user.currentSituation || "Non spécifiée"}
                </p>
              </div>

              {/* Objectif Principal */}
              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-zinc-600" /> Objectif Principal
                </p>
                <p className="text-sm text-zinc-200 font-medium pl-4">
                  {user.mainObjective || "Non spécifié"}
                </p>
              </div>

              {/* Objectifs Secondaires */}
              {user.profile?.secondaryObjectives && user.profile.secondaryObjectives.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 text-zinc-600" /> Objectifs Secondaires
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-4">
                    {user.profile!.secondaryObjectives.map((obj) => (
                      <Badge key={obj} variant="secondary" className="text-xs bg-zinc-800 text-zinc-300 border-white/5 font-normal">
                        {obj}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Principal Obstacle */}
              {user.profile?.mainBlocker && (
                <div className="space-y-1">
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3 text-zinc-600" /> Obstacle Principal
                  </p>
                  <p className="text-sm text-zinc-200 font-medium pl-4">
                    {blockerLabels[user.profile!.mainBlocker] || user.profile!.mainBlocker}
                  </p>
                </div>
              )}

              {/* Domaines de Focus */}
              {user.profile?.currentFocus && user.profile.currentFocus.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-zinc-600" /> Domaines de Focus
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-4">
                    {user.profile!.currentFocus.map((foc) => (
                      <Badge key={foc} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 font-mono uppercase tracking-wider font-bold">
                        {focusLabels[foc] || foc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rêve à 12 Mois */}
              {user.profile?.dreamStatement && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-zinc-600" /> Rêve à 12 Mois
                    </p>
                    <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 relative overflow-hidden italic text-xs text-zinc-400 font-light leading-relaxed pl-4">
                      &ldquo;{user.profile!.dreamStatement}&rdquo;
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quiz Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6 pb-6">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-primary" /> Analyse du Quiz Initial
                </CardTitle>
                <CardDescription className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-wider">
                  {quizResult ? `Effectué le ${new Date(quizResult.createdAt).toLocaleDateString('fr-FR')}` : "Données non disponibles"}
                </CardDescription>
              </div>
              {quizResult && (
                <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/30">
                  {Object.keys(answers).length} RÉPONSES
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {!quizResult ? (
                <div className="py-20 text-center space-y-4">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <Target className="h-8 w-8 text-zinc-700" />
                  </div>
                  <p className="text-zinc-500 font-mono text-sm">Cet utilisateur n'a pas encore passé le quiz d'évolution.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {questions.map((q, idx) => {
                    const userAnswerValue = answers[q.id]
                    const selectedOption = q.options.find(o => o.value === userAnswerValue)
                    
                    return (
                      <div key={q.id} className="space-y-4 relative pl-8 border-l border-white/5 last:border-0">
                        <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-800 border border-white/10" />
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Question {idx + 1} · {q.type}</p>
                          <h3 className="text-lg font-bold text-white leading-snug italic">&ldquo;{q.text}&rdquo;</h3>
                        </div>
                        
                        <div className="grid gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isUserChoice = opt.value === userAnswerValue
                            const optColor = profileColors[opt.value.toLowerCase()] || "#fff"
                            
                            return (
                              <div 
                                key={oIdx}
                                className={`
                                  p-4 rounded-xl border transition-all flex items-center justify-between
                                  ${isUserChoice 
                                    ? "bg-zinc-800/80 border-white/10" 
                                    : "bg-transparent border-white/[0.02] opacity-40"}
                                `}
                              >
                                <span className={`text-sm ${isUserChoice ? "text-zinc-100 font-medium" : "text-zinc-500"}`}>
                                  {opt.text}
                                </span>
                                {isUserChoice && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-3xs font-mono uppercase tracking-wider font-bold" style={{ color: optColor }}>
                                      +{q.weight * opt.score} {opt.value}
                                    </span>
                                    <div className="h-2 w-2 rounded-full" style={{ background: optColor }} />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rapport de Cohésion de l'Escouade (Squad Co-Evolution) */}
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5 mb-6 pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" /> Rapport de Cohésion de l'Escouade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeOrg ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Roster list */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white uppercase tracking-tighter italic text-left">
                        L'équipage : {activeOrg.name}
                      </h3>
                      <p className="text-xs font-mono text-zinc-500 uppercase text-left">
                        Roster de co-évolution pluridisciplinaire
                      </p>
                    </div>
                    
                    <div className="grid gap-3">
                      {activeOrg.members.map((member: { id: string; role: string; user: { class?: string | null; image?: string | null; name: string; pseudo?: string | null; level?: number | null } }) => {
                        const cl = (member.user.class || "builder").toLowerCase();
                        return (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="relative size-9 bg-zinc-950 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center font-mono font-bold text-xs uppercase text-zinc-500">
                                {member.user.image ? (
                                  <Image src={member.user.image} alt={member.user.name} width={36} height={36} className="w-full h-full object-cover" onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = "none"
                                  }} />
                                ) : (
                                  member.user.name.charAt(0)
                                )}
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-bold text-white uppercase">{member.user.pseudo || member.user.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs-sm font-mono text-zinc-500 uppercase tracking-widest">Classe :</span>
                                  <span className="text-xs-sm font-mono font-black uppercase text-primary">{cl}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-3xs font-mono text-zinc-500 uppercase">Niveau {member.user.level || 1}</span>
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-md border text-xs-sm font-mono font-bold uppercase tracking-wider",
                                member.role === "owner" || member.role === "LEADER" ? "text-primary bg-primary/10 border-primary/20" : "text-zinc-400 bg-white/5 border-white/5"
                              )}>
                                {member.role === "owner" || member.role === "LEADER" ? "Chef" : "Membre"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Cohesion gauge & recent logs */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5 text-left">
                          <div className="text-xs-sm font-mono text-zinc-500 uppercase">Cohésion Active</div>
                          <div className="text-xl font-black text-white font-mono italic">{(activeOrg.cohesionScore * 100).toFixed(0)}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs-sm font-mono text-zinc-500 uppercase">Streak</div>
                          <div className="text-xl font-black text-amber-400 font-mono flex items-center justify-end gap-1.5">
                            <Flame className="size-4 text-amber-400 fill-amber-400" />
                            {activeOrg.streakCount || 0}j
                          </div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all animate-pulse" style={{ width: `${activeOrg.cohesionScore * 100}%` }} />
                      </div>
                    </div>
                    
                    {/* Squad logs */}
                    <div className="space-y-3 text-left">
                      <h4 className="text-3xs font-mono text-zinc-500 uppercase font-black">Activité du Squad</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-1">
                        {squadMembersLogs.length > 0 ? (
                          squadMembersLogs.map((log) => (
                            <div key={log.id} className="text-3xs font-mono text-zinc-400 leading-normal flex gap-2">
                              <span className="text-primary">➜</span>
                              <div>
                                <span className="text-white font-bold">{log.user?.pseudo || log.user?.name}</span> : {log.action.replace(/_/g, ' ')}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-3xs text-zinc-600 font-mono italic">-- Aucun log d'activité d'escouade récent --</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 opacity-30">
                    <Users className="h-8 w-8 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 font-mono text-xs uppercase">Aucune escouade active détectée</p>
                    <p className="text-sm text-zinc-400 font-bold uppercase tracking-tight italic leading-tight">Cet utilisateur n'a pas encore rejoint d'escouade.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Missions History Card */}
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5 mb-6 pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" /> Historique des Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.missionSubmissions.length === 0 ? (
                <p className="text-zinc-600 font-mono text-sm py-8 text-center italic">Aucune mission soumise à ce jour.</p>
              ) : (
                <div className="space-y-4">
                  {user.missionSubmissions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{sub.mission.title}</p>
                          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            Soumis le {new Date(sub.createdAt).toLocaleDateString()} · {sub.status}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-3xs uppercase tracking-wider ${
                          sub.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          sub.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline Card */}
          <Card className="bg-zinc-900/50 border-white/5">
            <CardHeader className="border-b border-white/5 mb-6 pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <ScrollText className="h-6 w-6 text-primary" /> Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userActivityLogs.length === 0 ? (
                <p className="text-zinc-600 font-mono text-sm py-8 text-center italic">Aucune activité enregistrée.</p>
              ) : (
                <div className="space-y-0">
                  {userActivityLogs.map((log, i) => (
                    <div key={log.id} className="flex gap-4 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`size-2 rounded-full mt-1.5 ${
                          log.action.startsWith("ADMIN_") ? "bg-primary" :
                          log.action.startsWith("MISSION_") ? "bg-amber-500" :
                          log.action.startsWith("SQUAD_") ? "bg-violet-500" :
                          "bg-zinc-600"
                        }`} />
                        {i < userActivityLogs.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            {log.action.replace(/_/g, " ")}
                          </span>
                          <span className="text-3xs font-mono text-zinc-600">
                            {new Date(log.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        {log.metadata && (
                          <p className="text-xs font-mono text-zinc-500 mt-0.5 truncate">{String(log.metadata)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
