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
      level: user.level ?? 1,
      experience: user.experience ?? 0,
      class: user.class,
      role: user.role,
      pseudo: user.pseudo,
      bio: user.profile?.bio,
      country: user.country,
      city: user.city,
      language: user.language,
      githubUrl: user.githubUrl ?? null,
      linkedinUrl: user.linkedinUrl ?? null,
      twitterUrl: user.twitterUrl ?? null,
      portfolioUrl: user.portfolioUrl ?? null,
      currentSituation: user.currentSituation,
      dreamStatement: user.profile?.dreamStatement,
      mainObjective: user.mainObjective,
      currentFocus: user.profile?.currentFocus ?? [],
      mainBlocker: user.profile?.mainBlocker,
      builderScore: user.builderScore ?? 0,
      creatorScore: user.creatorScore ?? 0,
      strategistScore: user.strategistScore ?? 0,
      catalystScore: user.catalystScore ?? 0,
      tools: user.tools,
      domains: user.domains,
      primaryDomain: user.primaryDomain,
      subDomain: user.subDomain,
      learningTools: user.learningTools,
      practiceMode: user.practiceMode,
      certifications: user.certifications,
      specializationAt: user.specializationAt,
      badges: user.badges,
      missionsCompletedCount: user.missionsCompletedCount ?? 0,
      currentStreak: user.currentStreak ?? 0,
      longestStreak: user.longestStreak ?? 0,
      lastCheckinAt: user.lastCheckinAt ?? null,
      behavioralVibrancy: user.behavioralVibrancy,
      betaKeyId: user.beta?.betaKeyId ?? null,
      memberNumber: user.memberNumber,
      cardSignature: user.cardSignature,
      cardIssuedAt: user.cardIssuedAt,
      cardTier: user.cardTier,
      twoFactorEnabled: user.twoFactorEnabled ?? false,
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
