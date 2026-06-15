export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/experience";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { squadJoinLimiter, checkRateLimit } from "@/lib/ratelimit";
import crypto from "crypto";
import { validateSquadCognitiveBalance } from "@/lib/squad-validation";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { limited } = await checkRateLimit(squadJoinLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de tentatives. Réessaie dans une heure." }, { status: 429 });

    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ message: "Slug missing" }, { status: 400 });

    const userId = session.user.id;

    // Refuse access for banned users
    if (session.user.banned) {
      const banExpires = session.user.banExpires ? new Date(session.user.banExpires) : null;
      if (!banExpires || banExpires > new Date()) {
        return NextResponse.json({ message: "Ton compte est suspendu." }, { status: 403 });
      }
    }

    // Find the squad with leader info
    const squad = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });

    if (!squad) return NextResponse.json({ message: "Escouade introuvable" }, { status: 404 });

    // Prevent joining private squads directly
    if (squad.isPrivate) {
      return NextResponse.json({ 
        error: "Cette escouade est privée. Tu dois être invité(e) ou envoyer une demande d'adhésion." 
      }, { status: 403 });
    }

    // Check level authorization
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true }
    });

    if (!dbUser || dbUser.level < squad.requiredLevel) {
      return NextResponse.json({ 
        error: `Niveau d'habilitation insuffisante. Niveau ${squad.requiredLevel} requis.` 
      }, { status: 403 });
    }

    // Check Cognitive Balance
    const balanceValidation = await validateSquadCognitiveBalance(squad.id, userId);
    if (!balanceValidation.allowed) {
      return NextResponse.json({ 
        error: balanceValidation.message 
      }, { status: 400 });
    }

    // Fix SEC-006: Use transaction to prevent race conditions on member count
    const errorResult = await prisma.$transaction(async (tx) => {
      // Re-check count inside transaction
      const currentCount = await tx.member.count({
        where: { organizationId: squad.id }
      });

      if (currentCount >= 5) {
        throw new Error("SQUAD_FULL");
      }

      // Check if already in a squad (double check)
      const alreadyMember = await tx.member.findFirst({
        where: { userId }
      });

      if (alreadyMember) {
        throw new Error("ALREADY_IN_SQUAD");
      }

      // Join
      await tx.member.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          organizationId: squad.id,
          role: "member",
          createdAt: new Date()
        }
      });
      return null;
    }).catch((err) => err.message);

    if (errorResult === "SQUAD_FULL") {
      return NextResponse.json({ error: "Cette escouade est déjà complète (max 5)." }, { status: 400 });
    }
    if (errorResult === "ALREADY_IN_SQUAD") {
      return NextResponse.json({ error: "Tu es déjà membre d'une escouade." }, { status: 400 });
    }
    if (errorResult && typeof errorResult === "string" && errorResult !== "null") {
      throw new Error(errorResult);
    }

    logActivity({
      userId,
      action: "SQUAD_JOINED",
      entity: "squad",
      entityId: squad.id,
      metadata: { slug: squad.slug, memberCount: squad.members.length + 1 },
      request: req,
    });

    // Auto-approve squad-genesis mission for the new member (Fix SEC-002: Check if already approved)
    const squadGenesisMission = await prisma.mission.findUnique({ where: { slug: "squad-genesis" } });
    if (squadGenesisMission) {
      const existingSubmission = await prisma.missionSubmission.findUnique({
        where: {
          userId_missionId_cycleKey: {
            userId,
            missionId: squadGenesisMission.id,
            cycleKey: "PERMANENT",
          },
        },
        select: { status: true },
      });

      if (!existingSubmission || existingSubmission.status !== "APPROVED") {
        await prisma.missionSubmission.upsert({
          where: {
            userId_missionId_cycleKey: {
              userId,
              missionId: squadGenesisMission.id,
              cycleKey: "PERMANENT",
            },
          },
          update: { status: "APPROVED" },
          create: {
            userId,
            missionId: squadGenesisMission.id,
            cycleKey: "PERMANENT",
            status: "APPROVED",
            content: "Escouade rejointe automatiquement.",
            xpAwarded: squadGenesisMission.xp,
          },
        }).catch(() => {});
        await awardXp(userId, squadGenesisMission.xp, "SQUAD_GENESIS", squadGenesisMission.id).catch(() => {});
      }
    }

    const leader = squad.members.find((m) => m.role === "owner");
    if (leader && leader.user.id !== userId) {
      const joiner = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      if (joiner) {
        emailService.sendSquadMemberJoined({
          leaderEmail: leader.user.email,
          leaderName: leader.user.name,
          newMemberName: joiner.name,
          squadName: squad.name,
          memberCount: squad.members.length + 1,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SQUAD_JOIN]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
