import { prisma } from "./prisma";
import { triggerNotification } from "./qstash";
import { BehavioralVibrancy } from "./types";

export interface ExtendedUserForBadges {
  id: string;
  level: number;
  missionsCompletedCount: number;
  badges: string[];
  currentStreak: number;
  referralCount: number;
  reviewsCount?: number;
  vibrancy: BehavioralVibrancy;
  squadId?: string | null;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  criteria: (user: ExtendedUserForBadges) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- TIER 1: RANGS & ANCIENNETÉ ---
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
    id: "ELITE",
    name: "Élite",
    description: "Atteindre le niveau 10.",
    criteria: (user) => user.level >= 10,
  },
  {
    id: "LEGENDE",
    name: "Légende",
    description: "Atteindre le niveau 50.",
    criteria: (user) => user.level >= 50,
  },

  // --- TIER 2: MISSIONS (VOLUME) ---
  {
    id: "PREMIERE_PREUVE",
    name: "Première Preuve",
    description: "Compléter sa toute première mission.",
    criteria: (user) => user.missionsCompletedCount >= 1,
  },
  {
    id: "BOURREAU_TRAVAIL",
    name: "Bourreau de Travail",
    description: "Compléter 25 missions.",
    criteria: (user) => user.missionsCompletedCount >= 25,
  },
  {
    id: "METRONOME",
    name: "Métronome",
    description: "Compléter 50 missions.",
    criteria: (user) => user.missionsCompletedCount >= 50,
  },
  {
    id: "LA_MACHINE",
    name: "La Machine",
    description: "Compléter 100 missions.",
    criteria: (user) => user.missionsCompletedCount >= 100,
  },

  // --- TIER 3: DISCIPLINE (STREAKS) ---
  {
    id: "REGULIER",
    name: "Régulier",
    description: "Maintenir une série de 7 jours de check-ins.",
    criteria: (user) => (user.currentStreak ?? 0) >= 7,
  },
  {
    id: "INFLEXIBLE",
    name: "Inflexible",
    description: "Maintenir une série de 30 jours de check-ins.",
    criteria: (user) => (user.currentStreak ?? 0) >= 30,
  },
  {
    id: "INARRETABLE",
    name: "Inarrêtable",
    description: "Maintenir une série de 100 jours de check-ins.",
    criteria: (user) => (user.currentStreak ?? 0) >= 100,
  },

  // --- TIER 4: SPÉCIALISATION ---
  {
    id: "ARCHITECTE",
    name: "Architecte",
    description: "Compléter 10 missions de type CODE.",
    criteria: (user) => (user.vibrancy?.builder ?? 0) >= 100, // Basé sur le score d'évolution
  },
  {
    id: "VISIONNAIRE",
    name: "Visionnaire",
    description: "Compléter 10 missions de type DESIGN.",
    criteria: (user) => (user.vibrancy?.creator ?? 0) >= 100,
  },
  {
    id: "STRATEGE",
    name: "Stratège",
    description: "Compléter 10 missions de type BUSINESS.",
    criteria: (user) => (user.vibrancy?.strategist ?? 0) >= 100,
  },
  {
    id: "CATALYSEUR",
    name: "Catalyseur",
    description: "Compléter 10 missions de type NETWORK.",
    criteria: (user) => (user.vibrancy?.catalyst ?? 0) >= 100,
  },
  {
    id: "POLYMATH",
    name: "Polymath",
    description: "Avoir au moins 50 points dans chaque vecteur comportemental.",
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
    criteria: (user) => (user.referralCount ?? 0) >= 1,
  },
  {
    id: "GROWTH_HACKER",
    name: "Growth Hacker",
    description: "Parrainer 5 membres actifs.",
    criteria: (user) => (user.referralCount ?? 0) >= 5,
  },
  {
    id: "BATISSEUR_TRIBU",
    name: "Bâtisseur de Tribu",
    description: "Parrainer 20 membres actifs.",
    criteria: (user) => (user.referralCount ?? 0) >= 20,
  },
  {
    id: "FRERE_ARMES",
    name: "Frère d'Armes",
    description: "Être membre d'une escouade complète (5 agents).",
    criteria: (user) => !!user.squadId, // Simplifié
  },

  // --- TIER 6: QUALITÉ & CONTRIBUTIONS ---
  {
    id: "ZERO_FAUTE",
    name: "Zéro Faute",
    description: "Compléter 5 missions sans aucune demande de révision.",
    criteria: (user) => false, // Logique complexe nécessitant un compteur en DB
  },
  {
    id: "MENTOR",
    name: "Mentor",
    description: "Effectuer 10 reviews de missions approuvées.",
    criteria: (user) => (user.reviewsCount ?? 0) >= 10,
  },
  {
    id: "EXPERT_CERTIFIE",
    name: "Expert Certifié",
    description: "Effectuer 50 reviews de missions.",
    criteria: (user) => (user.reviewsCount ?? 0) >= 50,
  },
  {
    id: "L_EXEMPLAIRE",
    name: "L'Exemplaire",
    description: "Obtenir 5 fois le niveau de qualité 'EXEMPLARY'.",
    criteria: (user) => false, // Logique complexe
  },

  // --- SPÉCIAUX ---
  {
    id: "EARLY_ADOPTER",
    name: "Pionnier",
    description: "Membre de la phase Bêta.",
    criteria: (_user) => true,
  },
  {
    id: "SYNCHRO_GOLD",
    name: "Sync Gold",
    description: "Atteindre une cohésion de 100% avec ton escouade.",
    criteria: (user) => false,
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
        referralCount: true,
        behavioralVibrancy: true,
      },
    });

    if (!user) return [];

    const existingBadges = new Set(user.badges);
    const newBadges: string[] = [];

    // Adapter user pour les critères
    const userWithStats: ExtendedUserForBadges = {
      id: user.id,
      level: user.level,
      missionsCompletedCount: user.missionsCompletedCount,
      badges: user.badges,
      currentStreak: 0, // Sera implémenté avec engagementStats
      referralCount: user.referralCount,
      vibrancy: (user.behavioralVibrancy as unknown as BehavioralVibrancy) || {
        builder: 0,
        creator: 0,
        strategist: 0,
        catalyst: 0,
      }
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
  } catch (_) {
    console.error("[BADGE_ENGINE_ERROR]", error);
    return [];
  }
}

