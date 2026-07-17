import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
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
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = missionSchema.parse(body);

    const mission = await prisma.mission.update({
      where: { id },
      data: {
        ...validatedData,
        acceptanceCriteria: validatedData.acceptanceCriteria as Prisma.InputJsonValue,
      },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_UPDATED",
      entity: "Mission",
      entityId: mission.id,
      metadata: { title: mission.title, slug: mission.slug },
      request: req
    });

    return NextResponse.json(mission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSIONS_PUT]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited: delLimited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (delLimited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { title: true, slug: true }
    });

    await prisma.mission.delete({
      where: { id },
    });

    if (mission) {
      logActivity({
        userId: admin.id,
        action: "ADMIN_MISSION_DELETED",
        entity: "Mission",
        entityId: id,
        metadata: { title: mission.title, slug: mission.slug },
        request: req
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_MISSIONS_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
