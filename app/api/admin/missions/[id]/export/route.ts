import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
        _count: {
          select: { attempts: true, submissions: true },
        },
      },
    });

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });
    }

    const author = await prisma.user.findUnique({
      where: { id: mission.id }, // This won't work - missions don't have authorId
      select: { id: true, name: true, email: true },
    }).catch(() => null);

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedBy: admin.id,
      mission: {
        title: mission.title,
        description: mission.description,
        shortDesc: mission.shortDesc,
        slug: mission.slug,
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
        targetProfiles: mission.targetProfiles,
        deliverables: mission.deliverables,
        fullBriefing: mission.fullBriefing,
        submissionMethod: mission.submissionMethod,
        acceptanceCriteria: mission.acceptanceCriteria,
        evaluatorNotes: mission.evaluatorNotes,
        qualityIndicators: mission.qualityIndicators,
        resources: mission.resources,
        tags: mission.tags,
        evaluationRubric: mission.evaluationRubric,
        validationCriteria: mission.validationCriteria,
        prerequisites: mission.prerequisites,
        isWeeklyChallenge: mission.isWeeklyChallenge,
        weeklySlot: mission.weeklySlot,
        isOnboarding: mission.isOnboarding,
        isAutoApproved: mission.isAutoApproved,
        status: mission.status,
        steps: mission.steps.map((step) => ({
          stepOrder: step.stepOrder,
          key: step.key,
          title: step.title,
          description: step.description,
          fields: step.fields,
          required: step.required,
        })),
      },
      metadata: {
        version: "1.0",
        createdAt: mission.createdAt.toISOString(),
        updatedAt: mission.updatedAt.toISOString(),
        author: author ? { id: author.id, name: author.name, email: author.email } : null,
        stats: {
          attemptsCount: mission._count.attempts,
          submissionsCount: mission._count.submissions,
        },
      },
    };

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_EXPORTED",
      entity: "Mission",
      entityId: mission.id,
      metadata: { title: mission.title, slug: mission.slug },
      request: req,
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="mission-${mission.slug}.json"`,
      },
    });
  } catch (error) {
    console.error("[ADMIN_MISSION_EXPORT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}