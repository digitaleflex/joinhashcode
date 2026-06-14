"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldAlert, ArrowRight, Loader2 } from "lucide-react";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (error) {
        toast.error(error.message || "Code de sécurité invalide");
      } else {
        toast.success("Authentification réussie");
        window.location.href = "/dashboard";
      }
    } catch (_) {
      toast.error("Erreur technique");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-4 animate-pulse">
                    <ShieldAlert className="size-8 text-primary" />
                </div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    Vérification <span className="text-primary">2FA</span>
                </h1>
                <p className="text-zinc-500 text-sm font-light">
                    Saisis le code généré par ton application d"authentification.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Input 
                        type="text" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="000 000"
                        className="h-20 text-center text-4xl font-mono tracking-[0.5em] bg-zinc-900 border-white/5 text-white placeholder:text-zinc-800 rounded-3xl"
                        maxLength={6}
                        required
                        autoFocus
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isPending || code.length < 6}
                    className="w-full h-16 btn-primary-glow text-base font-black uppercase tracking-widest rounded-3xl"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : (
                        <>Valider l"accès <ArrowRight className="ml-2 size-5" /></>
                    )}
                </Button>
            </form>

            <p className="text-center text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                Agent_Authorization_Required // Protocole_V2.0
            </p>
        </div>
    </div>
  );
}
