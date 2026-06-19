export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isFeatureEnabled } from "@/lib/features";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

/**
 * Disband Squad
 * 
 * Allows the 'owner' to completely delete the squad and remove all members.
 * This is a destructive action.
 */
export async function DELETE(req: Request) {
  if (!isFeatureEnabled("squads")) return NextResponse.json({ message: "Fonctionnalité désactivée." }, { status: 404 });
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const userId = session.user.id;

    // 1. Verify caller is the owner
    const membership = await prisma.member.findFirst({
      where: { userId, role: "owner" },
      include: { organization: { select: { id: true, name: true } } }
    });

    if (!membership) {
      return NextResponse.json({ message: "Seul le leader peut dissoudre l'escouade." }, { status: 403 });
    }

    const squadId = membership.organizationId;
    const squadName = membership.organization.name;

    // 2. Perform dissolution (Prisma Cascade will handle members, requests, etc.)
    await prisma.organization.delete({
      where: { id: squadId }
    });

    logActivity({
      userId,
      action: "SQUAD_DISBANDED",
      entity: "squad",
      entityId: squadId,
      metadata: { name: squadName },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SQUAD_DISBAND_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
