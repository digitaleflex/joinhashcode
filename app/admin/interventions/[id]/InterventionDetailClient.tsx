"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Check,
  Clock,
  Users,
  Calendar,
  MapPin,
  Link2,
  Video,
  Trash2,
  Download,
  LifeBuoy,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { format, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import type { Intervention, InterventionAttendee } from "@/generated/prisma/client";

interface InterventionWithAttendees extends Intervention {
  attendees: (InterventionAttendee & { user: { id: string; name: string | null; email: string; pseudo: string | null; image: string | null; class: string | null; level: number } })[];
  _count: { attendees: number };
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Brouillon", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  PUBLISHED: { label: "Publiée", className: "bg-primary/10 text-primary border-primary/20" },
  COMPLETED: { label: "Terminée", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Annulée", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const ATTENDEE_STATUS_META: Record<string, { label: string; className: string }> = {
  REGISTERED: { label: "Inscrit", className: "bg-primary/10 text-primary border-primary/20" },
  ATTENDED: { label: "Présent", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Annulé", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  WAITLIST: { label: "Liste d'attente", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const LOCATION_TYPES = [
  { value: "online", label: "En ligne" },
  { value: "offline", label: "Présentiel" },
  { value: "hybrid", label: "Hybride" },
];

export function InterventionDetailClient({
  intervention,
  userRole,
}: {
  intervention: InterventionWithAttendees;
  userRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: intervention.title,
    description: intervention.description,
    date: format(new Date(intervention.date), "yyyy-MM-dd'T'HH:mm"),
    duration: intervention.duration,
    speaker: intervention.speaker,
    capacity: intervention.capacity,
    location: intervention.location,
    locationUrl: intervention.locationUrl ?? "",
    recordingUrl: intervention.recordingUrl ?? "",
    status: intervention.status,
  });
  const [attendeeEditId, setAttendeeEditId] = useState<string | null>(null);
  const [attendeeEditStatus, setAttendeeEditStatus] = useState("REGISTERED");

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/interventions/${intervention.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          date: new Date(editData.date).toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast.success("Intervention mise à jour");
      router.refresh();
      setEditMode(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendeeStatusChange = async (attendeeId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/interventions/${intervention.id}/attendees`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendeeId, status }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast.success("Statut mis à jour");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/interventions/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      toast.success("Intervention supprimée");
      router.push("/admin/interventions");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/interventions/export`);
      if (!response.ok) throw new Error("Erreur lors de l'export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `intervention-${intervention.id}-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Export téléchargé");
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const sm = STATUS_META[intervention.status] ?? {
    label: intervention.status,
    className: "bg-zinc-500/10 text-zinc-400",
  };

  const registeredCount = intervention.attendees.filter((a) => a.status === "REGISTERED").length;
  const attendedCount = intervention.attendees.filter((a) => a.status === "ATTENDED").length;
  const waitlistCount = intervention.capacity > 0 && registeredCount >= intervention.capacity
    ? intervention.attendees.filter((a) => a.status === "WAITLIST").length
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/interventions">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <LifeBuoy className="h-8 w-8" />
            {intervention.title}
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            {format(new Date(intervention.date), "EEEE dd MMMM yyyy 'à' HH:mm", { locale: fr })} · {intervention.duration} min
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {userRole === "ADMIN" && (
            <>
              <Dialog open={editMode} onOpenChange={setEditMode}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="font-mono">Modifier l'intervention</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="text-sm font-medium text-zinc-300">Titre *</Label>
                      <Input
                        id="edit-title"
                        value={editData.title}
                        onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                        required
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="text-sm font-medium text-zinc-300">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={editData.description}
                        onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                        required
                        rows={3}
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-speaker" className="text-sm font-medium text-zinc-300">Speaker *</Label>
                        <Input
                          id="edit-speaker"
                          value={editData.speaker}
                          onChange={(e) => setEditData((p) => ({ ...p, speaker: e.target.value }))}
                          required
                          className="bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-duration" className="text-sm font-medium text-zinc-300">Durée (min) *</Label>
                        <Input
                          id="edit-duration"
                          type="number"
                          value={editData.duration}
                          onChange={(e) => setEditData((p) => ({ ...p, duration: Number(e.target.value) }))}
                          min={1}
                          max={480}
                          required
                          className="bg-zinc-900 border-zinc-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-capacity" className="text-sm font-medium text-zinc-300">Capacité *</Label>
                        <Input
                          id="edit-capacity"
                          type="number"
                          value={editData.capacity}
                          onChange={(e) => setEditData((p) => ({ ...p, capacity: Number(e.target.value) }))}
                          min={1}
                          max={1000}
                          required
                          className="bg-zinc-900 border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-location" className="text-sm font-medium text-zinc-300">Lieu *</Label>
                        <Select value={editData.location} onValueChange={(v) => setEditData((p) => ({ ...p, location: v }))}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATION_TYPES.map((loc) => (
                              <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-date" className="text-sm font-medium text-zinc-300">Date *</Label>
                      <Input
                        id="edit-date"
                        type="datetime-local"
                        value={editData.date}
                        onChange={(e) => setEditData((p) => ({ ...p, date: e.target.value }))}
                        required
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-locationUrl" className="text-sm font-medium text-zinc-300">URL lieu</Label>
                      <Input
                        id="edit-locationUrl"
                        type="url"
                        value={editData.locationUrl}
                        onChange={(e) => setEditData((p) => ({ ...p, locationUrl: e.target.value }))}
                        placeholder="https://..."
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-recordingUrl" className="text-sm font-medium text-zinc-300">URL enregistrement</Label>
                      <Input
                        id="edit-recordingUrl"
                        type="url"
                        value={editData.recordingUrl}
                        onChange={(e) => setEditData((p) => ({ ...p, recordingUrl: e.target.value }))}
                        placeholder="https://..."
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status" className="text-sm font-medium text-zinc-300">Statut</Label>
                      <Select value={editData.status} onValueChange={(v) => setEditData((p) => ({ ...p, status: v }))}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Brouillon</SelectItem>
                          <SelectItem value="PUBLISHED">Publiée</SelectItem>
                          <SelectItem value="COMPLETED">Terminée</SelectItem>
                          <SelectItem value="CANCELLED">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="border-t border-zinc-800">
                      <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button type="submit" disabled={loading} className="bg-primary text-black">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  setDeleteId(intervention.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Description
            </h2>
            <p className="text-zinc-300 whitespace-pre-wrap">{intervention.description}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Informations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Speaker</span>
                <span className="text-white font-medium">{intervention.speaker}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Durée</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {intervention.duration} min
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Capacité</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {intervention.capacity}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Statut</span>
                <Badge variant="outline" className={`border font-mono text-3xs uppercase ${sm.className}`}>
                  {sm.label}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-zinc-500 font-mono text-xs uppercase">Lieu</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-zinc-700 font-mono text-xs uppercase">
                    {LOCATION_TYPES.find((l) => l.value === intervention.location)?.label || intervention.location}
                  </Badge>
                  {intervention.locationUrl && (
                    <a href={intervention.locationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      Lien
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Inscrits</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {registeredCount} / {intervention.capacity}
                  {waitlistCount > 0 && <span className="text-amber-400 text-xs">(+{waitlistCount} attente)</span>}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-mono text-xs uppercase">Présents</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-400" />
                  {attendedCount}
                </span>
              </div>
              {intervention.recordingUrl && (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-zinc-500 font-mono text-xs uppercase">Enregistrement</span>
                  <a href={intervention.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Voir l'enregistrement
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Participants ({intervention.attendees.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs">Participant</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs">Profil</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Statut</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Inscrit le</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Présent le</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Note</TableHead>
                    <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {intervention.attendees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-zinc-500 font-mono">
                        Aucun participant inscrit
                      </TableCell>
                    </TableRow>
                  ) : (
                    intervention.attendees.map((attendee) => {
                      const asm = ATTENDEE_STATUS_META[attendee.status] ?? {
                        label: attendee.status,
                        className: "bg-zinc-500/10 text-zinc-400",
                      };
                      return (
                        <TableRow key={attendee.id} className="border-zinc-800">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {attendee.user.name?.charAt(0) || attendee.user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">{attendee.user.name || "Sans nom"}</p>
                                <p className="text-zinc-500 text-xs font-mono">{attendee.user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {attendee.user.class ? (
                              <Badge variant="outline" className="border font-mono text-xs uppercase" style={{ background: `${({ builder: "#B8FF3B", creator: "#A855F7", strategist: "#22D3EE", catalyst: "#F97316" } as Record<string, string>)[attendee.user.class] ?? "#fff"}15`, color: ({ builder: "#B8FF3B", creator: "#A855F7", strategist: "#22D3EE", catalyst: "#F97316" } as Record<string, string>)[attendee.user.class] ?? "#fff" }}>
                                {attendee.user.class}
                              </Badge>
                            ) : (
                              <span className="text-zinc-500 text-xs font-mono">—</span>
                            )}
                            <p className="text-zinc-500 text-xs font-mono mt-0.5">LVL {attendee.user.level}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`border font-mono text-3xs uppercase ${asm.className}`}>
                              {asm.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-zinc-400 font-mono text-sm">
                            {format(new Date(attendee.registeredAt), "dd/MM HH:mm", { locale: fr })}
                          </TableCell>
                          <TableCell className="text-center text-zinc-400 font-mono text-sm">
                            {attendee.attendedAt ? format(new Date(attendee.attendedAt), "dd/MM HH:mm", { locale: fr }) : "—"}
                          </TableCell>
                          <TableCell className="text-center text-zinc-400 font-mono text-sm">
                            {attendee.rating ? `${attendee.rating}/5` : "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Select value={attendee.status} onValueChange={(v) => handleAttendeeStatusChange(attendee.id, v)}>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="REGISTERED">Inscrit</SelectItem>
                                <SelectItem value="ATTENDED">Présent</SelectItem>
                                <SelectItem value="CANCELLED">Annulé</SelectItem>
                                <SelectItem value="WAITLIST">Liste d'attente</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </h2>
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => {
                const weekStart = startOfWeek(addWeeks(new Date(intervention.date), i - 1), { weekStartsOn: 1 });
                const weekEnd = endOfWeek(addWeeks(new Date(intervention.date), i - 1), { weekStartsOn: 1 });
                const isCurrentWeek = i === 1;
                return (
                  <div key={i} className={`p-3 rounded-lg text-sm font-mono ${isCurrentWeek ? "bg-primary/10 border border-primary/30" : "bg-white/5"}`}>
                    <div className="flex items-center justify-between">
                      <span>{format(weekStart, "dd MMM", { locale: fr })} - {format(weekEnd, "dd MMM", { locale: fr })}</span>
                      {isCurrentWeek && <span className="text-primary text-xs">Cette semaine</span>}
                    </div>
                    {isCurrentWeek && (
                      <div className="mt-2 p-2 bg-primary/10 rounded text-primary text-xs font-mono">
                        {intervention.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Lieu
            </h2>
            <div className="space-y-2">
              <Badge variant="outline" className="border-zinc-700 font-mono text-xs uppercase w-full justify-start">
                {LOCATION_TYPES.find((l) => l.value === intervention.location)?.label || intervention.location}
              </Badge>
              {intervention.locationUrl && (
                <a href={intervention.locationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  {intervention.locationUrl}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Supprimer cette intervention ?"
        description={`L'intervention « ${intervention.title} » sera supprimée définitivement avec tous ses participants.`}
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}