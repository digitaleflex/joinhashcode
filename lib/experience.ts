import { prisma } from "./prisma";
import { invalidateUserCache } from "./user-cache";
import { checkAndAwardBadges } from "./badge-engine";
import { emailService } from "./email";

export const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400,
} as const;

export const LEVEL_THRESHOLDS = [0, 100, 400, 1400] as const;

/**
 * Attribue de l'XP à un utilisateur et consigne la transaction dans l'historique
 * Gère également la montée de niveau si le seuil est franchi.
 * 
 * @param userId L'ID de l'utilisateur
 * @param amount Le nombre de points d'XP à ajouter
 * @param reason Le motif (ex: "MISSION_COMPLETED")
 * @param sourceId L'ID de l'entité source (ex: ID de la mission)
 * @param customTx Instance de transaction Prisma (optionnel)
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  sourceId?: string,
  customTx?: any
) {
  const execute = async (tx: any) => {
    // 1. Détecter le bonus de cohésion de squad
    let finalAmount = amount;
    const membership = await tx.member.findFirst({
      where: { userId },
      include: { organization: true }
    });

    if (membership?.organization?.lastComboAt) {
      const now = new Date();
      const comboDate = new Date(membership.organization.lastComboAt);
      const diffMs = now.getTime() - comboDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Si le combo a été réalisé il y a moins de 24h, appliquer le bonus
      if (diffHours < 24) {
        finalAmount = Math.round(amount * 1.15); // +15% de bonus
      }
    }

    // 2. Enregistrer la transaction XP
    await tx.xpTransaction.create({
      data: {
        userId,
        amount: finalAmount,
        reason,
        sourceId,
      },
    });

    // 3. Récupérer l'XP et le niveau actuels de l'utilisateur
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { progress: { select: { experience: true, level: true } } },
    });

    if (!user) {
      throw new Error(`Utilisateur introuvable : ${userId}`);
    }

    const currentXp = user.progress?.experience ?? 0;
    const currentLevel = user.progress?.level ?? 1;
    const nextXp = currentXp + finalAmount;

    // Progression basée sur les seuils réels XP_THRESHOLDS
    let targetLevel = 1;
    if (nextXp >= XP_THRESHOLDS[4]) {
      targetLevel = 4;
    } else if (nextXp >= XP_THRESHOLDS[3]) {
      targetLevel = 3;
    } else if (nextXp >= XP_THRESHOLDS[2]) {
      targetLevel = 2;
    }
    const nextLevel = targetLevel > currentLevel ? targetLevel : currentLevel;

    // 4. Mettre à jour le progrès de l'utilisateur
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        progress: {
          upsert: {
            create: {
              experience: finalAmount,
              level: nextLevel,
            },
            update: {
              experience: { increment: finalAmount },
              level: nextLevel,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      include: {
        progress: { select: { level: true } },
      },
    });

    // Send Level 5 celebration email
    if (nextLevel === 5 && currentLevel < 5) {
      emailService.sendLevel5ReachedEmail({
        email: updatedUser.email,
        name: updatedUser.name,
      }).catch(err => console.error("[EMAIL_ERROR] sendLevel5ReachedEmail", err));
    }

    // 4. Invalider le cache Redis
    await invalidateUserCache(userId).catch((err) =>
      console.error(`🟢 [XP_SERVICE] Échec de l'invalidation du cache de ${userId} :`, err)
    );

    return updatedUser;
  };

  let resultUser;
  // Si on est déjà dans une transaction Prisma existante, l'utiliser
  if (customTx) {
    resultUser = await execute(customTx);
  } else {
    // Sinon, démarrer une transaction Prisma isolée
    resultUser = await prisma.$transaction(async (tx) => {
      return execute(tx);
    });
  }

  // 5. Déclencher la vérification des badges après la transaction
  await checkAndAwardBadges(userId).catch((err) =>
    console.error(`🟢 [XP_SERVICE] Échec du badge check pour ${userId} :`, err)
  );

  return resultUser;
}
