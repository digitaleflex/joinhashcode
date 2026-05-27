export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { slug } = await req.json();
    if (!slug) return new NextResponse("Slug missing", { status: 400 });

    const userId = session.user.id;

    // Refuse access for banned users
    const sessionUser = session.user as any;
    if (sessionUser.banned) {
      const banExpires = sessionUser.banExpires ? new Date(sessionUser.banExpires) : null;
      if (!banExpires || banExpires > new Date()) {
        return new NextResponse("Ton compte est suspendu.", { status: 403 });
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

    if (!squad) return new NextResponse("Escouade introuvable", { status: 404 });

    // Check if full
    if (squad.members.length >= 5) {
      return NextResponse.json({ error: "Cette escouade est déjà complète (max 5)." }, { status: 400 });
    }

    // Check if already in a squad
    const existingMember = await prisma.member.findFirst({
      where: { userId }
    });

    if (existingMember) {
      return NextResponse.json({ error: "Tu es déjà membre d'une escouade." }, { status: 400 });
    }

    // Join
    await prisma.member.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        organizationId: squad.id,
        role: "member",
        createdAt: new Date()
      }
    });

    logActivity({
      userId,
      action: "SQUAD_JOINED",
      entity: "squad",
      entityId: squad.id,
      metadata: { slug: squad.slug, memberCount: squad.members.length + 1 },
      request: req,
    });

    // Auto-approve squad-genesis mission for the new member
    const squadGenesisMission = await prisma.mission.findUnique({ where: { slug: "squad-genesis" } });
    if (squadGenesisMission) {
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
      await prisma.user.update({
        where: { id: userId },
        data: { experience: { increment: squadGenesisMission.xp } },
      }).catch(() => {});
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
  } catch (error) {
    console.error("[SQUAD_JOIN]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
