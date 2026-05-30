export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { containsProfanity } from "@/lib/security";

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,28})$/;

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Non autorisé. Connecte-toi pour continuer.", { status: 401 });

    const { name, slug, isPrivate, requiredLevel } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 40) {
      return NextResponse.json({ error: "Nom invalide (2–40 caractères)." }, { status: 400 });
    }

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Lien invalide : 3–30 caractères, lettres minuscules, chiffres et tirets uniquement." },
        { status: 400 }
      );
    }

    // Validate level
    const levelNum = parseInt(requiredLevel);
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
      return NextResponse.json({ error: "Niveau d'habilitation invalide (1–10)." }, { status: 400 });
    }

    // Profanity Filter
    if (containsProfanity(name) || containsProfanity(slug)) {
      return NextResponse.json(
        { error: "Ce nom n'est pas autorisé par le protocole de sécurité HASHCODE." },
        { status: 400 }
      );
    }

    // User must be owner of their squad
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id, role: "owner" },
      select: { organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Tu n'es pas chef d'escouade." }, { status: 403 });
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
        name: name.trim(), 
        slug,
        isPrivate: !!isPrivate,
        requiredLevel: levelNum
      },
    });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_UPDATED",
      entity: "squad",
      entityId: membership.organizationId,
      metadata: { name: updated.name, slug: updated.slug, isPrivate: updated.isPrivate, requiredLevel: updated.requiredLevel },
      request: req,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SQUAD_UPDATE]", error);
    return new NextResponse("Erreur système. Réessaie dans un instant.", { status: 500 });
  }
}
