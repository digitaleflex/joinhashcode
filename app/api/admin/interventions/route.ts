import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const interventionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  duration: z.number().min(1),
  speaker: z.string().min(1),
  capacity: z.number().min(1),
  location: z.string().min(1),
  locationUrl: z.string().url().optional().nullable(),
  recordingUrl: z.string().url().optional().nullable(),
  status: z.string().optional(),
});

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.InterventionWhereInput = {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(startDate || endDate ? {
        date: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      } : {}),
    };

    const [interventions, total, statusCounts] = await Promise.all([
      prisma.intervention.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { attendees: true },
          },
          attendees: {
            where: { status: { in: ["REGISTERED", "ATTENDED"] } },
            select: { id: true, status: true },
          },
        },
      }),
      prisma.intervention.count({ where }),
      prisma.intervention.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      interventions: interventions.map((i) => ({
        ...i,
        attendeeCount: i._count.attendees,
        registeredCount: i.attendees.filter((a) => a.status === "REGISTERED").length,
        attendedCount: i.attendees.filter((a) => a.status === "ATTENDED").length,
        waitlistCount: i.capacity - i.attendees.filter((a) => a.status === "REGISTERED").length > 0
          ? 0
          : Math.abs(i.capacity - i.attendees.filter((a) => a.status === "REGISTERED").length),
      })),
      total,
      counts: Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN_INTERVENTIONS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const validatedData = interventionSchema.parse(body);

    const intervention = await prisma.intervention.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        duration: validatedData.duration,
        speaker: validatedData.speaker,
        capacity: validatedData.capacity,
        location: validatedData.location,
        locationUrl: validatedData.locationUrl,
        recordingUrl: validatedData.recordingUrl,
        status: validatedData.status ?? "DRAFT",
        createdBy: admin.id,
      },
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_INTERVENTION_CREATED",
      entity: "Intervention",
      entityId: intervention.id,
      metadata: { title: intervention.title, date: intervention.date.toISOString() },
      request: req,
    });

    return NextResponse.json(intervention);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_INTERVENTIONS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}