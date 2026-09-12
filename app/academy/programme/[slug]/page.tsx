export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Wrench,
    CheckCircle2,
    GraduationCap,
    Award,
    CalendarClock,
    FolderGit2,
    ShieldCheck,
    BadgeCheck,
    Target,
    Brain,
    Cpu,
    Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    WORKSHOP_FORMAT,
    EVALUATION_WEIGHTS,
    PILLAR_STRUCTURE,
    PROGRESSION_STEPS,
    MASTERY_LEVELS,
} from "@/lib/academy/program";
import { prisma } from "@/lib/prisma";

function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

const WORKSHOP_TOTAL_MINUTES = WORKSHOP_FORMAT.reduce((acc, part) => acc + part.duration, 0);

const PHASE_ICONS = [
    { phase: 1, icon: Brain },
    { phase: 2, icon: Cpu },
    { phase: 3, icon: ShieldCheck },
    { phase: 4, icon: Rocket },
];

function phaseIcon(number: number) {
    return PHASE_ICONS.find((p) => p.phase === number)?.icon ?? Brain;
}

/**
 * Sémantique du slug :
 * - slug numérique ("1".."4") → Phase du programme HEF (number = parseInt(slug))
 * - slug non numérique → Pillar par son slug unique
 * Fallback : program "hef" pour le contexte.
 */

/* ── Sous-composant : rendu phase ─────────────────────────────────── */

