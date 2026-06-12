export const dynamic = "force-dynamic";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateSquadCohesion } from "@/lib/squad-logic";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { requestId, memberId, action } = body;

    // Legacy: remove an existing member directly
    if (memberId && action === "remove") {
      const target = await prisma.member.findUnique({ where: { id: memberId } });
      if (!target) return NextResponse.json({ message: "Membre introuvable" }, { status: 404 });
      
      const leadership = await prisma.member.findFirst({
        where: { organizationId: target.organizationId, userId: session.user.id, role: { in: ["owner", "admin"] } },
      });
      if (!leadership) return NextResponse.json({ message: "Interdit : Droits de commandement requis" }, { status: 403 });

      // Security check: Admins cannot remove owners or other admins
      if (leadership.role === "admin" && (target.role === "owner" || target.role === "admin")) {
        return NextResponse.json({ message: "Interdit : Un officier ne peut pas révoquer un autre officier ou le chef." }, { status: 403 });
      }

      const org = await prisma.organization.findUnique({ where: { id: target.organizationId }, select: { name: true } });
      await prisma.member.delete({ where: { id: memberId } });
      await prisma.notification.create({
        data: {
          userId: target.userId,
          type: "SQUAD_MEMBER_KICKED",
          title: "Tu as été retiré de l'escouade",
          message: `Le chef de ${org?.name || "l'escouade"} t'a retiré de l'équipe. Tu peux rejoindre ou créer une nouvelle escouade.`,
          link: "/squad",
        },
      }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (!requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    // Load the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!joinRequest) return NextResponse.json({ message: "Demande introuvable" }, { status: 404 });
    if (joinRequest.status !== "PENDING") {
      return NextResponse.json({ message: "Cette demande a déjà été traitée" }, { status: 400 });
    }

    // Verify caller has management rights
    const leadership = await prisma.member.findFirst({
      where: {
        organizationId: joinRequest.organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });
    if (!leadership) return NextResponse.json({ message: "Interdit : Droits de commandement requis" }, { status: 403 });

    if (action === "accept") {
      // Check capacity (max 5)
      const memberCount = await prisma.member.count({
        where: { organizationId: joinRequest.organizationId },
      });
      if (memberCount >= 5) {
        return NextResponse.json({ message: "L'escouade est complète (5/5)" }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        // Create membership
        await tx.member.create({
          data: {
            id: crypto.randomUUID(),
            organizationId: joinRequest.organizationId,
            userId: joinRequest.userId,
            role: "member",
            createdAt: new Date(),
          },
        });

        // Mark request accepted
        await tx.joinRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED" },
        });

        // Cancel all other pending requests from this user
        await tx.joinRequest.updateMany({
          where: { userId: joinRequest.userId, status: "PENDING", id: { not: requestId } },
          data: { status: "REJECTED" },
        });
      });

      // Boost squad cohesion by 10% on successful recruitment (+10% dynamic balance)
      await updateSquadCohesion(joinRequest.organizationId, 0.1, joinRequest.userId);

      // Notify the new member
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: "SQUAD_REQUEST_ACCEPTED",
          title: "Candidature acceptée !",
          message: "Tu as été recruté dans une escouade. Direction /squad pour rejoindre tes coéquipiers.",
          link: "/squad",
        },
      });
    } else {
      // Reject
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });

      // Notify the requester
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: "SQUAD_REQUEST_REJECTED",
          title: "Candidature refusée",
          message: "Ta demande d'intégration n'a pas été retenue. Tu peux postuler dans une autre escouade.",
          link: "/squad",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_RESPOND]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
