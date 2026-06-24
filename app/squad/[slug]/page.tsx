import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { CLASS_COLORS, type ProfileType } from "@/lib/member-card-constants";
import Link from "next/link";
import { Users, Shield, Lock, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function PublicSquadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const squad = await prisma.organization.findUnique({
    where: { slug },
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
            },
            include: {
              progress: { select: { level: true } },
            },
          },
        },
      },
    },
  });

  if (!squad || squad.isPrivate) notFound();

  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const isAlreadyMember = session
    ? squad.members.some((m) => m.userId === session.user.id)
    : false;
  const isFull = squad.members.length >= 5;
  const cohesionPct = Math.round((squad.cohesionScore || 0.1) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="scanline opacity-10" aria-hidden="true" />

      <div className="w-full max-w-2xl space-y-6 relative z-10">

        {/* Header nav */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[10px] font-mono text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
            ← Terminal HASHCODE
          </Link>
          {session && (
            <Link href="/squad" className="text-[10px] font-mono text-zinc-600 hover:text-primary transition-colors uppercase tracking-widest">
              Mon escouade →
            </Link>
          )}
        </div>

        {/* Main card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">

          {/* Top banner */}
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#B8FF3B,#B8FF3B_8px,transparent_8px,transparent_16px)] opacity-30" aria-hidden="true" />

          <div className="p-8 md:p-10 space-y-8">

            {/* Squad identity */}
            <div className="flex items-start gap-5">
              <div className="size-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {squad.logo ? (
                  <Image src={squad.logo} alt={squad.name} width={64} height={64} className="object-cover" />
                ) : (
                  <Users className="size-8 text-zinc-600" />
                )}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black uppercase italic text-white truncate">{squad.name}</h1>
                  {squad.isPrivate && <Badge variant="outline" className="text-[9px] font-mono border-zinc-700 text-zinc-500">PRIVÉ</Badge>}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  {squad.members.length}/5 agents · LVL {squad.requiredLevel}+ requis
                </p>
                {squad.streakCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="size-3 text-primary fill-primary" />
                    <span className="text-[10px] font-mono text-primary font-bold">{squad.streakCount} jours de streak</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {squad.description && (
              <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-primary/30 pl-4">
                {squad.description}
              </p>
            )}

            {/* Announcement */}
            {squad.announcement && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                <Zap className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-300 leading-relaxed italic">{squad.announcement}</p>
              </div>
            )}

            {/* Cohesion bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Cohésion de l'unité</span>
                <span className="text-[9px] font-mono font-black text-primary">{cohesionPct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_#C5F441] transition-all duration-700"
                  style={{ width: `${cohesionPct}%` }}
                />
              </div>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Agents actifs</p>
              <div className="grid grid-cols-1 gap-2">
                {squad.members.map((m) => {
                  const cl = (m.user.class || "builder").toLowerCase();
                  const color = CLASS_COLORS[cl as ProfileType] || "#B8FF3B";
                  return (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/2 border border-white/5">
                      <Avatar className="size-8 border border-white/10">
                        <AvatarImage src={m.user.image ?? undefined} />
                        <AvatarFallback className="text-[10px] bg-zinc-800">{m.user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {m.user.pseudo || m.user.name}
                          {m.role === "owner" && <span className="ml-2 text-[8px] font-mono text-primary uppercase">Chef</span>}
                        </p>
                        <p className="text-[9px] font-mono" style={{ color }}>
                          {(m.user.class || "Builder").toUpperCase()} · LVL {m.user.progress?.level ?? 1}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {Array.from({ length: 5 - squad.members.length }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/5 opacity-40">
                    <div className="size-8 rounded-full bg-zinc-900 flex items-center justify-center">
                      <Lock className="size-3 text-zinc-700" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Slot disponible</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
                <Shield className="size-3 text-zinc-500" />
                <span className="text-[9px] font-mono text-zinc-400 uppercase">Niveau {squad.requiredLevel}+ requis</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
                <Users className="size-3 text-zinc-500" />
                <span className="text-[9px] font-mono text-zinc-400 uppercase">{5 - squad.members.length} place{5 - squad.members.length > 1 ? "s" : ""} libre{5 - squad.members.length > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* CTA */}
            {isAlreadyMember ? (
              <Button asChild className="w-full h-14 btn-primary-glow font-black uppercase tracking-wide text-sm rounded-2xl">
                <Link href="/squad">
                  Accéder à l'escouade <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : isFull ? (
              <Button disabled className="w-full h-14 font-black uppercase text-sm rounded-2xl opacity-40">
                Escouade complète
              </Button>
            ) : session ? (
              <Button asChild className="w-full h-14 btn-primary-glow font-black uppercase tracking-wide text-sm rounded-2xl">
                <Link href={`/invite/${squad.slug}`}>
                  Postuler à l'escouade <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full h-14 btn-primary-glow font-black uppercase tracking-wide text-sm rounded-2xl">
                <Link href={`/signin?callbackURL=/squad/${squad.slug}`}>
                  Créer un compte & postuler <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
