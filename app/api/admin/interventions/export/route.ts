import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { formatYYYYMMDD } from "@/lib/dates";

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(startDate || endDate ? {
        date: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      } : {}),
    };

    const interventions = await prisma.intervention.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        _count: { select: { attendees: true } },
        attendees: {
          where: { status: { in: ["REGISTERED", "ATTENDED"] } },
          select: { id: true, status: true },
        },
      },
    });

    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const header = [
      "id",
      "title",
      "description",
      "date",
      "duration",
      "speaker",
      "capacity",
      "location",
      "locationUrl",
      "recordingUrl",
      "status",
      "createdBy",
      "createdAt",
      "updatedAt",
      "attendeeCount",
      "registeredCount",
      "attendedCount",
    ];

    const rows = interventions.map((i) => {
      const registered = i.attendees.filter((a) => a.status === "REGISTERED").length;
      const attended = i.attendees.filter((a) => a.status === "ATTENDED").length;
      return [
        i.id,
        escapeCSV(i.title),
        escapeCSV(i.description),
        i.date.toISOString(),
        String(i.duration),
        escapeCSV(i.speaker),
        String(i.capacity),
        escapeCSV(i.location),
        escapeCSV(i.locationUrl ?? ""),
        escapeCSV(i.recordingUrl ?? ""),
        i.status,
        i.createdBy,
        i.createdAt.toISOString(),
        i.updatedAt.toISOString(),
        String(i._count.attendees),
        String(registered),
        String(attended),
      ];
    });

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="interventions-export-${formatYYYYMMDD()}.csv"`,
      },
    });
  } catch (error) {
    console.error("[ADMIN_INTERVENTIONS_EXPORT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}