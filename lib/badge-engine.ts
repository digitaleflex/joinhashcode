import { prisma } from "./prisma";
import { triggerNotification } from "./qstash";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  criteria: (user: any) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "INITIE",
    name: "Initié",
    description: "Atteindre le niveau 2.",
    criteria: (user) => user.level >= 2,
  },
  {
    id: "VETERAN",
    name: "Vétéran",
    description: "Atteindre le niveau 5.",
    criteria: (user) => user.level >= 5,
  },
  {
    id: "PRODUCTIF",
    name: "Productif",
    description: "Compléter 10 missions.",
    criteria: (user) => user.missionsCompletedCount >= 10,
  },
  {
    id: "SYNCHRO_GOLD",
    name: "Sync Gold",
    description: "Atteindre une cohésion de 100% avec ton escouade.",
    criteria: (user) => false, // Géré via squad-logic
  },
  {
    id: "EARLY_ADOPTER",
    name: "Pionnier",
    description: "Membre de la phase Bêta.",
    criteria: (user) => true, // Attribué manuellement ou au signup
  }
];

export async function checkAndAwardBadges(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        level: true,
        missionsCompletedCount: true,
        badges: true,
      },
    });

    if (!user) return [];

    const existingBadges = new Set(user.badges);
    const newBadges: string[] = [];

    for (const badge of BADGE_DEFINITIONS) {
      if (!existingBadges.has(badge.id) && badge.criteria(user)) {
        newBadges.push(badge.id);
      }
    }

    if (newBadges.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          badges: {
            push: newBadges,
          },
        },
      });

      // Notify for each new badge
      for (const badgeId of newBadges) {
        const def = BADGE_DEFINITIONS.find(b => b.id === badgeId);
        await triggerNotification({
          userId,
          type: "ACHIEVEMENT",
          title: "Nouveau Badge Débloqué !",
          message: `Félicitations ! Tu as obtenu le badge : ${def?.name}`,
          link: "/dashboard",
        });
      }
    }

    return newBadges;
  } catch (error) {
    console.error("[BADGE_ENGINE_ERROR]", error);
    return [];
  }
}
