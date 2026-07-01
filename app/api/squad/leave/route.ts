export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { requireSession, checkCsrfOrigin } from "@/lib/auth-guard";

export async function DELETE(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Action trop fréquente. Réessaie dans une minute." }, { status: 429 });

    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
    });

    if (!membership) {
      return NextResponse.json({ message: "Tu n'es membre d'aucune escouade." }, { status: 404 });
    }

    if (membership.role === "owner") {
      const count = await prisma.member.count({ where: { organizationId: membership.organizationId } });
      if (count > 1) {
        return NextResponse.json(
          { message: "Transfère le rôle de Leader avant de quitter l'escouade." },
          { status: 400 }
        );
      }
      // Last member + leader: delete the whole organization
      await prisma.organization.delete({ where: { id: membership.organizationId } });
    } else {
      await prisma.member.delete({ where: { id: membership.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SQUAD_LEAVE]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
