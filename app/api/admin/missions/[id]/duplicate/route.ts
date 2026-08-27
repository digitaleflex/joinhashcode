import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import type { Prisma } from "@/generated/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const mission = await prisma.mission.findUnique({ where: { id } });
    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });
    }

    const newMission = await prisma.mission.create({
      data: {
        title: `${mission.title} - Copie`,
        description: mission.description,
        slug: `${mission.slug}-copy`,
        category: mission.category,
        difficulty: mission.difficulty,
        xp: mission.xp,
        weightBuilder: mission.weightBuilder,
        weightCreator: mission.weightCreator,
        weightStrategist: mission.weightStrategist,
        weightCatalyst: mission.weightCatalyst,
        duration: mission.duration,
        missionLevel: mission.missionLevel,
        requirements: mission.requirements,
        shortDesc: mission.shortDesc,
        targetProfiles: mission.targetProfiles,
        deliverables: mission.deliverables,
        fullBriefing: mission.fullBriefing,
        submissionMethod: mission.submissionMethod,
        acceptanceCriteria: mission.acceptanceCriteria as Prisma.InputJsonValue,
        evaluatorNotes: mission.evaluatorNotes,
        qualityIndicators: mission.qualityIndicators as Prisma.InputJsonValue,
        resources: (mission.resources ?? undefined) as Prisma.InputJsonValue | undefined,
        validationCriteria: mission.validationCriteria,
        prerequisites: mission.prerequisites,
        isWeeklyChallenge: false,
        weeklySlot: null,
        isOnboarding: mission.isOnboarding,
        isAutoApproved: mission.isAutoApproved,
        status: "DRAFT",
        publishAt: null,
        deadline: null,
        closedAt: null,
      },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_DUPLICATED",
      entity: "Mission",
      entityId: newMission.id,
      metadata: { sourceId: mission.id, title: newMission.title, slug: newMission.slug },
      request: req,
    });

    return NextResponse.json({ mission: { id: newMission.id, slug: newMission.slug } });
  } catch (error) {
    console.error("[ADMIN_MISSION_DUPLICATE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
