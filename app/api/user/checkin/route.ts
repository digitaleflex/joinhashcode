import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserEvolution, CHECKIN_WEIGHTS } from "@/lib/evolution-engine";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { awardXp } from "@/lib/experience";
import { checkinLimiter, checkRateLimit } from "@/lib/ratelimit";
import { safeAfter as after } from "@/lib/after";
import { triggerNotification } from "@/lib/qstash";
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
    let streakBroken = false;
    const checkin = await prisma.$transaction(async (tx) => {
      // A. Lock user row to serialize concurrent check-ins
      await tx.$queryRaw`
        SELECT "lastCheckinAt" FROM "user" 
        WHERE "id" = ${session.user.id} 
        FOR UPDATE
      `;

      // B. Verify cooldown inside the locked transaction context
      const lastCheckin = await tx.dailyCheckin.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (lastCheckin) {
        const hoursSince = (Date.now() - lastCheckin.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) {
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

      // D. Read current engagement stats for streak calculation
      const currentStats = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { lastCheckinAt: true, currentStreak: true, longestStreak: true },
      });

      const now = new Date();
      let newStreak = 1;

      if (currentStats?.lastCheckinAt) {
        const hoursSince = (now.getTime() - currentStats.lastCheckinAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince > 24) {
          streakBroken = true;
          newStreak = 1;
        } else {
          newStreak = (currentStats.currentStreak ?? 0) + 1;
        }
      } else {
        newStreak = 1;
      }

      const newLongestStreak = Math.max(newStreak, currentStats?.longestStreak ?? 0);

      // E. Update engagement stats on user
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          lastCheckinAt: now,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
        },
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
        await updateUserEvolution(session.user.id, weights);

        // Update squad cohesion if member
        const membership = await prisma.member.findUnique({
          where: { userId: session.user.id },
          select: { organizationId: true }
        });
        if (membership) {
          await updateSquadCohesion(membership.organizationId, 0.02, session.user.id);
        }

        // Notify if streak was broken
        if (streakBroken) {
          await triggerNotification({
            userId: session.user.id,
            type: "STREAK_BROKEN",
            title: "Série brisée",
            message: "Tu as manqué un jour de check-in. Ta série a été remise à zéro. Reviens demain pour repartir !",
            link: "/dashboard",
          });
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

