declare module "better-auth" {
  interface User {
    level: number;
    experience: number;
    class?: string | null;
    role: string;
    pseudo?: string | null;
    country?: string | null;
    city?: string | null;
    language: string;
    currentSituation?: string | null;
    technicalLevel?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    mainObjective?: string | null;
    builderScore: number;
    creatorScore: number;
    strategistScore: number;
    catalystScore: number;
    missionsCompletedCount: number;
    dreamStatement?: string | null;
    currentFocus?: string[] | null;
    mainBlocker?: string | null;
    lastCheckinAt?: Date | null;
    betaKeyId?: string | null;
    banned?: boolean | null;
    banExpires?: Date | null;
  }
}
