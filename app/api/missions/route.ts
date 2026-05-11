import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { MISSIONS, XP_THRESHOLDS, MissionLevel } from "@/lib/missions";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { missionId, content } = await req.json();

    if (!missionId || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) {
      return new NextResponse("Mission not found", { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, level: true, experience: true }
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

    // Transaction to save submission and update user XP/Level
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
          status: "APPROVED",
          xpAwarded: mission.xpReward
        },
        create: {
          userId: session.user.id,
          missionId: mission.id,
          content,
          status: "APPROVED",
          xpAwarded: mission.xpReward
        }
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: newXp,
          level: newLevel
        }
      });

      return sub;
    });

    return NextResponse.json({ submission, leveledUp: newLevel > dbUser.level, newLevel });
  } catch (error) {
    console.error("[MISSION_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
