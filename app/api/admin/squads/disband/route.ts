import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Only ADMIN or MODERATOR can perform this action
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { organizationId } = await req.json();

    if (!organizationId) {
      return NextResponse.json({ error: "ID d'organisation manquant" }, { status: 400 });
    }

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
          metadata: { squadName: organization.name } as any
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur dissolution admin :", error);
    return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
  }
}
