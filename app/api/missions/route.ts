import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { MISSIONS, XP_THRESHOLDS, MissionLevel } from "@/lib/missions";
import { emailService } from "@/lib/email";
import { updateVibrancyWithDecay, BehavioralVibrancy } from "@/lib/evolution";
import { triggerNotification } from "@/lib/qstash";
import { z } from "zod";

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse("Invalid request data", { status: 400 });
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

    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) {
      return new NextResponse("Mission not found", { status: 404 });
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
      return new NextResponse("User not found", { status: 404 });
    }

    if (dbUser.level < mission.requiredLevel) {
      return new NextResponse("Level too low for this mission", { status: 403 });
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
      return new NextResponse("Mission already completed", { status: 400 });
    }

    // For HASHCODE V1 Demo: Auto-approve missions
    const newXp = dbUser.experience + mission.xpReward;
    
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

    const { vibrancy: newVibrancy } = updateVibrancyWithDecay(
      currentVibrancy,
      missionWeights,
      dbUser.lastHypothesisUpdate
    );

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
          xpAwarded: mission.xpReward
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
          xpAwarded: mission.xpReward
        }
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: newXp,
          level: newLevel,
          behavioralVibrancy: newVibrancy as any,
          lastHypothesisUpdate: new Date(),
          missionsCompletedCount: { increment: 1 },
        }
      });

      return sub;
    });

    // Send confirmation email
    await emailService.sendMissionApproval({
      email: session.user.email,
      name: session.user.name,
      missionTitle: mission.title,
      xp: mission.xpReward
    });

    return NextResponse.json({ submission, leveledUp: newLevel > dbUser.level, newLevel });
  } catch (error) {
    console.error("[MISSION_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
