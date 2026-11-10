import { z } from "zod";
import { difficultyField, xpField, weightField } from "./common";

export const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  slug: z.string().min(1),
  category: z.string().min(1),
  difficulty: difficultyField,
  xp: xpField,
  weightBuilder: weightField,
  weightCreator: weightField,
  weightStrategist: weightField,
  weightCatalyst: weightField,
  duration: z.string().optional(),
  missionLevel: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  targetProfiles: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  submissionMethod: z.string().default("ANY_LINK"),
  acceptanceCriteria: z.array(z.string()).default([]),
  isWeeklyChallenge: z.boolean().default(false),
  weeklySlot: z.number().optional().nullable(),
});

export type MissionInput = z.infer<typeof missionSchema>;

export const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().url("Le lien de soumission doit être une URL valide (http/https).").startsWith("http", "Seuls les liens HTTP/HTTPS sont acceptés.").max(2048),
  projectDescription: z.string().max(5000).optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const reviewSchema = z.object({
  criteria: z.record(z.string(), z.boolean()),
  feedback: z.string().min(20),
  forceApprove: z.boolean().optional().default(false),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const UpdateSubmissionSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(2000).optional(),
  qualityLevel: z.enum(["STANDARD", "GOOD", "EXEMPLARY"]).optional(),
  revisionNotes: z.string().max(2000).optional(),
});

export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionSchema>;

