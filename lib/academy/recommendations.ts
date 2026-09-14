import { prisma } from "@/lib/prisma";

/**
 * Recommandations de cours issues du profil d'acquisition.
 *
 * POURQUOI
 * --------
 * Le prospect a répondu à 6 étapes de profiling pour indiquer son domaine.
 * À l'arrivée dans l'academy, lui présenter le catalogue complet revient à
 * ignorer ces réponses — et à lui faire refaire le tri lui-même.
 *
 * CORRESPONDANCE DOMAINE → CATÉGORIE
 * ----------------------------------
 * Les valeurs de `primaryDomain` viennent du profiling (`lib/acquisition/questions.ts`),
 * les `slug` de catégorie viennent du seed (`prisma/seed-academy.ts`). Les deux
 * vocabulaires ne se recoupent pas exactement :
 *
 *   web           → web
 *   cybersecurity → securite
 *   ai            → data
 *
 * Un domaine inconnu retombe sur les cours les mieux notés, toutes catégories
 * confondues — jamais une page vide.
 */

const DOMAIN_TO_CATEGORY: Record<string, string> = {
  web: "web",
  cybersecurity: "securite",
  ai: "data",
};

export type RecommendedCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  averageRating: number;
  totalLearners: number;
  categoryName: string | null;
};

const SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  level: true,
  averageRating: true,
  totalLearners: true,
  category: { select: { name: true } },
} as const;

const TAKE = 3;

/**
 * Retourne jusqu'à 3 cours publiés adaptés au domaine du profil.
 *
 * @param primaryDomain valeur brute issue du profiling (peut être null/undefined)
 */
export async function getRecommendedCourses(
  primaryDomain?: string | null
): Promise<{ courses: RecommendedCourse[]; matched: boolean }> {
  const categorySlug = primaryDomain
    ? DOMAIN_TO_CATEGORY[primaryDomain]
    : undefined;

  const shape = (
    rows: Array<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      level: string;
      averageRating: number;
      totalLearners: number;
      category: { name: string } | null;
    }>
  ): RecommendedCourse[] =>
    rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      level: c.level,
      averageRating: c.averageRating,
      totalLearners: c.totalLearners,
      categoryName: c.category?.name ?? null,
    }));

  // 1. Cours de la catégorie correspondant au domaine
  if (categorySlug) {
    const rows = await prisma.course.findMany({
      where: { isPublished: true, category: { slug: categorySlug } },
      orderBy: [{ averageRating: "desc" }, { totalLearners: "desc" }],
      take: TAKE,
      select: SELECT,
    });

    // 1b. Catégorie trouvée mais incomplète (ex: `web` et `securite` existent
    //     en base mais n'ont encore aucun cours) : on COMPLÈTE avec les
    //     meilleurs cours des autres catégories plutôt que d'afficher une
    //     section à 1 cours — ou rien du tout.
    if (rows.length < TAKE) {
      const fill = await prisma.course.findMany({
        where: {
          isPublished: true,
          id: { notIn: rows.map((r) => r.id) },
        },
        orderBy: [{ averageRating: "desc" }, { totalLearners: "desc" }],
        take: TAKE - rows.length,
        select: SELECT,
      });
      const merged = [...rows, ...fill];
      if (merged.length > 0) {
        return { courses: shape(merged), matched: rows.length > 0 };
      }
    } else {
      return { courses: shape(rows), matched: true };
    }
  }

  // 2. Repli : les cours les mieux notés, toutes catégories confondues.
  //    On ne renvoie JAMAIS une section vide — mieux vaut un catalogue
  //    générique qu'une page qui semble cassée.
  const fallback = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ averageRating: "desc" }, { totalLearners: "desc" }],
    take: TAKE,
    select: SELECT,
  });

  return { courses: shape(fallback), matched: false };
}
