"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Globe, AlignLeft, Type, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createCourse } from "@/app/actions/academy/course";

export function CourseCreateForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const language = formData.get("language") as string;

        setError(null);

        startTransition(async () => {
            const result = await createCourse({
                title,
                description,
                language: language as "FR" | "EN",
            });
            if (result.success) {
                router.push("/academy/my-courses");
            } else {
                setError(result.error ?? "Échec de la création");
            }
        });
    }

    return (
        <form action={handleSubmit} className="relative space-y-8 bg-card backdrop-blur-3xl rounded-[2rem] border border-border p-10 shadow-2xl overflow-hidden">
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title Section */}
                <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <Type className="size-4 text-primary" />
                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-muted-foreground">Informations de base</h3>
                    </div>
                    <div className="relative group/input">
                        <input
                            name="title"
                            type="text"
                            required
                            disabled={isPending}
                            className="w-full h-14 px-5 bg-secondary border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group-hover/input:bg-secondary/80 group-hover/input:border-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="ex: Masterclass : Architectures Web Avancées"
                        />
                        <label className="absolute left-5 -top-2.5 px-2 bg-card text-xs font-bold text-primary uppercase tracking-widest ring-1 ring-border">
                            Titre du Cours
                        </label>
                    </div>
                </div>

                {/* Description Section */}
                <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <AlignLeft className="size-4 text-primary" />
                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-muted-foreground">Description</h3>
                    </div>
                    <div className="relative group/input">
                        <textarea
                            name="description"
                            rows={5}
                            required
                            disabled={isPending}
                            className="w-full px-5 py-4 bg-secondary border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group-hover/input:bg-secondary/80 group-hover/input:border-muted-foreground/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Quelle transformation vos étudiants vont-ils vivre ?"
                        />
                        <label className="absolute left-5 -top-2.5 px-2 bg-card text-xs font-bold text-primary uppercase tracking-widest ring-1 ring-border">
                            Description
                        </label>
                    </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Globe className="size-4 text-primary" />
                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-muted-foreground">Localisation</h3>
                    </div>
                    <div className="relative group/input">
                        <select
                            name="language"
                            disabled={isPending}
                            className="w-full h-14 px-5 bg-secondary border border-border rounded-2xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group-hover/input:bg-secondary/80 group-hover/input:border-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="FR">Français (FR)</option>
                            <option value="EN">Anglais (US)</option>
                        </select>
                        <label className="absolute left-5 -top-2.5 px-2 bg-card text-xs font-bold text-primary uppercase tracking-widest ring-1 ring-border">
                            Langue Principale
                        </label>
                    </div>
                </div>

                {/* Visual Asset (Placeholder) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="size-4 text-primary" />
                        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-muted-foreground">Visuel</h3>
                    </div>
                    <div className="h-14 w-full flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-widest hover:bg-secondary hover:border-muted-foreground/30 transition-all cursor-not-allowed">
                        Charger une image de couverture (Optionnel)
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-6 border-t border-border">
                <Link
                    href="/academy/my-courses"
                    className={cn(
                        "text-muted-foreground hover:text-foreground text-xs font-black uppercase tracking-widest transition-colors",
                        isPending && "pointer-events-none opacity-20"
                    )}
                >
                    Annuler
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-[0_0_30px_rgba(255,87,34,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center gap-3"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Création...
                        </>
                    ) : (
                        "Créer le cours"
                    )}
                </button>
            </div>
        </form>
    );
}
