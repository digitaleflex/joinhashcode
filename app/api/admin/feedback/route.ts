import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.object({
  id: z.string(),
  status: z.enum(["NEW", "REVIEWED", "RESOLVED"]),
});

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    const body = await req.json();
    const result = statusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    await prisma.betaFeedback.update({
      where: { id: result.data.id },
      data: { status: result.data.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Feedback API Error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
};
