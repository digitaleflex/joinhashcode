import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const articleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
  slug: z.string().min(1),
  authorId: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const patchSchema = z.object({
  isPublished: z.boolean().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = articleSchema.parse(body);

    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: {
        ...validatedData,
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
    });

    logActivity({
      userId: admin.id,
      action: validatedData.isPublished ? "ADMIN_KNOWLEDGE_PUBLISHED" : "ADMIN_KNOWLEDGE_UPDATED",
      entity: "KnowledgeArticle",
      entityId: article.id,
      metadata: { title: article.title, category: article.category, visibility: article.visibility },
      request: req
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_KNOWLEDGE_PUT]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = patchSchema.parse(body);

    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: validatedData,
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_KNOWLEDGE_UPDATED",
      entity: "KnowledgeArticle",
      entityId: article.id,
      metadata: { title: article.title, patch: Object.keys(validatedData) },
      request: req
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }
    console.error("[ADMIN_KNOWLEDGE_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited: delLimited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (delLimited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id },
      select: { title: true, category: true }
    });

    await prisma.knowledgeArticle.delete({
      where: { id },
    });

    if (article) {
      logActivity({
        userId: admin.id,
        action: "ADMIN_KNOWLEDGE_DELETED",
        entity: "KnowledgeArticle",
        entityId: id,
        metadata: { title: article.title, category: article.category },
        request: req
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_KNOWLEDGE_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}