export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { containsProfanity } from "@/lib/security";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { invalidateUserCache } from "@/lib/user-cache";

const safeUrl = z.string().max(500).optional().nullable().or(z.literal("")).transform(v => v || undefined);

const TRUSTED_IMAGE_DOMAINS = [
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "api.qrserver.com",
];

const imageSchema = z.union([
  z.string().url().max(500).refine((url) => {
    try {
      const { hostname } = new URL(url);
      return TRUSTED_IMAGE_DOMAINS.includes(hostname);
    } catch {
      return false;
    }
  }, "Domaine d'image non autorisé. Utilise un upload local ou un fournisseur de confiance."),
  z.string().regex(/^\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)$/),
]).optional().nullable().or(z.literal("")).transform(v => v || undefined);

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
  image: imageSchema,
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
      return NextResponse.json({ message: "Accès non autorisé. Connecte-toi pour modifier ton profil." }, { status: 401 });
    }

    // Basic rate limit (60 seconds)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { updatedAt: true }
    });

    if (user?.updatedAt && (Date.now() - user.updatedAt.getTime() < 60000)) {
      return NextResponse.json({ message: "Doucement, bâtisseur ! Laisse ton terminal souffler une minute avant la prochaine mise à jour." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      return NextResponse.json({ message: firstError || "Certaines données transmises sont invalides." }, { status: 400 });
    }

    const { githubUrl, portfolioUrl, twitterUrl, linkedinUrl, ...restData } = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...restData,
        socials: {
          upsert: {
            create: {
              githubUrl: githubUrl || null,
              portfolioUrl: portfolioUrl || null,
              twitterUrl: twitterUrl || null,
              linkedinUrl: linkedinUrl || null,
            },
            update: {
              githubUrl: githubUrl !== undefined ? githubUrl : undefined,
              portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : undefined,
              twitterUrl: twitterUrl !== undefined ? twitterUrl : undefined,
              linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        level: true,
        experience: true,
        class: true,
        role: true,
        pseudo: true,
        bio: true,
        country: true,
        city: true,
        language: true,
        domains: true,
        tools: true,
        mainObjective: true,
        secondaryObjectives: true,
        updatedAt: true,
        socials: true,
      }
    });

    await invalidateUserCache(session.user.id);

    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      level: updatedUser.level,
      experience: updatedUser.experience,
      class: updatedUser.class,
      role: updatedUser.role,
      pseudo: updatedUser.pseudo,
      bio: updatedUser.bio,
      country: updatedUser.country,
      city: updatedUser.city,
      language: updatedUser.language,
      githubUrl: updatedUser.socials?.githubUrl ?? null,
      linkedinUrl: updatedUser.socials?.linkedinUrl ?? null,
      twitterUrl: updatedUser.socials?.twitterUrl ?? null,
      portfolioUrl: updatedUser.socials?.portfolioUrl ?? null,
      domains: updatedUser.domains,
      tools: updatedUser.tools,
      mainObjective: updatedUser.mainObjective,
      secondaryObjectives: updatedUser.secondaryObjectives,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.error("[USER_UPDATE_PATCH]", error);

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "pseudo") {
        return NextResponse.json({ message: "Ce pseudo est déjà utilisé par un autre talent du réseau." }, { status: 409 });
      }
    }

    return NextResponse.json({ message: "Le système a rencontré une erreur lors de la synchronisation. Réessaie bientôt." }, { status: 500 });
  }
}
