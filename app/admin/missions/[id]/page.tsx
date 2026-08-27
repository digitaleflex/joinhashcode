"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ConfirmDialog as AdminConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Save,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
  Copy,
  History,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { getStepMissionDef } from "@/lib/mission-engine";
import { MissionStepsEditor } from "@/components/admin/mission-steps-editor";
import { useMissionPermissions } from "@/hooks/use-mission-permissions";

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
  requirements: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  acceptanceCriteria: z.array(z.string()).default([]),
  fullBriefing: z.string().optional(),
  evaluatorNotes: z.string().optional(),
  qualityIndicators: z.string().optional(),
  resources: z.string().optional(),
  validationCriteria: z.string().optional(),
  prerequisites: z.string().optional(),
  status: z.string().default("DRAFT"),
  publishAt: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  closedAt: z.string().optional().nullable(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

interface MissionData extends MissionFormValues {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  _count: { attempts: number; submissions: number };
}

interface MissionSnapshot {
  id: string;
  missionId: string;
  data: unknown;
  label: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PUBLISHED", label: "Publiée" },
  { value: "CLOSED", label: "Fermée" },
  { value: "ARCHIVED", label: "Archivée" },
];

const STATUS_META: Record<string, { className: string }> = {
  DRAFT: { className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  PUBLISHED: { className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CLOSED: { className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ARCHIVED: { className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function toDatetimeLocal(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { canDelete } = useMissionPermissions();
  const [mission, setMission] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<MissionSnapshot[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState("");
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<MissionSnapshot | null>(null);
  const [duplicating, setDuplicating] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
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
      duration: "",
      missionLevel: "INIT",
      submissionMethod: "ANY_LINK",
      isWeeklyChallenge: false,
      weeklySlot: null,
      requirements: [],
      deliverables: [],
      acceptanceCriteria: [],
      fullBriefing: "",
      evaluatorNotes: "",
      qualityIndicators: "",
      resources: "",
      validationCriteria: "",
      prerequisites: "",
      status: "DRAFT",
      publishAt: null,
      deadline: null,
      closedAt: null,
    },
  });

  const fetchMission = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/missions`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const found = data.missions?.find((m: MissionData) => m.id === id);
      if (!found) {
        toast.error("Mission introuvable");
        router.push("/admin/missions");
        return;
      }
      setMission(found);
      form.reset({
        title: found.title,
        description: found.description,
        shortDesc: found.shortDesc ?? "",
        slug: found.slug,
        category: found.category,
        difficulty: found.difficulty,
        xp: found.xp,
        weightBuilder: found.weightBuilder,
        weightCreator: found.weightCreator,
        weightStrategist: found.weightStrategist,
        weightCatalyst: found.weightCatalyst,
        duration: found.duration ?? "",
        missionLevel: found.missionLevel ?? "INIT",
        submissionMethod: found.submissionMethod,
        isWeeklyChallenge: found.isWeeklyChallenge,
        weeklySlot: found.weeklySlot,
        requirements: found.requirements ?? [],
        deliverables: found.deliverables ?? [],
        acceptanceCriteria: found.acceptanceCriteria ?? [],
        fullBriefing: found.fullBriefing ?? "",
        evaluatorNotes: found.evaluatorNotes ?? "",
        qualityIndicators: found.qualityIndicators ?? "",
        resources: found.resources ?? "",
        validationCriteria: found.validationCriteria ?? "",
        prerequisites: found.prerequisites ?? "",
        status: found.status,
        publishAt: found.publishAt,
        deadline: found.deadline,
        closedAt: found.closedAt,
      });
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [id, router, form]);

  useEffect(() => {
    fetchMission();
  }, [fetchMission]);

  const fetchSnapshots = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/missions/${id}/snapshots`);
      if (!res.ok) return;
      const data = await res.json();
      setSnapshots(data.snapshots ?? []);
    } catch {
      setSnapshots([]);
    }
  }, [id]);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  const handleCreateSnapshot = async () => {
    try {
      setCreatingSnapshot(true);
      const res = await fetch(`/api/admin/missions/${id}/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: snapshotLabel || null }),
      });
      if (!res.ok) throw new Error();
      toast.success("Snapshot créé");
      setSnapshotLabel("");
      fetchSnapshots();
    } catch {
      toast.error("Erreur lors de la création du snapshot");
    } finally {
      setCreatingSnapshot(false);
    }
  };

  const handleRestore = async () => {
    if (!pendingRestore) return;
    try {
      const res = await fetch(`/api/admin/missions/snapshots/${pendingRestore.id}/restore`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      toast.success("Mission restaurée");
      setRestoreOpen(false);
      setPendingRestore(null);
      fetchMission();
      fetchSnapshots();
    } catch {
      toast.error("Erreur lors de la restauration");
    }
  };

  const handleDuplicate = async () => {
    try {
      setDuplicating(true);
      const res = await fetch(`/api/admin/missions/${id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success("Mission dupliquée");
      if (data?.mission?.id) {
        router.push(`/admin/missions/${data.mission.id}`);
      } else {
        router.push("/admin/missions");
      }
    } catch {
      toast.error("Erreur lors de la duplication");
    } finally {
      setDuplicating(false);
    }
  };

  const onSubmit = async (values: MissionFormValues) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/missions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success("Mission mise à jour");
      fetchMission();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "ARCHIVED" || newStatus === "CLOSED") {
      setPendingStatus(newStatus);
      setStatusConfirmOpen(true);
    } else {
      form.setValue("status", newStatus);
    }
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      form.setValue("status", pendingStatus);
    }
    setPendingStatus(null);
    setStatusConfirmOpen(false);
  };

  const handleSoftDelete = async () => {
    try {
      const res = await fetch(`/api/admin/missions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Mission supprimée");
      router.push("/admin/missions");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const addListEntry = (field: "requirements" | "deliverables" | "acceptanceCriteria") => {
    const current = form.getValues(field);
    form.setValue(field, [...current, ""]);
  };

  const updateListEntry = (
    field: "requirements" | "deliverables" | "acceptanceCriteria",
    index: number,
    value: string
  ) => {
    const current = [...form.getValues(field)];
    current[index] = value;
    form.setValue(field, current);
  };

  const removeListEntry = (
    field: "requirements" | "deliverables" | "acceptanceCriteria",
    index: number
  ) => {
    const current = form.getValues(field).filter((_, i) => i !== index);
    form.setValue(field, current);
  };

  if (loading || !mission) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const currentStatus = form.watch("status");
  const statusMeta = STATUS_META[currentStatus] ?? STATUS_META.DRAFT;
  const hasAttempts = mission._count.attempts + mission._count.submissions > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/missions">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
              Édition de Mission
              <Badge
                variant="outline"
                className={`border font-mono text-[9px] uppercase ${statusMeta.className}`}
              >
                {currentStatus}
              </Badge>
            </h1>
            <p className="text-zinc-400 font-mono text-sm mt-1">{mission.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/missions/${id}/preview`}>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs gap-1.5 border-zinc-700 text-zinc-300 hover:text-primary hover:border-primary/40"
            >
              <Eye className="h-3.5 w-3.5" />
              Aperçu
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            disabled={duplicating}
            className="font-mono text-xs gap-1.5 border-zinc-700 text-zinc-300 hover:text-primary hover:border-primary/40"
          >
            <Copy className="h-3.5 w-3.5" />
            {duplicating ? "Duplication..." : "Dupliquer"}
          </Button>
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="font-mono text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          )}
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving}
            className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight text-xs"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {hasAttempts && currentStatus === "DRAFT" && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-400 font-mono text-sm font-bold">Attention</p>
            <p className="text-amber-400/80 font-mono text-xs mt-1">
              Cette mission a {mission._count.attempts} tentative(s) et {mission._count.submissions} soumission(s).
              Archiver cette mission bloquera les soumissions en cours.
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="glass-card rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
              Informations Générales
            </h2>
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
                    <Textarea
                      {...field}
                      className="bg-zinc-900 border-zinc-800 font-mono min-h-[150px]"
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value ?? "INIT"}>
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Durée estimée</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ex: 3-5 jours"
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="submissionMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Méthode de soumission</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="ANY_LINK">Lien</SelectItem>
                        <SelectItem value="TEXT_RESPONSE">Texte</SelectItem>
                        <SelectItem value="LIVE_URL">URL Live</SelectItem>
                        <SelectItem value="DOCUMENT_LINK">Document</SelectItem>
                        <SelectItem value="GITHUB_LINK">GitHub</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end gap-8">
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
                        <FormLabel className="text-zinc-400 text-xs">Slot #</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            className="w-16 bg-zinc-900 border-zinc-800 font-mono text-sm"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
              Poids Psychométriques
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="weightBuilder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Builder</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightCreator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightStrategist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategist</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightCatalyst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catalyst</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="glass-card rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
              Cycle de Vie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Statut</label>
                <Select value={currentStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(currentStatus === "ARCHIVED" || currentStatus === "CLOSED") && (
                  <p className="text-xs font-mono text-amber-400 flex items-center gap-1.5 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    {currentStatus === "ARCHIVED"
                      ? "L'archivage masquera cette mission des utilisateurs."
                      : "La fermeture empêchera les nouvelles soumissions."}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="publishAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Date de publication
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={toDatetimeLocal(field.value)}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Date limite
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={toDatetimeLocal(field.value)}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Date de fermeture
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={toDatetimeLocal(field.value)}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-zinc-900 border-zinc-800 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {(() => {
            const stepDef = getStepMissionDef(mission.slug);
            if (!stepDef) return null;
            return <MissionStepsEditor slug={mission.slug} steps={stepDef.subMissions} />;
          })()}

          <div className="glass-card rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
                Critères d&apos;Acceptation
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListEntry("acceptanceCriteria")}
                className="h-7 border-primary text-primary hover:bg-primary/10"
              >
                + Ajouter
              </Button>
            </div>
            {(form.watch("acceptanceCriteria") ?? []).map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={val}
                  onChange={(e) => updateListEntry("acceptanceCriteria", i, e.target.value)}
                  className="bg-zinc-900 border-zinc-800 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListEntry("acceptanceCriteria", i)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
                Livrables Attendus
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListEntry("deliverables")}
                className="h-7 border-primary text-primary hover:bg-primary/10"
              >
                + Ajouter
              </Button>
            </div>
            {(form.watch("deliverables") ?? []).map((val, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={val}
                  onChange={(e) => updateListEntry("deliverables", i, e.target.value)}
                  className="bg-zinc-900 border-zinc-800 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListEntry("deliverables", i)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
              Critères de validation
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Critères que les reviewers utilisent pour évaluer les soumissions. Supporte le markdown.
            </p>
            <FormField
              control={form.control}
              name="validationCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Décrivez les critères de validation..."
                      className="bg-zinc-900 border-zinc-800 font-mono min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="glass-card rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
              Prérequis
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Ce dont le membre a besoin avant de commencer cette mission. Supporte le markdown.
            </p>
            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Décrivez les prérequis..."
                      className="bg-zinc-900 border-zinc-800 font-mono min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="glass-card rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
                  Champs avancés
                </h2>
              </div>
              {advancedOpen ? (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              )}
            </button>
            {advancedOpen && (
              <div className="px-6 pb-6 space-y-6 border-t border-zinc-800 pt-6">
                <FormField
                  control={form.control}
                  name="fullBriefing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Briefing Complet (avancé)</FormLabel>
                      <p className="text-xs font-mono text-zinc-500">
                        Texte détaillé du briefing, affiché après le briefing principal.
                      </p>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Briefing détaillé..."
                          className="bg-zinc-900 border-zinc-800 font-mono min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="evaluatorNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Notes pour les reviewers</FormLabel>
                      <p className="text-xs font-mono text-zinc-500">
                        Instructions internes visibles uniquement par les reviewers.
                      </p>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Notes internes pour les reviewers..."
                          className="bg-zinc-900 border-zinc-800 font-mono min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualityIndicators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Indicateurs de qualité</FormLabel>
                      <p className="text-xs font-mono text-zinc-500">
                        JSON — indicateurs utilisés pour évaluer la qualité des soumissions.
                      </p>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='[{"key": "...", "label": "...", "max": 5}]'
                          className="bg-zinc-900 border-zinc-800 font-mono min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Ressources externes</FormLabel>
                      <p className="text-xs font-mono text-zinc-500">
                        JSON — liens et ressources pour accompagner la mission.
                      </p>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='[{"title": "...", "url": "..."}]'
                          className="bg-zinc-900 border-zinc-800 font-mono min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-black hover:bg-primary/90 font-mono uppercase tracking-tighter px-8"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="glass-card rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-mono text-primary uppercase tracking-wider">
            Snapshots
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Label className="text-primary text-xs">Libellé (optionnel)</Label>
            <Input
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              placeholder="ex: Avant publication"
              className="bg-zinc-900 border-zinc-800 font-mono text-sm mt-1"
            />
          </div>
          <Button
            onClick={handleCreateSnapshot}
            disabled={creatingSnapshot}
            className="self-end bg-primary text-black hover:bg-primary/90 font-mono uppercase tracking-tighter"
          >
            <History className="h-4 w-4 mr-2" />
            {creatingSnapshot ? "Création..." : "Créer un snapshot"}
          </Button>
        </div>

        <div className="space-y-2">
          {snapshots.length === 0 ? (
            <p className="text-zinc-500 font-mono text-sm">Aucun snapshot pour le moment.</p>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="flex items-center justify-between border border-zinc-800 rounded-lg p-3"
              >
                <div className="flex flex-col">
                  <span className="text-zinc-100 font-mono text-sm">
                    {snap.label ?? "Snapshot sans libellé"}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    {new Date(snap.createdAt).toLocaleString("fr-FR")}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPendingRestore(snap);
                    setRestoreOpen(true);
                  }}
                  className="font-mono text-xs gap-1.5 border-primary text-primary hover:bg-primary/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restaurer
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <AdminConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette mission ?"
        description={`La mission « ${mission.title} » sera masquée. Cette action est réversible.`}
        confirmLabel="Supprimer"
        variant="destructive"
        onConfirm={handleSoftDelete}
      />

      <AdminConfirmDialog
        open={statusConfirmOpen}
        onOpenChange={setStatusConfirmOpen}
        title={`Changer le statut en ${pendingStatus === "ARCHIVED" ? "Archivée" : "Fermée"} ?`}
        description={
          pendingStatus === "ARCHIVED"
            ? "L'archivage masquera cette mission des utilisateurs. Les tentatives en cours seront bloquées."
            : "La fermeture empêchera les nouvelles soumissions."
        }
        confirmLabel="Confirmer"
        variant={pendingStatus === "ARCHIVED" ? "destructive" : "default"}
        onConfirm={confirmStatusChange}
        requireTyping={pendingStatus === "ARCHIVED" ? mission.title : undefined}
      />

      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restaurer cette version ?"
        description={`La mission sera remplacée par le snapshot « ${
          pendingRestore?.label ?? "sans libellé"
        } » (${pendingRestore ? new Date(pendingRestore.createdAt).toLocaleString("fr-FR") : ""}).`}
        confirmText="Restaurer"
        onConfirm={handleRestore}
      />
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />;
}
