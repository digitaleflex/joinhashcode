export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Compass,
  Award,
  LayoutDashboard,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRecommendedCourses } from "@/lib/academy/recommendations";

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata = {
  title: "Academy — HASHCODE",
  description:
    "Cours, parcours structurés et certifications HASHCODE. Développe tes compétences pas à pas.",
};

/* ── Helpers ───────────────────────────────────────────────── */

function levelLabel(level: string) {
  const labels: Record<string, string> = {
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
  };
  return labels[level] ?? level;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex items-center gap-1 text-sm font-bold text-foreground">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
      <span className="text-xs text-muted-foreground font-medium">
        ({rating.toFixed(1)})
      </span>
    </span>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default async function AcademyHubPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { category: { select: { name: true } }, tags: { select: { name: true } } },
    orderBy: { createdAt: "desc" as const },
    take: 3,
  });

  // Recommandations personnalisées à partir du profil d'acquisition.
  // La page est PUBLIQUE : on lit la session en best-effort (jamais de throw)
  // pour ne pas casser l'accès visiteur.
  //
  // NB: `primaryDomain` n'est PAS dans les `additionalFields` de better-auth,
  // donc absent de `session.user` — il faut le lire en base.
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);
  const profile = session?.user
    ? await prisma.user
        .findUnique({
          where: { id: session.user.id },
          select: { primaryDomain: true },
        })
        .catch(() => null)
    : null;
  const recommended = profile?.primaryDomain
    ? await getRecommendedCourses(profile.primaryDomain).catch(() => null)
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-secondary py-24">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" aria-hidden />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" aria-hidden />
        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
            <GraduationCap className="size-4 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              Academy
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1.05] text-balance break-words">
            Apprends, pratique, <span className="text-primary">certifie-toi</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Cours structurés, parcours progressifs et certifications reconnues.
            Construis tes compétences pas à pas avec la communauté HASHCODE.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/academy/courses"
              className="inline-flex items-center gap-2 bg-primary px-8 py-4 rounded-full text-sm font-black text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              Explorer les cours
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/academy/playground"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-4 text-sm font-black text-foreground transition-colors hover:border-primary/40"
            >
              Ouvrir le Playground Python
            </Link>
          </div>
        </div>
      </section>

      {/* ── Liens rapides ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/academy/courses"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <BookOpen className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Cours
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Parcours détaillés avec sections, ressources et quiz.
            </p>
          </Link>

          <Link
            href="/academy/programme"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <Compass className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Programme HEF
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Le socle des ingénieurs : phases, piliers et progression.
            </p>
          </Link>

          <Link
            href="/academy/paths"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <Compass className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Parcours
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Sentiers personnalisés selon tes objectifs et ton niveau.
            </p>
          </Link>

          <Link
            href="/academy/diplomas"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <Award className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Diplômes
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Certifications officielles pour valider tes compétences.
            </p>
          </Link>

          <Link
            href="/academy/my-courses"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <LayoutDashboard className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Mes cours
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Reprends là où tu en es : progression et prochaine leçon.
            </p>
          </Link>

          <Link
            href="/academy/certificates"
            className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
          >
            <BadgeCheck className="size-8 text-primary" />
            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
              Certificats
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Tes attestations de réussite à partager.
            </p>
          </Link>
        </div>
      </section>

      {/* ── Recommandé pour toi ──────────────────────────────── */}
      {/* Affiché uniquement si le visiteur est connecté ET que son profil
          d'acquisition a permis de matcher une catégorie. On ne montre pas
          un repli générique ici : il ferait doublon avec « Cours à la une »
          juste en dessous. */}
      {recommended?.matched && recommended.courses.length > 0 && (
        <section className="border-y border-border bg-card py-20">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
                Recommandé pour toi
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mt-2">
                D&apos;après ton profil
              </h2>
              <p className="mt-3 text-muted-foreground font-medium max-w-2xl">
                Tu as indiqué que ce domaine t&apos;attirait le plus. Voici par
                où commencer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/academy/courses/${course.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {course.categoryName && (
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      {course.categoryName}
                    </span>
                  )}
                  <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                    {course.description ??
                      "Découvrez les fondamentaux de ce parcours."}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] font-bold text-muted-foreground">
                    <span>{levelLabel(course.level)}</span>
                    {course.averageRating > 0 && (
                      <span>★ {course.averageRating.toFixed(1)}</span>
                    )}
                    {course.totalLearners > 0 && (
                      <span>{course.totalLearners} inscrits</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary">
                    Voir le cours
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Cours à la une ───────────────────────────────────── */}
      <section className="bg-secondary py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
                Cours à la une
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mt-2">
                Les formations les plus récentes
              </h2>
            </div>
            <Link
              href="/academy/courses"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Voir tout
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">
                Aucun cours publié pour l&apos;instant
              </h3>
              <p className="text-muted-foreground text-center max-w-sm font-medium">
                Reviens bientôt — de nouvelles formations arrivent régulièrement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const categoryName = course.category?.name ?? null;
                const tagNames = course.tags.map((t) => t.name);
                return (
                  <Link
                    key={course.id}
                    href={`/academy/courses/${course.slug}`}
                    className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
                  >
                    <div className="aspect-16/10 bg-secondary relative overflow-hidden border-b border-border">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/5 to-transparent">
                          <span className="text-primary/20 text-6xl font-black italic">H</span>
                        </div>
                      )}
                      <div className="absolute top-5 left-5 bg-card/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-border">
                        <span className="text-xs font-black uppercase tracking-wider text-primary">
                          {levelLabel(course.level)}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1 space-y-4">
                      <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground font-medium text-sm line-clamp-2 leading-relaxed">
                        {course.description ?? "Découvrez les fondamentaux de ce parcours avec nos experts."}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tagNames.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="pt-4 mt-auto border-t border-border flex items-center justify-between">
                        {categoryName && (
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {categoryName}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Stars rating={course.averageRating} />
                          <ArrowRight className="size-3 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
