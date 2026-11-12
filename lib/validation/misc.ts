import { z } from "zod";

const safeUrlOrNull = z.string().max(500).optional().nullable().or(z.literal(""))
  .transform(v => v || undefined)
  .refine((v) => !v || !/^(javascript|data|vbscript):/i.test(v), "Protocole non autorisé.")
  .refine((v) => !v || /^https?:\/\//i.test(v), "URL doit commencer par http(s)://.");

// ── Beta key verification ─────────────────────────────────────────────────────
export const betaVerifySchema = z.object({
  key: z.string().trim().min(1, "Clé requise.").max(100),
});

export type BetaVerifyInput = z.infer<typeof betaVerifySchema>;

// ── Quiz feedback ─────────────────────────────────────────────────────────────
export const quizFeedbackSchema = z.object({
  quizResultId: z.string().min(1, "ID du résultat requis."),
  isAccurate: z.boolean(),
  usefulness: z.number().min(1).max(5),
  comment: z.string().max(2000).optional().nullable().transform(v => v || undefined),
});

export type QuizFeedbackInput = z.infer<typeof quizFeedbackSchema>;

// ── Notification bulk update ──────────────────────────────────────────────────
export const notificationBulkSchema = z.object({
  ids: z.array(z.string().min(1)).max(100).optional(),
  isRead: z.boolean().optional(),
  isSaved: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  readAll: z.boolean().optional(),
  archiveAll: z.boolean().optional(),
});

export type NotificationBulkInput = z.infer<typeof notificationBulkSchema>;

// ── Admin: beta key generation ────────────────────────────────────────────────
export const adminKeyGenSchema = z.object({
  count: z.number().int().min(1).max(100).default(1),
  prefix: z.string().min(1).max(20).default("H26-"),
});

export type AdminKeyGenInput = z.infer<typeof adminKeyGenSchema>;

// ── Admin: broadcast notification ─────────────────────────────────────────────
export const adminBroadcastSchema = z.object({
  title: z.string().min(1, "Titre requis.").max(200),
  message: z.string().min(1, "Message requis.").max(1000),
  type: z.string().max(50).default("SYSTEM"),
  link: safeUrlOrNull,
});

export type AdminBroadcastInput = z.infer<typeof adminBroadcastSchema>;

// ── Admin: activity log ───────────────────────────────────────────────────────
export const adminLogSchema = z.object({
  action: z.string().min(1).max(100),
  entityId: z.string().min(1).max(100).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AdminLogInput = z.infer<typeof adminLogSchema>;
