import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { Prisma } from "@/generated/prisma/client";

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { scope } = await req.json().catch(() => ({ scope: "all" }));

    let users;
    if (scope === "unassigned") {
      users = await prisma.user.findMany({
        where: { class: null, behavioralVibrancy: { not: Prisma.DbNull } },
        select: { id: true, behavioralVibrancy: true },
      });
    } else {
      users = await prisma.user.findMany({
        where: { behavioralVibrancy: { not: Prisma.DbNull } },
        select: { id: true, behavioralVibrancy: true },
      });
    }

    let updated = 0;
    for (const user of users) {
      const vibrancy = user.behavioralVibrancy as Record<string, number> || { builder: 0, creator: 0, strategist: 0, catalyst: 0 };
      await updateUserEvolution(user.id, {
        builder: vibrancy.builder || 0,
        creator: vibrancy.creator || 0,
        strategist: vibrancy.strategist || 0,
        catalyst: vibrancy.catalyst || 0,
      });
      updated++;
    }

    logActivity({
      userId: admin.id,
      action: "ADMIN_CORE_RECALCULATED",
      entity: "core",
      metadata: { scope, updatedCount: updated },
      request: req,
    });

    return NextResponse.json({ updated, scope });
  } catch (error) {
    console.error("[ADMIN_CORE_RECALCULATE_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}