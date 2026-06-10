export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/upload";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Accès non autorisé. Connecte-toi pour uploader ton avatar.", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("Aucun fichier détecté.", { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return new NextResponse("Format non supporté. Utilise JPEG, PNG ou WEBP.", { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return new NextResponse("Fichier trop lourd. La limite est de 2 Mo.", { status: 400 });
    }

    const extByMime: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const ext = extByMime[file.type];
    const fileName = `${session.user.id}-${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const url = await saveFile(buffer, fileName, "avatars");

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: url },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[AVATAR_POST]", error);
    return new NextResponse("Une erreur système est survenue. Réessaie dans un instant.", { status: 500 });
  }
}
