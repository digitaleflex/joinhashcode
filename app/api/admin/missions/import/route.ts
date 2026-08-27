import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const importSchema = z.object({
  mission: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    shortDesc: z.string().optional(),
    slug: z.string().min(1),
    category: z.string().min(1),
    difficulty: z.number().min(1).max(5),
    xp: z.number().min(0),
    weightBuilder: z.number().min(0).max(1),
    weightCreator: z.number().min(0).max(1),
    weightStrategist: z.number().min(0).max(1),
    weightCatalyst: z.number().min(0).max(1),
    duration: z.string().optional(),
    missionLevel: z.string().optional(),
    requirements: z.array(z.string()).default([]),
    targetProfiles: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    fullBriefing: z.string().optional(),
    submissionMethod: z.string().default("ANY_LINK"),
    acceptanceCriteria: z.array(z.string()).default([]),
    evaluatorNotes: z.string().optional(),
    qualityIndicators: z.unknown().optional(),
    resources: z.unknown().optional(),
    tags: z.array(z.string()).default([]),
    evaluationRubric: z.unknown().optional(),
    validationCriteria: z.string().optional(),
    prerequisites: z.string().optional(),
    isWeeklyChallenge: z.boolean().default(false),
    weeklySlot: z.number().optional().nullable(),
    isOnboarding: z.boolean().default(false),
    isAutoApproved: z.boolean().default(false),
    status: z.string().default("DRAFT"),
    steps: z.array(z.object({
      stepOrder: z.number().int().min(0),
      key: z.string().min(1),
      title: z.string().min(1),
      description: z.string(),
      fields: z.unknown(),
      required: z.boolean().default(true),
    })).default([]),
  }),
  metadata: z.object({
    version: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    author: z.unknown().optional(),
    stats: z.unknown().optional(),
  }).optional(),
});

function generateSlug(base: string): string {
  let slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length > 100) slug = slug.slice(0, 100);
  return slug;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.mission.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const validatedData = importSchema.parse(body);

    const { mission: missionData } = validatedData;

    const baseSlug = generateSlug(missionData.slug);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const existingByTitle = await prisma.mission.findFirst({
      where: { title: missionData.title },
      select: { id: true },
    });

    if (existingByTitle) {
      return NextResponse.json(
        { message: "Une mission avec ce titre existe déjà", field: "title" },
        { status: 409 }
      );
    }

    const mission = await prisma.mission.create({
      data: {
        title: missionData.title,
        description: missionData.description,
        shortDesc: missionData.shortDesc,
        slug: uniqueSlug,
        category: missionData.category,
        difficulty: missionData.difficulty,
        xp: missionData.xp,
        weightBuilder: missionData.weightBuilder,
        weightCreator: missionData.weightCreator,
        weightStrategist: missionData.weightStrategist,
        weightCatalyst: missionData.weightCatalyst,
        duration: missionData.duration,
        missionLevel: missionData.missionLevel,
        requirements: missionData.requirements,
        targetProfiles: missionData.targetProfiles,
        deliverables: missionData.deliverables,
        fullBriefing: missionData.fullBriefing,
        submissionMethod: missionData.submissionMethod,
        acceptanceCriteria: missionData.acceptanceCriteria as any,
        evaluatorNotes: missionData.evaluatorNotes,
        qualityIndicators: missionData.qualityIndicators as any,
        resources: missionData.resources as any,
        tags: missionData.tags,
        evaluationRubric: missionData.evaluationRubric as any,
        validationCriteria: missionData.validationCriteria,
        prerequisites: missionData.prerequisites,
        isWeeklyChallenge: missionData.isWeeklyChallenge,
        weeklySlot: missionData.weeklySlot,
        isOnboarding: missionData.isOnboarding,
        isAutoApproved: missionData.isAutoApproved,
        status: missionData.status,
      },
    });

    if (missionData.steps.length > 0) {
      await prisma.missionStep.createMany({
        data: missionData.steps.map((step) => ({
          missionId: mission.id,
          stepOrder: step.stepOrder,
          key: step.key,
          title: step.title,
          description: step.description,
          fields: step.fields as any,
          required: step.required,
        })),
      });
    }

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_IMPORTED",
      entity: "Mission",
      entityId: mission.id,
      metadata: { title: mission.title, slug: mission.slug, importedFrom: validatedData.metadata?.version ?? "unknown" },
      request: req,
    });

    return NextResponse.json({ id: mission.id, slug: mission.slug, title: mission.title });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Données invalides", errors: error.errors }, { status: 400 });
    }
    console.error("[ADMIN_MISSION_IMPORT_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}