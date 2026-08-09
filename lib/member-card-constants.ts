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
