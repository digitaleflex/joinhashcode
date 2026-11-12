"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/app/actions/academy/forum";

interface ReplyFormProps {
    topicId: string;
}

export function ReplyForm({ topicId }: ReplyFormProps) {
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) {
            setError("Votre réponse ne peut pas être vide.");
            return;
        }

        setError(null);
        startTransition(async () => {
            const result = await createPost({ topicId, content: trimmed });
            if (result.success) {
                setContent("");
            } else {
                setError(result.error ?? "Échec de l'envoi");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold text-center">
                    {error}
                </div>
            )}

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPending}
                rows={4}
                placeholder="Écris ta réponse..."
                className="bg-secondary border-border rounded-2xl resize-none"
                aria-label="Ta réponse"
            />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="rounded-xl font-black text-xs uppercase tracking-widest"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-3 mr-2 animate-spin" />
                            Envoi...
                        </>
                    ) : (
                        <>
                            <Send className="size-3 mr-2" />
                            Répondre
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
