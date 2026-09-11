export const dynamic = "force-dynamic";
import Link from "next/link";
import { Compass, Star, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyPathsPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="bg-secondary py-24">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                        <Compass className="size-4 text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Orientation Professionnelle</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
                        Trouvez votre <span className="text-primary">voie</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        Nos parcours métiers sont conçus pour vous amener de débutant à expert en quelques mois, avec un diplôme à la clé.
                    </p>
                </div>
            </section>

            {/* Path Categories */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { title: "Développement Web", jobs: ["Frontend", "Backend", "Fullstack"], icon: Zap, color: "bg-blue-500" },
                        { title: "Data & IA", jobs: ["Data Analyst", "Data Scientist", "IA Engineer"], icon: Star, color: "bg-purple-500" },
                        { title: "Design & Produit", jobs: ["UX Designer", "Product Manager", "UI Designer"], icon: ShieldCheck, color: "bg-primary" },
                    ].map((path, i) => {
                        const Icon = path.icon;
                        return (
                            <div key={i} className="group bg-card rounded-3xl border border-border p-10 hover:shadow-2xl transition-all duration-500 space-y-8">
                                <div className={`w-16 h-16 ${path.color} rounded-2xl flex items-center justify-center text-white`}>
                                    <Icon className="size-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-foreground">{path.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {path.jobs.map(job => (
                                            <span key={job} className="text-[11px] font-bold bg-muted text-muted-foreground px-3 py-1 rounded-full">{job}</span>
                                        ))}
                                    </div>
                                </div>
                                <Button asChild variant="ghost" className="w-full justify-between font-black text-sm uppercase tracking-widest hover:text-primary p-0">
                                    <Link href="/academy/courses">Voir le parcours <ArrowRight className="size-4" /></Link>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
