"use client";

import { useEffect, useState } from "react";
import { PublicSquadList } from "@/components/dashboard/squad/PublicSquadList";
import { Globe, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function SquadDiscoverySection() {
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        const response = await fetch("/api/squad/public?limit=3");
        if (!response.ok) throw new Error("Échec");
        const json = await response.json();
        setSquads(json.data || []); // json.data instead of json
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSquads();
  }, []);

  if (isLoading || squads.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-black/40">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Globe className="size-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-primary uppercase">Recrutement Actif</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
              Trouve ton <span className="text-primary underline decoration-4 underline-offset-8">unité</span>
            </h2>
            <p className="text-zinc-500 max-w-xl font-light text-sm md:text-base">
                Ne bâtis pas seul. Rejoins une escouade d"élite, synchronise tes efforts et multiplie ton impact dans l"écosystème.
            </p>
          </div>
          
          <div className="hidden lg:block p-6 rounded-3xl border border-dashed border-white/5 bg-white/1 text-center">
             <div className="text-3xl font-black text-white/20 font-mono italic mb-1">{squads.length}+</div>
             <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest leading-relaxed">
               Escouades_En_Expansion
             </p>
          </div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <PublicSquadList squads={squads} />
        </motion.div>

        <div className="mt-16 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
                Authentification_Sécurisée // Collaboration_Décentralisée
            </p>
        </div>
      </div>
    </section>
  );
}
