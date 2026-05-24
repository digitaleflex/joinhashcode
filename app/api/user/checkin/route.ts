import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { updateUserEvolution, CHECKIN_WEIGHTS } from "@/lib/evolution-engine";
import { BehavioralVibrancy } from "@/lib/evolution";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { logActivity } from "@/lib/activity-log";

const checkinSchema = z.object({
  note: z.string().transform(stripHtml).pipe(z.string().min(1).max(1000)),
  domain: z.string().min(1).max(100),
  energy: z.number().int().min(1).max(5),
  duration: z.number().int().min(1).max(1440),
});

const BASE_CHECKIN_XP = 25;

function computeStreak(lastStreakDate: Date | null): {
  newStreak: number;
  streakBroken: boolean;
} {
  if (!lastStreakDate) return { newStreak: 1, streakBroken: false };

  const now = new Date();
  const diffMs = now.getTime() - lastStreakDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Entre 20h et 48h depuis le dernier check-in → streak maintenu
  if (diffHours >= 20 && diffHours < 48) {
    return { newStreak: 0, streakBroken: false }; // 0 = incrémenter depuis la DB
  }

  // Plus de 48h → streak cassé
  return { newStreak: 1, streakBroken: true };
}

function isSurge(energy: number, domain: string, lastCheckinAt: Date | null): boolean {
  // 10% de base, +5% si énergie max, +5% si retour après 48h d'absence
  let chance = 0.1;
  if (energy === 5) chance += 0.05;
  if (lastCheckinAt) {
    const diffH = (Date.now() - lastCheckinAt.getTime()) / (1000 * 60 * 60);
    if (diffH > 48) chance += 0.05;
  }
  return Math.random() < chance;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const existingCheckin = await prisma.dailyCheckin.findFirst({
      where: { userId: session.user.id, createdAt: { gte: twentyHoursAgo } },
    });

    if (existingCheckin) {
      return new NextResponse(
        "Tu as déjà signé ton check-in aujourd'hui. Garde ton énergie pour demain !",
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = checkinSchema.safeParse(body);
    if (!parsed.success) return new NextResponse("Données invalides", { status: 400 });

    const { note, domain, energy, duration } = parsed.data;

    // Fetch user data needed for streak + surge
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        lastCheckinAt: true,
        currentStreak: true,
        longestStreak: true,
        lastStreakDate: true,
        guildMembers: { select: { guildId: true } },
      },
    });

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    // --- Streak calculation ---
    const { newStreak, streakBroken } = computeStreak(user.lastStreakDate);
    const nextStreak = newStreak === 1 ? 1 : user.currentStreak + 1;
    const nextLongest = Math.max(user.longestStreak, nextStreak);

    // --- Surge XP ---
    const surge = isSurge(energy, domain, user.lastCheckinAt);
    const xpMultiplier = surge ? 3 : 1;

    // Bonus streak: +10 XP tous les 7 jours
    const streakBonus = nextStreak % 7 === 0 ? 50 : 0;
    const totalXP = BASE_CHECKIN_XP * xpMultiplier + streakBonus;

    // --- Create check-in ---
    const checkin = await prisma.dailyCheckin.create({
      data: { userId: session.user.id, note, domain, energy, duration },
    });

    // --- Update evolution ---
    const baseWeights: BehavioralVibrancy = { builder: 0, creator: 0, strategist: 0, catalyst: 0 };
    const domainWeights = CHECKIN_WEIGHTS[domain] || {
      builder: 0.25,
      creator: 0.25,
      strategist: 0.25,
      catalyst: 0.25,
    };
    await updateUserEvolution(session.user.id, { ...baseWeights, ...domainWeights }, 0.01);

    // --- Persist streak + XP + lastCheckinAt ---
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastCheckinAt: new Date(),
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastStreakDate: new Date(),
        experience: { increment: totalXP },
      },
    });

    // Streak milestone notifications
    if ([7, 14, 30].includes(nextStreak)) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "STREAK_MILESTONE",
          title: `${nextStreak} jours de Neural Momentum !`,
          message:
            nextStreak === 7
              ? "Tu enchaînes 7 jours consécutifs. Multiplicateur ×1.5 débloqué !"
              : nextStreak === 14
              ? "14 jours de continuité. Multiplicateur ×2.0 débloqué !"
              : "30 jours. Tu fais partie des 1%. Badge NEURAL_CORE en route.",
          link: "/dashboard",
        },
      });
    }

    // Streak broken notification
    if (streakBroken && user.currentStreak >= 3) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "STREAK_BROKEN",
          title: "Momentum Neural interrompu",
          message: `Ta série de ${user.currentStreak} jours est réinitialisée. Recommence dès maintenant.`,
          link: "/dashboard",
        },
      });
    }

    // --- Squad cohesion ---
    const guildId = user.guildMembers?.[0]?.guildId;
    if (guildId) {
      await updateSquadCohesion(guildId, 0.05, session.user.id);
    }

    logActivity({
      userId: session.user.id,
      action: "CHECKIN_COMPLETED",
      entity: "checkin",
      entityId: checkin.id,
      metadata: { domain, energy, duration, xpEarned: totalXP, streak: nextStreak, surge },
      request: req,
    });

    return NextResponse.json({
      ...checkin,
      streak: nextStreak,
      xpEarned: totalXP,
      surge,
      streakBroken,
    });
  } catch (error) {
    console.error("[DAILY_CHECKIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
