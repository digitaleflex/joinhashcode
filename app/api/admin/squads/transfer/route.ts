import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Only ADMIN or MODERATOR can perform this action
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { organizationId, targetMemberId } = await req.json();

    if (!organizationId || !targetMemberId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    // Verify member exists in the organization
    const targetMember = await prisma.member.findUnique({
      where: { id: targetMemberId },
      include: { user: true }
    });

    if (!targetMember || targetMember.organizationId !== organizationId) {
      return NextResponse.json({ error: "Membre cible introuvable dans cette organisation" }, { status: 404 });
    }

    // Transaction: Downgrade all current owners to member, then upgrade target to owner
    await prisma.$transaction([
      prisma.member.updateMany({
        where: {
          organizationId: organizationId,
          role: { in: ["owner", "LEADER"] }
        },
        data: { role: "member" }
      }),
      prisma.member.update({
        where: { id: targetMemberId },
        data: { role: "owner" }
      }),
      // Log the admin action
      prisma.activityLog.create({
        data: {
          action: "ADMIN_SQUAD_TRANSFER",
          userId: session.user.id,
          metadata: { targetMemberId, targetUserEmail: targetMember.user.email }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur transfert admin :", error);
    return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
  }
}
