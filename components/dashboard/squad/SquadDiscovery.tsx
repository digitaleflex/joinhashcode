"use client";

import { useEffect, useState } from "react";
import { PublicSquadList } from "@/components/dashboard/squad/PublicSquadList";
import { Loader2, Globe } from "lucide-react";

export function SquadDiscovery() {
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        const response = await fetch("/api/squad/public");
        if (!response.ok) throw new Error("Échec du chargement");
        const json = await response.json();
        setSquads(json.data || []); // json.data instead of json
      } catch (_) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSquads();
  }, []);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Globe className="size-5 text-primary" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white uppercase italic">Recrutement Actif</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Escouades en recherche d"agents</p>
        </div>
      </div>

      <PublicSquadList squads={squads} />
    </div>
  );
}
