import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { questions } from "@/lib/questions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserRowActions } from "@/components/admin/UserRowActions"
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
  User as UserIcon,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { CLASS_COLORS } from "@/lib/member-card-constants"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserDossierPage({ params }: PageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      missionSubmissions: {
        include: { mission: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) notFound()

  const quizResult = user.quizResults[0]
  const answers = quizResult?.answers as Record<number, string> || {}
  
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
        <UserRowActions user={user as any} />
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
                {user.pseudo ? `@${user.pseudo}` : "ID NEURONAL"} · LVL {user.level}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono uppercase text-zinc-600 leading-none mb-1">Email</p>
                    <p className="text-sm text-zinc-300 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Shield className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-600 leading-none mb-1">Rôle Système</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-300">{user.role}</p>
                      {user.banned && <Badge variant="destructive" className="text-[9px] h-4">BANNI</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Globe className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-600 leading-none mb-1">Origine</p>
                    <p className="text-sm text-zinc-300">{user.country || "Non spécifié"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-600 leading-none mb-1">Membre depuis</p>
                    <p className="text-sm text-zinc-300">{new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">Classe de Profil</p>
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
                { label: "Builder", value: user.builderScore, color: profileColors.builder },
                { label: "Creator", value: user.creatorScore, color: profileColors.creator },
                { label: "Strategist", value: user.strategistScore, color: profileColors.strategist },
                { label: "Catalyst", value: user.catalystScore, color: profileColors.catalyst },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between items-end text-[10px] font-mono">
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
                  <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Missions</p>
                  <p className="text-xl font-bold text-white">{user.missionsCompletedCount}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">XP Total</p>
                  <p className="text-xl font-bold text-primary">{user.experience}</p>
                </div>
              </div>
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
                <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/30">
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
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Question {idx + 1} · {q.type}</p>
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
                                    <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: optColor }}>
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
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                            Soumis le {new Date(sub.createdAt).toLocaleDateString()} · {sub.status}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-[9px] uppercase tracking-wider ${
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
        </div>
      </div>
    </div>
  )
}
