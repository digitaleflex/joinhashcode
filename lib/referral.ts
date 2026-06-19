import { prisma } from "./prisma";
import { awardXp } from "./experience";

const MIN_DAYS_BEFORE_REWARD = 7
const MIN_CHECKINS_BEFORE_REWARD = 3

export async function processReferralReward(newUserId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { id: true, name: true, createdAt: true },
      include: { referral: { select: { referrerId: true } } },
    });

    if (!user || !user.referral?.referrerId) return;
    if (user.referral.referrerId === newUserId) return;

    const existingReward = await prisma.activityLog.findFirst({
      where: {
        userId: user.referral.referrerId,
        action: "REFERRAL_REWARD_GRANTED",
        entityId: newUserId,
      },
    });
    if (existingReward) return;

    // Anti-fraud: minimum account age
    const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (accountAgeDays < MIN_DAYS_BEFORE_REWARD) {
      console.log(`[REFERRAL_DEFERRED] ${newUserId} account age ${accountAgeDays.toFixed(1)}d < ${MIN_DAYS_BEFORE_REWARD}d`)
      return
    }

    // Anti-fraud: minimum check-ins
    const checkinCount = await prisma.dailyCheckin.count({
      where: { userId: newUserId },
    })
    if (checkinCount < MIN_CHECKINS_BEFORE_REWARD) {
      console.log(`[REFERRAL_DEFERRED] ${newUserId} check-ins ${checkinCount} < ${MIN_CHECKINS_BEFORE_REWARD}`)
      return
    }

    const rewardXp = 50;

    await prisma.$transaction(async (tx) => {
      await awardXp(user.referral!.referrerId!, rewardXp, "REFERRAL_SUCCESS", newUserId, tx);

      await tx.userReferral.upsert({
        where: { userId: user.referral!.referrerId! },
        create: { userId: user.referral!.referrerId!, referralCount: 1, referralCode: "" },
        update: { referralCount: { increment: 1 } },
      });

      await tx.notification.create({
        data: {
          userId: user.referral!.referrerId!,
          type: "REFERRAL_SUCCESS",
          title: "Récompense de parrainage ! 💎",
          message: `Ton ami ${user.name} a rejoint HASHCODE. Tu as reçu +${rewardXp} XP.`,
          link: "/dashboard",
        }
      });

      await tx.activityLog.create({
        data: {
          userId: user.referral!.referrerId!,
          action: "REFERRAL_REWARD_GRANTED",
          entity: "user",
          entityId: newUserId,
          metadata: { xpGranted: rewardXp, referredUserName: user.name, accountAgeDays: Math.round(accountAgeDays), checkinCount }
        }
      });
    });

    console.log(`[REFERRAL] Reward of ${rewardXp} XP granted to ${user.referral.referrerId} for referring ${newUserId}`);
  } catch (error: unknown) {
    console.error("[REFERRAL_REWARD_ERROR]", error);
  }
}
