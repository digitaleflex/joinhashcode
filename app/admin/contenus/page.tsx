"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Save, Loader2, FileText, BookOpen, Layers } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Atelier {
  id: string;
  slug: string;
  title: string;
  duration: string;
  description: string;
  profile: "builder" | "creator" | "strategist" | "catalyst";
  specializationId: string;
  specializationLabel: string;
  order: number;
  xpReward: number;
  missionSlugs: string[];
  pourquoi: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileContent {
  id: string;
  profile: "builder" | "creator" | "strategist" | "catalyst";
  pain: string;
  painBold: string;
  truths: { icon: string; bold: string; rest: string }[];
  unlockedMissions: { title: string; xp: number }[];
  lockedMissions: { title: string; xp: number }[];
  socialProof: string;
  whatsappText: string;
  ctaLabel: string;
  possibleSpecializations: any[];
  createdAt: string;
  updatedAt: string;
}

const PROFILES = ["builder", "creator", "strategist", "catalyst"] as const;
const PROFILE_LABELS: Record<string, string> = {
  builder: "Builder",
  creator: "Créateur",
  strategist: "Stratège",
  catalyst: "Catalyst",
};
const PROFILE_COLORS: Record<string, string> = {
  builder: "#B8FF3B",
  creator: "#A855F7",
  strategist: "#22D3EE",
  catalyst: "#F97316",
};

