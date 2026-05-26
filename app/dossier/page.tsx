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
  Medal,
  ChevronRight,
  Fingerprint,
  Activity,
  Cpu,
  Flame,
  TrendingUp,
  History,
  Compass,
  Users,
  Share2,
  Download
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
      missionSubmissions: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          mission: true
        }
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      members: {
        include: {
          organization: true
        }
      }
    },
  });

  if (!user) return null;

  const activeOrgMember = user.members.find(m => m.organizationId === session.session.activeOrganizationId) || user.members[0];
  const activeOrg = activeOrgMember?.organization;

  const quizResult = user.quizResults?.[0];
  const answers = quizResult?.answers as any || {};

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={user} />
        
        <main className="flex-1 p-4 md:p-10 pb-(--bottom-nav-height) md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header Dossier - Ultra Tactical */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Fingerprint className="size-3.5 text-primary" />
                        <span className="text-[10px] font-mono font-black uppercase text-primary">Dossier_Confidentiel_v2.1</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                        {user.name.split(' ')[0]} <span className="text-primary italic">.Data</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="font-mono text-[10px] border-white/10 text-zinc-500 uppercase tracking-wider">
                            Ref_System: {user.pseudo || "TALENT_IDENTIFIED"}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                            <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-wider">Status: Actif</span>
                        </div>
                        {user.technicalLevel && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                              <span className="text-[9px] font-mono font-black text-primary uppercase tracking-tighter">CLASSE: {user.technicalLevel}</span>
                          </div>
                        )}
                        {user.currentStreak > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
                              <Flame className="size-3 text-orange-500" />
                              <span className="text-[10px] font-mono font-bold text-orange-500">{user.currentStreak}D STREAK</span>
                          </div>
                        )}
                    </div>
                    <p className="text-zinc-500 max-w-xl italic text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
                        &quot;{user.bio || "Le silence est parfois la meilleure signature."}&quot;
                    </p>
                </div>
                
                <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Habilitation_ID</div>
                        <div className="text-xl font-black text-white font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            {user.id.slice(0, 12).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* Neuro-Analysis Results */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Brain className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-tight text-white">Analyse de Profil</h2>
                        </div>
                        
                        <Card className="glass-card overflow-hidden relative group rounded-[2.5rem]">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Cpu className="size-48" />
                            </div>
                            <CardContent className="p-8 sm:p-10 space-y-10 relative">
                                <div className="p-8 rounded-[2rem] bg-linear-to-br from-primary/10 via-transparent to-transparent border border-primary/20 shadow-inner">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-mono text-primary font-black uppercase">Vecteur_Dominant</span>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                                {quizResult?.profileType || "CALIBRATION_PENDING"}
                                            </h3>
                                        </div>
                                        <Badge className="bg-primary text-black font-black text-[10px] px-4 py-1.5 rounded-lg uppercase tracking-wider shadow-[0_0_20px_#C5F441]">
                                            Expertise_V1
                                        </Badge>
                                    </div>
                                    <p className="text-zinc-400 text-base leading-relaxed font-light">
                                        L&apos;analyse comportementale profonde révèle un profil de type <span className="text-white font-bold">{quizResult?.profileType || "inconnu"}</span>. 
                                        Tes schémas de décision montrent une prédisposition naturelle pour le build stratégique et l&apos;optimisation de systèmes complexes.
                                    </p>
                                </div>

                                {/* Answers Grid */}
                                {quizResult && (
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-3">
                                            Points_de_Données_Clés
                                            <div className="h-px bg-white/5 flex-1" />
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(answers).slice(0, 6).map(([key, value]: any) => (
                                                <div key={key} className="flex flex-col gap-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group/item">
                                                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider group-hover/item:text-primary transition-colors">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className="text-sm font-bold text-zinc-300 uppercase tracking-tight truncate">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider animate-pulse">
                                                -- Synchronisation de 42 autres vecteurs comportementaux --
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        </div>

                        {/* Badges & Distinctions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Medal className="size-5 text-primary" />
                                <h2 className="text-xl font-black uppercase tracking-tight text-white">Distinctions Système</h2>
                            </div>
                            
                            <Card className="glass-card rounded-[2rem] p-8">
                                <div className="flex flex-wrap gap-4">
                                    {user.badges.length > 0 ? (
                                        user.badges.map((badge: string) => (
                                            <Badge key={badge} className="bg-primary/20 text-primary border-primary/30 text-[11px] font-black uppercase py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(197,244,65,0.1)]">
                                                {badge}
                                            </Badge>
                                        ))
                                    ) : (
                                        <div className="w-full py-6 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">[ AUCUN_INSIGNE_DÉTECTÉ ]</span>
                                            <p className="text-[9px] text-zinc-700 font-mono mt-2 italic">-- En attente de faits d'armes remarquables --</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Evolution Engine & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="size-5 text-primary" />
                                <h2 className="text-xl font-black uppercase tracking-tight text-white">Missions Récentes</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {user.missionSubmissions.length > 0 ? (
                                    user.missionSubmissions.map((sub: any) => (
                                        <div key={sub.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-mono text-zinc-500 uppercase">{sub.mission.category}</div>
                                                <div className="text-sm font-bold text-white uppercase group-hover:text-primary transition-colors">{sub.mission.title}</div>
                                            </div>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-mono border-white/5",
                                                sub.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"
                                            )}>
                                                {sub.status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/5 text-center">
                                        <p className="text-[10px] font-mono text-zinc-600 uppercase">Aucune mission enregistrée</p>
                                        <Button asChild variant="link" className="text-primary text-[10px] uppercase font-black mt-2">
                                            <Link href="/missions">Initialiser la première mission</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <History className="size-5 text-primary" />
                                <h2 className="text-xl font-black uppercase tracking-tight text-white">Logs Tactiques</h2>
                            </div>
                            
                            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                                {user.activityLogs.length > 0 ? (
                                    user.activityLogs.map((log: any) => (
                                        <div key={log.id} className="flex gap-4 relative">
                                            <div className="size-[23px] rounded-full bg-background border border-white/10 flex items-center justify-center shrink-0 z-10">
                                                <div className="size-1 rounded-full bg-primary" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-[11px] text-zinc-300 font-bold uppercase tracking-tight">{log.action.replace(/_/g, ' ')}</div>
                                                <div className="text-[9px] font-mono text-zinc-600 uppercase">
                                                    {new Date(log.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] font-mono text-zinc-600 uppercase pl-8 italic">Flux de données vide</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Evolution Engine Metrics */}
                    <div className="p-8 rounded-[2.5rem] bg-linear-to-r from-primary/5 to-transparent border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="size-3.5 text-primary" />
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">Vibrancy_Level</span>
                                </div>
                                <div className="text-2xl font-black text-white font-mono italic">{(user.behavioralVibrancy as any)?.score || "0.85"}<span className="text-primary text-xs ml-1">%</span></div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary shadow-[0_0_10px_#C5F441]" style={{ width: `${((user.behavioralVibrancy as any)?.score || 0.85) * 100}%` }} />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Compass className="size-3.5 text-zinc-400" />
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">Profile_Drift</span>
                                </div>
                                <div className="text-2xl font-black text-white font-mono italic">{user.profileDrift.toFixed(2)}<span className="text-zinc-600 text-xs ml-1">Δ</span></div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-400" style={{ width: `${Math.min(user.profileDrift * 100, 100)}%` }} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">Confidence_Index</span>
                                </div>
                                <div className="text-2xl font-black text-white font-mono italic">{(user.confidenceScore * 100).toFixed(0)}<span className="text-emerald-500 text-xs ml-1">%</span></div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${user.confidenceScore * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Arsenal */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-tight text-white">Arsenal Technique</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="glass-card rounded-[2rem] p-8 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-mono uppercase text-primary font-black">Domaines_D_Expertise</h4>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {user.domains?.length > 0 ? (
                                            user.domains.map((d: string) => (
                                                <Badge key={d} className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase py-1 px-3">
                                                    {d}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs italic text-zinc-600 font-mono">-- Aucun domaine détecté --</span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                            
                            <Card className="glass-card rounded-[2rem] p-8 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-mono uppercase text-zinc-500 font-black">Outils_&_Technologies</h4>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {user.tools?.length > 0 ? (
                                            user.tools.map((t: string) => (
                                                <Badge key={t} variant="outline" className="border-white/10 text-zinc-400 text-[10px] font-bold uppercase py-1 px-3">
                                                    {t}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs italic text-zinc-600 font-mono">-- Arsenal vide --</span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="lg:col-span-4 space-y-12">
                    
                    {/* Member Card - Essential piece */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                            Carte_Habilitation
                            <div className="h-px bg-white/5 flex-1" />
                        </p>
                        <MemberCard
                            userId={user.id}
                            pseudo={user.pseudo ?? user.name}
                            memberNumber={user.memberNumber}
                            userClass={user.class}
                            level={user.level}
                            experience={user.experience}
                            createdAt={user.createdAt}
                            confidenceScore={user.confidenceScore}
                            missionsCompleted={user.missionsCompletedCount}
                            tools={user.tools}
                        />

                        {/* Social Share Action */}
                        <Button asChild className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-white font-black uppercase group transition-all">
                            <Link href={`/api/card/${user.id}`} target="_blank">
                                <Share2 className="mr-2 size-4 group-hover:text-primary" />
                                Générer Carte Partage
                                <Download className="ml-auto size-4 opacity-30 group-hover:opacity-100" />
                            </Link>
                        </Button>
                    </div>

                    {/* Squad Intel Area */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-mono uppercase text-zinc-600 flex items-center gap-3">
                            Squad_Intel
                            <div className="h-px bg-white/5 flex-1" />
                        </p>
                        <Card className="glass-card rounded-[2rem] p-6 space-y-6">
                            {activeOrg ? (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Users className="size-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase">Squad_Active</div>
                                            <div className="text-lg font-black text-white uppercase tracking-tighter italic">{activeOrg.name}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-mono text-zinc-600 uppercase font-black">Cohésion_Réseau</span>
                                            <span className="text-[10px] font-mono text-primary font-black">{(activeOrg.cohesionScore * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${activeOrg.cohesionScore * 100}%` }} />
                                        </div>
                                    </div>

                                    <Button asChild variant="outline" className="w-full border-white/5 bg-white/[0.02] text-[10px] font-black uppercase h-10 rounded-xl">
                                        <Link href="/squad">Voir le Dashboard Squad</Link>
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4 text-center py-4">
                                    <div className="size-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto opacity-20">
                                        <Users className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-mono text-zinc-600 uppercase">Aucune Squad Détectée</p>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight italic leading-tight">Le build solitaire a ses limites.</p>
                                    </div>
                                    <Button asChild className="w-full btn-primary-glow font-black uppercase h-12 rounded-xl text-[10px]">
                                        <Link href="/squad">Rejoindre une Squad</Link>
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Metadata Section */}
                    <Card className="glass-card rounded-[2rem] p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="text-[9px] font-mono text-primary font-black uppercase">Objectif_Tactique</div>
                                <div className="text-base font-bold text-white uppercase tracking-tight italic">
                                    {user.mainObjective || "NON_SPÉCIFIÉ"}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="text-[9px] font-mono text-zinc-600 font-black uppercase">Position_Géo</div>
                                <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <Globe className="size-3.5 text-primary" />
                                    {user.city || "UNKNOWN_LOCATION"}, {user.country || "GLOBAL"}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="text-[9px] font-mono text-zinc-600 font-black uppercase">Habilitation_Réseau</div>
                                <div className="flex items-center gap-3">
                                    <Link href={user.githubUrl || "#"} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-primary transition-all group/link">
                                        <Github className="size-4" />
                                    </Link>
                                    <Link href={user.linkedinUrl || "#"} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-[#0077B5] transition-all group/link">
                                        <Linkedin className="size-4" />
                                    </Link>
                                    <Link href={user.twitterUrl || "#"} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:text-white transition-all group/link">
                                        <svg viewBox="0 0 24 24" className="size-4 fill-current">
                                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                            <Button asChild variant="outline" className="border-white/10 text-white font-black uppercase h-14 rounded-2xl group hover:bg-white/5">
                                <Link href="/tech-tree">
                                    Tech Tree
                                    <Compass className="ml-2 size-4 group-hover:rotate-45 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild className="btn-primary-glow font-black uppercase h-14 rounded-2xl group">
                                <Link href="/missions">
                                    Mission
                                    <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                        <Button asChild variant="link" className="w-full text-zinc-600 font-mono text-[10px] uppercase hover:text-white">
                            <Link href="/settings">
                                Paramètres .Data
                            </Link>
                        </Button>
                    </Card>

                    {/* Verification Protocol Badge */}
                    <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center space-y-4">
                        <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <ShieldCheck className="size-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase text-emerald-400 tracking-wide">Protocol de Confiance Actif</h4>
                            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Vérifié_Par_IA_Hashcode</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
