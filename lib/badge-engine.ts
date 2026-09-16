import { prisma } from "./prisma";
import { triggerNotification } from "./qstash";
import { BehavioralVibrancy } from "./types";
import { logError } from "./logger";
export interface ExtendedUserForBadges {
  id: string;
  level: number;
  missionsCompletedCount: number;
  badges: string[];
  currentStreak: number;
  referralCount: number;
  reviewsCount: number;
  createdAt: Date;
  missionsWithoutRevisionCount: number;
  exemplaryReviewCount: number;
  vibrancy: BehavioralVibrancy;
  squadId?: string | null;
  missionCategoriesCompleted?: Record<string, number>;
  fastMissionCompletions?: number;
}

export type BadgeRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  criteria: (user: ExtendedUserForBadges) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- TIER 1: RANGS & ANCIENNETÉ ---
  {
    id: "INITIE",
    name: "Initié",
    description: "Atteindre le niveau 2.",
    rarity: "COMMON",
    criteria: (user) => user.level >= 2,
  },
  {
    id: "VETERAN",
    name: "Vétéran",
    description: "Atteindre le niveau 5.",
    rarity: "RARE",
    criteria: (user) => user.level >= 5,
  },
  {
    id: "ELITE",
    name: "Élite",
    description: "Atteindre le niveau 10.",
    rarity: "EPIC",
    criteria: (user) => user.level >= 10,
  },
  {
    id: "LEGENDE",
    name: "Légende",
    description: "Atteindre le niveau 50.",
    rarity: "LEGENDARY",
    criteria: (user) => user.level >= 50,
  },

  // --- TIER 2: MISSIONS (VOLUME) ---
  {
    id: "PREMIERE_PREUVE",
    name: "Première Preuve",
    description: "Compléter sa toute première mission.",
    rarity: "COMMON",
    criteria: (user) => user.missionsCompletedCount >= 1,
  },
  {
    id: "BOURREAU_TRAVAIL",
    name: "Bourreau de Travail",
    description: "Compléter 25 missions.",
    rarity: "RARE",
    criteria: (user) => user.missionsCompletedCount >= 25,
  },
  {
    id: "METRONOME",
    name: "Métronome",
    description: "Compléter 50 missions.",
    rarity: "EPIC",
    criteria: (user) => user.missionsCompletedCount >= 50,
  },
  {
    id: "LA_MACHINE",
    name: "La Machine",
    description: "Compléter 100 missions.",
    rarity: "LEGENDARY",
    criteria: (user) => user.missionsCompletedCount >= 100,
  },

  // --- TIER 3: DISCIPLINE (STREAKS) ---
  {
    id: "REGULIER",
    name: "Régulier",
    description: "Maintenir une série de 7 jours de check-ins.",
    rarity: "COMMON",
    criteria: (user) => (user.currentStreak ?? 0) >= 7,
  },
  {
    id: "INFLEXIBLE",
    name: "Inflexible",
    description: "Maintenir une série de 30 jours de check-ins.",
    rarity: "EPIC",
    criteria: (user) => (user.currentStreak ?? 0) >= 30,
  },
  {
    id: "INARRETABLE",
    name: "Inarrêtable",
    description: "Maintenir une série de 100 jours de check-ins.",
    rarity: "LEGENDARY",
    criteria: (user) => (user.currentStreak ?? 0) >= 100,
  },

  // --- TIER 4: SPÉCIALISATION ---
  {
    id: "ARCHITECTE",
    name: "Architecte",
    description: "Compléter 10 missions de type CODE.",
    rarity: "RARE",
    criteria: (user) => (user.vibrancy?.builder ?? 0) >= 100,
  },
  {
    id: "VISIONNAIRE",
    name: "Visionnaire",
    description: "Compléter 10 missions de type DESIGN.",
    rarity: "RARE",
    criteria: (user) => (user.vibrancy?.creator ?? 0) >= 100,
  },
  {
    id: "STRATEGE",
    name: "Stratège",
    description: "Compléter 10 missions de type BUSINESS.",
    rarity: "RARE",
    criteria: (user) => (user.vibrancy?.strategist ?? 0) >= 100,
  },
  {
    id: "CATALYSEUR",
    name: "Catalyseur",
    description: "Compléter 10 missions de type NETWORK.",
    rarity: "RARE",
    criteria: (user) => (user.vibrancy?.catalyst ?? 0) >= 100,
  },
  {
    id: "POLYMATH",
    name: "Polymath",
    description: "Avoir au moins 50 points dans chaque vecteur comportemental.",
    rarity: "LEGENDARY",
    criteria: (user) => 
      (user.vibrancy?.builder ?? 0) >= 50 && 
      (user.vibrancy?.creator ?? 0) >= 50 && 
      (user.vibrancy?.strategist ?? 0) >= 50 && 
      (user.vibrancy?.catalyst ?? 0) >= 50,
  },

  // --- TIER 5: INTELLIGENCE COLLECTIVE ---
  {
    id: "RECRUTEUR",
    name: "Recruteur",
    description: "Inviter un nouveau membre actif.",
    rarity: "COMMON",
    criteria: (user) => (user.referralCount ?? 0) >= 1,
  },
  {
    id: "GROWTH_HACKER",
    name: "Growth Hacker",
    description: "Parrainer 5 membres actifs.",
    rarity: "EPIC",
    criteria: (user) => (user.referralCount ?? 0) >= 5,
  },
  {
    id: "BATISSEUR_TRIBU",
    name: "Bâtisseur de Tribu",
    description: "Parrainer 20 membres actifs.",
    rarity: "LEGENDARY",
    criteria: (user) => (user.referralCount ?? 0) >= 20,
  },
  {
    id: "FRERE_ARMES",
    name: "Frère d'Armes",
    description: "Être membre d'une escouade complète (5 agents).",
    rarity: "RARE",
    criteria: (user) => !!user.squadId,
  },

  // --- TIER 6: QUALITÉ & CONTRIBUTIONS ---
  {
    id: "ZERO_FAUTE",
    name: "Zéro Faute",
    description: "Compléter 5 missions sans aucune demande de révision.",
    rarity: "EPIC",
    criteria: (user) => user.missionsWithoutRevisionCount >= 5,
  },
  {
    id: "MENTOR",
    name: "Mentor",
    description: "Effectuer 10 reviews de missions approuvées.",
    rarity: "RARE",
    criteria: (user) => (user.reviewsCount ?? 0) >= 10,
  },
  {
    id: "EXPERT_CERTIFIE",
    name: "Expert Certifié",
    description: "Effectuer 50 reviews de missions.",
    rarity: "LEGENDARY",
    criteria: (user) => (user.reviewsCount ?? 0) >= 50,
  },
  {
    id: "L_EXEMPLAIRE",
    name: "L'Exemplaire",
    description: "Obtenir 5 fois le niveau de qualité 'EXEMPLARY'.",
    rarity: "LEGENDARY",
    criteria: (user) => user.exemplaryReviewCount >= 5,
  },

  // --- SPÉCIAUX ---
  {
    id: "EARLY_ADOPTER",
    name: "Pionnier",
    description: "Membre de la phase Bêta.",
    rarity: "RARE",
    criteria: (user) => user.createdAt <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "SYNCHRO_GOLD",
    name: "Sync Gold",
    description: "Atteindre une cohésion de 100% avec ton escouade.",
    rarity: "EPIC",
    criteria: (_user) => false,
  },

  // --- TIER 7: MISSION-LINKED BADGES ---
  {
    id: "FIRST_MISSION",
    name: "First Mission",
    description: "Complete your first mission.",
    rarity: "COMMON",
    criteria: (user) => user.missionsCompletedCount >= 1,
  },
  {
    id: "MISSION_MASTER",
    name: "Mission Master",
    description: "Complete 10 missions.",
    rarity: "RARE",
    criteria: (user) => user.missionsCompletedCount >= 10,
  },
  {
    id: "SPECIALIST",
    name: "Specialist",
    description: "Complete 5 missions of the same category.",
    rarity: "EPIC",
    criteria: (user) => {
      const categories = user.missionCategoriesCompleted ?? {};
      return Object.values(categories).some(count => count >= 5);
    },
  },
  {
    id: "SPEED_RUNNER",
    name: "Speed Runner",
    description: "Complete a mission in less than 50% of estimated time.",
    rarity: "EPIC",
    criteria: (user) => (user.fastMissionCompletions ?? 0) >= 1,
  }
];

