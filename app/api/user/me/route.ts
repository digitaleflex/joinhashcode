export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getCachedUser } from "@/lib/user-cache";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await getCachedUser(session.user.id);
  if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // Projeter les champs requis pour le frontend
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    level: user.level,
    experience: user.experience,
    class: user.class,
    role: user.role,
    pseudo: user.pseudo,
    bio: user.bio,
    country: user.country,
    city: user.city,
    language: user.language,
    githubUrl: user.socials?.githubUrl ?? null,
    linkedinUrl: user.socials?.linkedinUrl ?? null,
    twitterUrl: user.socials?.twitterUrl ?? null,
    portfolioUrl: user.socials?.portfolioUrl ?? null,
    currentSituation: user.currentSituation,
    dreamStatement: user.dreamStatement,
    mainObjective: user.mainObjective,
    currentFocus: user.currentFocus,
    mainBlocker: user.mainBlocker,
    builderScore: user.psychometrics?.builderScore ?? 0,
    creatorScore: user.psychometrics?.creatorScore ?? 0,
    strategistScore: user.psychometrics?.strategistScore ?? 0,
    catalystScore: user.psychometrics?.catalystScore ?? 0,
    tools: user.tools,
    domains: user.domains,
    badges: user.badges,
    missionsCompletedCount: user.missionsCompletedCount,
    currentStreak: user.stats?.currentStreak ?? 0,
    longestStreak: user.stats?.longestStreak ?? 0,
    lastCheckinAt: user.stats?.lastCheckinAt ?? null,
    behavioralVibrancy: user.behavioralVibrancy,
    confidenceScore: user.psychometrics?.confidenceScore ?? 0.25,
    betaKeyId: user.betaKeyId,
    memberNumber: user.memberNumber,
    cardSignature: user.cardSignature,
    cardIssuedAt: user.cardIssuedAt,
    cardTier: user.cardTier,
    twoFactorEnabled: user.twoFactorEnabled,
  };

  return NextResponse.json(safeUser);
}
