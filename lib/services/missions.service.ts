import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/experience";
import { getCurrentCycleKey } from "@/lib/missions";
import { calculateAndSetLevel } from "@/lib/evolution-utils";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import { trackEvent, EVENTS } from "@/lib/analytics";

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

export interface MissionSubmissionInput {
  userId: string;
  missionId: string;
  content: string;
  projectDescription?: string;
  userDifficulty?: number;
  userRating?: number;
  userFeedback?: string;
  improvementSuggestions?: string;
}

export class MissionsService {
  static async submitMission(input: MissionSubmissionInput) {
    const { 
      userId,
      missionId, 
      content,
      projectDescription,
      userDifficulty,
      userRating,
      userFeedback,
      improvementSuggestions
    } = input;

    const mission = await prisma.mission.findFirst({
      where: { OR: [{ id: missionId }, { slug: missionId }] },
    });
    if (!mission) {
      throw new Error("MISSION_NOT_FOUND");
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        experience: true,
        missionsCompletedCount: true,
        stats: {
          select: {
            currentStreak: true,
          }
        },
      }
    });

    if (!dbUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const requiredLevel = LEVEL_REQUIREMENT[mission.missionLevel ?? "INIT"] ?? 1;
    if (dbUser.level < requiredLevel) {
      throw new Error("LEVEL_TOO_LOW");
    }

    const cycleKey = getCurrentCycleKey(mission);

    const existingSubmission = await prisma.missionSubmission.findUnique({
      where: {
        userId_missionId_cycleKey: {
          userId: userId,
          missionId: mission.id,
          cycleKey: cycleKey
        }
      }
    });

    if (existingSubmission) {
      if (existingSubmission.status === "APPROVED") {
        throw new Error("ALREADY_APPROVED");
      }
      if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") {
        throw new Error("SUBMISSION_PENDING");
      }
      if (existingSubmission.revisionCount >= 3) {
        throw new Error("MAX_REVISIONS_REACHED");
      }
    }

    const SYNC_BONUS_XP = (dbUser.stats?.currentStreak || 0) >= 3 ? 6 : 5;
    const isAutoApproved = mission.isWeeklyChallenge || mission.slug === "signal-ouverture" || mission.id === "signal-ouverture";
    const finalStatus = isAutoApproved ? "APPROVED" : "PENDING";
    const xpToAward = isAutoApproved ? (mission.xp || 0) : 0;

    // Fix SEC-001: Award SYNC_BONUS_XP only on the FIRST submission for this mission/cycle
    const experienceToIncrement = (existingSubmission ? 0 : SYNC_BONUS_XP) + xpToAward;

    const resultSubmission = await prisma.$transaction(async (tx) => {
      const submission = await tx.missionSubmission.upsert({
        where: {
          userId_missionId_cycleKey: {
            userId: userId,
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
          userId: userId,
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

      if (experienceToIncrement > 0) {
        await awardXp(userId, experienceToIncrement, isAutoApproved ? "MISSION_COMPLETED" : "MISSION_SUBMISSION_SYNC_BONUS", mission.id, tx);
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          missionsCompletedCount: isAutoApproved ? { increment: 1 } : undefined
        }
      });

      return submission;
    });

    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { experience: true, missionsCompletedCount: true }
    });
    
    if (finalUser) {
      await calculateAndSetLevel(userId, finalUser.experience, prisma);
      
      // Track Analytics
      if (finalUser.missionsCompletedCount === 1) {
          await trackEvent(userId, EVENTS.FIRST_MISSION_STARTED, { 
              missionId: mission.id,
              title: mission.title
          });
      }
    }

    // Side Effects (Notifications & Emails)
    try {
      await triggerNotification({
        userId: userId,
        type: "SYSTEM",
        title: isAutoApproved ? `Challenge Validé : ${mission.title}` : `Mission transmise : ${mission.title}`,
        message: isAutoApproved
          ? `Ton challenge hebdomadaire est validé. +${xpToAward} XP accordés !`
          : `Analyse en cours... Bonus de Sync (+${SYNC_BONUS_XP} XP) accordé immédiatement !`,
        link: "/missions"
      });
    } catch (notificationError) {
      console.error("[MissionsService] Notification Error", notificationError);
    }

    if (!isAutoApproved) {
      emailService.sendMissionSubmitted({
        email: dbUser.email,
        name: dbUser.name,
        missionTitle: mission.title,
        bonusXp: SYNC_BONUS_XP,
      });
    }

    return { 
      submission: resultSubmission, 
      status: finalStatus, 
      bonusXp: SYNC_BONUS_XP, 
      missionXp: xpToAward
    };
  }
}
