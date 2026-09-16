import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

const assignSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { userId } = assignSchema.parse(body);

    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { status: true, title: true },
    });

    if (!mission) {
      return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });
    }

    if (mission.status !== "PUBLISHED") {
      return NextResponse.json(
        { message: "La mission doit être publiée pour assigner des utilisateurs" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    const existing = await prisma.missionAssignment.findUnique({
      where: { userId_missionId: { userId, missionId: id } },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Cet utilisateur est déjà assigné à cette mission" },
        { status: 409 }
      );
    }

    const assignment = await prisma.missionAssignment.create({
      data: { userId, missionId: id },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_ASSIGNED",
      entity: "MissionAssignment",
      entityId: assignment.id,
      metadata: { missionId: id, missionTitle: mission.title, assignedUserId: userId, assignedUserName: user.name },
      request: req,
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSION_ASSIGN_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { userId } = assignSchema.parse(body);

    const existing = await prisma.missionAssignment.findUnique({
      where: { userId_missionId: { userId, missionId: id } },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Assignation introuvable" },
        { status: 404 }
      );
    }

    await prisma.missionAssignment.delete({
      where: { userId_missionId: { userId, missionId: id } },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_MISSION_UNASSIGNED",
      entity: "MissionAssignment",
      entityId: existing.id,
      metadata: { missionId: id, assignedUserId: userId },
      request: req,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSION_ASSIGN_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
