export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { squadManagementLimiter, checkRateLimit } from "@/lib/ratelimit";
import { logActivity } from "@/lib/activity-log";
import { triggerNotification } from "@/lib/qstash";

const promoteSchema = z.object({
  organizationId: z.string().min(1),
  targetUserId: z.string().min(1),
  role: z.enum(["admin", "member"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { limited } = await checkRateLimit(squadManagementLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Trop d'actions. Réessaie dans une heure." }, { status: 429 });

    const body = await req.json();
    const parsed = promoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "organizationId, targetUserId et role (admin|member) requis" }, { status: 400 });
    }
    const { organizationId, targetUserId, role } = parsed.data;

    // Seul le propriétaire peut promouvoir ou rétrograder
    const requester = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId, role: "owner" },
    });
    if (!requester) return NextResponse.json({ error: "Seul le leader peut nommer un co-leader" }, { status: 403 });

    if (targetUserId === session.user.id) {
      return NextResponse.json({ error: "Impossible de modifier ton propre rôle" }, { status: 400 });
    }

    const target = await prisma.member.findFirst({
      where: { userId: targetUserId, organizationId },
    });
    if (!target) return NextResponse.json({ error: "Ce membre n'appartient pas à ton escouade" }, { status: 404 });
    if (target.role === "owner") {
      return NextResponse.json({ error: "Le rôle du leader ne peut pas être modifié" }, { status: 400 });
    }
    if (target.role === role) {
      return NextResponse.json({ error: `Ce membre est déjà ${role === "admin" ? "co-leader" : "membre"}` }, { status: 400 });
    }

    await prisma.member.update({ where: { id: target.id }, data: { role } });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_UPDATED",
      entity: "organization",
      entityId: organizationId,
      metadata: { change: "member_role", targetUserId, newRole: role },
      request: req,
    });

    await triggerNotification({
      userId: targetUserId,
      type: "SQUAD_ROLE_UPDATED",
      title: role === "admin" ? "Tu es maintenant co-leader" : "Rôle mis à jour",
      message: role === "admin"
        ? "Ton leader te fait confiance pour aider à porter l'escouade : tu peux maintenant gérer les invitations et les demandes d'adhésion."
        : "Ton rôle au sein de l'escouade a été mis à jour. Bonne continuation avec l'équipe !",
      link: "/squad",
    }).catch(() => undefined);

    return NextResponse.json({ success: true, role });
  } catch (error: unknown) {
    console.error("[SQUAD_PROMOTE]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
