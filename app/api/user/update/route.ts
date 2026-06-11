export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { containsProfanity } from "@/lib/security";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const safeUrl = z.string().max(500).optional().nullable().or(z.literal("")).transform(v => v || undefined);

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional().nullable().transform(v => v || undefined),
  pseudo: z.string()
    .transform(stripHtml)
    .pipe(z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement)."))
    .refine(v => !containsProfanity(v), "Ce pseudo n'est pas autorisé par le protocole de sécurité HASHCODE.")
    .optional()
    .nullable()
    .transform(v => v || undefined),
  bio: z.string().transform(stripHtml).pipe(z.string().max(500))
    .refine(v => !containsProfanity(v), "Ta biographie contient des termes non autorisés.")
    .optional().nullable().transform(v => v || undefined),
  image: z.union([
    z.string().url().max(500),
    z.string().regex(/^\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)$/),
  ]).optional().nullable().or(z.literal("")).transform(v => v || undefined),
  country: z.string().max(100).optional().nullable().transform(v => v || undefined),
  city: z.string().max(100).optional().nullable().transform(v => v || undefined),
  language: z.enum(["fr", "en"]).optional().nullable().transform(v => v || undefined),
  currentSituation: z.string().max(200).optional().nullable().transform(v => v || undefined),
  githubUrl: safeUrl,
  portfolioUrl: safeUrl,
  twitterUrl: safeUrl,
  linkedinUrl: safeUrl,
  domains: z.array(z.string().max(50)).max(10).optional().nullable().transform(v => v || undefined),
  tools: z.array(z.string().max(50)).max(20).optional().nullable().transform(v => v || undefined),
  mainObjective: z.string().max(300).optional().nullable().transform(v => v || undefined),
  secondaryObjectives: z.array(z.string().max(200)).max(5).optional().nullable().transform(v => v || undefined),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Accès non autorisé. Connecte-toi pour modifier ton profil.", { status: 401 });
    }

    // Basic rate limit (60 seconds)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { updatedAt: true }
    });

    if (user?.updatedAt && (Date.now() - user.updatedAt.getTime() < 60000)) {
      return new NextResponse("Doucement, bâtisseur ! Laisse ton terminal souffler une minute avant la prochaine mise à jour.", { status: 429 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      return new NextResponse(firstError || "Certaines données transmises sont invalides.", { status: 400 });
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
        return new NextResponse("Ce pseudo est déjà utilisé par un autre talent du réseau.", { status: 409 });
      }
    }

    return new NextResponse("Le système a rencontré une erreur lors de la synchronisation. Réessaie bientôt.", { status: 500 });
  }
}
