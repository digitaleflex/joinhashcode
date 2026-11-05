import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileContentSchema = z.object({
  profile: z.enum(["builder", "creator", "strategist", "catalyst"]),
  pain: z.string().min(1),
  painBold: z.string().min(1),
  truths: z.array(z.object({
    icon: z.string().min(1),
    bold: z.string().min(1),
    rest: z.string().min(1),
  })).length(3),
  unlockedMissions: z.array(z.object({
    title: z.string().min(1),
    xp: z.number().int().min(0),
  })).length(2),
  lockedMissions: z.array(z.object({
    title: z.string().min(1),
    xp: z.number().int().min(0),
  })),
  socialProof: z.string().min(1),
  whatsappText: z.string().min(1),
  ctaLabel: z.string().min(1),
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
  })).min(1),
});

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const contents = await prisma.profileContent.findMany({
      orderBy: { profile: "asc" },
    });
    return NextResponse.json(contents);
  } catch (error) {
    console.error("[ADMIN_PROFILE_CONTENT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = profileContentSchema.parse(body);

    const content = await prisma.profileContent.upsert({
      where: { profile: validatedData.profile },
      create: validatedData,
      update: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_PROFILE_CONTENT_UPSERTED",
      entity: "profile_content",
      entityId: content.id,
      metadata: { profile: content.profile },
      request: req,
    });

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_PROFILE_CONTENT_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}