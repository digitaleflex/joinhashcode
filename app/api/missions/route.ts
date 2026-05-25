export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { XP_THRESHOLDS } from "@/lib/missions";
import { BehavioralVibrancy } from "@/lib/evolution";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { triggerNotification } from "@/lib/qstash";
import { z } from "zod";

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().min(1),
  projectDescription: z.string().optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("AccÃ¨s non autorisÃ©. Connecte-toi pour valider ta mission.", { status: 401 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse("DonnÃ©es d'envoi invalides. VÃ©rifie tes champs.", { status: 400 });
    }

    const { 
      missionId, 
      content,
      projectDescription,
      userDifficulty,
      userRating,
      userFeedback,
      improvementSuggestions
    } = validatedData.data;

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      return new NextResponse("Mission introuvable dans le systÃ¨me.", { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        level: true, 
        experience: true,
        behavioralVibrancy: true,
        lastHypothesisUpdate: true,
        class: true,
        missionsCompletedCount: true,
        currentStreak: true
      }
    });

    if (!dbUser) {
      return new NextResponse("Utilisateur introuvable.", { status: 404 });
    }

    const requiredLevel = LEVEL_REQUIREMENT[mission.missionLevel ?? "INIT"] ?? 1;
    if (dbUser.level < requiredLevel) {
      return new NextResponse("Ton rang est trop bas pour cette mission. Continue de build !", { status: 403 });
    }

    // Check if already submitted
    const existingSubmission = await prisma.missionSubmission.findUnique({
      where: {
        userId_missionId: {
          userId: session.user.id,
          missionId: mission.id
        }
      }
    });

    if (existingSubmission) {
      if (existingSubmission.status === "APPROVED") {
        return new NextResponse("Cette mission a dÃ©jÃ  Ã©tÃ© validÃ©e. Passe Ã  la suivante !", { status: 409 });
      }
      if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") {
        return new NextResponse("Ta soumission est dÃ©jÃ  en attente de validation. Patience !", { status: 400 });
      }
      if (existingSubmission.revisionCount >= 3) {
        return new NextResponse("Nombre maximum de rÃ©visions atteint. Contacte un admin.", { status: 400 });
      }
      // status === "NEEDS_REVISION" â†’ allow resubmission (falls through to upsert below)
    }

    // Transaction to save submission as PENDING and award instant Sync Bonus
    let SYNC_BONUS_XP = 5;
    const userStreak = dbUser.currentStreak || 0;
    
    if (userStreak >= 7) SYNC_BONUS_XP = 6; // 1.2x
    else if (userStreak >= 3) SYNC_BONUS_XP = 6; // 1.1x (5.5 rounded to 6)

    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.missionSubmission.upsert({
        where: {
          userId_missionId: {
            userId: session.user.id,
            missionId: mission.id
          }
        },
        update: {
          content,
          projectDescription,
          userDifficulty,
          userRating,
          userFeedback,
          improvementSuggestions,
          status: "PENDING",
          xpAwarded: 0
        },
        create: {
          userId: session.user.id,
          missionId: mission.id,
          content,
          projectDescription,
          userDifficulty,
          userRating,
          userFeedback,
          improvementSuggestions,
          status: "PENDING",
          xpAwarded: 0
        }
      });

      // Award instant bonus
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: { increment: SYNC_BONUS_XP }
        }
      });

      return submission;
    });

    // Notify user about the submission and the instant bonus
    try {
      await triggerNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: `Mission transmise : ${mission.title}`,
        message: `Analyse en cours... Bonus de Sync (+${SYNC_BONUS_XP} XP) accordÃ© immÃ©diatement !`,
        link: "/missions"
      });
    } catch (notificationError) {
      console.error("[NOTIFICATION_ERROR]", notificationError);
    }

    return NextResponse.json({ submission: result, status: "PENDING", bonusXp: SYNC_BONUS_XP });
  } catch (error) {
    console.error("[MISSION_SUBMIT]", error);
    return new NextResponse("Erreur interne du systÃ¨me. Nos ingÃ©nieurs sont sur le coup.", { status: 500 });
  }
}
