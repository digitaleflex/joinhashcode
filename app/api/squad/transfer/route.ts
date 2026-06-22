export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

/**
 * Transfer Squad Ownership
 * 
 * Allows the current 'owner' to promote another 'member' to 'owner'.
 * The previous owner becomes a standard 'member'.
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const { targetMemberId } = await req.json();

    if (!targetMemberId) {
      return NextResponse.json({ error: "ID du nouveau leader manquant." }, { status: 400 });
    }

    // 1. Verify caller is the current owner
    const callerMember = await prisma.member.findFirst({
      where: { userId: session.user.id, role: "owner" },
      select: { id: true, organizationId: true }
    });

    if (!callerMember) {
      return NextResponse.json({ error: "Seul le leader peut transférer la propriété." }, { status: 403 });
    }

    // 2. Verify target member belongs to the same squad
    const targetMember = await prisma.member.findUnique({
      where: { id: targetMemberId },
      select: { id: true, organizationId: true, userId: true }
    });

    if (!targetMember || targetMember.organizationId !== callerMember.organizationId) {
      return NextResponse.json({ error: "Le membre cible ne fait pas partie de ton escouade." }, { status: 404 });
    }

    if (targetMember.id === callerMember.id) {
      return NextResponse.json({ error: "Tu es déjà le leader." }, { status: 400 });
    }

    // 3. Perform transfer in transaction
    await prisma.$transaction([
      // Demote current owner
      prisma.member.update({
        where: { id: callerMember.id },
        data: { role: "member" }
      }),
      // Promote new owner
      prisma.member.update({
        where: { id: targetMember.id },
        data: { role: "owner" }
      })
    ]);

    logActivity({
      userId: session.user.id,
      action: "SQUAD_OWNERSHIP_TRANSFERRED",
      entity: "squad",
      entityId: callerMember.organizationId,
      metadata: { fromUserId: session.user.id, toUserId: targetMember.userId },
      request: req,
    });

    // Notify new leader
    await prisma.notification.create({
      data: {
        userId: targetMember.userId,
        type: "SQUAD_PROMOTED",
        title: "Tu es le nouveau leader !",
        message: "La gestion de l'escouade t'a été transférée. Tu as désormais les pleins pouvoirs.",
        link: "/squad",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SQUAD_TRANSFER_ERROR]", error);
    return NextResponse.json({ message: "Erreur lors du transfert de propriété." }, { status: 500 });
  }
}
