import { prisma } from "./prisma";
import { Prisma } from "../generated/prisma";
import { invalidateUserCache } from "./user-cache";

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
    // 1. Enregistrer la transaction XP
    await tx.xpTransaction.create({
      data: {
        userId,
        amount,
        reason,
        sourceId,
      },
    });

    // 2. Récupérer l'XP et le niveau actuels de l'utilisateur
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { experience: true, level: true },
    });

    if (!user) {
      throw new Error(`Utilisateur introuvable : ${userId}`);
    }

    const currentXp = user.experience;
    const currentLevel = user.level;
    const nextXp = currentXp + amount;

    // Progression simple : 1000 XP par niveau
    const xpPerLevel = 1000;
    const targetLevel = Math.floor(nextXp / xpPerLevel) + 1;
    const nextLevel = targetLevel > currentLevel ? targetLevel : currentLevel;

    // 3. Mettre à jour l'utilisateur
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        experience: { increment: amount },
        level: nextLevel,
      },
    });

    // 4. Invalider le cache Redis
    await invalidateUserCache(userId).catch((err) =>
      console.error(`🟢 [XP_SERVICE] Échec de l'invalidation du cache de ${userId} :`, err)
    );

    return updatedUser;
  };

  // Si on est déjà dans une transaction Prisma existante, l'utiliser
  if (customTx) {
    return execute(customTx);
  }

  // Sinon, démarrer une transaction Prisma isolée
  return prisma.$transaction(async (tx) => {
    return execute(tx);
  });
}
