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
      return NextResponse.json({ message: "Accès non autorisé. Connecte-toi pour uploader ton avatar." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier détecté." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ message: "Format non supporté. Utilise JPEG, PNG ou WEBP." }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ message: "Fichier trop lourd. La limite est de 2 Mo." }, { status: 400 });
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
    return NextResponse.json({ message: "Une erreur système est survenue. Réessaie dans un instant." }, { status: 500 });
  }
}
