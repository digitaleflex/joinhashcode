export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/upload";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireSession, checkCsrfOrigin, AuthError } from "@/lib/auth-guard";
import { avatarLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();

    const { limited } = await checkRateLimit(avatarLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de tentatives. Réessaie dans une heure." }, { status: 429 });

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
    const buffer = await file.arrayBuffer();

    // Fix SEC-016: validate magic bytes (not just client-supplied file.type)
    const sig = Buffer.from(buffer).subarray(0, 12).toString("hex");
    const validSig =
      sig.startsWith("ffd8ff") ||                          // JPEG
      sig.startsWith("89504e47") ||                        // PNG
      (sig.startsWith("52494646") && sig.slice(16, 24) === "57454250"); // WEBP (RIFF....WEBP)
    if (!validSig) {
      return NextResponse.json({ message: "Contenu de fichier invalide." }, { status: 400 });
    }

    // Fix SEC-014: random filename — does not expose userId
    const fileName = `${randomUUID()}.${ext}`;

    const url = await saveFile(buffer, fileName, "avatars");

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: url },
    });

    return NextResponse.json({ url });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[AVATAR_POST]", error);
    return NextResponse.json({ message: "Une erreur système est survenue. Réessaie dans un instant." }, { status: 500 });
  }
}
