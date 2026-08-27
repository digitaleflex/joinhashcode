import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.enum(["submission.created", "submission.approved", "submission.rejected", "review.started"])).optional(),
  secret: z.string().min(16).max(128).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations" }, { status: 429 });

  try {
    const { id, webhookId } = await params;
    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
      select: { id: true },
    });

    if (!mission) return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });

    const webhook = await prisma.missionWebhook.findFirst({
      where: { id: webhookId, missionId: mission.id },
    });

    if (!webhook) return NextResponse.json({ message: "Webhook introuvable" }, { status: 404 });

    const body = await req.json();
    const validated = updateWebhookSchema.parse(body);

    const updated = await prisma.missionWebhook.update({
      where: { id: webhookId },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSION_WEBHOOK_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations" }, { status: 429 });

  try {
    const { id, webhookId } = await params;
    const mission = await prisma.mission.findFirst({
      where: { OR: [{ slug: id }, { id }] },
      select: { id: true },
    });

    if (!mission) return NextResponse.json({ message: "Mission introuvable" }, { status: 404 });

    const webhook = await prisma.missionWebhook.findFirst({
      where: { id: webhookId, missionId: mission.id },
    });

    if (!webhook) return NextResponse.json({ message: "Webhook introuvable" }, { status: 404 });

    await prisma.missionWebhook.delete({ where: { id: webhookId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_MISSION_WEBHOOK_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}