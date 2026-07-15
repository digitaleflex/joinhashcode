import { LEVEL_THRESHOLDS } from "./member-card-constants"

export function getLevelProgress(xp: number) {
  const thresholds = LEVEL_THRESHOLDS
  let level = 1
  let currentLevelXp = 0
  let nextLevelXp: number | null = null

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      level = i + 1
      currentLevelXp = thresholds[i]
      nextLevelXp = thresholds[i + 1] ?? null
      break
    }
  }

  const xpInLevel = xp - currentLevelXp
  const xpNeededForNext = nextLevelXp ? nextLevelXp - currentLevelXp : 0
  const percent = nextLevelXp ? Math.min(Math.floor((xpInLevel / xpNeededForNext) * 100), 100) : 100

  return { level, xpInLevel, xpNeededForNext, nextLevelXp, percent }
}
