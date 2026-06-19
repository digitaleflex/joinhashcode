export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { isFeatureEnabled } from "@/lib/features";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  if (!isFeatureEnabled("squads")) return NextResponse.json({ error: "Fonctionnalité désactivée." }, { status: 404 });
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { targetUserId } = await req.json();
  if (!targetUserId || typeof targetUserId !== "string") {
    return NextResponse.json({ error: "ID cible requis" }, { status: 400 });
  }

  const inviterMember = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: { organization: { select: { name: true } } },
  });

  if (!inviterMember) {
    return NextResponse.json({ error: "Tu n'es membre d'aucune escouade" }, { status: 400 });
  }

  if (inviterMember.role !== "owner" && inviterMember.role !== "admin") {
    return NextResponse.json({ error: "Seuls les propriétaires et admins peuvent inviter" }, { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true, name: true },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const existingMember = await prisma.member.findUnique({
    where: { userId: targetUserId },
  });
  if (existingMember) {
    return NextResponse.json({ error: "Cet utilisateur est déjà dans une escouade" }, { status: 409 });
  }

  const existingInvite = await prisma.invitation.findFirst({
    where: {
      organizationId: inviterMember.organizationId,
      email: targetUser.email,
      status: "pending",
    },
  });
  if (existingInvite) {
    return NextResponse.json({ error: "Invitation déjà envoyée" }, { status: 409 });
  }

  const memberCount = await prisma.member.count({
    where: { organizationId: inviterMember.organizationId },
  });
  if (memberCount >= 5) {
    return NextResponse.json({ error: "Ton escouade est complète (5/5)" }, { status: 400 });
  }

  const invitation = await prisma.invitation.create({
    data: {
      id: crypto.randomUUID(),
      organizationId: inviterMember.organizationId,
      email: targetUser.email,
      role: "member",
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      inviterId: session.user.id,
    },
  });

  await Promise.allSettled([
    triggerNotification({
      userId: targetUser.id,
      type: "SYSTEM",
      title: "Invitation à rejoindre une escouade",
      message: `${session.user.name} t'invite à rejoindre "${inviterMember.organization.name}"`,
      link: `/invite/accept?id=${invitation.id}`,
    }),
    logActivity({
      userId: session.user.id,
      action: "SQUAD_INVITE_SENT",
      entity: "invitation",
      entityId: invitation.id,
      metadata: { targetUserId, squadName: inviterMember.organization.name },
      request: req,
    }),
  ]);

  return NextResponse.json({ message: "Invitation envoyée !" });
}
