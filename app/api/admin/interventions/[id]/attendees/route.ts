import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const updateAttendeeSchema = z.object({
  status: z.enum(["REGISTERED", "ATTENDED", "CANCELLED", "WAITLIST"]),
  feedback: z.string().optional().nullable(),
  rating: z.number().min(1).max(5).optional().nullable(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const attendees = await prisma.interventionAttendee.findMany({
      where: { interventionId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, pseudo: true, image: true, class: true, level: true },
        },
      },
      orderBy: { registeredAt: "asc" },
    });

    return NextResponse.json(attendees);
  } catch (error) {
    console.error("[ADMIN_INTERVENTION_ATTENDEES_GET]", error);
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
    const { attendeeId, ...data } = body;
    const validatedData = updateAttendeeSchema.parse(data);

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.status === "ATTENDED") {
      updateData.attendedAt = new Date();
    }

    const attendee = await prisma.interventionAttendee.update({
      where: { id: attendeeId },
      data: updateData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_INTERVENTION_ATTENDEE_UPDATED",
      entity: "InterventionAttendee",
      entityId: attendee.id,
      metadata: { interventionId: id, status: validatedData.status },
      request: req,
    });

    return NextResponse.json(attendee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_INTERVENTION_ATTENDEES_PATCH]", error);
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
    const { searchParams } = new URL(req.url);
    const attendeeId = searchParams.get("attendeeId");

    if (!attendeeId) {
      return NextResponse.json({ message: "ID participant requis" }, { status: 400 });
    }

    await prisma.interventionAttendee.delete({ where: { id: attendeeId } });

    logActivity({
      userId: admin.id,
      action: "ADMIN_INTERVENTION_ATTENDEE_REMOVED",
      entity: "InterventionAttendee",
      entityId: attendeeId,
      metadata: { interventionId: id },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_INTERVENTION_ATTENDEES_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}