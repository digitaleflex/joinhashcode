"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isPending, setIsPending] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await authClient.organization.inviteMember({
        email,
        role: role as any,
      });

      if (error) {
        toast.error(error.message || "Erreur lors de l\"invitation");
      } else {
        toast.success(`Invitation envoyée à ${email}`);
        setEmail("");
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4 border p-4 rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="email">Email du futur membre</Label>
        <Input
          id="email"
          type="email"
          placeholder="builder@hashcode.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choisir un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Membre (Standard)</SelectItem>
            <SelectItem value="admin">Administrateur (Gestion)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Envoi en cours..." : "Envoyer l\"invitation"}
      </Button>
    </form>
  );
}
