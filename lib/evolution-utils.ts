import { BehavioralVitality } from "./types";

/**
 * Mapping des classes vers les clés de vitalité comportementale.
 */
export const CLASS_TO_QUADRANT: Record<string, keyof BehavioralVitality> = {
  'Bâtisseur': 'builder',
  'Créateur': 'creator',
  'Stratège': 'strategist',
  'Catalyseur': 'catalyst',
  'BÂTISSEUR': 'builder',
  'CRÉATEUR': 'creator',
  'STRATÈGE': 'strategist',
  'CATALYSEUR': 'catalyst',
};

/**
 * Calcule le niveau de synchronisation neuronale (Sync_Level).
 * Il s'agit du pourcentage de dominance de la classe choisie par rapport à l'activité totale.
 * 
 * @param classLabel La classe de l'utilisateur (ex: "Bâtisseur")
 * @param vitality Les scores actuels de vitalité (builder, creator, strategist, catalyst)
 * @returns Un score entre 0 et 100
 */
export function calculateNeuralSync(
  classLabel: string | null,
  vitality: BehavioralVitality
): number {
  if (!classLabel) return 100;

  const targetKey = CLASS_TO_QUADRANT[classLabel];
  if (!targetKey) return 100;

  const total = vitality.builder + vitality.creator + vitality.strategist + vitality.catalyst;
  
  if (total === 0) return 100; // Synchronisé par défaut au démarrage

  const sync = (vitality[targetKey] / total) * 100;
  
  return Math.min(Math.max(Math.round(sync), 0), 100);
}

/**
 * Retourne un libellé et une couleur basés sur le score de synchronisation.
 */
export function getSyncStatus(score: number) {
  if (score >= 80) return { label: "OPTIMAL", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  if (score >= 50) return { label: "SYNCHRONISÉ", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
  if (score >= 30) return { label: "DÉRIVE LÉGÈRE", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  return { label: "DÉRIVE CRITIQUE", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" };
}
