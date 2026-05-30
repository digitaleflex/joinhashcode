"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface OrgSettingsFormProps {
  organization: any;
}

export function OrgSettingsForm({ organization }: OrgSettingsFormProps) {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug || "");
  const [isPrivate, setIsPrivate] = useState(organization.isPrivate || false);
  const [requiredLevel, setRequiredLevel] = useState(organization.requiredLevel || 1);
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await fetch("/api/squad/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          slug, 
          isPrivate, 
          requiredLevel 
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erreur lors de la mise à jour");
      } else {
        toast.success("Paramètres tactiques mis à jour");
        window.location.reload();
      }
    } catch {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8 border-white/5 p-6 rounded-2xl bg-zinc-900/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="org-name" className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Nom de l'unité</Label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-black/20 border-white/5 h-10 font-bold italic"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="org-slug" className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Fréquence de lien (Slug)</Label>
          <Input
            id="org-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="bg-black/20 border-white/5 h-10 font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="org-private" className="text-sm font-bold text-white uppercase tracking-tight italic">Escouade Privée</Label>
            <p className="text-[10px] text-zinc-500 font-medium">Masque l'unité des radars de recherche publics.</p>
          </div>
          <Switch 
            id="org-private"
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-white uppercase tracking-tight italic">Habilitation Requise</Label>
              <p className="text-[10px] text-zinc-500 font-medium">Niveau minimum pour postuler à l'unité.</p>
            </div>
            <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-black text-xs italic">
              LVL_{requiredLevel}
            </div>
          </div>
          <Slider 
            value={[requiredLevel]}
            onValueChange={(val) => setRequiredLevel(val[0])}
            max={10}
            min={1}
            step={1}
            className="py-4"
          />
        </div>
      </div>

      <Button type="submit" className="w-full btn-primary-glow font-black uppercase h-12 rounded-xl" disabled={isPending}>
        {isPending ? "Synchronisation..." : "Mettre à jour le protocole"}
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
