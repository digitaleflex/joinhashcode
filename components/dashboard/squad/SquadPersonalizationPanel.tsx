"use client"

import { useState, useCallback, useMemo } from "react"
import { Link as LinkIcon, Pencil, X, Check, Loader2, Megaphone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { SquadData } from "@/components/dashboard/squad-journey"

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,28})$/

interface SquadPersonalizationPanelProps {
  squad: SquadData | null
  localName: string
  localSlug: string
  onSave: (name: string, slug: string) => void
}

export function SquadPersonalizationPanel({ squad, localName, localSlug, onSave }: SquadPersonalizationPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editAnnouncement, setEditAnnouncement] = useState("")
  const [editDiscordUrl, setEditDiscordUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const sanitizeSlug = useCallback((value: string) =>
    value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-"), [])

  const slugError = useMemo(
    () => editSlug.length > 0 && !SLUG_REGEX.test(editSlug)
      ? "3–30 caractères · lettres, chiffres et tirets uniquement"
      : null,
    [editSlug]
  )

  const openEdit = () => {
    setEditName(localName)
    setEditSlug(localSlug)
    setEditDescription(squad?.description ?? "")
    setEditAnnouncement(squad?.announcement ?? "")
    setEditDiscordUrl(squad?.discordInviteUrl ?? "")
    setIsEditing(true)
  }

  const saveEdit = async () => {
    if (!editName.trim() || editName.trim().length < 2) { toast.error("Nom trop court (min. 2 caractères)."); return }
    if (!SLUG_REGEX.test(editSlug)) { toast.error("Format du lien invalide."); return }
    setIsSaving(true)
    try {
      const res = await fetch("/api/squad/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug,
          description: editDescription.trim(),
          announcement: editAnnouncement.trim(),
          discordInviteUrl: editDiscordUrl.trim() || null,
          isPrivate: squad?.isPrivate ?? false,
          requiredLevel: squad?.requiredLevel ?? 1,
        }),
      })
      const data = await res.json() as { name?: string; slug?: string; error?: string }
      if (!res.ok) throw new Error(data.error || "Erreur lors de la sauvegarde.")
      onSave(data.name ?? editName, data.slug ?? editSlug)
      setIsEditing(false)
      toast.success("Escouade mise à jour !")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkIcon className="size-4 text-primary" />
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Personnaliser</span>
        </div>
        {!isEditing ? (
          <button onClick={openEdit} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors">
            <Pencil className="size-3" />Modifier
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors">
            <X className="size-3" />Annuler
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          <div>
            <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Nom</div>
            <div className="text-sm font-bold text-white">{localName}</div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Lien d&apos;invitation</div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-zinc-600 text-[10px] font-mono shrink-0">…/invite/</span>
              <span className="text-primary text-[11px] font-mono font-bold truncate">{localSlug}</span>
            </div>
          </div>
          {squad?.description && (
            <div>
              <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Description</div>
              <p className="text-xs text-zinc-400 leading-relaxed">{squad.description}</p>
            </div>
          )}
          {squad?.discordInviteUrl && (
            <div>
              <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider mb-1">Discord</div>
              <a href={squad.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{squad.discordInviteUrl}</a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Nom de l&apos;escouade</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={40}
              placeholder="Ex: Les Bâtisseurs"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-medium placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Lien d&apos;invitation</label>
            <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/40 transition-colors bg-zinc-950">
              <span className="text-zinc-600 text-[10px] font-mono px-3 py-2 border-r border-white/5 shrink-0 bg-zinc-900/60">/invite/</span>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(sanitizeSlug(e.target.value))}
                maxLength={30}
                placeholder="mon-equipe"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-primary font-mono font-bold placeholder:text-zinc-700 focus:outline-none min-w-0"
              />
            </div>
            {slugError && <p className="text-[10px] text-red-400 font-mono">{slugError}</p>}
            {!slugError && editSlug.length >= 3 && (
              <p className="text-[10px] text-primary/60 font-mono flex items-center gap-1">
                <Check className="size-3" /> Format valide
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              Description <span className="text-zinc-700 normal-case">({editDescription.length}/300)</span>
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value.slice(0, 300))}
              rows={3}
              placeholder="Décris l'objectif et l'ambiance de ton escouade..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              <MessageCircle className="size-3" />
              Lien Discord <span className="text-zinc-700 normal-case">(optionnel)</span>
            </label>
            <input
              type="url"
              value={editDiscordUrl}
              onChange={(e) => setEditDiscordUrl(e.target.value)}
              placeholder="https://discord.gg/..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              <Megaphone className="size-3" />
              Annonce épinglée <span className="text-zinc-700 normal-case">({editAnnouncement.length}/200)</span>
            </label>
            <textarea
              value={editAnnouncement}
              onChange={(e) => setEditAnnouncement(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Un message court visible par tous les membres..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 transition-colors resize-none"
            />
          </div>

          <Button
            onClick={saveEdit}
            disabled={isSaving || !!slugError || editSlug.length < 3 || editName.trim().length < 2}
            className="w-full h-9 text-[11px] font-bold uppercase tracking-wide btn-primary-glow"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
          </Button>
        </div>
      )}
    </div>
  )
}
