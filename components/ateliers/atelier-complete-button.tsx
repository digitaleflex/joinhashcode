"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AtelierCompleteButton({
  initiallyCompleted = false,
}: {
  initiallyCompleted?: boolean;
}) {
  const [completed, setCompleted] = React.useState(initiallyCompleted);
  const [loading, setLoading] = React.useState(false);

  const complete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me/first-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "completed" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCompleted(true);
      toast.success("Première action terminée. Prochaine étape : un Lab.");
    } catch {
      toast.error("Impossible d'enregistrer la complétion. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-emerald-300" aria-hidden />
          <div>
            <p className="text-sm font-bold text-white">Première action terminée</p>
            <p className="text-xs text-zinc-400">
              Continue avec un Lab pour transformer cet atelier en preuve concrète.
            </p>
          </div>
        </div>
        <Button asChild className="h-10 rounded-xl px-4">
          <Link href="/labs">Explorer les Labs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-bold text-white">Atelier terminé ?</p>
          <p className="text-xs text-zinc-400">
            Marque-le pour débloquer la suite de ton parcours.
          </p>
        </div>
      </div>
      <Button
        onClick={complete}
        disabled={loading}
        className="btn-primary-glow h-10 rounded-xl px-4"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          "J'ai terminé cet atelier"
        )}
      </Button>
    </div>
  );
}
