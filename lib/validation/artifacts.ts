import { z } from "zod";

export const ARTIFACT_TYPES = [
  "REPO",
  "CODE",
  "TEXT",
  "TABLE",
  "DOC",
  "LOG",
  "DATA",
  "DIAGRAM",
  "LINK",
] as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export interface SubmissionSchemaArtifact {
  key: string;
  label: string;
  type: ArtifactType;
  required?: boolean;
  accepts?: string[];
  minItems?: number;
  minLength?: number;
  maxLength?: number;
  autoCheck?: string;
}

export const artifactInputSchema = z.object({
  key: z.string().min(1).max(80),
  type: z.string().min(1).max(30),
  value: z.string().max(20_000).optional().nullable(),
  fileUrl: z.string().max(2048).optional().nullable(),
  fileName: z.string().max(255).optional().nullable(),
  mimeType: z.string().max(150).optional().nullable(),
  size: z.number().int().nonnegative().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type ArtifactInput = z.infer<typeof artifactInputSchema>;

export const submissionArtifactsSchema = z.array(artifactInputSchema).max(20);

export class ArtifactValidationError extends Error {
  details: string[];

  constructor(details: string[]) {
    super("INVALID_ARTIFACTS");
    this.name = "ArtifactValidationError";
    this.details = details;
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidFileUrl(value: string): boolean {
  if (value.startsWith("/uploads/")) return true;
  return isHttpUrl(value);
}

function countItems(value: string, metadata?: Record<string, unknown> | null): number {
  if (metadata && Array.isArray(metadata.items)) {
    return metadata.items.filter((item) => typeof item === "string" && item.trim().length > 0).length;
  }
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

export function parseSubmissionSchema(value: unknown): SubmissionSchemaArtifact[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      key: typeof item.key === "string" ? item.key : "",
      label: typeof item.label === "string" ? item.label : "",
      type: (typeof item.type === "string" ? item.type : "DOC") as ArtifactType,
      required: item.required !== false,
      accepts: Array.isArray(item.accepts)
        ? item.accepts.filter((entry): entry is string => typeof entry === "string")
        : undefined,
      minItems: typeof item.minItems === "number" ? item.minItems : undefined,
      minLength: typeof item.minLength === "number" ? item.minLength : undefined,
      maxLength: typeof item.maxLength === "number" ? item.maxLength : undefined,
      autoCheck: typeof item.autoCheck === "string" ? item.autoCheck : undefined,
    }))
    .filter((item) => item.key.length > 0 && item.label.length > 0);
}

/**
 * Valide les artefacts soumis contre le contrat du labo.
 * Lève `ArtifactValidationError` avec un message par artefact invalide.
 */
export function validateArtifactsAgainstSchema(
  schema: SubmissionSchemaArtifact[],
  artifacts: ArtifactInput[],
): ArtifactInput[] {
  const errors: string[] = [];
  const allowedKeys = new Set(schema.map((item) => item.key));
  const byKey = new Map(artifacts.map((artifact) => [artifact.key, artifact]));

  for (const artifact of artifacts) {
    if (!allowedKeys.has(artifact.key)) {
      errors.push(`Artefact inconnu : ${artifact.key}.`);
    }
  }

  for (const spec of schema) {
    const artifact = byKey.get(spec.key);
    if (!artifact) {
      if (spec.required) errors.push(`${spec.label} est requis.`);
      continue;
    }

    const value = artifact.value?.trim() ?? "";
    const fileUrl = artifact.fileUrl?.trim() ?? "";
    const hasValue = value.length > 0 || fileUrl.length > 0;

    if (!hasValue) {
      if (spec.required) errors.push(`${spec.label} est requis.`);
      continue;
    }

    if (fileUrl && !isValidFileUrl(fileUrl)) {
      errors.push(`${spec.label} : URL de fichier invalide (fichier joint ou lien http(s) attendu).`);
    }

    if (spec.type === "REPO" || spec.type === "LINK") {
      if (value && !isHttpUrl(value)) {
        errors.push(`${spec.label} doit être une URL http(s) valide.`);
      }
    }

    // Les seuils portent sur le contenu collé : un fichier joint est opaque,
    // on ne peut pas le compter — seule sa présence est exigée.
    if (value.length > 0) {
      if (spec.type === "TEXT") {
        if (spec.minLength && value.length < spec.minLength) {
          errors.push(`${spec.label} doit contenir au moins ${spec.minLength} caractères.`);
        }
        if (spec.maxLength && value.length > spec.maxLength) {
          errors.push(`${spec.label} ne doit pas dépasser ${spec.maxLength} caractères.`);
        }
      }

      if (spec.minItems && countItems(value, artifact.metadata) < spec.minItems) {
        errors.push(`${spec.label} doit contenir au moins ${spec.minItems} éléments.`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ArtifactValidationError(errors);
  }

  return artifacts.map((artifact) => {
    const spec = schema.find((item) => item.key === artifact.key)!;
    return {
      ...artifact,
      type: spec.type,
      metadata: {
        ...(artifact.metadata ?? {}),
        label: spec.label,
      },
    };
  });
}
