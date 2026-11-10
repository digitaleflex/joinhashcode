export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";
import { getCurrentCycleKey } from "@/lib/missions";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import type { Prisma } from "@/generated/prisma/client";
import {
  ArtifactValidationError,
  parseSubmissionSchema,
  submissionArtifactsSchema,
  validateArtifactsAgainstSchema,
} from "@/lib/validation/artifacts";

const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().max(5000).optional().default(""),
  artifacts: submissionArtifactsSchema.optional(),
  projectDescription: z.string().max(5000).optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

const URL_METHODS = ["ANY_LINK", "LIVE_URL", "DOCUMENT_LINK", "GITHUB_LINK"] as const;

async function submitMission(userId: string, input: z.infer<typeof submissionSchema>) {
  const [mission, dbUser] = await Promise.all([
    prisma.mission.findFirst({
      where: { OR: [{ id: input.missionId }, { slug: input.missionId }] },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true,
        currentStreak: true,
        level: true, experience: true, missionsCompletedCount: true,
      }
    }),
  ]);
  if (!mission) throw new Error("MISSION_NOT_FOUND");
  if (!dbUser) throw new Error("USER_NOT_FOUND");

  const artifactSpecs = parseSubmissionSchema(mission.submissionSchema);
  let artifactsToCreate: ReturnType<typeof validateArtifactsAgainstSchema> | undefined;
  let summaryContent = input.content;

  if (artifactSpecs.length > 0) {
    if (!input.artifacts || input.artifacts.length === 0) {
      throw new ArtifactValidationError(["Aucun artefact fourni pour ce labo."]);
    }

    artifactsToCreate = validateArtifactsAgainstSchema(artifactSpecs, input.artifacts);
    summaryContent =
      input.content.trim() ||
      artifactsToCreate.find((artifact) => artifact.value?.trim())?.value ||
      artifactsToCreate.find((artifact) => artifact.fileUrl)?.fileUrl ||
      "multi-artifact";
  } else if (mission.submissionMethod === "TEXT_RESPONSE") {
    if (!input.content.trim()) throw new Error("INVALID_SUBMISSION_CONTENT");
  } else if (URL_METHODS.includes(mission.submissionMethod as any)) {
    if (!input.content.startsWith("http")) {
      throw new Error("INVALID_SUBMISSION_URL");
    }
    try {
      new URL(input.content);
    } catch {
      throw new Error("INVALID_SUBMISSION_URL");
    }
  }

  const cycleKey = getCurrentCycleKey(mission);

  const existingSubmission = await prisma.missionSubmission.findUnique({
    where: { userId_missionId_cycleKey: { userId, missionId: mission.id, cycleKey } }
  });

  if (existingSubmission) {
    if (existingSubmission.status === "APPROVED") throw new Error("ALREADY_APPROVED");
    if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") throw new Error("SUBMISSION_PENDING");
    if (existingSubmission.revisionCount >= 3) throw new Error("MAX_REVISIONS_REACHED");
  }

  const isAutoApproved = mission.isWeeklyChallenge || mission.isAutoApproved;
  const finalStatus = isAutoApproved ? "APPROVED" : "PENDING";

  const resultSubmission = await prisma.$transaction(async (tx) => {
    const submission = await tx.missionSubmission.upsert({
      where: { userId_missionId_cycleKey: { userId, missionId: mission.id, cycleKey } },
      update: {
        content: summaryContent,
        projectDescription: input.projectDescription,
        userDifficulty: input.userDifficulty,
        userRating: input.userRating,
        userFeedback: input.userFeedback,
        improvementSuggestions: input.improvementSuggestions,
        status: finalStatus,
      },
      create: {
        userId, missionId: mission.id, cycleKey,
        content: summaryContent,
        projectDescription: input.projectDescription,
        userDifficulty: input.userDifficulty,
        userRating: input.userRating,
        userFeedback: input.userFeedback,
        improvementSuggestions: input.improvementSuggestions,
        status: finalStatus,
        xpAwarded: 0,
      }
    });

    if (artifactsToCreate) {
      await tx.missionSubmissionArtifact.deleteMany({
        where: { submissionId: submission.id },
      });
      await tx.missionSubmissionArtifact.createMany({
        data: artifactsToCreate.map((artifact) => ({
          submissionId: submission.id,
          key: artifact.key,
          type: artifact.type,
          label:
            typeof artifact.metadata?.label === "string"
              ? artifact.metadata.label
              : artifact.key,
          value: artifact.value ?? null,
          fileUrl: artifact.fileUrl ?? null,
          fileName: artifact.fileName ?? null,
          mimeType: artifact.mimeType ?? null,
          size: artifact.size ?? null,
          metadata: (artifact.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
          status: "SUBMITTED",
        })),
      });
    }

    if (isAutoApproved) {
      await tx.user.update({
        where: { id: userId },
        data: { missionsCompletedCount: { increment: 1 } },
      });
    }

    return submission;
  });

  const finalUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { experience: true, missionsCompletedCount: true }
  });

  if (finalUser && (finalUser.missionsCompletedCount ?? 0) === 1) {
    const { trackEvent, EVENTS } = await import("@/lib/analytics");
    await trackEvent(userId, EVENTS.FIRST_MISSION_STARTED, { missionId: mission.id, title: mission.title });
  }

  try {
    await triggerNotification({
      userId,
      type: "SYSTEM",
      title: isAutoApproved ? `Lab validé : ${mission.title}` : `Lab transmis : ${mission.title}`,
      message: isAutoApproved
        ? `Ton lab est validé.`
        : `Analyse en cours... Ta soumission va être analysée.`,
      link: "/missions"
    });
  } catch (e) { console.error("[submitMission] Notification Error", e); }

  if (!isAutoApproved) {
    emailService.sendMissionSubmitted({
      email: dbUser.email, name: dbUser.name, missionTitle: mission.title,
    });
  }

  return { submission: resultSubmission, status: finalStatus };
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const missions = await prisma.mission.findMany({
      orderBy: [{ difficulty: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        description: true,
        shortDesc: true,
        slug: true,
        category: true,
        difficulty: true,
        xp: true,
        missionLevel: true,
        weightBuilder: true,
        weightCreator: true,
        weightStrategist: true,
        weightCatalyst: true,
        duration: true,
        requirements: true,
        targetProfiles: true,
        deliverables: true,
        submissionMethod: true,
        isWeeklyChallenge: true,
        weeklySlot: true,
        createdAt: true,
      },
    });

    return NextResponse.json(missions);
  } catch (error: unknown) {
    console.error("[MISSIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Accès non autorisé. Connecte-toi pour valider ta mission." }, { status: 401 });
    }

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) {
      return NextResponse.json({ message: "Action trop rapide. Réessaie dans quelques secondes." }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ message: "Données d'envoi invalides. Vérifie tes champs." }, { status: 400 });
    }

    try {
      const perfStart = performance.now();
      const result = await submitMission(session.user.id, validatedData.data);
      if (process.env.NODE_ENV === "development") console.log("[PERF] missions POST:", (performance.now() - perfStart).toFixed(0), "ms");
      return NextResponse.json(result);
    } catch (serviceError: unknown) {
      if (serviceError instanceof ArtifactValidationError) {
        return NextResponse.json(
          {
            message: "Certains artefacts sont invalides.",
            details: serviceError.details,
          },
          { status: 400 },
        );
      }

      const errorMap: Record<string, { message: string, status: number }> = {
        "MISSION_NOT_FOUND": { message: "Mission introuvable dans le système.", status: 404 },
        "USER_NOT_FOUND": { message: "Utilisateur introuvable.", status: 404 },
        "ALREADY_APPROVED": { message: "Cette mission a déjà été validée pour cette période.", status: 409 },
        "SUBMISSION_PENDING": { message: "Ta soumission est déjà en attente de validation. Patience !", status: 400 },
        "MAX_REVISIONS_REACHED": { message: "Nombre maximum de révisions atteint. Contacte un admin.", status: 400 },
        "INVALID_SUBMISSION_URL": { message: "Le lien de soumission doit être une URL valide (http/https).", status: 400 },
        "INVALID_SUBMISSION_CONTENT": { message: "Le contenu textuel est requis pour cette mission.", status: 400 },
      };

      const mapped = errorMap[serviceError instanceof Error ? serviceError.message : String(serviceError)];
      if (mapped) return NextResponse.json({ message: mapped.message }, { status: mapped.status });
      throw serviceError;
    }
  } catch (error: unknown) {
    console.error("[MISSION_SUBMIT_ROUTE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
