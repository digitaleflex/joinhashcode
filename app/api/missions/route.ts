export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";
import { awardXp } from "@/lib/experience";
import { getCurrentCycleKey } from "@/lib/missions";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";

const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().url("Le lien de soumission doit être une URL valide (http/https).").startsWith("http", "Seuls les liens HTTP/HTTPS sont acceptés.").max(2048),
  projectDescription: z.string().max(5000).optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

async function submitMission(userId: string, input: z.infer<typeof submissionSchema>) {
  const mission = await prisma.mission.findFirst({
    where: { OR: [{ id: input.missionId }, { slug: input.missionId }] },
  });
  if (!mission) throw new Error("MISSION_NOT_FOUND");

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, name: true,
      stats: { select: { currentStreak: true } },
      progress: { select: { level: true, experience: true, missionsCompletedCount: true } },
    }
  });
  if (!dbUser) throw new Error("USER_NOT_FOUND");

  const requiredLevel = LEVEL_REQUIREMENT[mission.missionLevel ?? "INIT"] ?? 1;
  if ((dbUser.progress?.level ?? 1) < requiredLevel) throw new Error("LEVEL_TOO_LOW");

  const cycleKey = getCurrentCycleKey(mission);

  const existingSubmission = await prisma.missionSubmission.findUnique({
    where: { userId_missionId_cycleKey: { userId, missionId: mission.id, cycleKey } }
  });

  if (existingSubmission) {
    if (existingSubmission.status === "APPROVED") throw new Error("ALREADY_APPROVED");
    if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") throw new Error("SUBMISSION_PENDING");
    if (existingSubmission.revisionCount >= 3) throw new Error("MAX_REVISIONS_REACHED");
  }

  const SYNC_BONUS_XP = (dbUser.stats?.currentStreak || 0) >= 3 ? 6 : 5;
  const isAutoApproved = mission.isWeeklyChallenge || mission.slug === "signal-ouverture" || mission.id === "signal-ouverture";
  const finalStatus = isAutoApproved ? "APPROVED" : "PENDING";
  const xpToAward = isAutoApproved ? (mission.xp || 0) : 0;
  const experienceToIncrement = (existingSubmission ? 0 : SYNC_BONUS_XP) + xpToAward;

  const resultSubmission = await prisma.$transaction(async (tx) => {
    const submission = await tx.missionSubmission.upsert({
      where: { userId_missionId_cycleKey: { userId, missionId: mission.id, cycleKey } },
      update: {
        content: input.content,
        projectDescription: input.projectDescription,
        userDifficulty: input.userDifficulty,
        userRating: input.userRating,
        userFeedback: input.userFeedback,
        improvementSuggestions: input.improvementSuggestions,
        status: finalStatus,
      },
      create: {
        userId, missionId: mission.id, cycleKey,
        content: input.content,
        projectDescription: input.projectDescription,
        userDifficulty: input.userDifficulty,
        userRating: input.userRating,
        userFeedback: input.userFeedback,
        improvementSuggestions: input.improvementSuggestions,
        status: finalStatus,
        xpAwarded: xpToAward,
      }
    });

    if (experienceToIncrement > 0) {
      await awardXp(userId, experienceToIncrement, isAutoApproved ? "MISSION_COMPLETED" : "MISSION_SUBMISSION_SYNC_BONUS", mission.id, tx);
    }

    if (isAutoApproved) {
      await tx.userProgress.upsert({
        where: { userId },
        create: { userId, missionsCompletedCount: 1 },
        update: { missionsCompletedCount: { increment: 1 } },
      });
    }

    return submission;
  });

  const finalUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { progress: { select: { experience: true, missionsCompletedCount: true } } }
  });

  if (finalUser && (finalUser.progress?.missionsCompletedCount ?? 0) === 1) {
    const { trackEvent, EVENTS } = await import("@/lib/analytics");
    await trackEvent(userId, EVENTS.FIRST_MISSION_STARTED, { missionId: mission.id, title: mission.title });
  }

  try {
    await triggerNotification({
      userId,
      type: "SYSTEM",
      title: isAutoApproved ? `Challenge Validé : ${mission.title}` : `Mission transmise : ${mission.title}`,
      message: isAutoApproved
        ? `Ton challenge hebdomadaire est validé. +${xpToAward} XP accordés !`
        : `Analyse en cours... Bonus de Sync (+${SYNC_BONUS_XP} XP) accordé immédiatement !`,
      link: "/missions"
    });
  } catch (e) { console.error("[submitMission] Notification Error", e); }

  if (!isAutoApproved) {
    emailService.sendMissionSubmitted({
      email: dbUser.email, name: dbUser.name, missionTitle: mission.title, bonusXp: SYNC_BONUS_XP,
    });
  }

  return { submission: resultSubmission, status: finalStatus, bonusXp: SYNC_BONUS_XP, missionXp: xpToAward };
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
      const result = await submitMission(session.user.id, validatedData.data);
      return NextResponse.json(result);
    } catch (serviceError: any) {
      const errorMap: Record<string, { message: string, status: number }> = {
        "MISSION_NOT_FOUND": { message: "Mission introuvable dans le système.", status: 404 },
        "USER_NOT_FOUND": { message: "Utilisateur introuvable.", status: 404 },
        "LEVEL_TOO_LOW": { message: "Ton rang est trop bas pour cette mission. Continue de build !", status: 403 },
        "ALREADY_APPROVED": { message: "Cette mission a déjà été validée pour cette période.", status: 409 },
        "SUBMISSION_PENDING": { message: "Ta soumission est déjà en attente de validation. Patience !", status: 400 },
        "MAX_REVISIONS_REACHED": { message: "Nombre maximum de révisions atteint. Contacte un admin.", status: 400 },
      };

      const mapped = errorMap[serviceError.message];
      if (mapped) return NextResponse.json({ message: mapped.message }, { status: mapped.status });
      throw serviceError;
    }
  } catch (error: unknown) {
    console.error("[MISSION_SUBMIT_ROUTE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
