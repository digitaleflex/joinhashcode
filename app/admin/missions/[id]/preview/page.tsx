import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle2,
  Award,
  Shield,
  Rocket,
  Clock,
  Layers,
  GitBranch,
  Lock,
  Info,
  Eye,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStepMissionDef } from "@/lib/mission-engine";

export default async function MissionPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
    redirect("/dashboard");
  }

  const mission = await prisma.mission.findFirst({
    where: {
      OR: [{ slug: id }, { id: id }],
    },
  });

  if (!mission) notFound();

  const approvedSubmissions = await prisma.missionSubmission.findMany({
    where: { missionId: mission.id, status: "APPROVED" },
    select: { createdAt: true, updatedAt: true },
    take: 50,
  });

  let avgDelay = 14;
  if (approvedSubmissions.length > 0) {
    const totalDelay = approvedSubmissions.reduce((acc, sub) => {
      return acc + (sub.updatedAt.getTime() - sub.createdAt.getTime());
    }, 0);
    avgDelay =
      Math.round(totalDelay / approvedSubmissions.length / (1000 * 60 * 60)) ||
      1;
  }

  const isOnboarding =
    mission.isOnboarding || getStepMissionDef(mission.slug) !== null;
  const briefingContent = mission.fullBriefing || mission.description;

  const methodIcon = {
    GITHUB_LINK: <GitBranch className="w-3.5 h-3.5" />,
    LIVE_URL: <Rocket className="w-3.5 h-3.5" />,
    TEXT_RESPONSE: <Layers className="w-3.5 h-3.5" />,
  }[mission.submissionMethod] ?? <Layers className="w-3.5 h-3.5" />;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/missions/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h1 className="text-lg font-mono font-bold text-primary uppercase tracking-tighter">
                Aperçu Membre
              </h1>
            </div>
            <p className="text-zinc-400 font-mono text-xs mt-1">
              Vue exacte telle qu&apos;affichée aux membres
            </p>
          </div>
        </div>
        <Link href={`/admin/missions/${id}`}>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs gap-1.5 border-zinc-700 text-zinc-300 hover:text-primary hover:border-primary/40"
          >
            <Pencil className="h-3.5 w-3.5" />
            Éditer
          </Button>
        </Link>
      </div>

      <div className="relative mb-10 pb-10 border-b border-zinc-800">
        <span className="absolute top-0 right-0 text-[80px] md:text-[120px] font-black font-mono text-primary/4 leading-none select-none pointer-events-none uppercase tracking-tighter">
          {mission.category.slice(0, 3)}
        </span>

        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-primary/50 uppercase">
                MISSION // {mission.slug.toUpperCase().replace(/-/g, "_")}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.1]">
              {mission.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-mono tracking-wider text-xs rounded-md px-2 py-0.5">
                {mission.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-zinc-400 border-zinc-700 font-mono text-xs rounded-md px-2 py-0.5"
              >
                NIV. {mission.difficulty}
              </Badge>
              {mission.status && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs rounded-md px-2 py-0.5 border-zinc-700 text-zinc-400"
                >
                  {mission.status}
                </Badge>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end justify-start">
            <div className="text-xs font-mono text-zinc-500 uppercase mb-1">
              Récompense
            </div>
            <div className="text-4xl sm:text-6xl md:text-7xl font-black font-mono text-primary leading-none">
              +{mission.xp}
            </div>
            <div className="text-xs font-mono text-primary/60 uppercase mt-1">
              XP
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap gap-6 mt-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-primary/40" />
            <span className="uppercase tracking-wider text-xs">
              Délai Review
            </span>
            <span className="text-zinc-300">~{avgDelay}h</span>
          </div>

          {mission.duration && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-primary/40" />
              <span className="uppercase tracking-wider text-xs">
                Durée
              </span>
              <span className="text-zinc-300">{mission.duration}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            {methodIcon}
            <span className="uppercase tracking-wider text-xs">
              Méthode
            </span>
            <span className="text-zinc-300">
              {mission.submissionMethod.replace(/_/g, " ")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Layers className="w-3.5 h-3.5 text-primary/40" />
            <span className="uppercase tracking-wider text-xs">
              Livrables
            </span>
            <span className="text-zinc-300">
              {mission.deliverables.length} élément
              {mission.deliverables.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-mono text-primary/40">01</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-mono uppercase text-primary">
                  Briefing
                </h2>
              </div>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="pl-8">
              <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {briefingContent}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-mono text-primary/40">02</span>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-mono uppercase text-primary">
                  Livrables attendus
                </h2>
              </div>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="pl-8 space-y-3">
              {mission.deliverables.map((deliverable, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                  <div className="shrink-0 w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-zinc-300 leading-relaxed">
                    {deliverable}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {mission.submissionMethod === "GITHUB_LINK" && (
            <div className="pl-8">
              <div className="flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <Info className="w-4 h-4 text-blue-400/70 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Si ton dépôt GitHub est privé, invite le compte{" "}
                  <span className="font-mono text-blue-400">
                    joinhashcode
                  </span>{" "}
                  comme collaborateur afin que nous puissions valider ton
                  travail.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Statut de la mission
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs font-mono text-zinc-400">
                    Mode aperçu
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    La soumission n&apos;est pas disponible en mode aperçu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {mission.requirements.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500/60" />
                  <span className="text-xs font-mono uppercase text-zinc-500">
                    Pré-requis
                  </span>
                </div>
              </div>
              <ul className="p-5 space-y-3">
                {mission.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs text-zinc-400 leading-relaxed"
                  >
                    <span className="text-primary/40 font-mono mt-0.5">
                      —
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
