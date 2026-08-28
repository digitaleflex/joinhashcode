import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { z } from "zod";

const specializationSchema = z.object({
  id: z.string().min(1),
  class: z.enum(["BUILDER", "CREATOR", "STRATEGIST", "CATALYST"]),
  name: z.string().min(1),
  description: z.string().min(1),
  missions: z.array(z.object({
    missionId: z.string().min(1),
    order: z.number().int().min(0),
    prerequisites: z.array(z.string()).default([]),
    xp: z.number().int().min(0),
  })).min(1),
});

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: [{ class: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(specializations);
  } catch (error) {
    console.error("[ADMIN_SPECIALIZATIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = specializationSchema.parse(body);

    const maxOrder = await prisma.specialization.findFirst({
      where: { class: validatedData.class },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const specialization = await prisma.specialization.create({
      data: {
        id: validatedData.id,
        class: validatedData.class,
        name: validatedData.name,
        description: validatedData.description,
        missions: validatedData.missions as any,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_SPECIALIZATION_CREATED",
      entity: "specialization",
      entityId: specialization.id,
      metadata: { id: specialization.id, name: specialization.name, class: specialization.class },
      request: req,
    });

    return NextResponse.json(specialization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_SPECIALIZATIONS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}