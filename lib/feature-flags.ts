export type FeatureFlag =
  | "weekly_challenges"
  | "badges"
  | "squad_advanced"
  | "squad_chat"
  | "squad_discovery"
  | "referrals"
  | "leaderboard"
  | "tour"

const DEFAULTS: Record<FeatureFlag, boolean> = {
  weekly_challenges: true,
  badges: true,
  squad_advanced: true,
  squad_chat: true,
  squad_discovery: true,
  referrals: true,
  leaderboard: true,
  tour: true,
}

const OVERRIDES: Partial<Record<FeatureFlag, boolean>> | null = (() => {
  const raw = process.env.FEATURE_FLAGS
  if (!raw) return null
  try {
    return JSON.parse(raw) as Partial<Record<FeatureFlag, boolean>>
  } catch {
    if (typeof process !== "undefined") {
      console.warn("[feature-flags] invalid FEATURE_FLAGS env var, using defaults")
    }
    return null
  }
})()

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  if (OVERRIDES && flag in OVERRIDES) {
    return OVERRIDES[flag] ?? DEFAULTS[flag]
  }
  return DEFAULTS[flag]
}

export function getFeatureFlags(): Record<FeatureFlag, boolean> {
  const flags = { ...DEFAULTS }
  if (OVERRIDES) {
    for (const key of Object.keys(flags) as FeatureFlag[]) {
      if (key in OVERRIDES) {
        flags[key] = OVERRIDES[key]!
      }
    }
  }
  return flags
}
