import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserEvolution, CHECKIN_WEIGHTS } from "@/lib/evolution-engine";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { awardXp } from "@/lib/experience";
import { checkinLimiter, checkRateLimit } from "@/lib/ratelimit";
import { safeAfter as after } from "@/lib/after";
import { z } from "zod";
import { requireSession, checkCsrfOrigin, AuthError } from "@/lib/auth-guard";

const checkinSchema = z.object({
  note: z.string().min(20, "Ta note doit faire au moins 20 caractères pour être validée par le protocole."),
  domain: z.string(),
  energy: z.number().min(1).max(5),
  duration: z.number().min(15).max(480),
});

const stripHtml = (str: string) => str.replace(/<[^>]*>?/gm, "");

export async function POST(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();

    const { limited } = await checkRateLimit(checkinLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de check-ins. Réessaie demain." }, { status: 429 });

    const body = await req.json();
    body.note = stripHtml(body.note || "");
    
    const validated = checkinSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ message: validated.error.errors[0].message }, { status: 400 });
    }

    const { note, domain, energy, duration } = validated.data;

    // 1. Variable Reward Logic (Neuro-Engagement) computed outside the transaction
    const isCriticalHit = Math.random() < 0.15; // 15% chance
    const baseXP = 10;
    const bonusXP = isCriticalHit ? 15 : 0;
    const totalXP = baseXP + bonusXP;
    
    const successMessages = [
        "Signal synchronisé. Ton build avance.",
        "Check-in validé. Le réseau te voit.",
        "Empreinte confirmée. Continue de livrer.",
        "Connexion établie. HASHCODE est fier de toi.",
    ];
    
    const rareMessages = [
        "SYNCHRONISATION EXCEPTIONNELLE : Signal rare détecté. Gain d'XP doublé !",
        "FLUX OPTIMAL : Ta régularité impressionne le système. Bonus de confiance accordé.",
        "RÉSONANCE NEURONALE : Tu es sur une fréquence rare. Profite de ce boost de signal !",
    ];

    const finalMessage = isCriticalHit 
        ? rareMessages[Math.floor(Math.random() * rareMessages.length)]
        : successMessages[Math.floor(Math.random() * successMessages.length)];

    // 2. Process check-in transaction (ultra-courte + thread-safe)
    const checkin = await prisma.$transaction(async (tx) => {
      // A. Lock user's engagement stats to serialize concurrent check-ins
      await tx.$queryRaw`
        SELECT "lastCheckinAt" FROM "engagement_stats" 
        WHERE "userId" = ${session.user.id} 
        FOR UPDATE
      `;

      // B. Verify cooldown inside the locked transaction context
      const lastCheckin = await tx.dailyCheckin.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (lastCheckin) {
        const hoursSince = (Date.now() - lastCheckin.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 20) {
          throw new Error("COOLDOWN_ACTIVE");
        }
      }

      // C. Create check-in record
      const created = await tx.dailyCheckin.create({
        data: {
          userId: session.user.id,
          note,
          domain,
          energy,
          duration,
        },
      });

      // D. Update user streak directement sur engagementStats (évite lock User)
      await tx.engagementStats.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          lastCheckinAt: new Date(),
          currentStreak: 1,
        },
        update: {
          lastCheckinAt: new Date(),
          currentStreak: { increment: 1 },
        }
      });

      return created;
    });

    // 3. Traitements post-réponse asynchrones via Next.js 'after'
    await after(async () => {
      try {
        // Award XP with variable reward
        await awardXp(session.user.id, totalXP, "DAILY_CHECKIN", checkin.id);

        // Update Vibrancy and Confidence
        const weights = { builder: 0, creator: 0, strategist: 0, catalyst: 0, ...CHECKIN_WEIGHTS[domain] };
        await updateUserEvolution(session.user.id, weights, 0.05);

        // Update squad cohesion if member
        const membership = await prisma.member.findUnique({
          where: { userId: session.user.id },
          select: { organizationId: true }
        });
        if (membership) {
          await updateSquadCohesion(membership.organizationId, 0.02, session.user.id);
        }
      } catch (error) {
        console.error("🔴 [Checkin API Post-Tasks Error]", error);
      }
    });

    const result = { ...checkin, finalMessage, totalXP, isCriticalHit };

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof Error && error.message === "COOLDOWN_ACTIVE") {
      return NextResponse.json({ 
          message: "Tu as déjà signé ton check-in aujourd'hui. Reviens dans quelques heures pour la suite de ton build !" 
      }, { status: 429 });
    }
    console.error("[CHECKIN_POST]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}

