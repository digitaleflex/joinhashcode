"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Topic {
    id: string;
    title: string;
    author: { name?: string };
    createdAt: Date;
    _count: { posts: number };
}

interface ModuleDiscussionsProps {
    courseId: string;
    sectionId?: string;
    lessonId?: string;
    showTrigger?: boolean;
}

export function ModuleDiscussions({ courseId, sectionId, lessonId, showTrigger = true }: ModuleDiscussionsProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"list" | "create">("list");

    const fetchTopics = async () => {
        setLoading(true);
        try {
            // TODO: implement API call to fetch topics
            // const data = await getContextTopics({ courseId, sectionId, lessonId });
            setTopics([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen || !showTrigger) {
            fetchTopics();
        }
    }, [isOpen, courseId, sectionId, lessonId, showTrigger]);

    const _handleTopicCreated = (_topicId: string) => {
        setView("list");
        fetchTopics();
    };

    const Content = () => (
        <div className="h-full flex flex-col p-6">
            {view === "list" ? (
                <>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Discussions</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Espace d&apos;échange du module</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setView("create")}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105"
                        >
                            <Plus className="size-3 mr-2" />
                            Poser une question
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 scrollbar-hide pb-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 gap-4">
                                <Loader2 className="size-8 animate-spin text-primary" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chargement des échanges...</p>
                            </div>
                        ) : topics.length === 0 ? (
                            <div className="text-center py-20 px-8 bg-secondary/50 rounded-[2.5rem] border border-dashed border-border">
                                <div className="size-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <MessageSquare className="size-8 text-muted-foreground/40" />
                                </div>
                                <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-2">Silence radio...</h4>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6">
                                    Soyez le premier à briser la glace et posez votre question ici !
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setView("create")}
                                    className="border-border hover:border-primary hover:text-primary rounded-xl font-black text-[10px] uppercase tracking-widest"
                                >
                                    Démarrer la discussion
                                </Button>
                            </div>
                        ) : (
                            topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/academy/my-courses/${courseId}/forum/${topic.id}`}
                                    className="group block p-6 rounded-4xl bg-card border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <h4 className="font-black text-foreground text-sm mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {topic.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-xl bg-secondary flex items-center justify-center text-[10px] font-black text-foreground uppercase">
                                                    {topic.author.name?.[0] || "A"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{topic.author.name}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true, locale: fr })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-[10px] font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <MessageSquare className="size-3" />
                                                {topic._count.posts}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 size-24 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[4rem]" />
                                </Link>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView("list")}
                            className="pl-0 hover:pl-2 transition-all font-black text-[10px] uppercase tracking-widest text-primary hover:bg-transparent"
                        >
                            ← Retour aux discussions
                        </Button>
                    </div>
                    {/* CreateTopicForm would go here */}
                    <p className="text-sm text-muted-foreground">Formulaire de création de sujet — à implémenter.</p>
                </div>
            )}
        </div>
    );

    if (showTrigger) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-5 border-border hover:border-primary hover:text-primary text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2"
                    >
                        <MessageSquare className="size-4" />
                        Discussions
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[450px] sm:w-[550px] p-0 border-l-0 shadow-2xl">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Discussions du module</SheetTitle>
                    </SheetHeader>
                    <Content />
                </SheetContent>
            </Sheet>
        );
    }

    return <Content />;
}
