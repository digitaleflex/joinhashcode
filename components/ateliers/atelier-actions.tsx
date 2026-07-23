"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AtelierActionsProps {
  atelierSlug: string;
  initialStatus: string;
  xpReward: number;
}

export function AtelierActions({ atelierSlug, initialStatus, xpReward }: AtelierActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";

  const updateStatus = async (newStatus: "IN_PROGRESS" | "COMPLETED") => {
    setLoading(true);
    try {
      const res = await fetch("/api/ateliers/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atelierSlug, status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur");
      }
      setStatus(newStatus);
      if (newStatus === "COMPLETED") {
        toast.success(`Atelier terminé ! +${xpReward} XP`);
      } else {
        toast.success("Atelier commencé ! Bonne découverte.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button disabled className="w-full h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-black tracking-wider gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Terminé · +{xpReward} XP
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      {!isInProgress && (
        <Button
          onClick={() => updateStatus("IN_PROGRESS")}
          disabled={loading}
          className="w-full h-12 rounded-xl btn-primary-glow text-[10px] uppercase font-black tracking-wider gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Commencer l&apos;atelier
        </Button>
      )}
      {isInProgress && (
        <Button
          onClick={() => updateStatus("COMPLETED")}
          disabled={loading}
          variant="secondary"
          className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500 text-[10px] uppercase font-black tracking-wider gap-2 transition-all"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Marquer comme terminé
        </Button>
      )}
    </div>
  );
}
