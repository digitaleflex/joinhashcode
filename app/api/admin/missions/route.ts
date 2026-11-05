import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const missionSchema = z.object({
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
  submissionMethod: z.string().default("ANY_LINK"),
  acceptanceCriteria: z.array(z.string()).default([]),
  isWeeklyChallenge: z.boolean().default(false),
  weeklySlot: z.number().optional().nullable(),
  status: z.string().optional(),
  publishAt: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  closedAt: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const tagFilter = searchParams.get("tag");

    const where: Prisma.MissionWhereInput = {
      deletedAt: null,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(tagFilter ? { tags: { has: tagFilter } } : {}),
    };

    const missions = await prisma.mission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { attempts: true, submissions: true },
        },
      },
    });

    const statusCounts = await prisma.mission.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    });

    return NextResponse.json({
      missions,
      counts: Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
    });
  } catch (error) {
    console.error("[ADMIN_MISSIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const validatedData = missionSchema.parse(body);

    const mission = await prisma.mission.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc,
        slug: validatedData.slug,
        category: validatedData.category,
        difficulty: validatedData.difficulty,
        xp: validatedData.xp,
        weightBuilder: validatedData.weightBuilder,
        weightCreator: validatedData.weightCreator,
        weightStrategist: validatedData.weightStrategist,
        weightCatalyst: validatedData.weightCatalyst,
        duration: validatedData.duration,
        missionLevel: validatedData.missionLevel,
        requirements: validatedData.requirements,
        targetProfiles: validatedData.targetProfiles,
        deliverables: validatedData.deliverables,
        submissionMethod: validatedData.submissionMethod,
        acceptanceCriteria: validatedData.acceptanceCriteria as Prisma.InputJsonValue,
        isWeeklyChallenge: validatedData.isWeeklyChallenge,
        weeklySlot: validatedData.weeklySlot,
        status: validatedData.status ?? "DRAFT",
        publishAt: validatedData.publishAt ? new Date(validatedData.publishAt) : null,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        closedAt: validatedData.closedAt ? new Date(validatedData.closedAt) : null,
      },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_CREATED",
      entity: "Mission",
      entityId: mission.id,
      metadata: { title: mission.title, slug: mission.slug },
      request: req
    });

    return NextResponse.json(mission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_MISSIONS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
