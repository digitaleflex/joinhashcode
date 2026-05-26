"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OrgSettingsFormProps {
  organization: any;
}

export function OrgSettingsForm({ organization }: OrgSettingsFormProps) {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug || "");
  const [isPrivate, setIsPrivate] = useState(organization.isPrivate ?? false);
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await authClient.organization.update({
        name,
        slug,
        metadata: {
            isPrivate: isPrivate
        }
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
    <form onSubmit={handleUpdate} className="space-y-6 border p-4 rounded-lg bg-card">
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
      </div>

      <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
        <div className="space-y-0.5">
          <Label>Escouade Privée</Label>
          <p className="text-[10px] text-muted-foreground">
            Si activé, l"escouade ne sera pas visible sur la page d"accueil.
          </p>
        </div>
        <Switch
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mise à jour..." : "Sauvegarder les modifications"}
      </Button>
    </form>
  );
}
