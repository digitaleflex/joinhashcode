"use client";

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center p-8">
        <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ShieldAlert className="h-7 w-7 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-white italic">
            Anomalie Système — Panel Admin
          </h2>
          <p className="text-sm text-zinc-500 font-light leading-relaxed">
            Une erreur est survenue dans le panel d&apos;administration. Les données ne sont pas affectées.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <p className="text-xs font-mono text-red-400/60 mt-2 break-all">{error.message}</p>
          )}
        </div>
        <Button onClick={reset} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
