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

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const profile = searchParams.get("profile");
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (profile) where.profile = profile;
    if (category) where.category = category;
    if (isActive !== null) where.isActive = isActive === "true";

    const ateliers = await prisma.atelier.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ ateliers });
  } catch (error) {
    console.error("[ADMIN_ATELIERS_GET]", error);
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
    const validatedData = atelierSchema.parse(body);

    const atelier = await prisma.atelier.create({
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_ATELIER_CREATED",
      entity: "Atelier",
      entityId: atelier.id,
      metadata: { title: atelier.title, profile: atelier.profile },
      request: req
    });

    return NextResponse.json(atelier);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_ATELIERS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}