export async function checkAndAwardBadges(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        badges: true,
        behavioralVibrancy: true,
        createdAt: true,
        level: true,
        missionsCompletedCount: true,
        referralCount: true,
        currentStreak: true,
      },
    });

    if (!user) return [];

    const existingBadges = new Set(user.badges);
    const newBadges: string[] = [];

    const [reviewsCount, missionsWithoutRevisionCount, exemplaryReviewCount, missionCategories, fastCompletions] = await Promise.all([
      prisma.missionReview.count({ where: { reviewerId: userId } }),
      prisma.missionSubmission.count({ where: { userId, revisionCount: 0, status: "APPROVED" } }),
      prisma.missionReview.count({ where: { submission: { userId }, qualityLevel: "EXEMPLARY" } }),
      prisma.missionSubmission.groupBy({
        by: ["missionId"],
        where: { userId, status: "APPROVED" },
        _count: { missionId: true },
      }),
      prisma.missionSubmission.count({
        where: {
          userId,
          status: "APPROVED",
          userDifficulty: { lt: 3 },
        },
      }),
    ]);

    const categoryCounts: Record<string, number> = {};
    for (const mc of missionCategories) {
      const mission = await prisma.mission.findUnique({
        where: { id: mc.missionId },
        select: { category: true },
      });
      if (mission?.category) {
        categoryCounts[mission.category] = (categoryCounts[mission.category] ?? 0) + mc._count.missionId;
      }
    }

    const userWithStats: ExtendedUserForBadges = {
      id: user.id,
      level: user.level ?? 1,
      missionsCompletedCount: user.missionsCompletedCount ?? 0,
      badges: user.badges,
      currentStreak: user.currentStreak ?? 0,
      referralCount: user.referralCount ?? 0,
      reviewsCount,
      createdAt: user.createdAt,
      missionsWithoutRevisionCount,
      exemplaryReviewCount,
      vibrancy: (user.behavioralVibrancy as unknown as BehavioralVibrancy) || {
        builder: 0,
        creator: 0,
        strategist: 0,
        catalyst: 0,
      },
      missionCategoriesCompleted: categoryCounts,
      fastMissionCompletions: fastCompletions,
    };

    for (const badge of BADGE_DEFINITIONS) {
      if (!existingBadges.has(badge.id) && badge.criteria(userWithStats)) {
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
   } catch (error: unknown) {
     logError("Badge Engine", error);
     return [];
   }
}

