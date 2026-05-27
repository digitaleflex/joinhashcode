export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true, createdAt: true, updatedAt: true,
      level: true, experience: true, class: true, role: true, pseudo: true, bio: true,
      country: true, city: true, language: true,
      githubUrl: true, linkedinUrl: true, twitterUrl: true, portfolioUrl: true,
      currentSituation: true, dreamStatement: true, mainObjective: true,
      currentFocus: true, mainBlocker: true,
      builderScore: true, creatorScore: true, strategistScore: true, catalystScore: true,
      tools: true, domains: true, badges: true,
      missionsCompletedCount: true, currentStreak: true, longestStreak: true,
      lastCheckinAt: true, behavioralVibrancy: true, confidenceScore: true, profileDrift: true,
      betaKeyId: true, memberNumber: true,
      cardSignature: true, cardIssuedAt: true, cardTier: true,
      twoFactorEnabled: true,
    },
  });
  if (!user) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(user);
}
