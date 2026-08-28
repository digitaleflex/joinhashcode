import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileContentSchema = z.object({
  profile: z.enum(["builder", "creator", "strategist", "catalyst"]).optional(),
  pain: z.string().min(1).optional(),
  painBold: z.string().min(1).optional(),
  truths: z.array(z.object({
    icon: z.string().min(1),
    bold: z.string().min(1),
    rest: z.string().min(1),
  })).length(3).optional(),
  unlockedMissions: z.array(z.object({
    title: z.string().min(1),
    xp: z.number().int().min(0),
  })).length(2).optional(),
  lockedMissions: z.array(z.object({
    title: z.string().min(1),
    xp: z.number().int().min(0),
  })).optional(),
  socialProof: z.string().min(1).optional(),
  whatsappText: z.string().min(1).optional(),
  ctaLabel: z.string().min(1).optional(),
  possibleSpecializations: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    reason: z.string().min(1),
    goal90days: z.string().min(1),
    goal90daysWhy: z.string().min(1),
    goal90daysOutcomes: z.array(z.string()).default([]),
    steps: z.array(z.object({
      weekRange: z.string().min(1),
      title: z.string().min(1),
      type: z.enum(["atelier", "projet", "validation"]),
    })),
    firstAction: z.object({
      type: z.enum(["atelier", "projet", "mentor"]),
      title: z.string().min(1),
      slug: z.string().min(1),
      duration: z.string().min(1),
      pourquoi: z.string().min(1),
    }),
  })).min(1).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = profileContentSchema.parse(body);

    const content = await prisma.profileContent.update({
      where: { id },
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_PROFILE_CONTENT_UPDATED",
      entity: "profile_content",
      entityId: content.id,
      metadata: { profile: content.profile },
      request: req,
    });

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_PROFILE_CONTENT_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const content = await prisma.profileContent.findUnique({ where: { id } });
    if (!content) return NextResponse.json({ message: "Contenu non trouvé" }, { status: 404 });

    await prisma.profileContent.delete({ where: { id } });

    logActivity({
      userId: admin.id,
      action: "ADMIN_PROFILE_CONTENT_DELETED",
      entity: "profile_content",
      entityId: id,
      metadata: { profile: content.profile },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_PROFILE_CONTENT_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}