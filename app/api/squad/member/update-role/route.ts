export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

/**
 * Update Squad Member Role
 * 
 * Allows the 'owner' to change the role of a member (e.g., promote to 'admin' or demote to 'member').
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Non autorisé", { status: 401 });

    const { memberId, role } = await req.json();

    if (!memberId || !role) {
      return NextResponse.json({ error: "ID du membre ou rôle manquant." }, { status: 400 });
    }

    if (!["admin", "member"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
    }

    // 1. Verify caller is the owner of the squad
    const callerMember = await prisma.member.findFirst({
      where: { userId: session.user.id, role: "owner" },
      select: { id: true, organizationId: true }
    });

    if (!callerMember) {
      return NextResponse.json({ error: "Seul le leader peut modifier les rôles de commandement." }, { status: 403 });
    }

    // 2. Verify target member belongs to the same squad and is not the owner
    const targetMember = await prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, organizationId: true, userId: true, role: true }
    });

    if (!targetMember || targetMember.organizationId !== callerMember.organizationId) {
      return NextResponse.json({ error: "Le membre cible ne fait pas partie de ton escouade." }, { status: 404 });
    }

    if (targetMember.role === "owner") {
      return NextResponse.json({ error: "Le rôle du leader ne peut pas être modifié ici. Utilise le transfert de propriété." }, { status: 400 });
    }

    // 3. Update the role
    await prisma.member.update({
      where: { id: memberId },
      data: { role }
    });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_MEMBER_ROLE_UPDATED",
      entity: "squad",
      entityId: callerMember.organizationId,
      metadata: { targetUserId: targetMember.userId, newRole: role },
      request: req,
    });

    // Notify the member
    await prisma.notification.create({
      data: {
        userId: targetMember.userId,
        type: "SQUAD_PROMOTED",
        title: role === "admin" ? "Promotion au rang d'Officier !" : "Mise à jour de ton rang",
        message: role === "admin" 
          ? "Tu as été promu Officier de l'escouade. Tu peux désormais gérer les membres et les candidatures."
          : "Ton rang a été réinitialisé au grade de Membre standard.",
        link: "/squad/manage",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_ROLE_UPDATE_ERROR]", error);
    return new NextResponse("Erreur lors de la mise à jour du rôle.", { status: 500 });
  }
}
