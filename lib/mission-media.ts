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

export function getMediaConfig(type: MediaType): StepMediaConfig {
  return MEDIA_CONFIG[type];
}

export function validateMediaFile(file: File, type: MediaType): { valid: boolean; error?: string } {
  const config = MEDIA_CONFIG[type];
  const allowedMimes = ALLOWED_MIME_TYPES[type];

  if (type !== "LINK" && config.allowedTypes.length > 0) {
    if (!allowedMimes.includes(file.type)) {
      return { valid: false, error: `Type de fichier non autorisé. Types acceptés : ${allowedMimes.join(", ")}` };
    }
    if (file.size > config.maxSize) {
      const maxMB = config.maxSize / (1024 * 1024);
      return { valid: false, error: `Fichier trop volumineux (max ${maxMB}MB)` };
    }
  }
  return { valid: true };
}

export function validateMediaFiles(files: File[], type: MediaType): { valid: boolean; error?: string } {
  const config = MEDIA_CONFIG[type];
  if (files.length > config.maxFiles) {
    return { valid: false, error: `Trop de fichiers (max ${config.maxFiles})` };
  }
  for (const file of files) {
    const result = validateMediaFile(file, type);
    if (!result.valid) return result;
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

export async function uploadMissionMediaMultiple(
  missionId: string,
  stepKey: string,
  files: File[]
): Promise<Array<{ url: string; filename: string; size: number; mimeType: string }>> {
  const results = [];
  for (const file of files) {
    results.push(await uploadMissionMedia(missionId, stepKey, file));
  }
  return results;
}

export async function deleteMissionMedia(missionId: string, stepKey: string, filename: string): Promise<void> {
  const filepath = path.join(process.cwd(), "public", "uploads", "missions", missionId, stepKey, filename);
  try {
    await fs.unlink(filepath);
  } catch {
    // Ignore if file doesn't exist
  }
}

export function getMediaFieldType(): StepFieldType[] {
  return ["IMAGE", "VIDEO", "FILE", "LINK"];
}

export interface MediaStepField {
  key: string;
  label: string;
  type: "IMAGE" | "VIDEO" | "FILE" | "LINK";
  required?: boolean;
  hint?: string;
  config?: StepMediaConfig;
}

import type { StepFieldType } from "./onboarding-mission";

export function createMediaField(
  key: string,
  label: string,
  mediaType: MediaType,
  options?: { required?: boolean; hint?: string }
): MediaStepField {
  return {
    key,
    label,
    type: mediaType,
    required: options?.required ?? false,
    hint: options?.hint,
    config: MEDIA_CONFIG[mediaType],
  };
}

export function parseMediaData(data: unknown, fieldType: MediaType): MediaFile[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as MediaFile[];
  if (typeof data === "object" && data !== null) return [data as MediaFile];
  return [];
}

export function isMediaFieldType(type: string): type is MediaType {
  return ["IMAGE", "VIDEO", "FILE", "LINK"].includes(type);
}