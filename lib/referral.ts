import { prisma } from "./prisma";
import { awardXp } from "./experience";

/**
 * Handle Referral Success
 * 
 * When a new user completes their account validation (e.g., beta key activated),
 * the referrer receives a reward (+50 XP).
 */
export async function processReferralReward(newUserId: string) {
  try {
    // 1. Check if the user was referred
    const user = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { id: true, referrerId: true, name: true }
    });

    if (!user || !user.referrerId) return;

    // 2. Grant reward to referrer
    const rewardXp = 50;
    
    await prisma.$transaction(async (tx) => {
      // Award XP via helper and register transaction
      await awardXp(user.referrerId!, rewardXp, "REFERRAL_SUCCESS", newUserId, tx);

      // Update Referral Count
      await tx.user.update({
        where: { id: user.referrerId! },
        data: {
          referralCount: { increment: 1 }
        }
      });
      
      // Create notification for Referrer
      await tx.notification.create({
        data: {
          userId: user.referrerId!,
          type: "REFERRAL_SUCCESS",
          title: "Récompense de parrainage ! 💎",
          message: `Ton ami ${user.name} a rejoint HASHCODE. Tu as reçu +${rewardXp} XP.`,
          link: "/dashboard",
        }
      });
      
      // Log Activity for Referrer
      await tx.activityLog.create({
        data: {
          userId: user.referrerId!,
          action: "REFERRAL_REWARD_GRANTED",
          entity: "user",
          entityId: newUserId,
          metadata: { xpGranted: rewardXp, referredUserName: user.name }
        }
      });
    });

    console.log(`[REFERRAL] Reward of ${rewardXp} XP granted to ${user.referrerId} for referring ${newUserId}`);
  } catch (_) {
    console.error("[REFERRAL_REWARD_ERROR]", error);
  }
}
