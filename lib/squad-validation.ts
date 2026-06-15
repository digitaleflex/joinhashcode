import { prisma } from "./prisma";

export interface ValidationResult {
  allowed: boolean;
  message?: string;
}

const CLASS_LABELS: Record<string, string> = {
  builder: "Builder",
  creator: "Créateur",
  strategist: "Stratège",
  catalyst: "Catalyseur",
};

/**
 * Valide l'équilibre cognitif d'une escouade avant d'ajouter un nouveau membre.
 * Un même profil (classe) ne peut pas être présent plus de 2 fois dans l'escouade.
 */
export async function validateSquadCognitiveBalance(
  organizationId: string,
  candidateUserId: string
): Promise<ValidationResult> {
  // 1. Récupérer la classe du candidat
  const candidate = await prisma.user.findUnique({
    where: { id: candidateUserId },
    select: { class: true, name: true },
  });

  if (!candidate || !candidate.class) {
    // Si le candidat n'a pas de classe (Initié), on l'autorise à rejoindre mais on ne bloque pas
    return { allowed: true };
  }

  const candidateClass = candidate.class.toLowerCase();

  // 2. Récupérer les membres actuels de l'escouade et leurs classes
  const members = await prisma.member.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          class: true,
        },
      },
    },
  });

  // 3. Compter les occurrences de chaque classe
  const classCounts: Record<string, number> = {
    builder: 0,
    creator: 0,
    strategist: 0,
    catalyst: 0,
  };

  members.forEach((member) => {
    if (member.user?.class) {
      const cls = member.user.class.toLowerCase();
      if (cls in classCounts) {
        classCounts[cls]++;
      }
    }
  });

  // 4. Vérifier si la classe du candidat dépasse la limite
  const currentCount = classCounts[candidateClass] ?? 0;
  if (currentCount >= 2) {
    const label = CLASS_LABELS[candidateClass] || candidate.class;
    
    // Déterminer les profils recherchés (ceux qui ont 0 ou le moins de représentants)
    const missingProfiles = Object.entries(classCounts)
      .filter(([_, count]) => count === 0)
      .map(([cls]) => CLASS_LABELS[cls])
      .filter(Boolean);

    let message = `Déséquilibre cognitif détecté : cette escouade compte déjà ${currentCount} représentants du profil ${label} (maximum 2).`;
    if (missingProfiles.length > 0) {
      message += ` Pour un équilibre parfait, l'escouade recherche plutôt des profils : ${missingProfiles.join(", ")}.`;
    } else {
      message += ` Veuillez diversifier les rôles au sein de l'équipe.`;
    }

    return {
      allowed: false,
      message,
    };
  }

  return { allowed: true };
}
