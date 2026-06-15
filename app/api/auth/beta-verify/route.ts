import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { processReferralReward } from "@/lib/referral";
import { emailService } from "@/lib/email";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting (SEC-013)
  const { limited } = await checkRateLimit(mutationLimiter, `beta-verify:${session.user.id}`);
  if (limited) {
    return NextResponse.json({ message: "Trop de tentatives" }, { status: 429 });
  }

  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ message: "La clé est requise" }, { status: 400 });
    }

    const betaKey = await prisma.betaKey.findUnique({
      where: { key: key.toUpperCase() },
    });

    // Harden error responses (SEC-013)
    if (!betaKey || betaKey.isUsed) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return NextResponse.json({ message: "Clé invalide ou déjà utilisée" }, { status: 400 });
    }

    if (betaKey.expiresAt && new Date() > betaKey.expiresAt) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return NextResponse.json({ message: "Cette clé a expiré" }, { status: 400 });
    }

    // Link key to user and mark as used
    await prisma.$transaction([
      prisma.betaKey.update({
        where: { id: betaKey.id },
        data: {
          isUsed: true,
          usedBy: session.user.id,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          betaKeyId: betaKey.id,
        },
      }),
    ]);

    // Reward the referrer if any
    await processReferralReward(session.user.id);

    // Send guidance email
    emailService.sendBetaKeyVerifiedEmail({
      email: session.user.email,
      name: session.user.name,
    }).catch(err => console.error("[EMAIL_ERROR] sendBetaKeyVerifiedEmail", err));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[BETA_VERIFY_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
