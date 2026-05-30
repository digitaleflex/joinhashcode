export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const type = formData.get("type") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

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
      // Validate file size (max 3 MB) and type (Images or PDF)
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Format non supporté. JPEG, PNG, WEBP ou PDF uniquement." }, { status: 400 });
      }

      if (file.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "Fichier trop lourd. Limite de 3 Mo." }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `feedback-${session.user.id}-${Date.now()}.${fileExt}`;

      // Upload file with absolute safety: try "feedback" bucket, fallback to "avatars" if not found
      let uploadError = null;
      try {
        const { error } = await getSupabaseAdmin().storage
          .from("feedback")
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
          });
        uploadError = error;
      } catch (err) {
        uploadError = err;
      }

      if (uploadError) {
        // Fallback to "avatars" bucket which is guaranteed to exist
        const { error: fallbackError } = await getSupabaseAdmin().storage
          .from("avatars")
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (fallbackError) {
          console.error("[FEEDBACK_UPLOAD_ERROR]", fallbackError);
          return NextResponse.json({ error: "Erreur lors du téléversement de la pièce jointe." }, { status: 500 });
        } else {
          const { data: { publicUrl } } = getSupabaseAdmin().storage
            .from("avatars")
            .getPublicUrl(fileName);
          attachmentUrl = publicUrl;
        }
      } else {
        const { data: { publicUrl } } = getSupabaseAdmin().storage
          .from("feedback")
          .getPublicUrl(fileName);
        attachmentUrl = publicUrl;
      }
    }

    const feedback = await prisma.betaFeedback.create({
      data: {
        userId: session.user.id,
        type,
        content,
        attachmentUrl,
      },
    });

    // Notify user — fire-and-forget, a failed email must not block the feedback save
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
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
