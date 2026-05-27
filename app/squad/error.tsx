"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function SquadError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center p-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-white italic">
            Signal de l&apos;Escouade Perdu
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Impossible de charger les données de ton escouade. Vérifie ta connexion et réessaie.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <p className="text-[10px] font-mono text-red-400/60 mt-2 break-all">{error.message}</p>
          )}
        </div>
        <Button onClick={reset} className="btn-primary-glow w-full">
          Reconnecter
        </Button>
      </div>
    </div>
  );
}
