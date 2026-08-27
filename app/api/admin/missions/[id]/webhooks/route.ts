import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(["submission.created", "submission.approved", "submission.rejected", "review.started"])).min(1),
  secret: z.string().min(16).max(128),
  isActive: z.boolean().optional().default(true),
});

const updateWebhookSchema = webhookSchema.partial();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
      select: { id: true },
    });

    if (!mission) return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });

    const webhooks = await prisma.missionWebhook.findMany({
      where: { missionId: mission.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(webhooks);
  } catch (error) {
    console.error("[ADMIN_MISSION_WEBHOOKS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations" }, { status: 429 });

  try {
    const { id } = await params;
    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
      select: { id: true },
    });

    if (!mission) return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });

    const body = await req.json();
    const validated = webhookSchema.parse(body);

    const webhook = await prisma.missionWebhook.create({
      data: {
        missionId: mission.id,
        url: validated.url,
        secret: validated.secret,
        events: validated.events,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSION_WEBHOOKS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}