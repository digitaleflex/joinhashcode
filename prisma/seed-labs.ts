import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { PrismaClient } from "../generated/prisma/client";
import { ARTIFACT_TYPES } from "../lib/validation/artifacts";

const ROOT = process.cwd();
const LABS_DIR = path.join(ROOT, "content/labs/cyber");

const artifactSpec = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(ARTIFACT_TYPES),
  required: z.boolean().optional(),
  accepts: z.array(z.string()).optional(),
  minLength: z.number().int().positive().optional(),
});

// Les critères sont des chaînes : getReviewCriteria() ignore tout autre format
// et retomberait sur la grille générique de la catégorie.
const labSchema = z.object({
  slug: z.string().regex(/^cyber-n0-\d{2}-[a-z0-9-]+$/),
  briefingFile: z.string().min(1),
  title: z.string().min(1),
  shortDesc: z.string().min(1),
  description: z.string().min(1),
  category: z.literal("CYBER"),
  difficulty: z.number().int().min(1).max(4),
  missionLevel: z.enum(["INIT", "CORE", "PRO"]),
  duration: z.string().min(1),
  requirements: z.array(z.string()),
  deliverables: z.array(z.string()).min(1),
  tags: z.array(z.string()).refine((tags) => tags.includes("CYBER") && tags.includes("LAB")),
  submissionMethod: z.string().min(1),
  acceptanceCriteria: z.array(z.string().min(1)).min(4),
  evaluatorNotes: z.string().min(1),
  submissionSchema: z.array(artifactSpec).min(1),
});

export type CyberLab = z.infer<typeof labSchema> & { fullBriefing: string };

/** Lit et valide les labs cyber versionnés dans `content/labs/cyber/`. */
export function loadCyberLabs(): CyberLab[] {
  return readdirSync(LABS_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const lab = labSchema.parse(JSON.parse(readFileSync(path.join(LABS_DIR, file), "utf8")));
      const fullBriefing = readFileSync(path.join(ROOT, lab.briefingFile), "utf8");
      return { ...lab, fullBriefing };
    });
}

/**
 * Importe les labs cyber de façon idempotente.
 * Un lab nouveau est créé en DRAFT : la publication reste une décision humaine.
 * Une relance met à jour le contenu mais ne touche jamais au statut.
 */
export async function seedCyberLabs(db: PrismaClient): Promise<number> {
  const labs = loadCyberLabs();
  for (const { briefingFile: _briefingFile, ...lab } of labs) {
    const data = {
      title: lab.title,
      shortDesc: lab.shortDesc,
      description: lab.description,
      fullBriefing: lab.fullBriefing,
      category: lab.category,
      difficulty: lab.difficulty,
      missionLevel: lab.missionLevel,
      duration: lab.duration,
      requirements: lab.requirements,
      deliverables: lab.deliverables,
      tags: lab.tags,
      targetProfiles: [],
      submissionMethod: lab.submissionMethod,
      acceptanceCriteria: lab.acceptanceCriteria,
      evaluatorNotes: lab.evaluatorNotes,
      submissionSchema: lab.submissionSchema,
    };
    await db.mission.upsert({
      where: { slug: lab.slug },
      update: data,
      create: { slug: lab.slug, status: "DRAFT", ...data },
    });
  }
  return labs.length;
}