export default function AdminContenusPage() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [profileContents, setProfileContents] = useState<ProfileContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ateliers" | "profiles">("ateliers");

  // Atelier form state
  const [atelierDialogOpen, setAtelierDialogOpen] = useState(false);
  const [editingAtelier, setEditingAtelier] = useState<Atelier | null>(null);
  const [atelierForm, setAtelierForm] = useState({
    slug: "",
    title: "",
    duration: "45 min",
    description: "",
    profile: "builder" as "builder" | "creator" | "strategist" | "catalyst",
    specializationId: "",
    specializationLabel: "",
    order: 0,
    xpReward: 50,
    missionSlugs: "",
    pourquoi: "",
    isActive: true,
  });

  // Profile content form state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileContent | null>(null);
  const [profileForm, setProfileForm] = useState({
    profile: "builder" as "builder" | "creator" | "strategist" | "catalyst",
    pain: "",
    painBold: "",
    truths: [{ icon: "", bold: "", rest: "" }, { icon: "", bold: "", rest: "" }, { icon: "", bold: "", rest: "" }],
    unlockedMissions: [{ title: "", xp: 50 }, { title: "", xp: 30 }],
    lockedMissions: [{ title: "", xp: 60 }, { title: "", xp: 40 }, { title: "", xp: 80 }],
    socialProof: "",
    whatsappText: "",
    ctaLabel: "",
    possibleSpecializations: [] as any[],
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"atelier" | "profile" | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ateliersRes, profilesRes] = await Promise.all([
        fetch("/api/admin/ateliers"),
        fetch("/api/admin/profile-content"),
      ]);
      if (!ateliersRes.ok || !profilesRes.ok) throw new Error("Failed to fetch");
      const ateliersData = await ateliersRes.json();
      const profilesData = await profilesRes.json();
      setAteliers(ateliersData);
      setProfileContents(profilesData);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetAtelierForm = () => {
    setAtelierForm({
      slug: "",
      title: "",
      duration: "45 min",
      description: "",
      profile: "builder",
      specializationId: "",
      specializationLabel: "",
      order: 0,
      xpReward: 50,
      missionSlugs: "",
      pourquoi: "",
      isActive: true,
    });
  };

  const resetProfileForm = () => {
    setProfileForm({
      profile: "builder",
      pain: "",
      painBold: "",
      truths: [{ icon: "", bold: "", rest: "" }, { icon: "", bold: "", rest: "" }, { icon: "", bold: "", rest: "" }],
      unlockedMissions: [{ title: "", xp: 50 }, { title: "", xp: 30 }],
      lockedMissions: [{ title: "", xp: 60 }, { title: "", xp: 40 }, { title: "", xp: 80 }],
      socialProof: "",
      whatsappText: "",
      ctaLabel: "",
      possibleSpecializations: [],
    });
  };

  const handleAtelierSubmit = async () => {
    try {
      const url = editingAtelier
        ? `/api/admin/ateliers/${editingAtelier.id}`
        : "/api/admin/ateliers";
      const method = editingAtelier ? "PATCH" : "POST";

      const missionSlugs = atelierForm.missionSlugs
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...atelierForm, missionSlugs }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(editingAtelier ? "Atelier mis à jour" : "Atelier créé");
      setAtelierDialogOpen(false);
      resetAtelierForm();
      setEditingAtelier(null);
      fetchData();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleProfileSubmit = async () => {
    try {
      const url = editingProfile
        ? `/api/admin/profile-content/${editingProfile.id}`
        : "/api/admin/profile-content";
      const method = editingProfile ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(editingProfile ? "Contenu profil mis à jour" : "Contenu profil créé");
      setProfileDialogOpen(false);
      resetProfileForm();
      setEditingProfile(null);
      fetchData();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleEditAtelier = (atelier: Atelier) => {
    setEditingAtelier(atelier);
    setAtelierForm({
      slug: atelier.slug,
      title: atelier.title,
      duration: atelier.duration,
      description: atelier.description,
      profile: atelier.profile,
      specializationId: atelier.specializationId,
      specializationLabel: atelier.specializationLabel,
      order: atelier.order,
      xpReward: atelier.xpReward,
      missionSlugs: atelier.missionSlugs.join(", "),
      pourquoi: atelier.pourquoi,
      isActive: atelier.isActive,
    });
    setAtelierDialogOpen(true);
  };

  const handleEditProfile = (content: ProfileContent) => {
    setEditingProfile(content);
    setProfileForm({
      profile: content.profile,
      pain: content.pain,
      painBold: content.painBold,
      truths: content.truths,
      unlockedMissions: content.unlockedMissions,
      lockedMissions: content.lockedMissions,
      socialProof: content.socialProof,
      whatsappText: content.whatsappText,
      ctaLabel: content.ctaLabel,
      possibleSpecializations: content.possibleSpecializations,
    });
    setProfileDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    try {
      const url = deleteType === "atelier"
        ? `/api/admin/ateliers/${deleteId}`
        : `/api/admin/profile-content/${deleteId}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${deleteType === "atelier" ? "Atelier" : "Contenu profil"} supprimé`);
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
      setDeleteType(null);
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
            <Layers className="h-8 w-8" />
            Contenus
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Gestion des ateliers, contenus de profils et spécialisations.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "profiles" | "ateliers")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 border border-zinc-800">
          <TabsTrigger value="ateliers" className="font-mono text-xs">
            <BookOpen className="h-4 w-4 mr-2" />
            Ateliers
          </TabsTrigger>
          <TabsTrigger value="profiles" className="font-mono text-xs">
            <FileText className="h-4 w-4 mr-2" />
            Contenus Profils
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ateliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <Card className="bg-zinc-900/50 border-zinc-800 flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">{ateliers.length} ateliers</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Input
                  placeholder="Filtrer par titre, slug..."
                  className="max-w-xs"
                  onChange={(e) => {
                    // Could add client-side filtering
                  }}
                />
              </CardContent>
            </Card>
            <Button onClick={() => { resetAtelierForm(); setEditingAtelier(null); setAtelierDialogOpen(true); }} className="font-mono text-xs">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Atelier
            </Button>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs">Titre</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs">Profil</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs">Spécialisation</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">Ordre</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs text-center">XP</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs">Statut</TableHead>
                  <TableHead className="text-zinc-400 font-mono uppercase text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ateliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-zinc-500 font-mono">
                      Aucun atelier. Cliquez sur "Nouvel Atelier" pour commencer.
                    </TableCell>
                  </TableRow>
                ) : (
                  ateliers.map((atelier) => (
                    <TableRow key={atelier.id} className="border-zinc-800 hover:bg-primary/5">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-mono font-bold text-sm">{atelier.title}</span>
                          <span className="text-zinc-500 text-xs font-mono">{atelier.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border font-mono text-[9px] uppercase"
                          style={{ borderColor: PROFILE_COLORS[atelier.profile], color: PROFILE_COLORS[atelier.profile] }}
                        >
                          {PROFILE_LABELS[atelier.profile]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-zinc-700 font-mono text-[10px]">
                          {atelier.specializationLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-zinc-300 font-mono text-sm">{atelier.order}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-primary font-mono font-bold">{atelier.xpReward} XP</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={atelier.isActive ? "default" : "outline"} className="font-mono text-xs">
                          {atelier.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/10"
                            onClick={() => handleEditAtelier(atelier)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => { setDeleteId(atelier.id); setDeleteType("atelier"); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <div className="flex justify-between items-center">
            <Card className="bg-zinc-900/50 border-zinc-800 flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">{profileContents.length} profils configurés</CardTitle>
              </CardHeader>
            </Card>
            <Button onClick={() => { resetProfileForm(); setEditingProfile(null); setProfileDialogOpen(true); }} className="font-mono text-xs">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter/Modifier Profil
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROFILES.map((profile) => {
              const content = profileContents.find((c) => c.profile === profile);
              return (
                <Card key={profile} className="bg-zinc-900/50 border-zinc-800" style={{ borderColor: PROFILE_COLORS[profile] + "40" }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono flex items-center gap-2" style={{ color: PROFILE_COLORS[profile] }}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PROFILE_COLORS[profile] }} />
                        {PROFILE_LABELS[profile]}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-xs" style={{ borderColor: PROFILE_COLORS[profile], color: PROFILE_COLORS[profile] }}>
                        {content ? "Configuré" : "Vide"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {content && (
                      <>
                        <p className="text-zinc-400 text-xs font-mono line-clamp-2">{content.pain}</p>
                        <div className="flex flex-wrap gap-1">
                          {content.possibleSpecializations.slice(0, 3).map((s: any, i: number) => (
                            <Badge key={i} variant="outline" className="font-mono text-[9px]">
                              {s.label}
                            </Badge>
                          ))}
                          {content.possibleSpecializations.length > 3 && (
                            <Badge variant="outline" className="font-mono text-[9px] text-zinc-500">
                              +{content.possibleSpecializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                    {!content && (
                      <p className="text-zinc-500 text-xs font-mono text-center py-4">Aucun contenu configuré</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-mono text-xs mt-2"
                      style={{ borderColor: PROFILE_COLORS[profile], color: PROFILE_COLORS[profile] }}
                      onClick={() => handleEditProfile(content || { id: "", profile, pain: "", painBold: "", truths: [], unlockedMissions: [], lockedMissions: [], socialProof: "", whatsappText: "", ctaLabel: "", possibleSpecializations: [], createdAt: "", updatedAt: "" } as ProfileContent)}
                    >
                      {content ? "Éditer" : "Configurer"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={atelierDialogOpen} onOpenChange={setAtelierDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono">{editingAtelier ? "Modifier l'atelier" : "Nouvel atelier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Slug *</Label>
                <Input value={atelierForm.slug} onChange={(e) => setAtelierForm({ ...atelierForm, slug: e.target.value })} placeholder="mon-atelier-unique" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Titre *</Label>
                <Input value={atelierForm.title} onChange={(e) => setAtelierForm({ ...atelierForm, title: e.target.value })} placeholder="Titre de l'atelier" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Durée</Label>
                <Input value={atelierForm.duration} onChange={(e) => setAtelierForm({ ...atelierForm, duration: e.target.value })} placeholder="45 min" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Profil *</Label>
                <Select value={atelierForm.profile} onValueChange={(v) => setAtelierForm({ ...atelierForm, profile: v as "builder" | "creator" | "strategist" | "catalyst" })}>
                  <SelectTrigger className="font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map((p) => (
                      <SelectItem key={p} value={p}>{PROFILE_LABELS[p]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Spécialisation ID *</Label>
                <Input value={atelierForm.specializationId} onChange={(e) => setAtelierForm({ ...atelierForm, specializationId: e.target.value })} placeholder="fullstack" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Label Spécialisation *</Label>
                <Input value={atelierForm.specializationLabel} onChange={(e) => setAtelierForm({ ...atelierForm, specializationLabel: e.target.value })} placeholder="Développement Fullstack" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Ordre</Label>
                <Input type="number" value={atelierForm.order} onChange={(e) => setAtelierForm({ ...atelierForm, order: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">XP Récompense</Label>
                <Input type="number" value={atelierForm.xpReward} onChange={(e) => setAtelierForm({ ...atelierForm, xpReward: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Actif</Label>
                <Select value={atelierForm.isActive.toString()} onValueChange={(v) => setAtelierForm({ ...atelierForm, isActive: v === "true" })}>
                  <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Oui</SelectItem>
                    <SelectItem value="false">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Description *</Label>
              <Textarea value={atelierForm.description} onChange={(e) => setAtelierForm({ ...atelierForm, description: e.target.value })} rows={3} placeholder="Description détaillée..." />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Pourquoi *</Label>
              <Textarea value={atelierForm.pourquoi} onChange={(e) => setAtelierForm({ ...atelierForm, pourquoi: e.target.value })} rows={2} placeholder="Pourquoi cet atelier est important..." />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Mission Slugs (séparés par des virgules)</Label>
              <Input value={atelierForm.missionSlugs} onChange={(e) => setAtelierForm({ ...atelierForm, missionSlugs: e.target.value })} placeholder="mission-1, mission-2" />
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-800">
            <Button variant="outline" onClick={() => setAtelierDialogOpen(false)} className="font-mono text-xs">Annuler</Button>
            <Button onClick={handleAtelierSubmit} className="bg-primary text-black font-mono text-xs" disabled={!atelierForm.slug || !atelierForm.title}>
              <Save className="h-4 w-4 mr-2" />
              {editingAtelier ? "Sauvegarder" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono">{editingProfile ? "Modifier le contenu profil" : "Nouveau contenu profil"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Profil *</Label>
              <Select value={profileForm.profile} onValueChange={(v) => setProfileForm({ ...profileForm, profile: v as any })}>
                <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROFILES.map((p) => (
                    <SelectItem key={p} value={p}>{PROFILE_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Pain Point *</Label>
              <Textarea value={profileForm.pain} onChange={(e) => setProfileForm({ ...profileForm, pain: e.target.value })} rows={2} placeholder="Le problème principal..." />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Pain Bold *</Label>
              <Input value={profileForm.painBold} onChange={(e) => setProfileForm({ ...profileForm, painBold: e.target.value })} placeholder="Partie en gras du pain point" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Social Proof</Label>
              <Textarea value={profileForm.socialProof} onChange={(e) => setProfileForm({ ...profileForm, socialProof: e.target.value })} rows={2} placeholder="Preuve sociale..." />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">WhatsApp Text</Label>
              <Textarea value={profileForm.whatsappText} onChange={(e) => setProfileForm({ ...profileForm, whatsappText: e.target.value })} rows={2} placeholder="Texte de partage WhatsApp..." />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">CTA Label</Label>
              <Input value={profileForm.ctaLabel} onChange={(e) => setProfileForm({ ...profileForm, ctaLabel: e.target.value })} placeholder="Rejoindre le Guild Builder →" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Truths (3 requis)</Label>
              <div className="space-y-2">
                {profileForm.truths.map((t, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <Input value={t.icon} onChange={(e) => { const arr = [...profileForm.truths]; arr[i] = { ...arr[i], icon: e.target.value }; setProfileForm({ ...profileForm, truths: arr }); }} placeholder="🔁" className="w-12" />
                    <Input value={t.bold} onChange={(e) => { const arr = [...profileForm.truths]; arr[i] = { ...arr[i], bold: e.target.value }; setProfileForm({ ...profileForm, truths: arr }); }} placeholder="Bold part" />
                    <Input value={t.rest} onChange={(e) => { const arr = [...profileForm.truths]; arr[i] = { ...arr[i], rest: e.target.value }; setProfileForm({ ...profileForm, truths: arr }); }} placeholder="Rest of text" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-zinc-800">
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)} className="font-mono text-xs">Annuler</Button>
            <Button onClick={handleProfileSubmit} className="bg-primary text-black font-mono text-xs" disabled={!profileForm.profile || !profileForm.pain}>
              <Save className="h-4 w-4 mr-2" />
              {editingProfile ? "Sauvegarder" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) { setDeleteId(null); setDeleteType(null); } }}
        title={deleteType === "atelier" ? "Supprimer cet atelier ?" : "Supprimer ce contenu profil ?"}
        description={deleteType === "atelier"
          ? "Cette action est irréversible."
          : "Cette action supprimera tout le contenu du profil."}
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}