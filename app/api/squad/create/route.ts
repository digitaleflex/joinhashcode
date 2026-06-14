export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { checkRateLimit, strictMutationLimiter } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/experience";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { containsProfanity } from "@/lib/security";
import { emailService } from "@/lib/email";
import crypto from "crypto";

// ── Curated name generator ────────────────────────────────────────────────────
// Produces memorable, brand-aligned squad names (e.g. "Protocole Nexus")
// instead of meaningless hashes like "Unité-MDUH".
const SQUAD_PREFIXES = [
  "Protocole", "Réseau", "Signal", "Nexus", "Vecteur",
  "Cipher", "Forge", "Noyau", "Circuit", "Matrice",
  "Flux", "Cellule", "Syntaxe", "Archive", "Bande",
];
const SQUAD_SUFFIXES = [
  "Alpha", "Zenith", "Nova", "Omega", "Sigma",
  "Apex", "Delta", "Prime", "Zero", "Infini",
  "Etoile", "Horizon", "Spectre", "Fusion", "Soleil",
];

function generateSquadName(): { name: string; slug: string } {
  const prefix = SQUAD_PREFIXES[Math.floor(Math.random() * SQUAD_PREFIXES.length)];
  const suffix = SQUAD_SUFFIXES[Math.floor(Math.random() * SQUAD_SUFFIXES.length)];
  const name = `${prefix} ${suffix}`;
  // Slug: lowercase, remove accents, replace spaces with hyphens
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return { name, slug };
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });

    const userId = session.user.id;

    const { limited } = await checkRateLimit(strictMutationLimiter, userId);
    if (limited) {
      return NextResponse.json({ message: "Trop de tentatives de création d'escouade. Réessaie plus tard." }, { status: 429 });
    }

    // Check if user already has a squad
    const existingMember = await prisma.member.findFirst({
      where: { userId },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Déjà membre d'une escouade" }, { status: 400 });
    }

    // Generate a memorable squad name, retry once on slug collision (extremely rare)
    let squad = null;
    let attempts = 0;

    while (!squad && attempts < 5) {
      const { name, slug } = generateSquadName();

      // Ensure generated name is not offensive (safety first)
      if (containsProfanity(name) || containsProfanity(slug)) {
        attempts++;
        continue;
      }

      const candidateSlug = attempts === 0
        ? slug
        : `${slug}-${Math.random().toString(36).substring(2, 4)}`;

      try {
        const orgId = crypto.randomUUID();
        const memberId = crypto.randomUUID();
        squad = await prisma.organization.create({
          data: {
            id: orgId,
            name,
            slug: candidateSlug,
            createdAt: new Date(),
            members: {
              create: {
                id: memberId,
                userId,
                role: "owner",
                createdAt: new Date(),
              },
            },
          },
        });
      } catch (createErr: any) {
        // Unique constraint on slug → retry with a disambiguator
        if (createErr?.code === "P2002") {
          attempts++;
          continue;
        }
        throw createErr;
      }
    }

    if (!squad) {
      return NextResponse.json({ message: "Impossible de générer un nom d'escouade unique. Réessaie dans un instant." }, { status: 500 });
    }

    logActivity({
      userId,
      action: "SQUAD_CREATED",
      entity: "squad",
      entityId: squad.id,
      metadata: { name: squad.name, slug: squad.slug },
      request: req,
    });

    // Send celebration email
    emailService.sendSquadCreatedEmail({
      email: session.user.email,
      name: session.user.name,
      squadName: squad.name,
    }).catch(err => console.error("[EMAIL_ERROR] sendSquadCreatedEmail", err));

    // Auto-approve squad-genesis mission for the squad creator (Fix SEC-002: Check if already approved)
    const squadGenesisMission = await prisma.mission.findUnique({ where: { slug: "squad-genesis" } });
    if (squadGenesisMission) {
      const existingSubmission = await prisma.missionSubmission.findUnique({
        where: {
          userId_missionId_cycleKey: {
            userId,
            missionId: squadGenesisMission.id,
            cycleKey: "PERMANENT",
          },
        },
      });

      if (!existingSubmission || existingSubmission.status !== "APPROVED") {
        await prisma.missionSubmission.upsert({
          where: {
            userId_missionId_cycleKey: {
              userId,
              missionId: squadGenesisMission.id,
              cycleKey: "PERMANENT",
            },
          },
          update: { status: "APPROVED" },
          create: {
            userId,
            missionId: squadGenesisMission.id,
            cycleKey: "PERMANENT",
            status: "APPROVED",
            content: "Escouade créée automatiquement.",
            xpAwarded: squadGenesisMission.xp,
          },
        }).catch(() => {});

        await awardXp(userId, squadGenesisMission.xp, "SQUAD_GENESIS", squadGenesisMission.id).catch(() => {});
      }
    }

    return NextResponse.json(squad);
  } catch (error: unknown) {
    console.error("[SQUAD_CREATE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
