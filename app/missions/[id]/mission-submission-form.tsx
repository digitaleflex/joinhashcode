"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send, ChevronRight, ChevronLeft, Check, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MissionSubmissionFormProps {
  missionId: string;
  submissionMethod: string;
  revisionNotes?: string | null;
  reviewerFeedback?: string | null;
  revisionCount?: number;
}

import { NeuralScanner } from "@/components/missions/neural-scanner";

export function MissionSubmissionForm({
  missionId,
  submissionMethod,
  revisionNotes,
  reviewerFeedback,
  revisionCount = 0,
}: MissionSubmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showRetroForm, setShowRetroForm] = useState(false);

  // Form State
  const [content, setContent] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [userDifficulty, setUserDifficulty] = useState(3);
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState("");

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Veuillez fournir le lien ou le contenu requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId,
          content,
        })
      });

      if (!res.ok) throw new Error(await res.text());

      await res.json();
      setSubmitSuccess(true);
      toast.success("Mission transmise avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };
const handleSubmitRetro = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch(`/api/missions/${missionId}/retrospective`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectDescription,
        userDifficulty,
        userRating,
        userFeedback,
      })
    });

    if (!res.ok) throw new Error(await res.text());

    setShowScanner(true);
  } catch (error: any) {
    toast.error(error.message || "Erreur lors de la rétrospective");
    setIsSubmitting(false);
  }
};


  if (showScanner) {
    return (
      <NeuralScanner 
        onComplete={() => {
          toast.success("Analyse terminée. Synchronisation effectuée !");
          router.refresh();
        }} 
      />
    );
  }

  if (submitSuccess && !showRetroForm) {
    return (
      <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center">
            <Check className="size-8 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Mission soumise ✓</h3>
            <p className="text-xs text-zinc-400 font-light max-w-xs">
              Ta soumission est en file d'attente. Un reviewer va l'examiner sous 48h.
            </p>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl text-left space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-3.5 text-primary shrink-0" />
            <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
              Partage ton expérience — optionnel
            </p>
          </div>
          <p className="text-[9px] text-zinc-500 leading-relaxed">
            Tes retours aident à améliorer les missions pour tous les membres.
            Ça prend 30 secondes.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRetroForm(true)}
              className="flex-1 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/20 transition-all"
            >
              Donner mon avis
            </button>
            <button
              onClick={() => {
                setShowScanner(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 text-[10px] font-bold hover:text-white transition-all"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showRetroForm) {
    const isTextResponse = submissionMethod === "TEXT_RESPONSE" || missionId === "introduction-ancrage";
    const hasRevision = !!revisionNotes;

    return (
      <div className="space-y-4">
        {hasRevision && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Révision #{revisionCount} — Points à corriger
            </p>
            {reviewerFeedback && (
              <p className="text-xs text-zinc-300 leading-relaxed italic">"{reviewerFeedback}"</p>
            )}
            <ul className="space-y-1.5">
              {revisionNotes!.split("\n").filter(Boolean).map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-300/80">
                  <span className="text-amber-500 mt-0.5">—</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmitStep1} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {missionId === "introduction-ancrage" ? "Ton ancrage (Projet + Objectif)_" : "Contenu de la mission / Lien_"}
            </Label>
            {isTextResponse ? (
              <Textarea
                placeholder={missionId === "introduction-ancrage"
                  ? "Ex: Je construis un SaaS de gestion de tâches. Mon objectif est d'avoir 100 utilisateurs actifs dans 3 mois."
                  : "Rédige ta réponse ici..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-card/30 border-border/40 min-h-30 rounded-xl focus:ring-primary/20 transition-all text-sm"
                required
                autoFocus
              />
            ) : (
              <Input
                placeholder={
                  submissionMethod === "GITHUB_LINK" ? "https://github.com/ton-profil/projet" :
                  submissionMethod === "LIVE_URL" ? "https://ton-projet.vercel.app" :
                  "https://..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-card/30 border-border/40 h-11 rounded-xl focus:ring-primary/20 transition-all text-sm"
                required
                autoFocus
              />
            )}
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl btn-primary-glow group" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Transmettre pour validation
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitRetro} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => setShowRetroForm(false)}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-[10px] font-mono uppercase tracking-wider text-primary">Rétrospection_</span>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Explique ton projet (Brief)_</Label>
        <Textarea
          placeholder="Qu'as-tu mis en place ? Quels outils as-tu utilisés ?"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="bg-card/30 border-border/40 rounded-xl min-h-20 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Difficulté_</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setUserDifficulty(val)}
                className={`flex-1 h-7 rounded-lg text-[10px] font-mono border transition-all ${userDifficulty === val ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Note_</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setUserRating(val)}
                className={`flex-1 h-7 rounded-lg text-xs border transition-all ${userRating >= val ? "bg-primary/10 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Ton avis global_</Label>
        <Textarea
          placeholder="Qu'as-tu pensé de cet exercice ?"
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          className="bg-card/30 border-border/40 rounded-xl min-h-15 text-sm"
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-xl btn-primary-glow" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        Finaliser la transmission
      </Button>
    </form>
  );
}
