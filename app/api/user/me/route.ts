export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedUser } from "@/lib/user-cache";
import { requireSession, AuthError } from "@/lib/auth-guard";

export async function GET() {
  try {
    const session = await requireSession();

    const user = await getCachedUser(session.user.id);
    if (!user) return NextResponse.json({ message: "Non trouvé" }, { status: 404 });

    // J+7 activation — lecture directe sans fetch HTTP (perf)
    let j7Activated = (user as any).j7Activated ?? false;
    if (!j7Activated && (user as any).currentSituation) {
      try {
        const validatedSubmissions = await prisma.missionSubmission.count({
          where: {
            userId: session.user.id,
            missionId: 'cmstmwc0e0000x9g7rkc9le41',
            NOT: { status: 'PENDING' },
          },
        });
        const sevenDaysAfterSignup = (user as any).createdAt ? new Date(new Date((user as any).createdAt).getTime() + 7 * 24 * 60 * 60 * 1000) : null;
        const isWithinJ7Window = sevenDaysAfterSignup ? validatedSubmissions > 0 : true;
        j7Activated = validatedSubmissions >= 3 && isWithinJ7Window;
        if (j7Activated && !(user as any).j7Activated) {
          prisma.user.update({ where: { id: session.user.id }, data: { j7Activated: true } }).catch(() => {});
        }
      } catch (e) {
        console.error("[J7-COMPUTE]", e);
      }
    }

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
      j7Activated, // ← ajouté ici
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
