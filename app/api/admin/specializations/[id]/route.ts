import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { z } from "zod";

const specializationUpdateSchema = z.object({
  id: z.string().min(1).optional(),
  class: z.enum(["BUILDER", "CREATOR", "STRATEGIST", "CATALYST"]).optional(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  missions: z.array(z.object({
    missionId: z.string().min(1),
    order: z.number().int().min(0),
    prerequisites: z.array(z.string()).default([]),
    xp: z.number().int().min(0),
  })).optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = specializationUpdateSchema.parse(body);

    const specialization = await prisma.specialization.update({
      where: { id },
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_SPECIALIZATION_UPDATED",
      entity: "specialization",
      entityId: specialization.id,
      metadata: { id: specialization.id, name: specialization.name },
      request: req,
    });

    return NextResponse.json(specialization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_SPECIALIZATIONS_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const spec = await prisma.specialization.findUnique({ where: { id } });
    if (!spec) return NextResponse.json({ message: "Spécialisation non trouvée" }, { status: 404 });

    await prisma.specialization.delete({ where: { id } });

    logActivity({
      userId: admin.id,
      action: "ADMIN_SPECIALIZATION_DELETED",
      entity: "specialization",
      entityId: id,
      metadata: { id: spec.id, name: spec.name },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_SPECIALIZATIONS_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}