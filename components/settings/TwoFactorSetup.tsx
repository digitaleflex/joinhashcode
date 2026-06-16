"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Key } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export function TwoFactorSetup({ user }: { user: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [totpData, setTotpData] = useState<{ totpURI: string; backupCodes: string[] } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"start" | "setup" | "verify">("start");

  const handleStartSetup = async () => {
    setIsPending(true);
    try {
      const { data, error } = await authClient.twoFactor.enable({
        password: "",
      });

      if (error) {
        toast.error(error.message || "Erreur d'authentification");
      } else if (data) {
        setTotpData(data);
        setStep("setup");
      }
    } catch (error: unknown) {
      toast.error("Erreur technique");
    } finally {
      setIsPending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
        trustDevice: true,
      });

      if (error) {
        toast.error(error.message || "Code invalide");
      } else {
        toast.success("Double authentification activée !");
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error("Erreur technique");
    } finally {
      setIsPending(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Désactiver la double authentification ? Ton compte sera moins sécurisé.")) return;

    setIsPending(true);
    try {
      const { error } = await authClient.twoFactor.disable({ password: "" });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("2FA désactivée");
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error("Erreur technique");
    } finally {
      setIsPending(false);
    }
  };

  if (user.twoFactorEnabled) {
    return (
      <Card className="bg-emerald-950/10 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
                <ShieldCheck className="size-5 text-emerald-500" />
            </div>
            <div>
                <CardTitle className="text-white text-base">Protection Active</CardTitle>
                <CardDescription className="text-zinc-500 text-xs">
                    Ton compte est protégé par la double authentification.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400 text-xs" onClick={handleDisable}>
                Désactiver la protection
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900/40 border-white/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldAlert className="size-5 text-primary" />
          </div>
          <div>
              <CardTitle className="text-white text-base">Sécurise ton compte</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                  Ajoute une couche de sécurité via Google Authenticator ou Authy.
              </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-primary-glow text-xs uppercase font-bold tracking-widest h-10 px-6">
                Activer la 2FA
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase italic">Configuration 2FA</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Suis les étapes pour verrouiller ton accès.
              </DialogDescription>
            </DialogHeader>

            {step === "start" && (
              <div className="space-y-4 py-4">
                <p className="text-sm text-zinc-400">
                  Clique sur le bouton ci-dessous pour générer ton QR code de configuration.
                </p>
                <Button onClick={handleStartSetup} className="w-full h-12 uppercase font-bold" disabled={isPending}>
                    {isPending ? "Génération..." : "Commencer la configuration"}
                </Button>
              </div>
            )}

            {step === "setup" && totpData && (
              <div className="space-y-6 py-4 flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl">
                    <Image 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpData.totpURI)}`} 
                        alt="2FA QR Code"
                        width={192}
                        height={192}
                        className="size-48"
                    />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-primary italic">Scanne ce code avec ton App</p>
                    <p className="text-[10px] text-zinc-500 max-w-[250px] mx-auto">
                        Ouvre Google Authenticator, Authy ou FreeOTP et ajoute un nouveau compte.
                    </p>
                </div>
                
                <div className="w-full p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-mono text-amber-500 uppercase flex items-center gap-2">
                        <Key className="size-3" /> Codes de secours (Unique)
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                        {totpData.backupCodes.slice(0, 4).map((code, i) => (
                            <code key={i} className="text-[10px] font-mono text-zinc-400 bg-black/40 p-1 rounded text-center">{code}</code>
                        ))}
                    </div>
                    <p className="text-[8px] text-zinc-600 italic">Sauvegarde ces codes en lieu sûr.</p>
                </div>

                <Button className="w-full h-12 uppercase font-bold" onClick={() => setStep("verify")}>
                    J&apos;ai scanné le code
                </Button>
              </div>
            )}

            {step === "verify" && (
              <form onSubmit={handleVerify} className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-500">Code à 6 chiffres</label>
                    <Input 
                        type="text" 
                        value={verificationCode} 
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000 000"
                        className="bg-zinc-900 border-white/5 text-center text-xl font-mono tracking-widest h-14"
                        maxLength={6}
                        required
                    />
                </div>
                <Button type="submit" className="w-full h-12 uppercase font-bold" disabled={isPending}>
                    {isPending ? "Activation..." : "Finaliser l&apos;activation"}
                </Button>
                <button type="button" className="w-full text-[10px] text-zinc-600 hover:text-zinc-400 underline" onClick={() => setStep("setup")}>
                    Retour au QR Code
                </button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
