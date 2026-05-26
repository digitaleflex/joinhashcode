export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { XP_THRESHOLDS, getCurrentCycleKey } from "@/lib/missions";
import { BehavioralVibrancy } from "@/lib/evolution";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { calculateAndSetLevel } from "@/lib/evolution-utils";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
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
      return new NextResponse("Accès non autorisé. Connecte-toi pour valider ta mission.", { status: 401 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse("Données d'envoi invalides. Vérifie tes champs.", { status: 400 });
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
      return new NextResponse("Mission introuvable dans le système.", { status: 404 });
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
      return new NextResponse("Utilisateur introuvable.", { status: 404 });
    }

    const requiredLevel = LEVEL_REQUIREMENT[mission.missionLevel ?? "INIT"] ?? 1;
    if (dbUser.level < requiredLevel) {
      return new NextResponse("Ton rang est trop bas pour cette mission. Continue de build !", { status: 403 });
    }

    // CYCLE KEY LOGIC (Roadmap Security Audit Fix)
    const cycleKey = getCurrentCycleKey(mission);

    // Transaction to save submission and award XP safely.
    // The existingSubmission check is INSIDE the transaction to prevent race conditions:
    // two parallel requests would otherwise both pass the check and double-award XP.
    let SYNC_BONUS_XP = 5;
    const userStreak = dbUser.currentStreak || 0;
    if (userStreak >= 3) SYNC_BONUS_XP = 6;

    const isAutoApproved = mission.isWeeklyChallenge;
    const finalStatus = isAutoApproved ? "APPROVED" : "PENDING";
    const xpToAward = isAutoApproved ? mission.xp : 0;

    type SubmitError = { _code: number; _msg: string };
    const isSubmitError = (e: unknown): e is SubmitError =>
      typeof e === "object" && e !== null && "_code" in e;

    let result: Awaited<ReturnType<typeof prisma.missionSubmission.upsert>>;
    try {
      result = await prisma.$transaction(
        async (tx) => {
          const existingSubmission = await tx.missionSubmission.findUnique({
            where: {
              userId_missionId_cycleKey: {
                userId: session.user.id,
                missionId: mission.id,
                cycleKey,
              },
            },
          });

          if (existingSubmission) {
            if (existingSubmission.status === "APPROVED")
              throw Object.assign(new Error(), { _code: 409, _msg: "Cette mission a déjà été validée pour cette période." } satisfies SubmitError);
            if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW")
              throw Object.assign(new Error(), { _code: 400, _msg: "Ta soumission est déjà en attente de validation. Patience !" } satisfies SubmitError);
            if (existingSubmission.revisionCount >= 3)
              throw Object.assign(new Error(), { _code: 400, _msg: "Nombre maximum de révisions atteint. Contacte un admin." } satisfies SubmitError);
          }

          const isNew = !existingSubmission;

          const submission = await tx.missionSubmission.upsert({
            where: {
              userId_missionId_cycleKey: {
                userId: session.user.id,
                missionId: mission.id,
                cycleKey,
              },
            },
            update: {
              content,
              projectDescription,
              userDifficulty,
              userRating,
              userFeedback,
              improvementSuggestions,
              status: finalStatus,
            },
            create: {
              userId: session.user.id,
              missionId: mission.id,
              cycleKey,
              content,
              projectDescription,
              userDifficulty,
              userRating,
              userFeedback,
              improvementSuggestions,
              status: finalStatus,
              xpAwarded: xpToAward,
            },
          });

          // Award XP only on new submissions (revisions don't re-award sync bonus)
          if (isNew) {
            await tx.user.update({
              where: { id: session.user.id },
              data: {
                experience: { increment: SYNC_BONUS_XP + xpToAward },
                missionsCompletedCount: isAutoApproved ? { increment: 1 } : undefined,
              },
            });
          }

          return submission;
        },
        { isolationLevel: "Serializable" }
      );
    } catch (e) {
      if (isSubmitError(e)) {
        return new NextResponse(e._msg, { status: e._code });
      }
      throw e;
    }

    // RECALCULATE LEVEL AND BADGES
    const finalUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { experience: true }
    });
    if (finalUser) {
      await calculateAndSetLevel(session.user.id, finalUser.experience, prisma);
    }

    // Notify user
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
    return new NextResponse("Erreur interne du système. Nos ingénieurs sont sur le coup.", { status: 500 });
  }
}
