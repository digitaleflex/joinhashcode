export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import crypto from "crypto";
import { validateSquadCognitiveBalance } from "@/lib/squad-validation";
import { emailService } from "@/lib/email";
import { inviteSquadSchema } from "@/lib/validation";
import { squadManagementLimiter, checkRateLimit } from "@/lib/ratelimit";
import { requireSession, checkCsrfOrigin } from "@/lib/auth-guard";

export async function POST(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();
    const { limited } = await checkRateLimit(squadManagementLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Trop d'actions. Réessaie dans une heure." }, { status: 429 });
    const body = await req.json();
    const parsed = inviteSquadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "ID de la cible requis" }, { status: 400 });
    }
    const { targetUserId } = parsed.data;

    const inviterId = session.user.id;

    // Find the inviter's squad membership (must be owner or admin)
    const inviterMember = await prisma.member.findFirst({
      where: { userId: inviterId },
      include: { organization: true },
    });

    if (!inviterMember) {
      return NextResponse.json({ error: "Tu n'es membre d'aucune escouade" }, { status: 400 });
    }

    if (!["owner", "admin"].includes(inviterMember.role)) {
      return NextResponse.json({ error: "Seuls les chefs et admins peuvent inviter" }, { status: 403 });
    }

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Check if target is already banned
    const targetSecurity = await prisma.userSecurity.findUnique({
      where: { userId: targetUserId },
    });
    if (targetSecurity?.banned) {
      return NextResponse.json({ error: "Cet utilisateur est suspendu" }, { status: 403 });
    }

    // Check if target is already in a squad
    const targetMember = await prisma.member.findFirst({
      where: { userId: targetUserId },
    });
    if (targetMember) {
      return NextResponse.json({ error: "Cet agent est déjà dans une escouade" }, { status: 400 });
    }

    // Check cognitive balance
    const balanceValidation = await validateSquadCognitiveBalance(inviterMember.organizationId, targetUserId);
    if (!balanceValidation.allowed) {
      return NextResponse.json({ error: balanceValidation.message }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        organizationId: inviterMember.organizationId,
        email: targetUser.email,
        status: "pending",
      },
    });
    if (existingInvite) {
      return NextResponse.json({ error: "Une invitation a déjà été envoyée à cet email" }, { status: 409 });
    }

    // Check squad size limit
    const memberCount = await prisma.member.count({
      where: { organizationId: inviterMember.organizationId },
    });
    if (memberCount >= 5) {
      return NextResponse.json({ error: "Ton escouade est déjà complète (max 5)" }, { status: 400 });
    }

    // Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        id: crypto.randomUUID(),
        organizationId: inviterMember.organizationId,
        email: targetUser.email,
        role: "member",
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        inviterId,
      },
    });

    logActivity({
      userId: inviterId,
      action: "SQUAD_INVITE_SENT",
      entity: "invitation",
      entityId: invitation.id,
      metadata: {
        targetUserId,
        targetEmail: targetUser.email,
        organizationId: inviterMember.organizationId,
      },
      request: req,
    });

    // Fire-and-forget in-app notification to the target user
    prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "SQUAD_INVITATION",
        title: "Invitation à rejoindre une escouade",
        message: `${session.user.name} t'invite à rejoindre "${inviterMember.organization.name}"`,
        link: `/invite/accept?id=${invitation.id}`,
      },
    }).catch(() => {});

    // Fire-and-forget email to the target user
    if (targetUser.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
      const invitationLink = `${appUrl}/invite/accept?id=${invitation.id}`;
      emailService.sendSquadInvitationEmail({
        email: targetUser.email,
        name: targetUser.name,
        leaderName: session.user.name,
        squadName: inviterMember.organization.name,
        invitationLink,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Invitation envoyée !" });
  } catch (error: unknown) {
    console.error("[SQUAD_INVITE]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
