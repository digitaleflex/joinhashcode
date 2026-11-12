export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    GraduationCap,
    ArrowRight,
    Brain,
    Cpu,
    ShieldCheck,
    Rocket,
    BookOpen,
    Wrench,
    CheckCircle2,
    Award,
    Layers,
    Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROGRESSION_STEPS, MASTERY_LEVELS } from "@/lib/academy/program";
import { prisma } from "@/lib/prisma";

const PHASE_ICONS = [
    { phase: 1, icon: Brain },
    { phase: 2, icon: Cpu },
    { phase: 3, icon: ShieldCheck },
    { phase: 4, icon: Rocket },
];

function phaseIcon(number: number) {
    return PHASE_ICONS.find((p) => p.phase === number)?.icon ?? Brain;
}

export default async function AcademyProgrammePage() {
    const program = await prisma.program.findUnique({
        where: { slug: "hef" },
        include: {
            phases: {
                orderBy: { number: "asc" as const },
                include: {
                    pillars: {
                        where: { isPublished: true },
                        orderBy: { order: "asc" as const },
                    },
                },
            },
        },
    });

    if (!program) notFound();

    const totalPillars = program.phases.reduce((acc, phase) => acc + phase.pillars.length, 0);

    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="bg-secondary py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                        <GraduationCap className="size-4 text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
                            {program.name}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1.05]">
                        Le socle des <span className="text-primary">ingénieurs</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
                        {program.description ?? "Un programme complet pour passer de débutant à architecte."}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <Layers />
                            <span className="flex items-center gap-1">
                                <span className="text-primary">{program.phases.length}</span> phases
                            </span>
                        </span>
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <BookOpen className="size-4 text-primary" />
                            {totalPillars} piliers de compétences
                        </span>
                        <span className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                            <Award className="size-4 text-primary" />
                            {program.durationMonths}+ mois de progression
                        </span>
                    </div>
                </div>
            </section>

            {/* Phases + Pillars */}
            <section className="py-24 max-w-7xl mx-auto px-6 space-y-24">
                {program.phases.map((phase) => {
                    const Icon = phaseIcon(phase.number);
                    return (
                        <div key={phase.id} className="space-y-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                                                Phase {phase.number}
                                            </span>
                                            <h2 className="text-3xl font-black text-foreground tracking-tight">
                                                {phase.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-relaxed">{phase.description ?? "—"}</p>
                                    {phase.finality && (
                                        <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground bg-card border border-border px-4 py-2 rounded-full">
                                            <Target className="size-4 text-primary" />
                                            {phase.finality}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {phase.pillars.map((pillar) => (
                                    <Link
                                        key={pillar.id}
                                        href={`/academy/programme/${pillar.slug}`}
                                        className="group bg-card rounded-3xl border border-border p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-5xl font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                                                {String(pillar.level).padStart(2, "0")}
                                            </span>
                                            <span className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Wrench className="size-5" />
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-black text-foreground leading-snug group-hover:text-primary transition-colors">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-medium">{pillar.objective ?? "—"}</p>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {pillar.concepts.slice(0, 4).map((concept) => (
                                                    <span
                                                        key={concept}
                                                        className="text-xs font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                                                    >
                                                        {concept}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                Projet : {pillar.project ?? "—"}
                                            </span>
                                            <ArrowRight className="size-4 text-primary -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Progression pédagogique */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-6 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
                            Progression pédagogique
                        </span>
                        <h2 className="text-4xl font-black text-foreground tracking-tight">
                            De la découverte à la transmission
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                            Chaque pilier suit un cycle identique : apprendre, pratiquer, construire, puis valider
                            devant la communauté.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PROGRESSION_STEPS.map((step, i) => (
                            <div key={step.step} className="bg-card rounded-3xl border border-border p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                                        Étape {i + 1}
                                    </span>
                                    <CheckCircle2 className="size-5 text-primary/40" />
                                </div>
                                <h3 className="text-lg font-black text-foreground">{step.step}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{step.label}</p>
                                <span className="inline-flex text-xs font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                                    {step.validation}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Niveaux de maîtrise */}
            <section className="py-24 max-w-7xl mx-auto px-6 space-y-14">
                <div className="text-center space-y-4">
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
                        Niveaux de maîtrise
                    </span>
                    <h2 className="text-4xl font-black text-foreground tracking-tight">
                        Six niveaux, du premier pas au mentorat
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MASTERY_LEVELS.map((level, i) => (
                        <div
                            key={level.level}
                            className="bg-card rounded-3xl border border-border p-8 space-y-4 flex flex-col"
                        >
                            <div className="flex items-center justify-between">
                                <span className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-sm">
                                    {i + 1}
                                </span>
                                <Award className="size-6 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">{level.level}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{level.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-brand rounded-[4rem] p-16 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            Prêt à devenir ingénieur ?
                        </h2>
                        <p className="text-white/70 max-w-xl mx-auto text-lg font-medium">
                            Rejoignez le programme HashCode Engineering Foundations et construisez les compétences
                            qui durent.
                        </p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-black rounded-full px-12 h-16 text-lg uppercase tracking-widest border-none transition-transform hover:scale-105 active:scale-95">
                            <Link href="/acquisition/profiling">Commencer gratuitement</Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -ml-40 -mb-40" />
                </div>
            </section>
        </div>
    );
}
