"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import Link from "next/link";

const LOCATION_TYPES = [
  { value: "online", label: "En ligne" },
  { value: "offline", label: "Présentiel" },
  { value: "hybrid", label: "Hybride" },
];

const STATUS_TYPES = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PUBLISHED", label: "Publiée" },
];

export default function NewInterventionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: 60,
    speaker: "",
    capacity: 50,
    location: "online",
    locationUrl: "",
    recordingUrl: "",
    status: "DRAFT",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création");
      }

      const intervention = await response.json();
      toast.success("Intervention créée");
      router.push(`/admin/interventions/${intervention.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/interventions">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <Calendar className="h-8 w-8" />
            Nouvelle Intervention
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Créez un nouvel événement, atelier ou conférence
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-primary font-mono">01</span>
            Informations générales
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-zinc-300">
                Titre *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de l'intervention"
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-zinc-300">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description détaillée de l'intervention"
                required
                rows={4}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speaker" className="text-sm font-medium text-zinc-300">
                  Speaker / Intervenant *
                </Label>
                <Input
                  id="speaker"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  placeholder="Nom du speaker"
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-zinc-300">
                  Durée (minutes) *
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  min={1}
                  max={480}
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-sm font-medium text-zinc-300">
                  Capacité *
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={1}
                  max={1000}
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-zinc-300">
                  Type de lieu *
                </Label>
                <Select value={formData.location} onValueChange={handleChange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-zinc-300">
                Date et heure *
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-primary font-mono">02</span>
            Liens et ressources
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationUrl" className="text-sm font-medium text-zinc-300">
                URL du lieu (pour événements en ligne/hybrides)
              </Label>
              <Input
                id="locationUrl"
                name="locationUrl"
                type="url"
                value={formData.locationUrl}
                onChange={handleChange}
                placeholder="https://zoom.us/... ou https://meet.google.com/..."
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordingUrl" className="text-sm font-medium text-zinc-300">
                URL d'enregistrement (après l'événement)
              </Label>
              <Input
                id="recordingUrl"
                name="recordingUrl"
                type="url"
                value={formData.recordingUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/... ou https://vimeo.com/..."
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-primary font-mono">03</span>
            Statut
          </h2>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-zinc-300">
              Statut initial
            </Label>
            <Select value={formData.status} onValueChange={handleChange}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_TYPES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/interventions">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-primary text-black font-mono font-bold uppercase tracking-tight">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Création..." : "Créer l'intervention"}
          </Button>
        </div>
      </form>
    </div>
  );
}