import { PROFILE_COLORS } from "./profile-content"
export type { ProfileType } from "./profile-content"

export const CLASS_COLORS = PROFILE_COLORS;

export const LEVEL_NAMES: Record<number, string> = {
  1: "INIT",
  2: "CORE",
  3: "PRO",
  4: "ELITE",
};

export const XP_MAX: Record<number, number> = {
  1: 100,
  2: 400,
  3: 1400,
  4: 9999,
};

export const LEVEL_THRESHOLDS = [0, 100, 400, 1400] as const;

export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400,
};
