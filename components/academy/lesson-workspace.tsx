"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, NotebookPen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChecklistGroup {
  title: string;
  items: string[];
}

interface LessonWorkspaceProps {
  contentId: string;
  initialCompleted: boolean;
  initialNote: string;
  initialChecklist: Record<string, boolean>;
  checklistGroups?: ChecklistGroup[];
  mission?: { slug: string; category: string } | null;
  isAuthenticated: boolean;
}

export function LessonWorkspace({
  contentId,
  initialCompleted,
  initialNote,
  initialChecklist,
  checklistGroups = [],
  mission,
  isAuthenticated,
}: LessonWorkspaceProps) {
  const [completed, setCompleted] = React.useState(initialCompleted);
  const [note, setNote] = React.useState(initialNote);
  const [savedNote, setSavedNote] = React.useState(initialNote);
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>(initialChecklist);
  const [saving, setSaving] = React.useState<"complete" | "note" | "checklist" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const totalItems = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
  const doneItems = Object.values(checklist).filter(Boolean).length;
  const ratio = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : completed ? 100 : 0;

  const save = async (
    payload: Record<string, unknown>,
    kind: "complete" | "note" | "checklist",
  ): Promise<boolean> => {
    if (!isAuthenticated) return false;
    setSaving(kind);
    setError(null);
    try {
      const res = await fetch("/api/academy/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, ...payload }),
      });
      if (!res.ok) throw new Error("Impossible d'enregistrer.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer.");
      return false;
    } finally {
      setSaving(null);
    }
  };

  const toggleCompleted = async () => {
    const previous = completed;
    const next = !completed;
    setCompleted(next);
    const ok = await save({ isCompleted: next }, "complete");
    if (!ok) setCompleted(previous);
  };

  const toggleItem = async (key: string) => {
    const previous = checklist;
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    const ok = await save({ checklist: next }, "checklist");
    if (!ok) setChecklist(previous);
  };

  const saveNote = async () => {
    const value = note;
    const ok = await save({ note: value }, "note");
    if (ok) setSavedNote(value);
  };

  return (
    <section className="mt-10 rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Ton espace de travail
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            Avance, annote et prouve
          </h2>
        </div>
        {totalItems > 0 && (
          <div className="min-w-40">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>Checklist</span>
              <span>{doneItems}/{totalItems}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            Connecte-toi
          </Link>{" "}
          pour suivre ta progression, enregistrer tes notes et cocher les étapes du lab.
        </div>
      ) : (
        <>
          {checklistGroups.length > 0 && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {checklistGroups.map((group, groupIndex) => (
                <div key={group.title} className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item, itemIndex) => {
                      const key = `${groupIndex}-${itemIndex}`;
                      const checked = Boolean(checklist[key]);
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => toggleItem(key)}
                            aria-pressed={checked}
                            className="flex w-full items-start gap-2.5 text-left text-sm leading-relaxed text-zinc-300"
                          >
                            {checked ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" aria-hidden />
                            )}
                            <span className={cn(checked && "text-zinc-500 line-through")}>{item}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5">
            <label htmlFor="lesson-note" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <NotebookPen className="h-3.5 w-3.5" aria-hidden />
              Tes notes
            </label>
            <textarea
              id="lesson-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Ce que tu as compris, les points bloquants, tes résultats de mesures..."
              className="mt-2 w-full rounded-2xl border border-border bg-background/50 p-4 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-primary/50"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground">
                {note === savedNote ? "Notes à jour." : "Modifications non enregistrées."}
              </p>
              <Button
                type="button"
                onClick={saveNote}
                disabled={saving === "note" || note === savedNote}
                size="sm"
                className="h-8 rounded-lg px-3 text-xs"
              >
                {saving === "note" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="mr-1.5 h-3.5 w-3.5" aria-hidden />}
                Enregistrer
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button
              type="button"
              onClick={toggleCompleted}
              aria-pressed={completed}
              disabled={saving === "complete"}
              variant={completed ? "default" : "outline"}
              className="h-10 rounded-xl px-4"
            >
              {saving === "complete" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : completed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden />
                  Terminé
                </>
              ) : (
                "Marquer comme terminé"
              )}
            </Button>
            {mission && (
              <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                <Link href={`/missions/${mission.slug}`}>
                  {mission.category === "PROJECT" ? "Soumettre mon projet" : "Soumettre mes preuves"}
                </Link>
              </Button>
            )}
          </div>
        </>
      )}

      {error && <p className="mt-3 text-xs font-medium text-red-400">{error}</p>}
    </section>
  );
}
