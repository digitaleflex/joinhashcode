export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { checkRateLimit, strictMutationLimiter } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limit check
    const { limited } = await checkRateLimit(strictMutationLimiter, userId);
    if (limited) {
      return NextResponse.json({ message: "Trop de tentatives d'invitation. Réessaie plus tard." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "L'identifiant du talent cible est requis." }, { status: 400 });
    }

    // 1. Check if viewer is member and owner/admin of a squad
    const viewerMember = await prisma.member.findFirst({
      where: { userId },
      include: {
        organization: {
          include: {
            members: true,
            invitations: {
              where: { status: "pending" }
            }
          }
        }
      }
    });

    if (!viewerMember || !["owner", "admin"].includes(viewerMember.role)) {
      return NextResponse.json({ error: "Seuls les chefs et administrateurs d'escouade peuvent envoyer des invitations." }, { status: 403 });
    }

    const squad = viewerMember.organization;

    // 2. Fetch target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        pseudo: true
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Le talent ciblé n'existe pas." }, { status: 404 });
    }

    // 3. Ensure target is not inviting themselves
    if (targetUser.id === userId) {
      return NextResponse.json({ error: "Tu ne peux pas t'inviter toi-même." }, { status: 400 });
    }

    // 4. Ensure target has no squad
    const targetSquadMembership = await prisma.member.findFirst({
      where: { userId: targetUser.id }
    });

    if (targetSquadMembership) {
      return NextResponse.json({ error: "Ce talent fait déjà partie d'une escouade." }, { status: 400 });
    }

    // 5. Ensure squad is not full (members + active invites < 5)
    const membersCount = squad.members.length;
    const invitesCount = squad.invitations.length;

    if (membersCount + invitesCount >= 5) {
      return NextResponse.json({ error: "Limite de membres atteinte. Ton escouade ne peut pas dépasser 5 agents (actifs + invitations en cours)." }, { status: 400 });
    }

    // 6. Ensure target hasn't already been invited by this squad
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        organizationId: squad.id,
        email: targetUser.email,
        status: "pending"
      }
    });

    if (existingInvite) {
      return NextResponse.json({ error: "Une invitation est déjà en cours pour ce talent." }, { status: 400 });
    }

    // 7. Create invitation
    const invitationId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    await prisma.$transaction([
      prisma.invitation.create({
        data: {
          id: invitationId,
          organizationId: squad.id,
          email: targetUser.email,
          role: "member",
          status: "pending",
          expiresAt,
          inviterId: userId
        }
      }),
      prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          userId: targetUser.id,
          type: "SQUAD_INVITATION",
          title: "Invitation d'escouade",
          message: `${session.user.name} t'invite à rejoindre son escouade "${squad.name}".`,
          link: `/invite/accept?id=${invitationId}`,
          createdAt: new Date()
        }
      })
    ]);

    logActivity({
      userId,
      action: "SQUAD_MEMBER_INVITED",
      entity: "squad",
      entityId: squad.id,
      metadata: { targetUserId: targetUser.id, targetEmail: targetUser.email, invitationId },
      request: req
    });

    // 8. Send invitation email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invitationLink = `${appUrl}/invite/accept?id=${invitationId}`;

    emailService.sendSquadInvitationEmail({
      email: targetUser.email,
      name: targetUser.name,
      leaderName: session.user.name,
      squadName: squad.name,
      invitationLink
    }).catch((err) => console.error("[EMAIL_ERROR] sendSquadInvitationEmail", err));

    return NextResponse.json({ success: true, message: `Invitation envoyée avec succès à ${targetUser.name || targetUser.email}.` });
  } catch (error: unknown) {
    console.error("[SQUAD_INVITE_ROUTE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
