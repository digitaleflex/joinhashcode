export type FeatureFlag = {
  enabled: boolean
  description: string
}

export type FeatureFlags = {
  guilds: FeatureFlag
  squads: FeatureFlag
  streaks: FeatureFlag
  weeklyChallenges: FeatureFlag
  badges: FeatureFlag
  retrospectives: FeatureFlag
  missions: FeatureFlag
}

const defaultFlags: FeatureFlags = {
  guilds: { enabled: false, description: "Groupes thématiques (Guilds)" },
  squads: { enabled: false, description: "Équipes projets (Squads)" },
  streaks: { enabled: false, description: "Séries quotidiennes" },
  weeklyChallenges: { enabled: false, description: "Défis hebdomadaires" },
  badges: { enabled: false, description: "Badges et accomplissements" },
  retrospectives: { enabled: false, description: "Rétrospectives d'équipe" },
  missions: { enabled: true, description: "Missions de base" },
}

export function getFeatureFlags(): FeatureFlags {
  if (typeof process === "undefined") return defaultFlags
  const overrides = process.env.NEXT_PUBLIC_FEATURE_FLAGS
  if (!overrides) return defaultFlags
  try {
    const parsed = JSON.parse(overrides)
    return {
      ...defaultFlags,
      ...Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [
          k,
          { ...defaultFlags[k as keyof FeatureFlags], enabled: Boolean(v) },
        ])
      ),
    }
  } catch {
    return defaultFlags
  }
}

export function isFeatureEnabled(name: keyof FeatureFlags): boolean {
  return getFeatureFlags()[name].enabled
}
