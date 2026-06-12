export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentCycleKey } from "@/lib/missions";
import { calculateAndSetLevel } from "@/lib/evolution-utils";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().url("Le lien de soumission doit être une URL valide (http/https).").startsWith("http", "Seuls les liens HTTP/HTTPS sont acceptés."),
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
      return NextResponse.json({ message: "Accès non autorisé. Connecte-toi pour valider ta mission." }, { status: 401 });
    }

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) {
      return NextResponse.json({ message: "Trop de soumissions. Réessaie dans une minute." }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ message: "Données d'envoi invalides. Vérifie tes champs." }, { status: 400 });
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

    const mission = await prisma.mission.findFirst({
      where: { OR: [{ id: missionId }, { slug: missionId }] },
    });
    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable dans le système." }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        experience: true,
        behavioralVibrancy: true,
        lastHypothesisUpdate: true,
        class: true,
        missionsCompletedCount: true,
        currentStreak: true,
      }
    });

    if (!dbUser) {
      return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
    }

    const requiredLevel = LEVEL_REQUIREMENT[mission.missionLevel ?? "INIT"] ?? 1;
    if (dbUser.level < requiredLevel) {
      return NextResponse.json({ message: "Ton rang est trop bas pour cette mission. Continue de build !" }, { status: 403 });
    }

    const cycleKey = getCurrentCycleKey(mission);

    const existingSubmission = await prisma.missionSubmission.findUnique({
      where: {
        userId_missionId_cycleKey: {
          userId: session.user.id,
          missionId: mission.id,
          cycleKey: cycleKey
        }
      }
    });

    if (existingSubmission) {
      if (existingSubmission.status === "APPROVED") {
        return NextResponse.json({ message: "Cette mission a déjà été validée pour cette période." }, { status: 409 });
      }
      if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") {
        return NextResponse.json({ message: "Ta soumission est déjà en attente de validation. Patience !" }, { status: 400 });
      }
      if (existingSubmission.revisionCount >= 3) {
        return NextResponse.json({ message: "Nombre maximum de révisions atteint. Contacte un admin." }, { status: 400 });
      }
    }

    const SYNC_BONUS_XP = (dbUser.currentStreak || 0) >= 3 ? 6 : 5;
    const isAutoApproved = mission.isWeeklyChallenge;
    const finalStatus = isAutoApproved ? "APPROVED" : "PENDING";
    const xpToAward = isAutoApproved ? mission.xp : 0;

    // Fix SEC-001: Award SYNC_BONUS_XP only on the FIRST submission for this mission/cycle
    const experienceToIncrement = (existingSubmission ? 0 : SYNC_BONUS_XP) + xpToAward;

    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.missionSubmission.upsert({
        where: {
          userId_missionId_cycleKey: {
            userId: session.user.id,
            missionId: mission.id,
            cycleKey: cycleKey
          }
        },
        update: {
          content,
          projectDescription,
          userDifficulty,
          userRating,
          userFeedback,
          improvementSuggestions,
          status: finalStatus,
          xpAwarded: { increment: 0 }
        },
        create: {
          userId: session.user.id,
          missionId: mission.id,
          cycleKey: cycleKey,
          content,
          projectDescription,
          userDifficulty,
          userRating,
          userFeedback,
          improvementSuggestions,
          status: finalStatus,
          xpAwarded: xpToAward
        }
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: { increment: experienceToIncrement },
          missionsCompletedCount: isAutoApproved ? { increment: 1 } : undefined
        }
      });

      return submission;
    });

    const finalUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { experience: true, missionsCompletedCount: true }
    });
    
    if (finalUser) {
      await calculateAndSetLevel(session.user.id, finalUser.experience, prisma);
      
      // Track Analytics
      if (finalUser.missionsCompletedCount === 1) {
          await trackEvent(session.user.id, EVENTS.FIRST_MISSION_STARTED, { 
              missionId: mission.id,
              title: mission.title
          });
      }
    }

    try {
      await triggerNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: isAutoApproved ? `Challenge Validé : ${mission.title}` : `Mission transmise : ${mission.title}`,
        message: isAutoApproved
          ? `Ton challenge hebdomadaire est validé. +${xpToAward} XP accordés !`
          : `Analyse en cours... Bonus de Sync (+${SYNC_BONUS_XP} XP) accordé immédiatement !`,
        link: "/missions"
      });
    } catch (notificationError) {
      console.error("[NOTIFICATION_ERROR]", notificationError);
    }

    if (!isAutoApproved) {
      emailService.sendMissionSubmitted({
        email: dbUser.email,
        name: dbUser.name,
        missionTitle: mission.title,
        bonusXp: SYNC_BONUS_XP,
      });
    }

    return NextResponse.json({ 
      submission: result, 
      status: finalStatus, 
      bonusXp: SYNC_BONUS_XP, 
      missionXp: xpToAward
    });
  } catch (error) {
    console.error("[MISSION_SUBMIT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
