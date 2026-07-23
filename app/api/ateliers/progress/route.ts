export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { getAtelier } from "@/lib/ateliers";

const patchSchema = z.object({
  atelierSlug: z.string().min(1),
  status: z.enum(["IN_PROGRESS", "COMPLETED"]),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (slug) where.atelierSlug = slug;

    const progress = await prisma.atelierProgress.findMany({ where });
    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { atelierSlug, status } = parsed.data;
    const atelier = getAtelier(atelierSlug);
    if (!atelier) return NextResponse.json({ error: "Atelier not found" }, { status: 404 });

    const existing = await prisma.atelierProgress.findUnique({
      where: { userId_atelierSlug: { userId: session.user.id, atelierSlug } },
    });

    if (status === "COMPLETED" && existing?.status === "COMPLETED") {
      return NextResponse.json({ error: "Already completed" }, { status: 409 });
    }

    const progress = await prisma.atelierProgress.upsert({
      where: { userId_atelierSlug: { userId: session.user.id, atelierSlug } },
      create: {
        userId: session.user.id,
        atelierSlug,
        status,
        xpEarned: status === "COMPLETED" ? atelier.xpReward : 0,
        startedAt: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      update: {
        status,
        xpEarned: status === "COMPLETED" ? atelier.xpReward : existing?.xpEarned ?? 0,
        startedAt: existing?.startedAt ?? new Date(),
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    logActivity({
      userId: session.user.id,
      action: status === "COMPLETED" ? "ATELIER_COMPLETED" : "ATELIER_STARTED",
      entity: "atelier",
      entityId: atelierSlug,
      metadata: { title: atelier.title, xpEarned: progress.xpEarned },
      request: req,
    });

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
