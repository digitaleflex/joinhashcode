import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const safeUrl = z.string().url().startsWith("https://").max(500).optional().or(z.literal("")).transform(v => v || undefined);

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  pseudo: z.string()
    .regex(/^[a-zA-Z0-9_]{3,20}$/, "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement).")
    .optional(),
  bio: z.string().transform(stripHtml).pipe(z.string().max(500)).optional(),
  image: z.string().url().max(500).optional().or(z.literal("")),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  currentSituation: z.string().max(200).optional(),
  githubUrl: safeUrl,
  portfolioUrl: safeUrl,
  twitterUrl: safeUrl,
  linkedinUrl: safeUrl,
  domains: z.array(z.string().max(50)).max(10).optional(),
  tools: z.array(z.string().max(50)).max(20).optional(),
  mainObjective: z.string().max(300).optional(),
  secondaryObjectives: z.array(z.string().max(200)).max(5).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Basic rate limit (60 seconds)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { updatedAt: true }
    });

    if (user?.updatedAt && (Date.now() - user.updatedAt.getTime() < 60000)) {
      return new NextResponse("Doucement ! Tu as mis à jour ton profil il y a moins d'une minute.", { status: 429 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      return new NextResponse(firstError || "Données invalides", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[USER_UPDATE_PATCH]", error);

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "pseudo") {
        return new NextResponse("Ce pseudo est déjà utilisé par un autre talent.", { status: 409 });
      }
    }

    return new NextResponse("Erreur lors de la mise à jour", { status: 500 });
  }
}
