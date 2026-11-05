"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

const missionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  shortDesc: z.string().optional(),
  slug: z.string().min(1, "Le slug est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  difficulty: z.coerce.number().min(1).max(5),
  xp: z.coerce.number().min(0),
  weightBuilder: z.coerce.number().min(0).max(1),
  weightCreator: z.coerce.number().min(0).max(1),
  weightStrategist: z.coerce.number().min(0).max(1),
  weightCatalyst: z.coerce.number().min(0).max(1),
  duration: z.string().optional(),
  missionLevel: z.string().optional(),
  submissionMethod: z.string().default("ANY_LINK"),
  isWeeklyChallenge: z.boolean().default(false),
  weeklySlot: z.coerce.number().optional().nullable(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

interface MissionFormProps {
  initialData?: Record<string, unknown> | null;
  onSuccess: () => void;
}

export function MissionForm({ initialData, onSuccess }: MissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>((initialData?.requirements as string[]) || []);
  const [deliverables, setDeliverables] = useState<string[]>((initialData?.deliverables as string[]) || []);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>((initialData?.acceptanceCriteria as string[]) || []);

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema) as Resolver<MissionFormValues>,
    defaultValues: (initialData as MissionFormValues) || {
      title: "",
      description: "",
      shortDesc: "",
      slug: "",
      category: "BEYOND",
      difficulty: 1,
      xp: 100,
      weightBuilder: 0.25,
      weightCreator: 0.25,
      weightStrategist: 0.25,
      weightCatalyst: 0.25,
      duration: "1h",
      missionLevel: "INIT",
      submissionMethod: "ANY_LINK",
      isWeeklyChallenge: false,
      weeklySlot: null,
    },
  });

  const onSubmit = async (values: MissionFormValues) => {
    try {
      setLoading(true);
      const url = initialData 
        ? `/api/admin/missions/${initialData.id}` 
        : "/api/admin/missions";
      
      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          requirements,
          deliverables,
          acceptanceCriteria,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      toast.success(initialData ? "Mission mise à jour" : "Mission créée");
      onSuccess();
    } catch (error: unknown) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const addListEntry = (setter: Dispatch<SetStateAction<string[]>>, current: string[]) => {
    setter([...current, ""]);
  };

  const updateListEntry = (setter: Dispatch<SetStateAction<string[]>>, current: string[], index: number, value: string) => {
    const next = [...current];
    next[index] = value;
    setter(next);
  };

  const removeListEntry = (setter: Dispatch<SetStateAction<string[]>>, current: string[], index: number) => {
    setter(current.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Titre</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-zinc-900 border-zinc-800 font-mono focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Slug</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-zinc-900 border-zinc-800 font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shortDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Description Courte (Card)</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-900 border-zinc-800 font-mono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Briefing Complet</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-zinc-900 border-zinc-800 font-mono min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="TECH">TECH</SelectItem>
                    <SelectItem value="DESIGN">DESIGN</SelectItem>
                    <SelectItem value="STRATEGY">STRATEGY</SelectItem>
                    <SelectItem value="COMMUNITY">COMMUNITY</SelectItem>
                    <SelectItem value="BEYOND">BEYOND</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="missionLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Niveau</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="INIT">INIT</SelectItem>
                    <SelectItem value="CORE">CORE</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Difficulté (1-5)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-zinc-900 border-zinc-800 font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">XP</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-zinc-900 border-zinc-800 font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-mono text-primary uppercase tracking-wider">Poids Psychométriques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="weightBuilder" render={({ field }) => (
              <FormItem><FormLabel>Builder</FormLabel><FormControl><Input type="number" step="0.1" {...field} className="bg-zinc-900 border-zinc-800 font-mono" /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="weightCreator" render={({ field }) => (
              <FormItem><FormLabel>Creator</FormLabel><FormControl><Input type="number" step="0.1" {...field} className="bg-zinc-900 border-zinc-800 font-mono" /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="weightStrategist" render={({ field }) => (
              <FormItem><FormLabel>Strategist</FormLabel><FormControl><Input type="number" step="0.1" {...field} className="bg-zinc-900 border-zinc-800 font-mono" /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="weightCatalyst" render={({ field }) => (
              <FormItem><FormLabel>Catalyst</FormLabel><FormControl><Input type="number" step="0.1" {...field} className="bg-zinc-900 border-zinc-800 font-mono" /></FormControl></FormItem>
            )} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="text-primary">Critères d'Acceptation</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => addListEntry(setAcceptanceCriteria, acceptanceCriteria)} className="h-7 border-primary text-primary hover:bg-primary/10">
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>
            {acceptanceCriteria.map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input value={val} onChange={(e) => updateListEntry(setAcceptanceCriteria, acceptanceCriteria, i, e.target.value)} className="bg-zinc-900 border-zinc-800 font-mono text-sm" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeListEntry(setAcceptanceCriteria, acceptanceCriteria, i)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="text-primary">Livrables Attendus</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => addListEntry(setDeliverables, deliverables)} className="h-7 border-primary text-primary hover:bg-primary/10">
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>
            {deliverables.map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input value={val} onChange={(e) => updateListEntry(setDeliverables, deliverables, i, e.target.value)} className="bg-zinc-900 border-zinc-800 font-mono text-sm" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeListEntry(setDeliverables, deliverables, i)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 pt-4 border-t border-zinc-800">
          <FormField
            control={form.control}
            name="isWeeklyChallenge"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-primary cursor-pointer">Challenge Hebdo</FormLabel>
              </FormItem>
            )}
          />
          {form.watch("isWeeklyChallenge") && (
            <FormField
              control={form.control}
              name="weeklySlot"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel>Slot #</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} className="w-20 bg-zinc-900 border-zinc-800 font-mono" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button disabled={loading} type="submit" className="bg-primary text-black hover:bg-primary/90 font-mono uppercase tracking-tighter px-8">
            {loading ? "Chargement..." : initialData ? "Mettre à jour" : "Lancer la mission"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
