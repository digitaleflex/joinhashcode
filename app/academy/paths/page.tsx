export const dynamic = "force-dynamic";
import Link from "next/link";
import { Compass, Star, ArrowRight, ShieldCheck, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

/**
 * Parcours = dérivation des phases du programme HEF.
 *
 * CHOIX PÉDAGOGIQUE : chaque Phase du programme HEF devient un "parcours".
 * C'est cohérent car :
 *  - Le programme HEF est structuré en 4 phases séquentielles (Foundations → Systems →
 *    Professional Engineering → Large Scale Engineering), chacune avec un objectif
 *    et une finality clairement définies.
 *  - Les piliers (17 au total) sont groupés sous chaque phase et représentent les
 *    compétences à maîtriser dans ce parcours.
 *  - Les cours existants (3) sont rattachés à des piliers spécifiques, donc le parcours
 *    phase→pilier→cours reflète le cheminement réel de l'apprenant.
 *
 * Alternative envisagée (non retenue) : dériver des Course.category. Cependant, les
 * catégories sont plates (5) et ne reflètent pas la progression pédagogique du programme.
 */

const PHASE_ICONS = [
    { phase: 1, icon: Zap },
    { phase: 2, icon: ShieldCheck },
    { phase: 3, icon: Star },
    { phase: 4, icon: Compass },
];

function phaseIcon(number: number) {
    return PHASE_ICONS.find((p) => p.phase === number)?.icon ?? Zap;
}

export default async function AcademyPathsPage() {
    const program = await prisma.program.findUnique({
        where: { slug: "hef" },
        include: {
            phases: {
                orderBy: { number: "asc" as const },
                include: {
                    pillars: {
                        where: { isPublished: true },
                        orderBy: { order: "asc" as const },
                        select: { id: true, level: true, title: true, slug: true, objective: true, concepts: true, project: true },
                    },
                },
            },
        },
    });

    if (!program) notFound();

    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                        <Compass className="size-4 text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
                            {program.name}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
                        Trouvez votre <span className="text-primary">voie</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        {program.description ?? "Chaque phase est un parcours complet, du fondamental à l'expertise."}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <Target className="size-4 text-primary" />
                            <span className="text-primary font-black">{program.phases.length}</span> parcours
                        </span>
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <Star className="size-4 text-primary" />
                            {program.phases.reduce((acc, p) => acc + p.pillars.length, 0)} piliers de compétences
                        </span>
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <ShieldCheck className="size-4 text-primary" />
                            {program.durationMonths}+ mois
                        </span>
                    </div>
                </div>
            </section>

            {/* Paths = Phases */}
            <section className="py-24 max-w-7xl mx-auto px-6 space-y-16">
                {program.phases.map((phase) => {
                    const Icon = phaseIcon(phase.number);
                    return (
                        <div key={phase.id} className="group bg-card rounded-3xl border border-border p-10 hover:shadow-2xl transition-all duration-500 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white">
                                            <Icon className="size-7" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                Parcours {phase.number}
                                            </span>
                                            <h2 className="text-3xl font-black text-foreground tracking-tight">
                                                {phase.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        {phase.description ?? "—"}
                                    </p>
                                    {phase.finality && (
                                        <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground bg-secondary border border-border px-4 py-2 rounded-full">
                                            <Target className="size-4 text-primary" />
                                            {phase.finality}
                                        </p>
                                    )}
                                </div>
                                <Button asChild variant="ghost" className="w-fit justify-between font-black text-sm uppercase tracking-widest hover:text-primary p-0">
                                    <Link href={`/academy/programme/${phase.number}`}>
                                        Voir le parcours <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Pillars mini-grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {phase.pillars.map((pillar) => (
                                    <Link
                                        key={pillar.id}
                                        href={`/academy/programme/${pillar.slug}`}
                                        className="group/pillar bg-secondary rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-primary/20">
                                                {String(pillar.level).padStart(2, "0")}
                                            </span>
                                            <h3 className="text-base font-black text-foreground group-hover/pillar:text-primary transition-colors leading-snug">
                                                {pillar.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                                            {pillar.objective ?? "—"}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {pillar.concepts.slice(0, 3).map((concept) => (
                                                <span
                                                    key={concept}
                                                    className="text-[10px] font-bold bg-card text-muted-foreground px-2.5 py-1 rounded-full"
                                                >
                                                    {concept}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {phase.pillars.length === 0 && (
                                <p className="text-center text-muted-foreground font-medium py-8">
                                    Aucun pilier publié pour ce parcours.
                                </p>
                            )}
                        </div>
                    );
                })}
            </section>
        </div>
    );
}