import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import { adminSquadDisbandSchema } from "@/lib/validation";

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
    const parsed = adminSquadDisbandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "ID d'organisation manquant" }, { status: 400 });
    }
    const { organizationId } = parsed.data;

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return NextResponse.json({ error: "Organisation introuvable" }, { status: 404 });
    }

    // Prisma Cascade delete will handle Member, Invitation, etc. based on schema
    await prisma.$transaction([
      prisma.organization.delete({
        where: { id: organizationId }
      }),
      // Log the admin action
      prisma.activityLog.create({
        data: {
          action: "ADMIN_SQUAD_DISBAND",
          userId: session.user.id,
          metadata: { squadName: organization.name }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Erreur dissolution admin :", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur interne" }, { status: 500 });
  }
}
