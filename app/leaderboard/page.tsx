import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const revalidate = 120;

async function getLeaderboard() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      pseudo: true,
      image: true,
      class: true,
    },
    include: {
      progress: { select: { level: true, experience: true, missionsCompletedCount: true } },
    },
    orderBy: [{ progress: { experience: "desc" } }, { progress: { level: "desc" } }],
    take: 50,
  });

  return users.map((u, i) => ({
    id: u.id,
    name: u.name,
    pseudo: u.pseudo,
    image: u.image,
    class: u.class,
    level: u.progress?.level ?? 1,
    experience: u.progress?.experience ?? 0,
    missionsCompletedCount: u.progress?.missionsCompletedCount ?? 0,
    rank: i + 1,
  }));
}

const RANK_STYLES: Record<number, { border: string; glow: string; badge: string; icon: string }> = {
  1: { border: "border-amber-500/40", glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]", badge: "bg-amber-500 text-black", icon: "text-amber-400" },
  2: { border: "border-zinc-400/30", glow: "shadow-[0_0_20px_rgba(161,161,170,0.1)]", badge: "bg-zinc-400 text-black", icon: "text-zinc-400" },
  3: { border: "border-orange-700/30", glow: "shadow-[0_0_20px_rgba(194,120,56,0.1)]", badge: "bg-orange-700 text-white", icon: "text-orange-600" },
};

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const users = await getLeaderboard();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft className="size-3" /> Retour au Dashboard
          </Link>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Trophy className="size-3.5 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Classement Global</span>
              </div>
              <h1 className="text-4xl font-black uppercase italic text-white tracking-tight">
                Panthéon des <span className="text-primary">Bâtisseurs</span>
              </h1>
              <p className="text-zinc-500 text-sm font-light">Classement par points d'expérience (XP) · Mis à jour en temps réel</p>
            </div>
          </div>
        </div>

        {/* Full ranking table */}
        <div className="space-y-2">
          {users.map((user) => {
            const style = RANK_STYLES[user.rank];
            return (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border bg-zinc-950/40 transition-all ${style?.border || "border-white/5"}`}
              >
                {/* Rank */}
                <div className={`size-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${style ? style.badge : "bg-zinc-900 text-zinc-500"}`}>
                  {user.rank}
                </div>

                {/* Avatar */}
                <Avatar className="size-10 border-2 border-zinc-800">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="bg-zinc-900">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-white uppercase italic truncate">{user.pseudo || user.name}</p>
                    <Badge className="text-[8px] bg-white/5 text-zinc-400 border-white/10 font-mono">
                      {user.class?.toUpperCase() || "BÂTISSEUR"}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase">Niveau</p>
                    <p className="text-xs font-black text-white">{user.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase">XP</p>
                    <p className="text-xs font-black text-primary italic">
                      {user.experience}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
