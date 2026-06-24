import type { ProfileType as _ProfileType } from "./profile-content"
export type ProfileType = _ProfileType

export const CLASS_COLORS: Record<ProfileType, string> = {
  builder:    "#B8FF3B",
  creator:    "#A855F7",
  strategist: "#22D3EE",
  catalyst:   "#F97316",
};

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
