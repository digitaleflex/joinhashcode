import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const atelierSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  order: z.number().min(0),
  icon: z.string().optional(),
  category: z.string().min(1),
  prerequisites: z.array(z.string()).default([]),
  profile: z.string().min(1),
  specializationId: z.string().min(1),
  specializationLabel: z.string().min(1),
  xpReward: z.number().min(0).default(50),
  missionSlugs: z.array(z.string()).default([]),
  pourquoi: z.string().optional(),
  isActive: z.boolean().default(true),
});

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = atelierSchema.parse(body);

    const atelier = await prisma.atelier.update({
      where: { id },
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_ATELIER_UPDATED",
      entity: "Atelier",
      entityId: atelier.id,
      metadata: { title: atelier.title, profile: atelier.profile },
      request: req
    });

    return NextResponse.json(atelier);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_ATELIERS_PUT]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = patchSchema.parse(body);

    const atelier = await prisma.atelier.update({
      where: { id },
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_ATELIER_UPDATED",
      entity: "Atelier",
      entityId: atelier.id,
      metadata: { title: atelier.title, patch: Object.keys(validatedData) },
      request: req
    });

    return NextResponse.json(atelier);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_ATELIERS_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited: delLimited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (delLimited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const atelier = await prisma.atelier.findUnique({
      where: { id },
      select: { title: true, profile: true }
    });

    await prisma.atelier.delete({
      where: { id },
    });

    if (atelier) {
      logActivity({
        userId: admin.id,
        action: "ADMIN_ATELIER_DELETED",
        entity: "Atelier",
        entityId: id,
        metadata: { title: atelier.title, profile: atelier.profile },
        request: req
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_ATELIERS_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}