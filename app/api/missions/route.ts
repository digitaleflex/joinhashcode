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
        level: true, 
        experience: true,
        behavioralVibrancy: true,
        lastHypothesisUpdate: true,
        class: true,
        missionsCompletedCount: true
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

    if (existingSubmission && existingSubmission.status === "APPROVED") {
      return new NextResponse("Cette mission a déjà été validée. Passe à la suivante !", { status: 400 });
    }

    // For HASHCODE V1 Demo: Auto-approve missions
    const newXp = dbUser.experience + mission.xp;
    
    // Calculate if level up is needed
    let newLevel = dbUser.level;
    for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS)) {
      const levelNum = parseInt(levelStr);
      if (newXp >= threshold && levelNum > newLevel) {
        newLevel = levelNum;
      }
    }

    const currentVibrancy = (dbUser.behavioralVibrancy as unknown as BehavioralVibrancy) || {
      builder: 0,
      creator: 0,
      strategist: 0,
      catalyst: 0,
    };

    const missionWeights: BehavioralVibrancy = {
      builder: mission.weightBuilder || 0,
      creator: mission.weightCreator || 0,
      strategist: mission.weightStrategist || 0,
      catalyst: mission.weightCatalyst || 0,
    };

    // Transaction to save submission and update user XP/Level/Vibrancy
    const submission = await prisma.$transaction(async (tx) => {
      const sub = await tx.missionSubmission.upsert({
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
          status: "APPROVED",
          xpAwarded: mission.xp
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
          status: "APPROVED",
          xpAwarded: mission.xp
        }
      });

      const missionWeights: BehavioralVibrancy = {
        builder: mission.weightBuilder || 0,
        creator: mission.weightCreator || 0,
        strategist: mission.weightStrategist || 0,
        catalyst: mission.weightCatalyst || 0,
      };

      // Confidence gain for mission: 0.05
      await updateUserEvolution(session.user.id, missionWeights, 0.05, tx);

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: newXp,
          level: newLevel,
          missionsCompletedCount: { increment: 1 },
        }
      });

      return sub;
    });

    // Trigger notification (replaces direct email service call)
    try {
      await triggerNotification({
        userId: session.user.id,
        type: "MISSION_APPROVED",
        title: `Mission validée : ${mission.title}`,
        message: `Tu as gagné +${mission.xp} XP !`,
        link: "/missions"
      });
    } catch (notificationError) {
      console.error("[NOTIFICATION_ERROR]", notificationError);
    }

    return NextResponse.json({ submission, leveledUp: newLevel > dbUser.level, newLevel });
  } catch (error) {
    console.error("[MISSION_SUBMIT]", error);
    return new NextResponse("Erreur interne du système. Nos ingénieurs sont sur le coup.", { status: 500 });
  }
}
