import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/features";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, Zap, Target, ArrowLeft, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const revalidate = 120;

async function getLeaderboard() {
  const squads = await prisma.organization.findMany({
    where: { isPrivate: false },
    select: {
      id: true, name: true, slug: true, logo: true,
      cohesionScore: true, streakCount: true, description: true,
      members: {
        select: {
          id: true, role: true,
          user: { select: { id: true, name: true, pseudo: true, image: true, class: true }, include: { progress: { select: { level: true, missionsCompletedCount: true } } } },
        },
      },
    },
    orderBy: [{ cohesionScore: "desc" }, { streakCount: "desc" }],
    take: 20,
  });

  return squads.map((s, i) => ({
    ...s,
    rank: i + 1,
    totalMissions: s.members.reduce((acc, m) => acc + (m.user.progress?.missionsCompletedCount || 0), 0),
    avgLevel: s.members.length
      ? Math.round(s.members.reduce((acc, m) => acc + (m.user.progress?.level ?? 1), 0) / s.members.length * 10) / 10
      : 0,
  }));
}

const RANK_STYLES: Record<number, { border: string; glow: string; badge: string; icon: string }> = {
  1: { border: "border-amber-500/40", glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]", badge: "bg-amber-500 text-black", icon: "text-amber-400" },
  2: { border: "border-zinc-400/30", glow: "shadow-[0_0_20px_rgba(161,161,170,0.1)]", badge: "bg-zinc-400 text-black", icon: "text-zinc-400" },
  3: { border: "border-orange-700/30", glow: "shadow-[0_0_20px_rgba(194,120,56,0.1)]", badge: "bg-orange-700 text-white", icon: "text-orange-600" },
};

export default async function LeaderboardPage() {
  if (!isFeatureEnabled("squads")) redirect("/dashboard");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const squads = await getLeaderboard();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-4">
          <Link href="/squad" className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft className="size-3" /> Retour à mon escouade
          </Link>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Trophy className="size-3.5 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Classement des Unités</span>
              </div>
              <h1 className="text-4xl font-black uppercase italic text-white tracking-tight">
                Leaderboard <span className="text-primary">Escouades</span>
              </h1>
              <p className="text-zinc-500 text-sm font-light">Classement par cohésion · Mis à jour toutes les 2 minutes</p>
            </div>
          </div>
        </div>

        {/* Top 3 podium */}
        {squads.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 items-end">
            {[squads[1], squads[0], squads[2]].map((squad, podiumIdx) => {
              const heights = ["h-32", "h-44", "h-36"];
              const style = RANK_STYLES[squad.rank] || { border: "border-white/5", glow: "", badge: "bg-zinc-800 text-white", icon: "text-zinc-500" };
              return (
                <Link key={squad.id} href={`/squad/${squad.slug}`} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border bg-zinc-950/60 hover:bg-zinc-900/60 transition-all ${style.border} ${style.glow} ${heights[podiumIdx]}`}>
                  <div className={`size-6 rounded-full flex items-center justify-center text-xs font-black ${style.badge}`}>
                    {squad.rank}
                  </div>
                  {squad.logo ? (
                    <Image src={squad.logo} alt={squad.name} width={36} height={36} className="rounded-xl" />
                  ) : (
                    <div className="size-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Users className={`size-5 ${style.icon}`} />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-black text-white uppercase italic truncate max-w-24">{squad.name}</p>
                    <p className="text-[9px] font-mono text-primary font-bold">{Math.round((squad.cohesionScore || 0) * 100)}% SYNC</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Full ranking table */}
        <div className="space-y-2">
          {squads.map((squad) => {
            const style = RANK_STYLES[squad.rank];
            const cohesionPct = Math.round((squad.cohesionScore || 0) * 100);
            return (
              <Link
                key={squad.id}
                href={`/squad/${squad.slug}`}
                className={`flex items-center gap-4 p-4 rounded-2xl border bg-zinc-950/40 hover:bg-zinc-900/40 transition-all group ${style?.border || "border-white/5"}`}
              >
                {/* Rank */}
                <div className={`size-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${style ? style.badge : "bg-zinc-900 text-zinc-500"}`}>
                  {squad.rank}
                </div>

                {/* Logo */}
                <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  {squad.logo ? (
                    <Image src={squad.logo} alt={squad.name} width={40} height={40} className="object-cover" />
                  ) : (
                    <Users className="size-5 text-zinc-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-white uppercase italic truncate">{squad.name}</p>
                    {squad.streakCount >= 3 && (
                      <Badge className="text-[8px] bg-primary/10 text-primary border-primary/20 font-mono gap-1">
                        <Star className="size-2 fill-primary" /> {squad.streakCount}j streak
                      </Badge>
                    )}
                  </div>
                  {squad.description && (
                    <p className="text-[10px] text-zinc-500 truncate hidden sm:block">{squad.description}</p>
                  )}
                </div>

                {/* Member avatars */}
                <div className="flex -space-x-2 shrink-0 hidden sm:flex">
                  {squad.members.slice(0, 4).map((m) => (
                    <Avatar key={m.id} className="size-6 border-2 border-zinc-950">
                      <AvatarImage src={m.user.image ?? undefined} />
                      <AvatarFallback className="text-[8px] bg-zinc-800">{m.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center hidden md:block">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase">Missions</p>
                    <p className="text-xs font-black text-white flex items-center gap-1">
                      <Target className="size-3 text-primary" />{squad.totalMissions}
                    </p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase">Niv. moy.</p>
                    <p className="text-xs font-black text-white flex items-center gap-1">
                      <TrendingUp className="size-3 text-primary" />{squad.avgLevel}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase">Cohésion</p>
                    <p className="text-xs font-black text-primary">
                      <Zap className="size-3 inline mr-0.5" />{cohesionPct}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {squads.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl">
            <Trophy className="size-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono text-xs uppercase">Aucune escouade publique pour l'instant</p>
          </div>
        )}
      </div>
    </div>
  );
}
