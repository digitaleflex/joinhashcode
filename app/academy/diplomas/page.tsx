export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, Award, ShieldCheck, BadgeCheck, FileCheck2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

/**
 * Diplomas = Badges du programme + Programme HEF.
 *
 * Les Badges représentent les certifications délivrables (ex: "Certifié HEF", "Architecte").
 * Le Programme HEF fournit le contexte global (nom, vision, durée).
 *
 * Note : le schema Badge ne contient pas de champ "courseId" ou lien direct vers un
 * cours spécifique — les badges sont génériques et débloqués par l'accomplissement
 * d'étapes (cours, piliers, etc.). On construit donc les diplomas à partir des badges
 * disponibles + la description du programme.
 */

export default async function AcademyDiplomasPage() {
    const [program, badges] = await Promise.all([
        prisma.program.findUnique({
            where: { slug: "hef" },
            select: { name: true, description: true, durationMonths: true, icon: true },
        }),
        prisma.badge.findMany({
            orderBy: { name: "asc" as const },
        }),
    ]);

    if (!program) notFound();

    const diplomaSteps = [
        { icon: BadgeCheck, title: "Suivez le parcours", desc: "Complétez les modules et travaux pratiques du programme." },
        { icon: FileCheck2, title: "Réussissez les évaluations", desc: "Validez vos connaissances avec un score minimum." },
        { icon: GraduationCap, title: "Obtenez votre certification", desc: "Un certificat numérique vérifiable avec un ID unique." },
    ];

    return (
        <div className="bg-background">
            <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                        <Award className="size-4 text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                            {program.name}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight tracking-tight">
                        Certifiez vos <br />
                        <span className="text-primary">compétences.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        {program.description ?? "À l'issue de chaque parcours, obtenez une certification HASHCODE qui atteste de vos compétences auprès des recruteurs."}
                    </p>

                    {/* Comment ça marche */}
                    <div className="space-y-5">
                        {diplomaSteps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="flex items-start gap-5 bg-secondary p-6 rounded-2xl border border-border group hover:border-primary/20 transition-colors">
                                    <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <Icon className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-foreground mb-1">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Badges visuel */}
                <div className="relative">
                    <div className="aspect-4/5 bg-brand rounded-[4rem] p-16 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-black text-sm">H</span>
                                </div>
                                <span className="font-black text-lg tracking-tight">HASHCODE</span>
                            </div>
                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                    {badges.length} Certifications disponibles
                                </p>
                                <div className="space-y-3">
                                    {badges.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                                    <Award className="size-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{badge.name}</p>
                                                    <p className="text-[10px] text-white/50 font-medium">
                                                        {badge.description ?? "Certification HashCode"}
                                                    </p>
                                                </div>
                                            </div>
                                            {badge.xpRequired > 0 && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Star className="size-3 text-primary" />
                                                    <span className="text-[10px] font-bold text-white/60">
                                                        {badge.xpRequired} XP requis
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="size-6 text-primary" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Programme</p>
                                    <p className="text-sm font-mono font-bold text-white">{program.name}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                                    {program.durationMonths}+ mois de formation
                                </p>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                        <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-foreground text-center mb-16">Pourquoi nos certifications comptent</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Reconnues par les entreprises", desc: "Nos certifications sont conçues avec des professionnels du secteur pour refléter les compétences réellement recherchées." },
                            { title: "Vérifiables en ligne", desc: "Chaque certificat possède un identifiant unique permettant aux recruteurs de vérifier son authenticité instantanément." },
                            { title: "Ajoutables sur LinkedIn", desc: "Partagez votre certification directement sur votre profil LinkedIn pour augmenter votre visibilité professionnelle." },
                        ].map((a, i) => (
                            <div key={i} className="bg-card p-10 rounded-3xl border border-border shadow-sm space-y-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black">{i + 1}</div>
                                <h3 className="text-xl font-black text-foreground">{a.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-brand rounded-[4rem] p-16 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            Prêt à certifier vos compétences ?
                        </h2>
                        <p className="text-white/70 max-w-xl mx-auto text-lg font-medium">
                            Rejoignez le programme {program.name} et obtenez vos certifications reconnues.
                        </p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-black rounded-full px-12 h-16 text-lg uppercase tracking-widest border-none transition-transform hover:scale-105 active:scale-95">
                            <Link href="/academy/programme">Découvrir le programme</Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -ml-40 -mb-40" />
                </div>
            </section>
        </div>
    );
}
