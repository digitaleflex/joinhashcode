"use client";

import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function OnboardingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center p-8">
        <div className="h-14 w-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <WifiOff className="h-7 w-7 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-white italic">
            Initialisation Interrompue
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Une erreur est survenue pendant l&apos;onboarding. Ta progression est sauvegardée — réessaie pour continuer.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <p className="text-[10px] font-mono text-red-400/60 mt-2 break-all">{error.message}</p>
          )}
        </div>
        <Button onClick={reset} className="btn-primary-glow w-full">
          Reprendre
        </Button>
      </div>
    </div>
  );
}
