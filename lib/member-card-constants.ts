import { PROFILE_COLORS } from "./profile-content"
export type { ProfileType } from "./profile-content"

export const CLASS_COLORS = PROFILE_COLORS;

export const LEVEL_NAMES: Record<number, string> = {
   1: "INIT",
   2: "CORE",
   3: "PRO",
   4: "ELITE",
   5: "VETERAN",
   6: "MASTER",
   7: "GRANDMASTER",
   8: "LEGEND",
   9: "MYTHIC",
   10: "TRANSCENDENT",
};

export function getLevelName(level: number): string {
   if (level <= 10) return LEVEL_NAMES[level] ?? "AGENT"
   return `ASCENDED ${level - 10}`
}

const LEVEL_THRESHOLDS_ARRAY = [0, 100, 400, 1400, 3500, 8000, 16000, 30000, 55000, 100000];

export const XP_THRESHOLDS: Record<number, number> = {};
for (let i = 1; i <= 10; i++) {
   XP_THRESHOLDS[i] = LEVEL_THRESHOLDS_ARRAY[i - 1];
}
for (let i = 11; i <= 50; i++) {
   const gap = 100000 + (i - 11) * 20000;
   XP_THRESHOLDS[i] = XP_THRESHOLDS[i - 1] + gap;
}

export const LEVEL_THRESHOLDS = Object.values(XP_THRESHOLDS).sort((a, b) => a - b);

export const XP_MAX: Record<number, number> = {};
for (let i = 1; i <= 50; i++) {
   XP_MAX[i] = XP_THRESHOLDS[i + 1] ?? XP_THRESHOLDS[i];
}

export type MissionDifficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export const DIFFICULTY_XP: Record<MissionDifficulty, number> = {
  EASY: 20,
  MEDIUM: 50,
  HARD: 100,
  EXPERT: 200,
};

export const DIFFICULTY_LEVEL_GATE: Record<MissionDifficulty, number> = {
  EASY: 1,
  MEDIUM: 1,
  HARD: 10,
  EXPERT: 20,
};

export function getXpForLevel(level: number): number {
  return XP_THRESHOLDS[level] ?? 0;
}

export function getLevelFromXp(xp: number): number {
  const sortedLevels = Object.keys(XP_THRESHOLDS).map(Number).sort((a, b) => b - a);
  for (const level of sortedLevels) {
    if (xp >= XP_THRESHOLDS[level]) {
      return level;
    }
  }
  return 1;
}

export function getXpForDifficulty(difficulty: MissionDifficulty): number {
  return DIFFICULTY_XP[difficulty];
}

export function getRequiredLevelForDifficulty(difficulty: MissionDifficulty): number {
  return DIFFICULTY_LEVEL_GATE[difficulty];
}

export function canAccessMission(userLevel: number, missionDifficulty: MissionDifficulty): boolean {
  return userLevel >= DIFFICULTY_LEVEL_GATE[missionDifficulty];
}
