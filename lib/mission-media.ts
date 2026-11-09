import { promises as fs } from "fs";
import path from "path";

export type MediaType = "IMAGE" | "VIDEO" | "FILE" | "LINK";

export interface MediaFile {
  type: MediaType;
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  alt?: string;
}

export interface StepMediaConfig {
  allowedTypes: MediaType[];
  maxSize: number;
  maxFiles: number;
}

const MEDIA_CONFIG: Record<string, StepMediaConfig> = {
  IMAGE: { allowedTypes: ["IMAGE"], maxSize: 10 * 1024 * 1024, maxFiles: 5 },
  VIDEO: { allowedTypes: ["VIDEO"], maxSize: 50 * 1024 * 1024, maxFiles: 2 },
  FILE: { allowedTypes: ["FILE"], maxSize: 50 * 1024 * 1024, maxFiles: 3 },
  LINK: { allowedTypes: ["LINK"], maxSize: 0, maxFiles: 10 },
};

const ALLOWED_MIME_TYPES: Record<MediaType, string[]> = {
  IMAGE: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  VIDEO: ["video/mp4", "video/webm", "video/quicktime"],
  FILE: ["application/pdf", "application/zip", "application/x-zip-compressed", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  LINK: [],
};

// ── Artefacts de labo (code, rapports, logs, données) ──────────────────────
// Les MIME types des fichiers de code sont peu fiables selon les navigateurs :
// on valide par extension, avec une taille maximale explicite.
export const ARTIFACT_MAX_SIZE = 25 * 1024 * 1024;

const ARTIFACT_EXTENSIONS = new Set([
  "py", "sql", "ipynb", "md", "txt", "log", "csv", "tsv", "json", "yaml", "yml",
  "toml", "sh", "bash", "js", "jsx", "ts", "tsx", "html", "css", "scss",
  "java", "c", "h", "cpp", "hpp", "go", "rs", "rb", "php", "xml", "ini",
  "pdf", "zip", "png", "jpg", "jpeg", "webp", "gif", "svg",
]);

export function validateArtifactFile(file: File): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: "Fichier vide." };
  }
  if (file.size > ARTIFACT_MAX_SIZE) {
    return { valid: false, error: `Fichier trop volumineux (max ${ARTIFACT_MAX_SIZE / (1024 * 1024)} Mo).` };
  }
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ARTIFACT_EXTENSIONS.has(extension)) {
    return { valid: false, error: `Extension non autorisée : .${extension || "?"}` };
  }
  return { valid: true };
}

export async function uploadMissionMedia(
  missionId: string,
  stepKey: string,
  file: File
): Promise<{ url: string; filename: string; size: number; mimeType: string }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "missions", missionId, stepKey);
  await fs.mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${timestamp}-${sanitizedName}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  const publicUrl = `/uploads/missions/${missionId}/${stepKey}/${filename}`;
  return {
    url: publicUrl,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
  };
}

export interface MediaStepField {
  key: string;
  label: string;
  type: "IMAGE" | "VIDEO" | "FILE" | "LINK";
  required?: boolean;
  hint?: string;
  config?: StepMediaConfig;
}


