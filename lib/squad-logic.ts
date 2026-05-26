import { prisma } from "./prisma";
import { emailService } from "./email";

async function notifySquadMembers(
  guildId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  const members = await prisma.guildMember.findMany({
    where: { guildId },
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
  guildId: string,
  boost: number,
  triggerUserId?: string
) {
  try {
    const squad = await prisma.guild.findUnique({
      where: { id: guildId },
      select: { cohesionScore: true, name: true },
    });

    if (!squad) return;

    const newScore = Math.min(1.0, squad.cohesionScore + boost);

    await prisma.guild.update({
      where: { id: guildId },
      data: { cohesionScore: newScore },
    });

    if (newScore >= 0.9) {
      await updateSquadStreak(guildId, squad.name);
    }

    if (newScore === 1.0 && squad.cohesionScore < 1.0) {
      await notifySquadMembers(
        guildId,
        "SQUAD_COHESION_MAX",
        "Cohésion Maximale",
        `L'escouade ${squad.name} est en synchronisation parfaite ! Continuez sur cette lancée.`,
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
        const others = await prisma.guildMember.findMany({
          where: { guildId, userId: { not: triggerUserId } },
          select: { userId: true },
        });
        if (others.length > 0) {
          await prisma.notification.createMany({
            data: others.map(({ userId }) => ({
              userId,
              type: "SQUAD_MEMBER_CHECKIN",
              title: "Activité dans l'escouade",
              message: `${actor.name} vient de booster la cohésion (+${pct}%).`,
              link: "/community",
            })),
            skipDuplicates: true,
          });
        }
      }
    }
  } catch (error) {
    console.error("[SQUAD_COHESION_UPDATE_ERROR]", error);
  }
}

async function updateSquadStreak(guildId: string, squadName: string) {
  const squad = await prisma.guild.findUnique({
    where: { id: guildId },
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

  await prisma.guild.update({
    where: { id: guildId },
    data: { streakCount: newCount, lastStreakAt: now },
  });

  if (newCount === 7) {
    await rewardSquadMembers(guildId, "HYPER_LINK", 200);
    await notifySquadMembers(
      guildId,
      "SQUAD_STREAK_7",
      "Hyper Link débloqué !",
      `${squadName} a atteint 7 jours consécutifs de synchronisation. Badge HYPER_LINK accordé à tous les membres.`,
      "/community"
    );
  } else if (newCount === 3) {
    await notifySquadMembers(
      guildId,
      "SQUAD_STREAK_3",
      "3 jours de sync !",
      `${squadName} enchaîne 3 jours de haute cohésion. Continuez pour décrocher HYPER_LINK à J+7.`,
      "/community"
    );
  }
}

async function rewardSquadMembers(
  guildId: string,
  badgeName: string,
  xp: number
) {
  const members = await prisma.guildMember.findMany({
    where: { guildId },
    select: { userId: true },
  });

  for (const member of members) {
    await prisma.user.update({
      where: { id: member.userId },
      data: {
        badges: { push: badgeName },
        experience: { increment: xp },
      },
    });
  }
}

export async function applySquadCohesionDecay() {
  try {
    const squads = await prisma.guild.findMany({
      where: { cohesionScore: { gt: 0.05 } },
      select: { id: true, name: true, cohesionScore: true },
    });

    for (const squad of squads) {
      const newScore = Math.max(0.05, squad.cohesionScore - 0.02);
      await prisma.guild.update({
        where: { id: squad.id },
        data: { cohesionScore: newScore },
      });

      if (newScore < 0.4 && squad.cohesionScore >= 0.4) {
        await notifySquadMembers(
          squad.id,
          "SQUAD_COHESION_LOW",
          "Synchronisation en baisse",
          `L'escouade ${squad.name} perd de la cohésion. Faites un check-in pour maintenir la dynamique.`,
          "/community"
        );
        const leader = await prisma.guildMember.findFirst({
          where: { guildId: squad.id, role: "LEADER" },
          include: { user: { select: { email: true, name: true } } },
        });
        if (leader) {
          emailService.sendSquadCohesionAlert({
            leaderEmail: leader.user.email,
            leaderName: leader.user.name,
            squadName: squad.name,
            cohesionScore: newScore,
            level: "low",
          });
        }
      }

      if (newScore < 0.15 && squad.cohesionScore >= 0.15) {
        await notifySquadMembers(
          squad.id,
          "SQUAD_COHESION_CRITICAL",
          "Alerte : cohésion critique",
          `${squad.name} est en danger de désynchronisation. Agissez maintenant.`,
          "/community"
        );
        const leader = await prisma.guildMember.findFirst({
          where: { guildId: squad.id, role: "LEADER" },
          include: { user: { select: { email: true, name: true } } },
        });
        if (leader) {
          emailService.sendSquadCohesionAlert({
            leaderEmail: leader.user.email,
            leaderName: leader.user.name,
            squadName: squad.name,
            cohesionScore: newScore,
            level: "critical",
          });
        }
      }
    }

    return { processed: squads.length };
  } catch (error) {
    console.error("[SQUAD_DECAY_ERROR]", error);
  }
}
