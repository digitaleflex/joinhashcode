"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Key, 
  ChevronRight, 
  ShieldAlert, 
  Fingerprint,
  Loader2,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function BetaAccessPage() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/beta-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      if (response.ok) {
        toast.success("Accès Habilité. Bienvenue Agent.");
        router.refresh(); // Refresh to let middleware re-evaluate
        router.push("/onboarding");
      } else {
        const error = await response.text();
        toast.error(error || "Clé invalide ou déjà utilisée");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      <div className="scanline opacity-10" />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Lock className="size-3 text-primary" />
                <span className="text-[10px] font-mono font-black uppercase text-primary tracking-widest">Restricted_Area</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                Beta <span className="text-primary">.Access</span>
            </h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Une habilitation valide est requise pour entrer sur la grille.
            </p>
        </div>

        <Card className="glass-card bg-zinc-900/60 border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-10 space-y-8">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                    <ShieldAlert className="size-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold leading-tight">
                            Protocole de Sécurité Actif
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                            Votre empreinte numérique a été détectée mais votre niveau d'accréditation est insuffisant.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-600 uppercase font-black px-1">Clé_D_Habilitation</label>
                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                            <Input 
                                value={key}
                                onChange={(e) => setKey(e.target.value.toUpperCase())}
                                placeholder="H26-XXXX-XXXX"
                                className="h-16 pl-12 bg-black/40 border-white/10 rounded-2xl font-mono text-white text-lg tracking-[0.2em] focus-visible:ring-primary/20 uppercase"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading || !key.trim()}
                        className="w-full h-16 rounded-2xl btn-primary-glow font-black uppercase text-base group"
                    >
                        {loading ? (
                            <Loader2 className="size-6 animate-spin text-black" />
                        ) : (
                            <>
                                Authentifier l'Accès
                                <ChevronRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => window.open('https://x.com/joinhashcode', '_blank')}
                        className="text-[10px] font-mono text-zinc-600 uppercase hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Fingerprint className="size-3" />
                        Demander une habilitation via le QG
                    </button>
                </div>
            </CardContent>
        </Card>

        <p className="text-center text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
            SYSTEM_STATUS: SECURE // GRID_READY: TRUE
        </p>
      </div>
    </div>
  );
}
