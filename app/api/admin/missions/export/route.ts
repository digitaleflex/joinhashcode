import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  if (admin.role !== "ADMIN")
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });

  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        category: true,
        xp: true,
        createdAt: true,
        updatedAt: true,
        submissions: {
          select: { id: true },
        },
      },
    });

    const header = [
      "id",
      "title",
      "slug",
      "status",
      "category",
      "xp",
      "createdAt",
      "updatedAt",
      "submissionsCount",
    ];

    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const rows = missions.map((m) => [
      m.id,
      escapeCSV(m.title),
      escapeCSV(m.slug),
      m.status,
      escapeCSV(m.category),
      String(m.xp),
      m.createdAt.toISOString(),
      m.updatedAt.toISOString(),
      String(m.submissions.length),
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="missions.csv"',
      },
    });
  } catch (error) {
    console.error("[ADMIN_MISSIONS_EXPORT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
