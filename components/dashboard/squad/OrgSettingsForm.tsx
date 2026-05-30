"use client";

import { useState } from "react";
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
      const res = await fetch("/api/squad/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erreur lors de la mise à jour");
      } else {
        toast.success("Paramètres mis à jour");
        window.location.reload();
      }
    } catch {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 border p-4 rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="org-name">Nom de l'escouade</Label>
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


      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mise à jour..." : "Sauvegarder les modifications"}
      </Button>

      <div className="mt-12 pt-6 border-t border-destructive/20 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-destructive uppercase">Zone de Danger</h4>
          <p className="text-xs text-muted-foreground">
            La dissolution de l'escouade est irréversible. Tous les membres seront expulsés et les données supprimées.
          </p>
        </div>
        <Button 
          type="button" 
          variant="destructive" 
          className="w-full font-bold uppercase text-[10px]"
          disabled={isPending}
          onClick={async () => {
            if (!confirm("ATTENTION : Es-tu certain de vouloir DISSOUDRE l'escouade ? Cette action est définitive.")) return;
            setIsPending(true);
            try {
              const res = await fetch("/api/squad/disband", { method: "DELETE" });
              if (!res.ok) {
                toast.error("Erreur lors de la dissolution");
              } else {
                toast.success("Escouade dissoute");
                window.location.href = "/squad";
              }
            } catch {
              toast.error("Erreur système");
            } finally {
              setIsPending(false);
            }
          }}
        >
          Dissoudre l'escouade
        </Button>
      </div>
    </form>
  );
}
