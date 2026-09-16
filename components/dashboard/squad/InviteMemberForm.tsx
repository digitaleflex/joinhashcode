"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await authClient.organization.inviteMember({
        email,
        role: "member",
      });

      if (error) {
        toast.error(error.message || "Erreur lors de l'invitation");
      } else {
        toast.success(`Invitation envoyée à ${email}`);
        setEmail("");
      }
    } catch {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-6 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
      <div className="space-y-2">
        <Label htmlFor="invite-email" className="text-xs font-mono uppercase text-zinc-500 font-bold">
          Email du futur membre
        </Label>
        <Input
          id="invite-email"
          type="email"
          placeholder="builder@hashcode.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-black/20 border-white/5 h-10"
        />
      </div>

      <Button type="submit" className="w-full btn-primary-glow font-black uppercase h-11 rounded-xl gap-2" disabled={isPending}>
        <Mail className="size-4" />
        {isPending ? "Envoi en cours..." : "Envoyer l'invitation"}
      </Button>
    </form>
  );
}