export async function checkMissionBadges(userId: string, missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      select: { category: true },
    });

    if (!mission) return [];

    const submission = await prisma.missionSubmission.findUnique({
      where: { userId_missionId_cycleKey: { userId, missionId, cycleKey: "PERMANENT" } },
      select: { userDifficulty: true },
    });

    if (!submission) return [];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { badges: true, missionsCompletedCount: true },
    });

    if (!user) return [];

    const existingBadges = new Set(user.badges);
    const newBadges: string[] = [];

    if (!existingBadges.has("FIRST_MISSION") && user.missionsCompletedCount >= 1) {
      newBadges.push("FIRST_MISSION");
    }

    if (!existingBadges.has("MISSION_MASTER") && user.missionsCompletedCount >= 10) {
      newBadges.push("MISSION_MASTER");
    }

    const categoryCompletions = await prisma.missionSubmission.count({
      where: {
        userId,
        status: "APPROVED",
        mission: { category: mission.category },
      },
    });

    if (!existingBadges.has("SPECIALIST") && categoryCompletions >= 5) {
      newBadges.push("SPECIALIST");
    }

    if (
      !existingBadges.has("SPEED_RUNNER") &&
      submission.userDifficulty !== null &&
      submission.userDifficulty <= 2
    ) {
      newBadges.push("SPEED_RUNNER");
    }

    if (newBadges.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          badges: { push: newBadges },
        },
      });

      for (const badgeId of newBadges) {
        const def = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
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
  } catch (error: unknown) {
    console.error("[CHECK_MISSION_BADGES_ERROR]", error);
    return [];
  }
}

