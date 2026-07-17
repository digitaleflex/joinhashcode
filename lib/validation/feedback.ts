import { z } from "zod";

export const CONTACT_TYPES = ["BUG", "FEATURE", "PARTNERSHIP", "TEAM", "OTHER"] as const;

export const contactSchema = z.object({
  type: z.enum(CONTACT_TYPES).default("OTHER"),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  github: z.string().max(500).optional(),
  portfolio: z.string().max(500).optional(),
  skills: z.string().max(1000).optional(),
  honeypot: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const statusSchema = z.object({
  id: z.string(),
  status: z.enum(["NEW", "REVIEWED", "RESOLVED"]),
});

export type StatusUpdateInput = z.infer<typeof statusSchema>;
