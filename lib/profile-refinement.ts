import { ProfileType } from "./analysis";

export interface ProfileRefinementInput {
  builderScore: number;
  creatorScore: number;
  strategistScore: number;
  catalystScore: number;
  missionType?: string;
  specializationScores?: Partial<Record<ProfileType, number>>;
}

export function refineProfileByMission(input: ProfileRefinementInput): Pick<ProfileRefinementInput, "builderScore" | "creatorScore" | "strategistScore" | "catalystScore"> {
  let { builderScore, creatorScore, strategistScore, catalystScore, missionType } = input;

  if (!missionType) {
    return { builderScore, creatorScore, strategistScore, catalystScore };
  }

  const type = missionType.toUpperCase();
  const boost = 0.15;

  switch (type) {
    case "CODE":
      builderScore += boost;
      break;
    case "DESIGN":
      creatorScore += boost;
      break;
    case "BUSINESS":
      strategistScore += boost;
      break;
    case "NETWORK":
      catalystScore += boost;
      break;
    default:
      break;
  }

  return {
    builderScore: Math.round(builderScore * 100) / 100,
    creatorScore: Math.round(creatorScore * 100) / 100,
    strategistScore: Math.round(strategistScore * 100) / 100,
    catalystScore: Math.round(catalystScore * 100) / 100,
  };
}

export function refineProfileBySpecialization(
  input: ProfileRefinementInput,
  specializationScores: Partial<Record<ProfileType, number>> = {}
): Pick<ProfileRefinementInput, "builderScore" | "creatorScore" | "strategistScore" | "catalystScore"> {
  if (!specializationScores || Object.keys(specializationScores).length === 0) {
    return {
      builderScore: input.builderScore,
      creatorScore: input.creatorScore,
      strategistScore: input.strategistScore,
      catalystScore: input.catalystScore,
    };
  }

  const boost = 0.1;

  return {
    builderScore: Math.round((input.builderScore + (specializationScores.builder || 0) * boost) * 100) / 100,
    creatorScore: Math.round((input.creatorScore + (specializationScores.creator || 0) * boost) * 100) / 100,
    strategistScore: Math.round((input.strategistScore + (specializationScores.strategist || 0) * boost) * 100) / 100,
    catalystScore: Math.round((input.catalystScore + (specializationScores.catalyst || 0) * boost) * 100) / 100,
  };
}
