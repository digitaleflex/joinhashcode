import { prisma } from "@/lib/prisma";
import { getSessionSafe } from "@/lib/get-session-safe";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Compass, Users, ArrowLeft, ShieldCheck, Zap, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { JoinSquadButton } from "@/components/squad/join-squad-button";

export const dynamic = "force-dynamic";

const MAX_MEMBERS = 5;

export default async function DiscoverSquadsPage() {
  const session = await getSessionSafe();
  if (!session) redirect("/signin");

  const [squads, currentMember] = await Promise.all([
    prisma.organization.findMany({
      where: { isPrivate: false, slug: { not: null } },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        cohesionScore: true,
        streakCount: true,
        requiredLevel: true,
        createdAt: true,
        _count: { select: { members: true } },
        members: {
          select: {
            id: true,
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: [{ cohesionScore: "desc" }, { createdAt: "desc" }],
      take: 30,
    }),
    prisma.member.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    }),
  ]);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { level: true },
  });
  const userLevel = user?.level ?? 1;

  const openSquads = squads.filter((s) => s._count.members < MAX_MEMBERS);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-4">
          <Link href="/squad" className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft className="size-3" /> Retour
          </Link>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Compass className="size-3.5 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Trouve ton unité</span>
              </div>
              <h1 className="text-4xl font-black uppercase italic text-white tracking-tight">
                Découvrir les <span className="text-primary">Escouades</span>
              </h1>
              <p className="text-zinc-500 text-sm font-light">
                {openSquads.length} escouade{openSquads.length > 1 ? "s" : ""} recrutent actuellement · Max 5 membres
              </p>
            </div>
          </div>
        </div>

        {/* Already in a squad banner */}
        {currentMember && (
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/5">
            <ShieldCheck className="size-5 text-primary shrink-0" />
            <p className="text-xs text-zinc-400">
              Tu fais déjà partie d&apos;une escouade. Tu ne peux rejoindre qu&apos;une seule unité à la fois.
            </p>
          </div>
        )}

        {/* Squad cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {openSquads.map((squad) => {
            const spotsLeft = MAX_MEMBERS - squad._count.members;
            const levelOk = userLevel >= squad.requiredLevel;
            return (
              <div
                key={squad.id}
                className="flex flex-col gap-4 p-5 rounded-2xl border border-white/5 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-white/10 transition-all"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {squad.logo ? (
                      <Image src={squad.logo} alt={squad.name} width={44} height={44} className="object-cover" />
                    ) : (
                      <Users className="size-5 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-black text-white uppercase italic truncate">{squad.name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                        {squad._count.members}/{MAX_MEMBERS} membres
                      </span>
                      <Badge className="text-[8px] bg-zinc-800 text-zinc-300 border-transparent font-mono gap-1">
                        <UserPlus className="size-2" /> {spotsLeft} place{spotsLeft > 1 ? "s" : ""}
                      </Badge>
                      {squad.streakCount >= 3 && (
                        <Badge className="text-[8px] bg-primary/10 text-primary border-primary/20 font-mono gap-1">
                          🔥 {squad.streakCount}j
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {squad.description && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 -mt-1">
                    {squad.description}
                  </p>
                )}

                {/* Member avatars */}
                {squad.members.length > 0 && (
                  <div className="flex -space-x-2">
                    {squad.members.slice(0, 5).map((m) => (
                      <Avatar key={m.id} className="size-6 border-2 border-zinc-950">
                        <AvatarImage src={m.user.image ?? undefined} />
                        <AvatarFallback className="text-[8px] bg-zinc-800">
                          {m.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}

                {/* Bottom row */}
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary">
                      <Zap className="size-3" />{Math.round((squad.cohesionScore || 0) * 100)}% SYNC
                    </div>
                    {squad.requiredLevel > 1 && (
                      <div className={`text-[9px] font-mono uppercase tracking-wider ${levelOk ? "text-zinc-600" : "text-amber-500"}`}>
                        Niveau {squad.requiredLevel} requis
                      </div>
                    )}
                  </div>
                  {!currentMember && (
                    <JoinSquadButton slug={squad.slug!} name={squad.name} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {openSquads.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl space-y-3">
            <Users className="size-12 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 font-mono text-xs uppercase">Aucune escouade recrute pour le moment</p>
            <Link href="/squad" className="inline-block text-[10px] font-mono text-primary hover:underline uppercase tracking-widest">
              Crée la tienne →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
