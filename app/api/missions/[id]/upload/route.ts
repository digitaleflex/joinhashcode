import { isUnpublishedCyberLab } from "@/lib/lab-visibility";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";
import { uploadMissionMedia, validateArtifactFile } from "@/lib/mission-media";
import { parseSubmissionSchema } from "@/lib/validation/artifacts";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
    }

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) {
      return NextResponse.json(
        { message: "Trop de fichiers envoyés. Réessaie dans une minute." },
        { status: 429 },
      );
    }

    const { id } = await params;
    const mission = await prisma.mission.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, submissionSchema: true, status: true, tags: true },
    });
    if (!mission || isUnpublishedCyberLab(mission)) {
      return NextResponse.json({ message: "Mission introuvable." }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const key = formData.get("key");

    if (!(file instanceof File) || typeof key !== "string" || key.trim().length === 0) {
      return NextResponse.json(
        { message: "Fichier ou clé d'artefact manquant." },
        { status: 400 },
      );
    }

    const schema = parseSubmissionSchema(mission.submissionSchema);
    if (schema.length > 0 && !schema.some((item) => item.key === key)) {
      return NextResponse.json(
        { message: "Cet artefact n'est pas attendu pour ce labo." },
        { status: 400 },
      );
    }

    const validation = validateArtifactFile(file);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const uploaded = await uploadMissionMedia(mission.id, key, file);
    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("[MISSION_UPLOAD]", error);
    return NextResponse.json({ message: "Erreur interne." }, { status: 500 });
  }
}
