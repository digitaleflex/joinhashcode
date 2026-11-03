import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Check, Clock, GraduationCap, Star, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollButton } from "@/components/academy/enroll-button";
import { getSessionSafe } from "@/lib/get-session-safe";
import { isEnrolled } from "@/app/actions/academy/course";

export const dynamic = "force-dynamic";

interface CoursePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) return {};
    return {
        title: `${course.title} | HASHCODE Academy`,
        description: course.description || undefined,
    };
}

 export default async function AcademyCoursePage({ params }: CoursePageProps) {
     const { slug } = await params;
 
     const course = await prisma.course.findUnique({
         where: { slug },
         include: {
             instructor: { select: { name: true, image: true } },
             category: true,
             sections: {
                 orderBy: { order: "asc" },
                 include: { contents: { orderBy: { order: "asc" } } }
             }
         }
     });
 
     if (!course) notFound();
 
     const totalLessons = course.sections.reduce((acc: number, s: { contents: unknown[] }) => acc + s.contents.length, 0);
 
    // Vérifie l'état d'inscription côté serveur.
    // Page publique : on lit la session de façon optionnelle (getSessionSafe).
    // Sans session → lien /signin ; avec session → bouton d'inscription.
    const session = await getSessionSafe();
    const isAuthenticated = Boolean(session);
    const enrolled = await isEnrolled(course.id);
 
     return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        name: course.title,
                        description: course.description ?? undefined,
                        inLanguage: "fr",
                        isAccessibleForFree: true,
                        provider: {
                            "@type": "Organization",
                            name: "HashCode",
                            sameAs: "https://joinhashcode.com",
                        },
                    }),
                }}
            />
            <Link
                href="/academy/courses"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft className="size-4" /> Retour au catalogue
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                            {course.category?.name || "Formation"}
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {totalLessons} leçons
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                        {course.title}
                    </h1>
                    {course.description && (
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-8">
                            {course.description}
                        </p>
                    )}

                    <div className="mb-8 flex items-center gap-3">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-black text-muted-foreground">{course.instructor.name?.charAt(0) || "H"}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Formateur</p>
                            <p className="text-sm font-black text-foreground">{course.instructor.name || "HashCode Team"}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-foreground mb-6">Programme</h2>
                    <div className="space-y-4">
                        {course.sections.map((section, idx) => (
                            <div key={section.id} className="p-6 border border-border rounded-3xl bg-card hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <PlayCircle className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground">{section.title}</p>
                                            <p className="text-xs font-bold text-muted-foreground">
                                                {section.contents.length} leçon{section.contents.length > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-muted-foreground">Section {idx + 1}</span>
                                </div>

                                {section.contents.length > 0 && (
                                    <ul className="mt-4 space-y-1 border-t border-border pt-3">
                                        {section.contents.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={`/academy/courses/${course.slug}/lessons/${item.id}`}
                                                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                                                >
                                                    <span className="truncate">{item.title}</span>
                                                    <ArrowRight className="size-3.5 shrink-0 text-primary/60 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="sticky top-8 p-8 border border-border rounded-[2.5rem] bg-card shadow-xl shadow-slate-100/50">
                        <div className="text-center mb-8 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Note moyenne</p>
                            <div className="flex items-center justify-center gap-2">
                                <Star className="size-6 text-primary fill-primary" />
                                <p className="text-3xl font-black text-foreground">
                                    {course.totalLearners > 0 ? `${course.averageRating.toFixed(1)} / 5` : "Nouveau"}
                                </p>
                            </div>
                            <p className="text-xs font-bold text-muted-foreground">{course.totalLearners > 0 ? `${course.totalLearners} élèves inscrits` : "Aucun élève inscrit"}</p>
                        </div>

                                                {/* 
    Mode FREE : pas d'appel réseau externe, pas d'email.
    Si l'utilisateur n'est pas authentifié, on affiche un lien vers /signin 
    au lieu du bouton d'inscription (le server action renverrait 401).
  */}
  {isAuthenticated ? (
    <EnrollButton courseId={course.id} initiallyEnrolled={enrolled} />
  ) : (
    <Button asChild className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest">
      <Link href="/signin">Se connecter pour s'inscrire</Link>
    </Button>
  )}

                        <ul className="mt-8 space-y-3 text-sm font-bold text-muted-foreground">
                            <li className="flex items-center gap-3"><Check className="size-4 text-primary" /> Accès à vie</li>
                            <li className="flex items-center gap-3"><Check className="size-4 text-primary" /> Certificat HashCode</li>
                            <li className="flex items-center gap-3"><Check className="size-4 text-primary" /> Support des formateurs</li>
                            <li className="flex items-center gap-3"><Clock className="size-4 text-primary" /> Rythme flexible</li>
                            <li className="flex items-center gap-3"><GraduationCap className="size-4 text-primary" /> Niveau {course.level === "BEGINNER" ? "débutant" : course.level === "INTERMEDIATE" ? "intermédiaire" : "avancé"}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
