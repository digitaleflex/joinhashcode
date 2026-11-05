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

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const visibility = searchParams.get("visibility");
    const isPublished = searchParams.get("isPublished");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (visibility) where.visibility = visibility;
    if (isPublished !== null) where.isPublished = isPublished === "true";

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("[ADMIN_KNOWLEDGE_GET]", error);
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
    const validatedData = articleSchema.parse(body);

    const article = await prisma.knowledgeArticle.create({
      data: {
        ...validatedData,
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
    });

    logActivity({
      userId: admin.id,
      action: validatedData.isPublished ? "ADMIN_KNOWLEDGE_PUBLISHED" : "ADMIN_KNOWLEDGE_CREATED",
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
    console.error("[ADMIN_KNOWLEDGE_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}