export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { containsProfanity } from "@/lib/security";

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
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userId = session.user.id;

    // Check if user already has a squad
    const existingMember = await prisma.guildMember.findFirst({
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
        squad = await prisma.guild.create({
          data: {
            name,
            slug: candidateSlug,
            members: {
              create: {
                userId,
                role: "LEADER",
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
      return new NextResponse("Could not generate unique squad name", { status: 500 });
    }

    logActivity({
      userId,
      action: "SQUAD_CREATED",
      entity: "squad",
      entityId: squad.id,
      metadata: { name: squad.name, slug: squad.slug },
      request: req,
    });

    return NextResponse.json(squad);
  } catch (error) {
    console.error("[SQUAD_CREATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
