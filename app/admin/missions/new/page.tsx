"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "sonner";

const missionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  shortDesc: z.string().optional(),
  slug: z.string().min(1, "Le slug est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  difficulty: z.coerce.number().min(1).max(5),
  xp: z.coerce.number().min(0),
  missionLevel: z.string().optional(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

export default function NewMissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema) as Resolver<MissionFormValues>,
    defaultValues: {
      title: "",
      description: "",
      shortDesc: "",
      slug: "",
      category: "BEYOND",
      difficulty: 1,
      xp: 100,
      missionLevel: "INIT",
    },
  });

  const onSubmit = async (values: MissionFormValues) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          weightBuilder: 0.25,
          weightCreator: 0.25,
          weightStrategist: 0.25,
          weightCatalyst: 0.25,
          submissionMethod: "ANY_LINK",
          status: "DRAFT",
        }),
      });
      if (!res.ok) throw new Error();
      const mission = await res.json();
      toast.success("Mission créée");
      router.push(`/admin/missions/${mission.id}`);
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <Link href="/admin/missions">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-mono font-bold text-primary tracking-tighter uppercase">
            Nouvelle Mission
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Créer une nouvelle mission pour la communauté.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-lg p-6 max-w-3xl">
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
                      <Input
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono focus:border-primary"
                      />
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
                  <FormLabel className="text-primary">Description Courte</FormLabel>
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
                  <FormLabel className="text-primary">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-zinc-900 border-zinc-800 font-mono min-h-[120px]"
                    />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? "INIT"}>
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
                      <Input
                        type="number"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
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
                      <Input
                        type="number"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-black hover:bg-primary/90 font-mono uppercase tracking-tighter px-8"
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? "Création..." : "Créer la mission"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
