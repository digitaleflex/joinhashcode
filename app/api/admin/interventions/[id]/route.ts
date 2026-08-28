import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().optional(),
  duration: z.number().min(1).optional(),
  speaker: z.string().min(1).optional(),
  capacity: z.number().min(1).optional(),
  location: z.string().min(1).optional(),
  locationUrl: z.string().url().optional().nullable(),
  recordingUrl: z.string().url().optional().nullable(),
  status: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const intervention = await prisma.intervention.findUnique({
      where: { id },
      include: {
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, email: true, pseudo: true, image: true },
            },
          },
          orderBy: { registeredAt: "asc" },
        },
        _count: { select: { attendees: true } },
      },
    });

    if (!intervention) {
      return NextResponse.json({ message: "Intervention non trouvée" }, { status: 404 });
    }

    return NextResponse.json(intervention);
  } catch (error) {
    console.error("[ADMIN_INTERVENTION_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    const intervention = await prisma.intervention.update({
      where: { id },
      data: updateData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_INTERVENTION_UPDATED",
      entity: "Intervention",
      entityId: intervention.id,
      metadata: { title: intervention.title, changes: Object.keys(validatedData) },
      request: req,
    });

    return NextResponse.json(intervention);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_INTERVENTION_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;

    await prisma.intervention.delete({ where: { id } });

    logActivity({
      userId: admin.id,
      action: "ADMIN_INTERVENTION_DELETED",
      entity: "Intervention",
      entityId: id,
      metadata: {},
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_INTERVENTION_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}