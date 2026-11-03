export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
};

function Stars({ rating }: { rating: number }) {
    const full = Math.round(rating);
    return (
        <span className="flex items-center gap-1 text-sm font-bold text-foreground">
            {"★".repeat(full)}{"☆".repeat(5 - full)}
            <span className="text-xs text-muted-foreground font-medium">({rating.toFixed(1)})</span>
        </span>
    );
}

/* ── Card ─────────────────────────────────────────────────────────── */

function CourseCard({
    course,
    categoryName,
    tagNames,
    sectionCount,
}: {
    course: Awaited<ReturnType<typeof getCourses>>[number];
    categoryName: string | null;
    tagNames: string[];
    sectionCount: number;
}) {
    return (
        <Link
            href={`/academy/courses/${course.slug}`}
            className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
        >
            <div className="aspect-16/10 bg-secondary relative overflow-hidden border-b border-border">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/5 to-transparent">
                        <span className="text-primary/20 text-6xl font-black italic">H</span>
                    </div>
                )}
                <div className="absolute top-5 left-5 bg-card/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-border">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                        {LEVEL_LABELS[course.level] ?? course.level}
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
                    {tagNames.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] font-bold">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="pt-4 mt-auto border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {categoryName && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {categoryName}
                            </span>
                        )}
                        <span className="text-[10px] font-black text-muted-foreground">
                            {sectionCount} section{sectionCount > 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {course.totalLearners > 0 ? (<Stars rating={course.averageRating} />) : (<span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Nouveau</span>)}
                        <ArrowRight className="size-3 text-primary" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

/* ── Fetch helper ─────────────────────────────────────────────────── */

async function getCourses() {
    return prisma.course.findMany({
        where: { isPublished: true },
        include: {
            category: { select: { name: true } },
            tags: { select: { name: true } },
            sections: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" as const },
    });
}

async function getCategories() {
    "use server";
    return prisma.category.findMany({ orderBy: { name: "asc" as const } });
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function AcademyCoursesPage() {
    const [courses, categories] = await Promise.all([getCourses(), getCategories()]);

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="mb-16 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1 bg-primary rounded-full" />
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">Catalogue</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Toutes nos formations</h1>
                    <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                        Développez vos compétences avec des parcours conçus par des experts et certifiés par l&apos;État.
                    </p>
                </div>

                {/* Filters (static for now — categories from DB) */}
                <div className="flex flex-wrap items-center gap-2 mb-12">
                    <Filter className="size-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground mr-2">Filtrer :</span>
                    {categories.map((cat) => (
                        <Badge
                            key={cat.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-bold"
                        >
                            {cat.name}
                        </Badge>
                    ))}
                </div>

                {/* Grid */}
                {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-black text-foreground mb-2">Aucun cours disponible</h3>
                        <p className="text-muted-foreground text-center max-w-sm font-medium">
                            Nous ajouterons bientôt de nouvelles formations. Revenez nous rendre visite.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course) => {
                            const categoryName = course.category?.name ?? null;
                            const tagNames = course.tags.map((t) => t.name);
                            const sectionCount = course.sections.length;
                            return (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    categoryName={categoryName}
                                    tagNames={tagNames}
                                    sectionCount={sectionCount}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Footer stats */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-muted-foreground">
                    <span>{courses.length} formation{courses.length > 1 ? "s" : ""}</span>
                    <span className="text-border">•</span>
                    <span>{categories.length} catégorie{categories.length > 1 ? "s" : ""}</span>
                </div>
            </div>
        </div>
    );
}
