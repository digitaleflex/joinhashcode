export const LEVEL_THRESHOLDS = [0, 100, 400, 1400]

export function getLevelProgress(xp: number) {
  let level = 1
  let currentLevelXp = 0
  let nextLevelXp: number | null = null

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      currentLevelXp = LEVEL_THRESHOLDS[i]
      nextLevelXp = LEVEL_THRESHOLDS[i + 1] ?? null
      break
    }
  }

  const xpInLevel = xp - currentLevelXp
  const xpNeededForNext = nextLevelXp ? nextLevelXp - currentLevelXp : 0
  const percent = nextLevelXp ? Math.min(Math.floor((xpInLevel / xpNeededForNext) * 100), 100) : 100

  return { level, xpInLevel, xpNeededForNext, nextLevelXp, percent }
}
