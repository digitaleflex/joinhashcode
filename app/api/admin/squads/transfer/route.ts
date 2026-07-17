import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import { adminSquadTransferSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    // Only ADMIN or MODERATOR can perform this action
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { limited } = await checkRateLimit(adminOpsLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

    const body = await req.json();
    const parsed = adminSquadTransferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }
    const { organizationId, targetMemberId } = parsed.data;

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
  } catch (error: unknown) {
    console.error("Erreur transfert admin :", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur interne" }, { status: 500 });
  }
}
