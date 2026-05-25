export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("AccÃ¨s non autorisÃ©. Connecte-toi pour uploader ton avatar.", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("Aucun fichier dÃ©tectÃ©.", { status: 400 });
    }

    // Validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return new NextResponse("Format non supportÃ©. Utilise JPEG, PNG ou WEBP.", { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return new NextResponse("Fichier trop lourd. La limite est de 2 Mo.", { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${session.user.id}-${Date.now()}.webp`; // Add timestamp to bypass CDN cache

    const { error } = await getSupabaseAdmin().storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("[AVATAR_UPLOAD_ERROR]", error);
      return new NextResponse("Erreur lors de la sauvegarde sur le serveur de stockage.", { status: 500 });
    }

    const { data: { publicUrl } } = getSupabaseAdmin().storage
      .from("avatars")
      .getPublicUrl(fileName);

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    });

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("[AVATAR_POST]", error);
    return new NextResponse("Une erreur systÃ¨me est survenue. RÃ©essaie dans un instant.", { status: 500 });
  }
}
