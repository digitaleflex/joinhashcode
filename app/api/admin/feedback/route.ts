export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { z } from "zod";
import { emailService } from "@/lib/email";
import { triggerNotification } from "@/lib/qstash";

const listQuerySchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "RESOLVED"]).optional(),
  type: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET = withAdminAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = listQuerySchema.parse({
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [items, total] = await Promise.all([
      prisma.betaFeedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      }),
      prisma.betaFeedback.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error: unknown) {
    console.error("[ADMIN_FEEDBACK_GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
});

const statusSchema = z.object({
  id: z.string(),
  status: z.enum(["NEW", "REVIEWED", "RESOLVED"]),
});


export const PATCH = withAdminAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const result = statusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const currentFeedback = await prisma.betaFeedback.findUnique({
      where: { id: result.data.id },
      select: { status: true, userId: true },
    });

    if (!currentFeedback) {
      return NextResponse.json({ error: "Feedback non trouvé" }, { status: 404 });
    }

    const updatedFeedback = await prisma.$transaction(async (tx) => {
      const feedback = await tx.betaFeedback.update({
        where: { id: result.data.id },
        data: { status: result.data.status },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              experience: true,
              level: true,
            },
          }
        }
      });

      // Reward notification if moving to RESOLVED and wasn't already RESOLVED
      // (Découplage pipeline : XP/evolution retirés — gamification gelée)
      if (result.data.status === "RESOLVED" && currentFeedback.status !== "RESOLVED") {
        try {
          await triggerNotification({
            userId: feedback.userId,
            type: "SYSTEM",
            title: "Feedback résolu",
            message: "Ton feedback a été pris en compte et résolu. Merci pour ta contribution !",
            link: "/dashboard",
          });
        } catch (error) {
          console.error("Notification Error:", error);
        }
      }

      return feedback;
    });

    // Notify user of status change (if not NEW)
    if (result.data.status !== "NEW") {
      await emailService.sendFeedbackUpdate({
        email: updatedFeedback.user.email,
        name: updatedFeedback.user.name,
        status: result.data.status,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("Admin Feedback API Error:", e);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
});

