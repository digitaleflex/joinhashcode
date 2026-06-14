export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) return NextResponse.json({ error: "Trop de requêtes. Réessaie dans une minute." }, { status: 429 });

    const formData = await req.formData();
    const type = formData.get("type") as string;
    const content = formData.get("content") as string;
    const ratingStr = formData.get("rating") as string;
    const file = formData.get("file") as File | null;

    const rating = ratingStr ? parseInt(ratingStr) : null;
    if (rating !== null && (isNaN(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Note de satisfaction invalide (1-5)" }, { status: 400 });
    }

    if (!type || !content) {
      return NextResponse.json({ error: "Données de transmission manquantes" }, { status: 400 });
    }

    if (content.length < 10) {
      return NextResponse.json({ error: "Le message doit contenir au moins 10 caractères" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "Le message ne doit pas dépasser 2000 caractères" }, { status: 400 });
    }

    const validTypes = ["BUG", "FEATURE_REQUEST", "GENERAL"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Nature de transmission invalide" }, { status: 400 });
    }

    let attachmentUrl: string | null = null;

    if (file && file.size > 0) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Format non supporté. JPEG, PNG, WEBP ou PDF uniquement." }, { status: 400 });
      }

      if (file.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "Fichier trop lourd. Limite de 3 Mo." }, { status: 400 });
      }

      const extByMime: Record<string, string> = {
        "image/jpeg": "jpg", "image/png": "png",
        "image/webp": "webp", "application/pdf": "pdf",
      };
      const fileExt = extByMime[file.type];
      const fileName = `feedback-${session.user.id}-${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
      const buffer = await file.arrayBuffer();

      try {
        attachmentUrl = await saveFile(buffer, fileName, "feedback");
      } catch (_) {
        console.error("[FEEDBACK_UPLOAD_ERROR]", err);
        return NextResponse.json(
          { error: "Le service de pièces jointes est indisponible. Réessaie sans pièce jointe." },
          { status: 503 }
        );
      }
    }

    const feedback = await prisma.betaFeedback.create({
      data: {
        userId: session.user.id,
        type,
        content,
        rating,
        attachmentUrl,
      },
    });

    emailService.sendFeedbackReceipt({
      email: session.user.email,
      name: session.user.name,
      type,
    }).catch((err: unknown) => console.error("[EMAIL_ERROR] sendFeedbackReceipt", err));

    return NextResponse.json({
      success: true,
      message: "Feedback envoyé avec succès !",
      id: feedback.id
    });
  } catch (_) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
