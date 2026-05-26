"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface OrgSettingsFormProps {
  organization: any;
}

export function OrgSettingsForm({ organization }: OrgSettingsFormProps) {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug || "");
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await authClient.organization.update({
        name,
        slug,
      });

      if (error) {
        toast.error(error.message || "Erreur lors de la mise à jour");
      } else {
        toast.success("Paramètres mis à jour");
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 border p-4 rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="org-name">Nom de l"escouade</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="org-slug">Slug (URL unique)</Label>
        <Input
          id="org-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">
          Exemple : hashcode.com/squad/{slug || "votre-escouade"}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mise à jour..." : "Sauvegarder les modifications"}
      </Button>
    </form>
  );
}
