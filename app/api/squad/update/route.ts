import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,28})$/;

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { name, slug } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 40) {
      return NextResponse.json({ error: "Nom invalide (2–40 caractères)." }, { status: 400 });
    }

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Lien invalide : 3–30 caractères, lettres minuscules, chiffres et tirets uniquement." },
        { status: 400 }
      );
    }

    // User must be LEADER of their squad
    const membership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id, role: "LEADER" },
      select: { guildId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Tu n'es pas chef d'escouade." }, { status: 403 });
    }

    // Check slug uniqueness (excluding current squad)
    const conflict = await prisma.guild.findFirst({
      where: { slug, id: { not: membership.guildId } },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json({ error: "Ce lien est déjà pris. Essaie un autre." }, { status: 409 });
    }

    const updated = await prisma.guild.update({
      where: { id: membership.guildId },
      data: { name: name.trim(), slug },
    });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_UPDATED",
      entity: "squad",
      entityId: membership.guildId,
      metadata: { name: updated.name, slug: updated.slug },
      request: req,
    });

    return NextResponse.json({ name: updated.name, slug: updated.slug });
  } catch (error) {
    console.error("[SQUAD_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
