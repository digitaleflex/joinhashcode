"use client";

import { useRef, useState } from "react";
import { Loader2, Paperclip, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SubmissionSchemaArtifact } from "@/lib/validation/artifacts";

export interface ArtifactDraft {
  key: string;
  type: string;
  value: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}

interface ArtifactFieldsProps {
  missionId: string;
  schema: SubmissionSchemaArtifact[];
  values: Record<string, ArtifactDraft>;
  onChange: (key: string, patch: Partial<ArtifactDraft>) => void;
  disabled?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  REPO: "Dépôt",
  CODE: "Code",
  TEXT: "Texte",
  TABLE: "Tableau",
  DOC: "Document",
  LOG: "Journal / sortie",
  DATA: "Données",
  DIAGRAM: "Schéma",
  FILE: "Fichier",
  LINK: "Lien",
};

function acceptsFile(spec: SubmissionSchemaArtifact): boolean {
  return ["REPO", "FILE", "LINK"].includes(spec.type);
}

function acceptsText(spec: SubmissionSchemaArtifact): boolean {
  return ["CODE", "DOC", "LOG", "DATA", "DIAGRAM"].includes(spec.type);
}

export function ArtifactFields({
  missionId,
  schema,
  values,
  onChange,
  disabled = false,
}: ArtifactFieldsProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const upload = async (spec: SubmissionSchemaArtifact, file: File) => {
    setUploadingKey(spec.key);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("key", spec.key);
      const response = await fetch(`/api/missions/${missionId}/upload`, {
        method: "POST",
        body,
      });
      const payload = (await response.json().catch(() => null)) as
        | { fileUrl?: string; fileName?: string; mimeType?: string; size?: number; message?: string }
        | null;
      if (!response.ok || !payload?.fileUrl) {
        throw new Error(payload?.message ?? "Impossible d'envoyer le fichier.");
      }
      onChange(spec.key, {
        fileUrl: payload.fileUrl,
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        size: payload.size,
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Impossible d'envoyer le fichier.");
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      {schema.map((spec) => {
        const value = values[spec.key] ?? {
          key: spec.key,
          type: spec.type,
          value: "",
        };
        const canUpload = acceptsFile(spec);
        const canText = acceptsText(spec);
        const isUploading = uploadingKey === spec.key;

        return (
          <div
            key={spec.key}
            className="rounded-2xl border border-border/40 bg-card/20 p-4 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {spec.label}
                  {spec.required && <span className="ml-1 text-primary">*</span>}
                </Label>
                <p className="text-3xs text-zinc-500">
                  {spec.type === "REPO" && "Dépôt Git public ou archive ZIP."}
                  {spec.type === "TEXT" && "Réponse écrite directement dans le formulaire."}
                  {spec.type === "TABLE" && "Colle ton tableau (Markdown, TSV ou texte structuré)."}
                  {spec.type === "DIAGRAM" && "Colle un schéma Mermaid ou joins une image."}
                  {spec.type === "LOG" && "Colle la sortie ou joins un fichier de log."}
                  {spec.type === "DATA" && "Joins les données brutes ou un lien."}
                  {spec.type === "DOC" && "Joins un document ou colle son contenu."}
                  {spec.type === "CODE" && "Joins les fichiers ou un lien vers le code."}
                  {spec.type === "LINK" && "URL http(s) accessible."}
                  {acceptsFile(spec) && "Joins un fichier."}
                </p>
              </div>
              <Badge variant="outline" className="text-3xs font-mono uppercase">
                {TYPE_LABELS[spec.type] ?? spec.type}
              </Badge>
            </div>

            {canText && spec.type === "TEXT" ? (
              <Textarea
                value={value.value}
                onChange={(event) => onChange(spec.key, { value: event.target.value })}
                placeholder="Rédige ta réponse ici…"
                className="bg-background/40 border-border/40 min-h-24 rounded-xl text-sm"
                disabled={disabled}
              />
            ) : null}

            {canText && spec.type !== "TEXT" && spec.type !== "REPO" && spec.type !== "LINK" ? (
              <Textarea
                value={value.value}
                onChange={(event) => onChange(spec.key, { value: event.target.value })}
                placeholder={
                  spec.type === "TABLE"
                    ? "Colonne 1 | Colonne 2 | Colonne 3\nvaleur 1 | valeur 2 | valeur 3"
                    : spec.type === "DIAGRAM"
                      ? "flowchart LR\n  A --> B"
                      : "Colle ici le contenu, la sortie ou un lien…"
                }
                className="bg-background/40 border-border/40 min-h-24 rounded-xl font-mono text-xs"
                disabled={disabled}
              />
            ) : null}

            {(spec.type === "REPO" || spec.type === "LINK") && (
              <Input
                value={value.value}
                onChange={(event) => onChange(spec.key, { value: event.target.value })}
                placeholder={
                  spec.type === "REPO"
                    ? "https://github.com/ton-profil/ton-depot"
                    : "https://…"
                }
                className="bg-background/40 border-border/40 h-10 rounded-xl text-sm"
                disabled={disabled}
              />
            )}

            {spec.minItems && spec.minItems > 1 && (
              <p className="text-3xs text-zinc-500">
                Minimum {spec.minItems} éléments — un par ligne si tu colles du texte.
              </p>
            )}
            {spec.minLength && (
              <p className="text-3xs text-zinc-500">
                Minimum {spec.minLength} caractères ({value.value.trim().length}/{spec.minLength}).
              </p>
            )}

            {canUpload && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={(element) => {
                    fileInputs.current[spec.key] = element;
                  }}
                  type="file"
                  className="hidden"
                  disabled={disabled || isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(spec, file);
                    event.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-border/40 text-xs"
                  onClick={() => fileInputs.current[spec.key]?.click()}
                  disabled={disabled || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {value.fileUrl ? "Remplacer le fichier" : "Joindre un fichier"}
                </Button>

                {value.fileUrl && (
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-3xs text-emerald-300">
                    <Paperclip className="h-3 w-3 shrink-0" />
                    <span className="truncate">{value.fileName ?? value.fileUrl}</span>
                    <button
                      type="button"
                      className="text-emerald-400/60 hover:text-emerald-300"
                      onClick={() =>
                        onChange(spec.key, {
                          fileUrl: undefined,
                          fileName: undefined,
                          mimeType: undefined,
                          size: undefined,
                        })
                      }
                      aria-label="Retirer le fichier"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {value.fileUrl && (
              <a
                href={value.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("block truncate text-3xs text-primary hover:underline")}
              >
                {value.fileUrl}
              </a>
            )}
          </div>
        );
      })}

      {uploadError && (
        <p className="text-xs text-red-400">{uploadError}</p>
      )}
    </div>
  );
}
