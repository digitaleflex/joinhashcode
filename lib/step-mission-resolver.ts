import { ONBOARDING_MISSION } from "./onboarding-mission";
import { PROJECT_MISSION } from "./project-mission";
import { SOLUTION_MISSION } from "./solution-mission";
import type { OnboardingMissionDef } from "./onboarding-mission";

export function getStepMissionDef(slug: string | null | undefined): OnboardingMissionDef | null {
  if (!slug) return null;
  if (slug === ONBOARDING_MISSION.slug) return ONBOARDING_MISSION;
  if (slug === PROJECT_MISSION.slug) return PROJECT_MISSION;
  if (slug === SOLUTION_MISSION.slug) return SOLUTION_MISSION;
  return null;
}

export function isStepMission(slug: string | null | undefined): boolean {
  return getStepMissionDef(slug) !== null;
}