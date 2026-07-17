import { z } from "zod";
import { SLUG_REGEX, safeUrl } from "./common";

export const squadSlugSchema = z.string()
  .min(3, "Le slug doit contenir au moins 3 caractères.")
  .max(30, "Le slug doit contenir au maximum 30 caractères.")
  .regex(SLUG_REGEX, "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.");

export const inviteSlugSchema = squadSlugSchema;

export const createSquadSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(100, "Le nom est trop long."),
});

export type CreateSquadInput = z.infer<typeof createSquadSchema>;

export const updateSquadSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(40, "Le nom est trop long.").optional(),
  slug: squadSlugSchema.optional(),
  isPrivate: z.boolean().optional(),
  requiredLevel: z.number().int().min(1).max(10).optional(),
  description: z.string().max(300).optional(),
  announcement: z.string().max(200).optional(),
  discordInviteUrl: safeUrl.optional(),
});

export type UpdateSquadInput = z.infer<typeof updateSquadSchema>;

export const joinSquadSchema = z.object({
  slug: squadSlugSchema,
});

export type JoinSquadInput = z.infer<typeof joinSquadSchema>;

export const inviteSquadSchema = z.object({
  targetUserId: z.string().min(1, "ID de la cible requis."),
});

export type InviteSquadInput = z.infer<typeof inviteSquadSchema>;

export const joinRequestSchema = z.object({
  organizationId: z.string().min(1, "organizationId requis."),
});

export type JoinRequestInput = z.infer<typeof joinRequestSchema>;

export const joinRequestRespondSchema = z.object({
  requestId: z.string().min(1, "requestId requis."),
  action: z.enum(["accept", "reject"], { message: "action doit être accept ou reject." }),
});

export type JoinRequestRespondInput = z.infer<typeof joinRequestRespondSchema>;

export const squadMessageSchema = z.object({
  content: z.string().trim().min(1, "Le message ne peut pas être vide.").max(2000, "Message trop long."),
  organizationId: z.string().min(1, "organizationId requis."),
});

export type SquadMessageInput = z.infer<typeof squadMessageSchema>;
