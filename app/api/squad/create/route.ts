export const dynamic = 'force-dynamic'
import { checkRateLimit, strictMutationLimiter } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/experience";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { containsProfanity } from "@/lib/security";
import { emailService } from "@/lib/email";
import crypto from "crypto";
import { requireSession, checkCsrfOrigin, AuthError } from "@/lib/auth-guard";
import { createSquadSchema } from "@/lib/validation";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);
}

export async function POST(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();
    const userId = session.user.id;

    const { limited } = await checkRateLimit(strictMutationLimiter, userId);
    if (limited) {
      return NextResponse.json({ message: "Trop de tentatives de création d'escouade. Réessaie plus tard." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = createSquadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name } = parsed.data;

    if (containsProfanity(name)) {
      return NextResponse.json({ message: "Ce nom n'est pas autorisé. Choisis-en un autre." }, { status: 400 });
    }

    // Check if user already has a squad
    const existingMember = await prisma.member.findFirst({
      where: { userId },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Déjà membre d'une escouade" }, { status: 400 });
    }

    // Generate slug from name, retry on collision
    let squad = null;
    let attempts = 0;
    const baseSlug = slugify(name);

    while (!squad && attempts < 5) {
      const candidateSlug = attempts === 0
        ? baseSlug
        : `${baseSlug}-${Math.random().toString(36).substring(2, 4)}`;

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
      } catch (createErr: unknown) {
        if (createErr instanceof Error && (createErr as { code?: string }).code === "P2002") {
          attempts++;
          continue;
        }
        throw createErr;
      }
    }

    if (!squad) {
      return NextResponse.json({ message: "Impossible de générer un slug unique. Réessaie dans un instant." }, { status: 500 });
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
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[SQUAD_CREATE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
