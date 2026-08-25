import { prisma } from "./prisma";
import { awardXp } from "./experience";
import { safeAfter } from "./after";

async function notifySquadMembers(
  organizationId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  const members = await prisma.member.findMany({
    where: { organizationId },
    select: { userId: true },
  });

  if (members.length === 0) return;

  await prisma.notification.createMany({
    data: members.map(({ userId }) => ({
      userId,
      type,
      title,
      message,
      link: link ?? null,
    })),
    skipDuplicates: true,
  });
}

export async function updateSquadCohesion(
  organizationId: string,
  boost: number,
  triggerUserId?: string
) {
  try {
    const squad = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { cohesionScore: true, name: true },
    });

    if (!squad) return;

    const newScore = Math.min(1.0, squad.cohesionScore + boost);

    await prisma.organization.update({
      where: { id: organizationId },
      data: { cohesionScore: newScore },
    });

    if (newScore >= 0.9) {
      await updateSquadStreak(organizationId, squad.name);
    }

    if (newScore === 1.0 && squad.cohesionScore < 1.0) {
      await notifySquadMembers(
        organizationId,
        "SQUAD_COHESION_MAX",
        "Cohésion Maximale",
        `Toute l'escouade ${squad.name} a validé sa présence aujourd'hui : synchronisation parfaite entre tous les profils.`,
        "/community"
      );
    }

    if (triggerUserId) {
      const actor = await prisma.user.findUnique({
        where: { id: triggerUserId },
        select: { name: true },
      });
      if (actor) {
        const pct = Math.round(boost * 100);
        const others = await prisma.member.findMany({
          where: { organizationId, userId: { not: triggerUserId } },
          select: { userId: true },
        });
        if (others.length > 0) {
          await prisma.notification.createMany({
            data: others.map(({ userId }) => ({
              userId,
              type: "SQUAD_MEMBER_CHECKIN",
              title: "Activité dans l'escouade",
              message: `${actor.name} est là aujourd'hui — l'escouade se resynchronise (+${pct}% de cohésion).`,
              link: "/community",
            })),
            skipDuplicates: true,
          });
        }
      }
    }
  } catch (error: unknown) {
    console.error("[SQUAD_COHESION_UPDATE_ERROR]", error);
  }
}

async function updateSquadStreak(organizationId: string, squadName: string) {
  const squad = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { lastStreakAt: true, streakCount: true },
  });

  if (!squad) return;

  const now = new Date();
  const last = squad.lastStreakAt ? new Date(squad.lastStreakAt) : null;
  const isToday =
    last &&
    last.getDate() === now.getDate() &&
    last.getMonth() === now.getMonth() &&
    last.getFullYear() === now.getFullYear();

  if (isToday) return;

  const newCount = squad.streakCount + 1;

  await prisma.organization.update({
    where: { id: organizationId },
    data: { streakCount: newCount, lastStreakAt: now },
  });

  if (newCount === 7) {
    await rewardSquadMembers(organizationId, "HYPER_LINK", 200);
    await notifySquadMembers(
      organizationId,
      "SQUAD_STREAK_7",
      "Hyper Link débloqué !",
      `7 jours consécutifs où chacun a été là pour les autres. Cette régularité est votre vraie force — le badge HYPER_LINK en est la trace.`,
      "/community"
    );
  } else if (newCount === 3) {
    await notifySquadMembers(
      organizationId,
      "SQUAD_STREAK_3",
      "3 jours de sync !",
      `Trois jours d'affilée où toute l'escouade ${squadName} s'est synchronisée. L'habitude prend — HYPER_LINK vous attend à J+7.`,
      "/community"
    );
  }
}

async function rewardSquadMembers(
  organizationId: string,
  badgeName: string,
  xp: number
) {
  const members = await prisma.member.findMany({
    where: { organizationId },
    select: { userId: true },
  });

  if (members.length === 0) return;

  // Déplacement dans safeAfter pour libérer immédiatement le thread HTTP principal
  safeAfter(async () => {
    for (const member of members) {
      try {
        if (xp > 0) {
          await awardXp(member.userId, xp, `SQUAD_REWARD_${badgeName}`, organizationId);
        }
        await prisma.user.update({
          where: { id: member.userId },
          data: {
            badges: { push: badgeName },
          },
        });
      } catch (err) {
        console.error(`[SQUAD_LOGIC] Failed to reward user ${member.userId}:`, err);
      }
    }
  });
}

// ── Bouclier de série (streak freeze) ────────────────────────────────────────
// Après 48h sans check-in à haute cohésion, la série casse — sauf si l'escouade
// consomme son bouclier hebdomadaire. Objectif : garder l'aversion à la perte
// sans l'anxiété qui fait churner les users casuels.

export async function processStreakBreaks(): Promise<{ frozen: number; reset: number }> {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const breaking = await prisma.organization.findMany({
    where: { streakCount: { gt: 0 }, lastStreakAt: { lt: cutoff } },
    select: { id: true, name: true, streakCount: true, streakFreezes: true },
    take: 100,
  });

  let frozen = 0;
  let reset = 0;

  for (const org of breaking) {
    if (org.streakFreezes > 0) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { streakFreezes: { decrement: 1 }, lastStreakAt: new Date() },
      });
      await notifySquadMembers(
        org.id,
        "SQUAD_STREAK_FREEZE",
        "Bouclier de série activé",
        `Votre série de ${org.streakCount} jours est protégée aujourd'hui. Un check-in demain relance la synchronisation !`,
        "/community"
      );
      frozen++;
    } else {
      await prisma.organization.update({
        where: { id: org.id },
        data: { streakCount: 0 },
      });
      await notifySquadMembers(
        org.id,
        "SQUAD_STREAK_RESET",
        "Un nouveau départ pour votre escouade",
        `La série de ${org.name} est retombée à zéro — c'est arrivé à tout le monde. Un premier check-in relance la cohésion et la série repart.`,
        "/community"
      );
      reset++;
    }
  }

  return { frozen, reset };
}

export async function refillStreakFreezes(): Promise<number> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const res = await prisma.organization.updateMany({
    where: {
      streakFreezes: { lt: 1 },
      OR: [{ lastStreakFreezeAt: null }, { lastStreakFreezeAt: { lt: weekAgo } }],
    },
    data: { streakFreezes: 1, lastStreakFreezeAt: new Date() },
  });
  return res.count;
}

