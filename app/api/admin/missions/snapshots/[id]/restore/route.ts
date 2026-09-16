import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { restoreSnapshot } from "@/lib/mission-versioning";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const snapshot = await prisma.missionSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return NextResponse.json({ message: "Snapshot introuvable" }, { status: 404 });
    }

    const mission = await restoreSnapshot(id);

    logActivity({
      userId: session.user.id,
      action: "ADMIN_MISSION_UPDATED",
      entity: "Mission",
      entityId: mission.id,
      metadata: { title: mission.title, slug: mission.slug, restoredFrom: id },
      request: req,
    });

    return NextResponse.json(mission);
  } catch (error) {
    console.error("[ADMIN_SNAPSHOT_RESTORE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
