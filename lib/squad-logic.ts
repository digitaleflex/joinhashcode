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

/**
 * Applique une dérive (decay) à toutes les escouades.
 * Réduit le score de 2% (0.02) pour simuler la perte de synchronisation avec le temps.
 * Seuil minimum : 0.05
 */
export async function applySquadCohesionDecay() {
  try {
    // On diminue le score de toutes les guildes qui n'ont pas été mises à jour depuis 24h
    const squads = await prisma.guild.findMany({
      where: { 
        cohesionScore: { gt: 0.05 },
        updatedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    for (const squad of squads) {
      const newScore = Math.max(0.05, squad.cohesionScore - 0.02);
      await prisma.guild.update({
        where: { id: squad.id },
        data: { cohesionScore: newScore }
      });
      
      // Note: On pourrait envoyer une notification ici aux membres de l'escouade
    }
    
    return { processed: squads.length };
  } catch (error) {
    console.error("[SQUAD_DECAY_ERROR]", error);
  }
}
