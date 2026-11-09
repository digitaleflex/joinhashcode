import { prisma } from "./prisma";
import { logError, logInfo } from "./logger";

const MIN_DAYS_BEFORE_REWARD = 7

export async function processReferralReward(newUserId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { id: true, name: true, createdAt: true, referrerId: true },
    });

    if (!user || !user.referrerId) return;
    if (user.referrerId === newUserId) return;

    const existingReward = await prisma.activityLog.findFirst({
      where: {
        userId: user.referrerId,
        action: "REFERRAL_REWARD_GRANTED",
        entityId: newUserId,
      },
    });
    if (existingReward) return;

    // Anti-fraud: minimum account age
    const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
     if (accountAgeDays < MIN_DAYS_BEFORE_REWARD) {
       logInfo("Referral Deferred", `${newUserId} account age ${accountAgeDays.toFixed(1)}d < ${MIN_DAYS_BEFORE_REWARD}d`);
       return
     }

    if (!user.referrerId) {
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.referrerId as string },
        data: { referralCount: { increment: 1 } },
      });

      await tx.notification.create({
        data: {
          userId: user.referrerId as string,
          type: "REFERRAL_SUCCESS",
          title: "Parrainage réussi !",
          message: `${user.name} a rejoint HASHCODE grâce à toi.`,
          link: "/dashboard",
        }
      });

      await tx.activityLog.create({
        data: {
          userId: user.referrerId,
          action: "REFERRAL_REWARD_GRANTED",
          entity: "user",
          entityId: newUserId,
          metadata: { referredUserName: user.name, accountAgeDays: Math.round(accountAgeDays) }
        }
      });
    });

    logInfo("Referral Reward", `Referral of ${newUserId} credited to ${user.referrerId}`);
   } catch (error: unknown) {
     logError("Referral Reward", error);
   }
}
