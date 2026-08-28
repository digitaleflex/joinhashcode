"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Save, Loader2, GitBranch, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface SpecializationMission {
  missionId: string;
  order: number;
  prerequisites: string[];
  xp: number;
}

interface Specialization {
  id: string;
  specializationId: string;
  class: "BUILDER" | "CREATOR" | "STRATEGIST" | "CATALYST";
  name: string;
  description: string;
  missions: SpecializationMission[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CLASS_LABELS: Record<string, string> = {
  BUILDER: "Builder",
  CREATOR: "Créateur",
  STRATEGIST: "Stratège",
  CATALYST: "Catalyst",
};

const CLASS_COLORS: Record<string, string> = {
  BUILDER: "#B8FF3B",
  CREATOR: "#A855F7",
  STRATEGIST: "#22D3EE",
  CATALYST: "#F97316",
};

const MISSION_TITLES: Record<string, string> = {
  "mission-api-design": "API Design",
  "mission-database-modeling": "Database Modeling",
  "mission-auth-system": "Auth System",
  "mission-caching-layer": "Caching Layer",
  "mission-microservices": "Microservices",
  "mission-docker-fundamentals": "Docker Fundamentals",
  "mission-ci-cd-pipeline": "CI/CD Pipeline",
  "mission-kubernetes-basics": "Kubernetes Basics",
  "mission-terraform-iac": "Terraform IaC",
  "mission-observability-stack": "Observability Stack",
  "mission-mobile-setup": "Mobile Setup",
  "mission-native-navigation": "Native Navigation",
  "mission-offline-first": "Offline First",
  "mission-push-notifications": "Push Notifications",
  "mission-app-store-deploy": "App Store Deploy",
  "mission-user-research": "User Research",
  "mission-wireframing": "Wireframing",
  "mission-design-system": "Design System",
  "mission-prototyping": "Prototyping",
  "mission-usability-testing": "Usability Testing",
  "mission-tech-writing": "Tech Writing",
  "mission-video-production": "Video Production",
  "mission-newsletter-growth": "Newsletter Growth",
  "mission-seo-content": "SEO Content",
  "mission-content-strategy": "Content Strategy",
  "mission-brand-strategy": "Brand Strategy",
  "mission-logo-identity": "Logo Identity",
  "mission-motion-design": "Motion Design",
  "mission-brand-guidelines": "Brand Guidelines",
  "mission-rebrand-project": "Rebrand Project",
  "mission-product-discovery": "Product Discovery",
  "mission-roadmap-planning": "Roadmap Planning",
  "mission-metrics-kpis": "Metrics & KPIs",
  "mission-user-feedback-loop": "User Feedback Loop",
  "mission-product-launch": "Product Launch",
  "mission-market-analysis": "Market Analysis",
  "mission-business-model": "Business Model",
  "mission-go-to-market": "Go to Market",
  "mission-fundraising": "Fundraising",
  "mission-unit-economics": "Unit Economics",
  "mission-growth-loops": "Growth Loops",
  "mission-ab-testing": "A/B Testing",
  "mission-viral-mechanics": "Viral Mechanics",
  "mission-retention-cohorts": "Retention Cohorts",
  "mission-growth-model": "Growth Model",
  "mission-community-strategy": "Community Strategy",
  "mission-onboarding-flow": "Onboarding Flow",
  "mission-ambassador-program": "Ambassador Program",
  "mission-community-events": "Community Events",
  "mission-community-scaling": "Community Scaling",
  "mission-mentoring-basics": "Mentoring Basics",
  "mission-code-review-mentor": "Code Review Mentor",
  "mission-career-coaching": "Career Coaching",
  "mission-group-mentoring": "Group Mentoring",
  "mission-mentorship-program": "Mentorship Program",
  "mission-meetup-organization": "Meetup Organization",
  "mission-hackathon-planning": "Hackathon Planning",
  "mission-speaker-curation": "Speaker Curation",
  "mission-event-marketing": "Event Marketing",
  "mission-conference-production": "Conference Production",
};

export default function AdminParcoursPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState<"BUILDER" | "CREATOR" | "STRATEGIST" | "CATALYST">("BUILDER");

  // Form state
  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialization | null>(null);
  const [specForm, setSpecForm] = useState({
    specializationId: "",
    class: "BUILDER" as "BUILDER" | "CREATOR" | "STRATEGIST" | "CATALYST",
    name: "",
    description: "",
    missions: [] as SpecializationMission[],
    order: 0,
    isActive: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [missionDialogOpen, setMissionDialogOpen] = useState(false);
  const [editingMissionIndex, setEditingMissionIndex] = useState<number | null>(null);
  const [missionForm, setMissionForm] = useState({
    missionId: "",
    order: 0,
    prerequisites: "",
    xp: 200,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/specializations");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSpecializations(data);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSpecs = specializations.filter((s) => s.class === activeClass);

  const resetSpecForm = () => {
    setSpecForm({
      specializationId: "",
      class: activeClass,
      name: "",
      description: "",
      missions: [],
      order: 0,
      isActive: true,
    });
  };

  const resetMissionForm = () => {
    setMissionForm({
      missionId: "",
      order: 0,
      prerequisites: "",
      xp: 200,
    });
  };

  const handleSpecSubmit = async () => {
    try {
      const url = editingSpec
        ? `/api/admin/specializations/${editingSpec.id}`
        : "/api/admin/specializations";
      const method = editingSpec ? "PATCH" : "POST";

      const missions = specForm.missions.map((m, i) => ({
        ...m,
        order: i,
        prerequisites: m.prerequisites,
      }));

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...specForm, missions }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(editingSpec ? "Spécialisation mise à jour" : "Spécialisation créée");
      setSpecDialogOpen(false);
      resetSpecForm();
      setEditingSpec(null);
      fetchData();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleMissionSubmit = () => {
    if (!missionForm.missionId) return;
    const newMission: SpecializationMission = {
      missionId: missionForm.missionId,
      order: editingMissionIndex !== null ? editingMissionIndex : specForm.missions.length,
      prerequisites: missionForm.prerequisites.split(",").map((p) => p.trim()).filter(Boolean),
      xp: missionForm.xp,
    };

    let newMissions = [...specForm.missions];
    if (editingMissionIndex !== null) {
      newMissions[editingMissionIndex] = newMission;
    } else {
      newMissions.push(newMission);
    }

    setSpecForm({ ...specForm, missions: newMissions });
    setMissionDialogOpen(false);
    resetMissionForm();
    setEditingMissionIndex(null);
  };

  const handleEditSpec = (spec: Specialization) => {
    setEditingSpec(spec);
    setSpecForm({
      specializationId: spec.specializationId,
      class: spec.class,
      name: spec.name,
      description: spec.description,
      missions: spec.missions.map((m) => ({
        ...m,
        prerequisites: m.prerequisites,
      })),
      order: spec.order,
      isActive: spec.isActive,
    });
    setSpecDialogOpen(true);
  };

  const handleAddMission = () => {
    setEditingMissionIndex(null);
    setMissionForm({
      missionId: "",
      order: specForm.missions.length,
      prerequisites: "",
      xp: 200,
    });
    setMissionDialogOpen(true);
  };

  const handleEditMission = (index: number, mission: SpecializationMission) => {
    setEditingMissionIndex(index);
    setMissionForm({
      missionId: mission.missionId,
      order: mission.order,
      prerequisites: mission.prerequisites.join(", "),
      xp: mission.xp,
    });
    setMissionDialogOpen(true);
  };

  const handleDeleteMission = (index: number) => {
    const newMissions = specForm.missions.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i }));
    setSpecForm({ ...specForm, missions: newMissions });
  };

  const moveMission = (index: number, direction: "up" | "down") => {
    const newMissions = [...specForm.missions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMissions.length) return;

    [newMissions[index], newMissions[targetIndex]] = [newMissions[targetIndex], newMissions[index]];
    newMissions.forEach((m, i) => { m.order = i; });
    setSpecForm({ ...specForm, missions: newMissions });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/specializations/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Spécialisation supprimée");
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <GitBranch className="h-8 w-8" />
            Parcours — Arbre des Missions
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Éditeur visuel des parcours d'apprentissage par classe.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={activeClass} onValueChange={(v) => setActiveClass(v as "BUILDER" | "CREATOR" | "STRATEGIST" | "CATALYST")} className="flex gap-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1">
            {(["BUILDER", "CREATOR", "STRATEGIST", "CATALYST"] as const).map((cls) => (
              <TabsTrigger
                key={cls}
                value={cls}
                className={cn(
                  "font-mono text-xs px-3 py-1.5",
                  activeClass === cls
                    ? "bg-primary text-black"
                    : "text-zinc-400 hover:text-white"
                )}
                style={{ borderColor: CLASS_COLORS[cls] + "40" }}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: CLASS_COLORS[cls] }}
                />
                {CLASS_LABELS[cls]}
              </TabsTrigger>
            ))}
          </Tabs>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => { resetSpecForm(); setEditingSpec(null); setSpecDialogOpen(true); }} className="font-mono text-xs">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Spécialisation
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {filteredSpecs.length === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-800 text-center py-16">
              <CardContent>
                <GitBranch className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 font-mono mb-4">
                  Aucune spécialisation pour {CLASS_LABELS[activeClass]}
                </p>
                <Button onClick={() => { resetSpecForm(); setEditingSpec(null); setSpecDialogOpen(true); }} className="font-mono text-xs">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredSpecs.map((spec) => (
              <Card key={spec.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden" style={{ borderColor: CLASS_COLORS[spec.class] + "40" }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CLASS_COLORS[spec.class] }}
                      />
                      <div>
                        <CardTitle className="text-lg font-mono flex items-center gap-2">
                          {spec.name}
                          <Badge variant="outline" className="font-mono text-[9px] uppercase" style={{ borderColor: CLASS_COLORS[spec.class], color: CLASS_COLORS[spec.class] }}>
                            {spec.specializationId}
                          </Badge>
                        </CardTitle>
                        <p className="text-zinc-500 text-xs font-mono">{spec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={spec.isActive ? "default" : "outline"} className="font-mono text-xs">
                        {spec.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => handleEditSpec(spec)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => { setDeleteId(spec.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {spec.missions.length === 0 ? (
                      <p className="text-zinc-500 text-sm font-mono text-center py-4">Aucune mission. Cliquez sur "Ajouter une mission".</p>
                    ) : (
                      spec.missions
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((mission, index) => (
                          <div
                            key={`${spec.id}-${mission.missionId}`}
                            className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg group"
                          >
                            <div className="flex flex-col items-center text-zinc-500 shrink-0">
                              <GripVertical className="h-5 w-5 cursor-grab active:cursor-grabbing" />
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 text-zinc-500 hover:text-white hover:bg-white/5"
                                  onClick={() => moveMission(index, "up")}
                                  disabled={index === 0}
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 text-zinc-500 hover:text-white hover:bg-white/5"
                                  onClick={() => moveMission(index, "down")}
                                  disabled={index === spec.missions.length - 1}
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-mono font-bold text-sm truncate">
                                  {MISSION_TITLES[mission.missionId] || mission.missionId}
                                </span>
                                <span className="text-zinc-500 text-xs font-mono">({mission.missionId})</span>
                              </div>
                              {mission.prerequisites.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {mission.prerequisites.map((prereq, i) => (
                                    <Badge key={i} variant="outline" className="font-mono text-[8px] text-zinc-400 border-zinc-700">
                                      {MISSION_TITLES[prereq] || prereq}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
                              <span>Ordre: {mission.order + 1}</span>
                              <span className="text-primary">{mission.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                                onClick={() => handleEditMission(index, mission)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => handleDeleteMission(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-mono text-xs mt-2"
                      onClick={handleAddMission}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une mission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Légende Missions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              {Object.entries(MISSION_TITLES)
                .filter(([id]) => {
                  const spec = specializations.find((s) => s.missions.some((m) => m.missionId === id));
                  return spec?.class === activeClass;
                })
                .map(([id, title]) => (
                  <div key={id} className="flex items-center gap-2 text-sm font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer p-2 rounded hover:bg-white/5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CLASS_COLORS[activeClass] }} />
                    <span className="truncate">{title}</span>
                    <span className="text-zinc-500 text-xs ml-auto">{id}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono">{editingSpec ? "Modifier la spécialisation" : "Nouvelle spécialisation"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">ID Spécialisation *</Label>
                <Input value={specForm.specializationId} onChange={(e) => setSpecForm({ ...specForm, specializationId: e.target.value })} placeholder="BACKEND_DEV" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Classe *</Label>
                <Select value={specForm.class} onValueChange={(v) => setSpecForm({ ...specForm, class: v as any })}>
                  <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUILDER">Builder</SelectItem>
                    <SelectItem value="CREATOR">Créateur</SelectItem>
                    <SelectItem value="STRATEGIST">Stratège</SelectItem>
                    <SelectItem value="CATALYST">Catalyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Nom *</Label>
              <Input value={specForm.name} onChange={(e) => setSpecForm({ ...specForm, name: e.target.value })} placeholder="Backend Developer" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Description</Label>
              <Textarea value={specForm.description} onChange={(e) => setSpecForm({ ...specForm, description: e.target.value })} rows={2} placeholder="Description de la spécialisation..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Ordre d'affichage</Label>
                <Input type="number" value={specForm.order} onChange={(e) => setSpecForm({ ...specForm, order: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Active</Label>
                <Select value={specForm.isActive.toString()} onValueChange={(v) => setSpecForm({ ...specForm, isActive: v === "true" })}>
                  <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Oui</SelectItem>
                    <SelectItem value="false">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-800">
            <Button variant="outline" onClick={() => setSpecDialogOpen(false)} className="font-mono text-xs">Annuler</Button>
            <Button onClick={handleSpecSubmit} className="bg-primary text-black font-mono text-xs" disabled={!specForm.specializationId || !specForm.name}>
              <Save className="h-4 w-4 mr-2" />
              {editingSpec ? "Sauvegarder" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={missionDialogOpen} onOpenChange={setMissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono">{editingMissionIndex !== null ? "Modifier la mission" : "Ajouter une mission"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Mission ID *</Label>
              <Select value={missionForm.missionId} onValueChange={(v) => setMissionForm({ ...missionForm, missionId: v })}>
                <SelectTrigger className="font-mono text-xs"><SelectValue placeholder="Sélectionner une mission" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(MISSION_TITLES)
                    .filter(([id]) => {
                      const spec = specializations.find((s) => s.missions.some((m) => m.missionId === id));
                      return spec?.class === specForm.class;
                    })
                    .map(([id, title]) => (
                      <SelectItem key={id} value={id}>{title} ({id})</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Ordre</Label>
                <Input type="number" value={missionForm.order} onChange={(e) => setMissionForm({ ...missionForm, order: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">XP</Label>
                <Input type="number" value={missionForm.xp} onChange={(e) => setMissionForm({ ...missionForm, xp: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Prérequis (IDs séparés par des virgules)</Label>
              <Input value={missionForm.prerequisites} onChange={(e) => setMissionForm({ ...missionForm, prerequisites: e.target.value })} placeholder="mission-api-design, mission-database-modeling" />
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-800">
            <Button variant="outline" onClick={() => setMissionDialogOpen(false)} className="font-mono text-xs">Annuler</Button>
            <Button onClick={handleMissionSubmit} className="bg-primary text-black font-mono text-xs" disabled={!missionForm.missionId}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Supprimer cette spécialisation ?"
        description="Cette action est irréversible. Toutes les missions associées seront supprimées."
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}