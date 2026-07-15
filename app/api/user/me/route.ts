export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { getCachedUser } from "@/lib/user-cache";
import { requireSession, AuthError } from "@/lib/auth-guard";

export async function GET() {
  try {
    const session = await requireSession();

    const user = await getCachedUser(session.user.id);
    if (!user) return NextResponse.json({ message: "Non trouvé" }, { status: 404 });

    // Projeter les champs requis pour le frontend
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      level: user.progress?.level ?? 1,
      experience: user.progress?.experience ?? 0,
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
      builderScore: user.builderScore ?? 0,
      creatorScore: user.creatorScore ?? 0,
      strategistScore: user.strategistScore ?? 0,
      catalystScore: user.catalystScore ?? 0,
      tools: user.tools,
      domains: user.domains,
      badges: user.badges,
      missionsCompletedCount: user.progress?.missionsCompletedCount ?? 0,
      currentStreak: user.stats?.currentStreak ?? 0,
      longestStreak: user.stats?.longestStreak ?? 0,
      lastCheckinAt: user.stats?.lastCheckinAt ?? null,
      behavioralVibrancy: user.behavioralVibrancy,
      confidenceScore: user.confidenceScore ?? 0.25,
      betaKeyId: user.beta?.betaKeyId ?? null,
      memberNumber: user.memberNumber,
      cardSignature: user.cardSignature,
      cardIssuedAt: user.cardIssuedAt,
      cardTier: user.cardTier,
      twoFactorEnabled: user.security?.twoFactorEnabled ?? false,
    };

    return NextResponse.json(safeUser, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[USER_ME]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
