import { Prisma } from "@/generated/prisma/client"
import { prisma } from "./prisma";
import { invalidateUserCache } from "./user-cache";
import { checkAndAwardBadges } from "./badge-engine";
import { emailService } from "./email";
import { getLevelFromXp, canAccessMission, getRequiredLevelForDifficulty } from "./member-card-constants";

/**
 * Attribue de l'XP à un utilisateur et consigne la transaction dans l'historique
 * Gère également la montée de niveau si le seuil est franchi.
 * 
 * @param userId L'ID de l'utilisateur
 * @param amount Le nombre de points d'XP à ajouter
 * @param reason Le motif (ex: "MISSION_COMPLETED")
 * @param sourceId L'ID de l'entité source (ex: ID de la mission)
 * @param customTx Instance de transaction Prisma (optionnel)
 * @param missionDifficulty Difficulté de la mission pour vérification du level gate (optionnel)
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  sourceId?: string,
  customTx?: Omit<Prisma.TransactionClient, "$transaction" | "$connect" | "$disconnect" | "$on" | "$use" | "$extends">,
  missionDifficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT"
) {
  const execute = async (tx: Omit<Prisma.TransactionClient, "$transaction" | "$connect" | "$disconnect" | "$on" | "$use" | "$extends">) => {
    let finalAmount = amount;
    
    // 1. Vérifier le level gate pour les missions (AVANT de créer la transaction)
    if (missionDifficulty) {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { level: true },
      });
      
      if (!user) {
        throw new Error(`Utilisateur introuvable : ${userId}`);
      }
      
      if (!canAccessMission(user.level ?? 1, missionDifficulty)) {
        return { blocked: true, requiredLevel: getRequiredLevelForDifficulty(missionDifficulty), currentLevel: user.level ?? 1 };
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
      select: { experience: true, level: true },
    });

    if (!user) {
      throw new Error(`Utilisateur introuvable : ${userId}`);
    }

    const currentXp = user.experience ?? 0;
    const currentLevel = user.level ?? 1;
    const nextXp = currentXp + finalAmount;

    const nextLevel = getLevelFromXp(nextXp);

    // 4. Mettre à jour le progrès de l'utilisateur
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        experience: { increment: finalAmount },
        level: nextLevel,
      },
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
      },
    });

    if (nextLevel >= 5 && currentLevel < 5) {
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
