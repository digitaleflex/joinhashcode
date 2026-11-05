export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { containsProfanity } from "@/lib/security";
import { requireSession, checkCsrfOrigin, AuthError } from "@/lib/auth-guard";
import { updateSquadSchema } from "@/lib/validation";
import { squadManagementLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function PATCH(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();
    const { limited } = await checkRateLimit(squadManagementLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Trop d'actions. Réessaie dans une heure." }, { status: 429 });

    const body = await req.json();
    const parsed = updateSquadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }

    const { name, slug, isPrivate, requiredLevel, description, announcement, discordInviteUrl } = parsed.data;

    // Profanity Filter
    if (name && containsProfanity(name)) {
      return NextResponse.json(
        { error: "Ce nom n'est pas autorisé par le protocole de sécurité HASHCODE." },
        { status: 400 }
      );
    }

    const levelNum = requiredLevel ?? 1;

    // User must be owner or admin of their squad
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id, role: { in: ["owner", "admin"] } },
      select: { organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Tu n'as pas les droits de gestion pour cette escouade." }, { status: 403 });
    }

    // Check slug uniqueness (excluding current squad)
    const conflict = await prisma.organization.findFirst({
      where: { slug, id: { not: membership.organizationId } },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json({ error: "Ce lien est déjà pris. Essaie un autre." }, { status: 409 });
    }

    const updated = await prisma.organization.update({
      where: { id: membership.organizationId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(slug !== undefined && { slug }),
        ...(isPrivate !== undefined && { isPrivate: !!isPrivate }),
        ...(requiredLevel !== undefined && { requiredLevel: levelNum }),
        ...(description !== undefined && { description }),
        ...(announcement !== undefined && { announcement }),
        ...(discordInviteUrl !== undefined && { discordInviteUrl: discordInviteUrl ?? null }),
      },
    });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_UPDATED",
      entity: "squad",
      entityId: membership.organizationId,
      metadata: { name: updated.name, slug: updated.slug, isPrivate: updated.isPrivate, requiredLevel: updated.requiredLevel, hasDiscord: !!updated.discordInviteUrl },
      request: req,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[SQUAD_UPDATE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
