import { prisma } from "./prisma";

/**
 * Met à jour le Score de Cohésion d'une escouade (Guild).
 * La cohésion augmente avec l'activité collective et diminue légèrement avec le temps (decay).
 * @param guildId L'ID de l'escouade
 * @param boost La valeur à ajouter (ex: 0.05 pour un check-in, 0.1 pour une mission)
 */
export async function updateSquadCohesion(guildId: string, boost: number) {
  try {
    const squad = await prisma.guild.findUnique({
      where: { id: guildId },
      select: { cohesionScore: true }
    });

    if (!squad) return;

    // Calcul du nouveau score (max 1.0)
    const newScore = Math.min(1.0, squad.cohesionScore + boost);

    await prisma.guild.update({
      where: { id: guildId },
      data: { 
        cohesionScore: newScore,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error("[SQUAD_COHESION_UPDATE_ERROR]", error);
  }
}
