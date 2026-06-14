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
    if (!session) return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });

    const { name, slug, isPrivate, requiredLevel, description, announcement } = await req.json();

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
        name: name.trim(),
        slug,
        isPrivate: !!isPrivate,
        requiredLevel: levelNum,
        description: typeof description === "string" ? description.slice(0, 300) : undefined,
        announcement: typeof announcement === "string" ? announcement.slice(0, 200) : undefined,
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
  } catch (_) {
    console.error("[SQUAD_UPDATE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
