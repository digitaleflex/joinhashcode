import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const bulkSchema = z.object({
  action: z.enum(["archive", "publish", "close"]),
  missionIds: z.array(z.string()).min(1),
});

const VALID_TRANSITIONS: Record<string, string[]> = {
  archive: ["DRAFT", "PUBLISHED"],
  publish: ["DRAFT"],
  close: ["PUBLISHED"],
};

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  if (admin.role !== "ADMIN")
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });

  try {
    const body = await req.json();
    const { action, missionIds } = bulkSchema.parse(body);

    const validStatuses = VALID_TRANSITIONS[action];

    const missions = await prisma.mission.findMany({
      where: { id: { in: missionIds } },
      select: { id: true, title: true, status: true },
    });

    const invalid = missions.filter((m) => !validStatuses.includes(m.status));
    if (invalid.length > 0) {
      return NextResponse.json(
        {
          message: `${invalid.length} mission(s) en état invalide pour l'action "${action}"`,
          invalid: invalid.map((m) => ({ id: m.id, title: m.title, status: m.status })),
        },
        { status: 400 },
      );
    }

    const statusMap: Record<string, string> = {
      archive: "ARCHIVED",
      publish: "PUBLISHED",
      close: "CLOSED",
    };

    const updateData: Record<string, unknown> = { status: statusMap[action] };
    if (action === "publish") updateData.publishAt = new Date();
    if (action === "close") updateData.closedAt = new Date();

    const result = await prisma.mission.updateMany({
      where: { id: { in: missionIds } },
      data: updateData,
    });

    logActivity({
      userId: admin.id,
      action: `ADMIN_MISSIONS_BULK_${action.toUpperCase()}`,
      entity: "Mission",
      metadata: { count: result.count, missionIds },
      request: req,
    });

    return NextResponse.json({
      message: `${result.count} mission(s) mise(s) à jour`,
      count: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_MISSIONS_BULK_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
