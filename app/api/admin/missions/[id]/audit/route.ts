import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!mission)
      return NextResponse.json(
        { message: "Mission introuvable" },
        { status: 404 },
      );

    const logs = await prisma.activityLog.findMany({
      where: {
        entity: "Mission",
        entityId: id,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        userId: true,
        action: true,
        entity: true,
        entityId: true,
        metadata: true,
        ip: true,
        userAgent: true,
        createdAt: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[ADMIN_MISSION_AUDIT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
