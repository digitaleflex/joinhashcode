export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emailService } from "@/lib/email";

const feedbackSchema = z.object({
  type: z.enum(["BUG", "FEATURE_REQUEST", "GENERAL"]),
  content: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message ?? "Données invalides."
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const feedback = await prisma.betaFeedback.create({
      data: {
        userId: session.user.id,
        type: result.data.type,
        content: result.data.content,
      },
    });

    // Notify user — fire-and-forget, a failed email must not block the feedback save
    emailService.sendFeedbackReceipt({
      email: session.user.email,
      name: session.user.name,
      type: result.data.type,
    }).catch((err: unknown) => console.error("[EMAIL_ERROR] sendFeedbackReceipt", err));

    return NextResponse.json({ 
      success: true, 
      message: "Feedback envoyé avec succès !",
      id: feedback.id 
    });
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