async function PhaseView({ number }: { number: number }) {
    const phase = await prisma.programPhase.findFirst({
        where: { program: { slug: "hef" }, number },
        include: {
            pillars: {
                where: { isPublished: true },
                orderBy: { order: "asc" as const },
            },
        },
    });

    if (!phase) notFound();

    const Icon = phaseIcon(phase.number);

    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="bg-secondary py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
                    <Link
                        href="/academy/programme"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Retour au programme
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white">
                            <Icon className="size-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Phase {phase.number}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                                {phase.title}
                            </h1>
                        </div>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
                        {phase.description ?? "—"}
                    </p>
                    {phase.finality && (
                        <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground bg-card border border-border px-4 py-2 rounded-full">
                            <Target className="size-4 text-primary" />
                            {phase.finality}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground font-medium">
                        {phase.pillars.length} piliers de compétences
                    </p>
                </div>
            </section>

            {/* Pillars grid */}
            <section className="py-24 max-w-7xl mx-auto px-6">
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
                                            className="text-[10px] font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                                        >
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Projet : {pillar.project ?? "—"}
                                </span>
                                <ArrowRight className="size-4 text-primary -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
                {phase.pillars.length === 0 && (
                    <p className="text-center text-muted-foreground font-medium py-12">
                        Aucun pilier publié pour cette phase.
                    </p>
                )}
            </section>
        </div>
    );
}

/* ── Sous-composant : rendu pillar ────────────────────────────────── */

async function PillarView({ slug }: { slug: string }) {
    const pillar = await prisma.pillar.findUnique({
        where: { slug },
        include: {
            phase: { select: { number: true, title: true } },
            program: { select: { name: true } },
        },
    });

    if (!pillar) notFound();

    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="bg-secondary py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
                    <Link
                        href="/academy/programme"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Retour au programme
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
                            {String(pillar.level).padStart(2, "0")}
                        </span>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Pilier {pillar.level} • Phase {pillar.phase.number} — {pillar.phase.title}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                                {pillar.title}
                            </h1>
                        </div>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
                        {pillar.objective ?? "—"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {pillar.concepts.map((concept) => (
                            <span
                                key={concept}
                                className="text-[11px] font-bold bg-card border border-border text-foreground px-3 py-1.5 rounded-full"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-14">
                    {/* Atelier HashCode */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Wrench className="size-5" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight">
                                Atelier HashCode
                            </h2>
                        </div>
                        <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 text-sm font-bold bg-secondary text-foreground px-4 py-2 rounded-full">
                                    <CalendarClock className="size-4 text-primary" />
                                    {pillar.workshop ?? "—"} — ≈ {formatDuration(WORKSHOP_TOTAL_MINUTES)}
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">
                                    ou découpée en 2 à 3 séances
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {WORKSHOP_FORMAT.map((part, i) => (
                                    <div key={part.part} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-foreground">
                                                {i + 1}. {part.part}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium">{part.description}</p>
                                        </div>
                                        <span className="text-sm font-black text-primary">{formatDuration(part.duration)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Projet de validation */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <FolderGit2 className="size-5" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight">
                                Projet de validation
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-card rounded-3xl border border-border p-8 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                    Projet
                                </span>
                                <p className="text-lg font-black text-foreground leading-snug">{pillar.project ?? "—"}</p>
                            </div>
                            <div className="bg-card rounded-3xl border border-border p-8 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                    Livrable attendu
                                </span>
                                <p className="text-lg font-black text-foreground leading-snug">{pillar.deliverable ?? "—"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Structure du pilier */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <BookOpen className="size-5" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight">
                                Structure du pilier
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PILLAR_STRUCTURE.map((section, i) => (
                                <span
                                    key={section}
                                    className="inline-flex items-center gap-2 text-xs font-bold bg-card border border-border text-foreground px-4 py-2.5 rounded-full"
                                >
                                    <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-[10px] text-primary">
                                        {i + 1}
                                    </span>
                                    {section}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Progression pédagogique */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <GraduationCap className="size-5" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight">
                                Progression pédagogique
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {PROGRESSION_STEPS.map((step, i) => (
                                <div
                                    key={step.step}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card rounded-2xl border border-border px-6 py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-xs">
                                            {i + 1}
                                        </span>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-foreground">{step.step}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{step.label}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex self-start sm:self-auto text-[10px] font-bold bg-secondary text-muted-foreground px-3 py-1.5 rounded-full">
                                        {step.validation}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Side column */}
                <aside className="space-y-8">
                    {/* Évaluation */}
                    <div className="bg-card rounded-3xl border border-border p-8 space-y-5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-primary" />
                            <h3 className="text-lg font-black text-foreground">Évaluation</h3>
                        </div>
                        <div className="space-y-4">
                            {EVALUATION_WEIGHTS.map((item) => (
                                <div key={item.criterion} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-foreground">{item.criterion}</span>
                                        <span className="font-black text-primary">{item.weight}%</span>
                                    </div>
                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${item.weight * 4}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Niveaux de maîtrise */}
                    <div className="bg-card rounded-3xl border border-border p-8 space-y-5">
                        <div className="flex items-center gap-2">
                            <Award className="size-5 text-primary" />
                            <h3 className="text-lg font-black text-foreground">Niveaux de maîtrise</h3>
                        </div>
                        <ol className="space-y-2.5">
                            {MASTERY_LEVELS.map((level) => (
                                <li key={level.level} className="flex items-start gap-3">
                                    <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-foreground">{level.level}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{level.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Badge */}
                    <div className="bg-brand rounded-3xl p-8 text-white space-y-5 relative overflow-hidden">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="size-6 text-primary" />
                            <h3 className="text-lg font-black">Badge HashCode</h3>
                        </div>
                        <p className="text-white/70 text-sm font-medium leading-relaxed">
                            Validez le pilier {pillar.level} et obtenez le badge officiel attestant votre maîtrise.
                        </p>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                    </div>

                    {/* CTA */}
                    {pillar.courseId ? (
                        <Button
                            asChild
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest border-none"
                        >
                            <Link href={`/academy/courses/${pillar.courseId}`}>
                                Accéder au contenu <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="bg-secondary rounded-2xl border border-dashed border-border p-6 text-center space-y-2">
                            <p className="text-sm font-black text-foreground">Contenu en préparation</p>
                            <p className="text-xs text-muted-foreground font-medium">
                                Les ateliers et ressources de ce pilier arrivent bientôt.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

/* ── Page principale ──────────────────────────────────────────────── */

export default async function AcademySlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const isNumeric = /^\d+$/.test(slug);

    if (isNumeric) {
        const number = parseInt(slug, 10);
        if (number < 1 || number > 4) notFound();
        return <PhaseView number={number} />;
    }

    return <PillarView slug={slug} />;
}
