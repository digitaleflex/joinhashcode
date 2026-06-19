export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    let userReferral = await prisma.userReferral.findUnique({
      where: { userId: session.user.id },
      select: { referralCode: true, referralCount: true },
    });

    if (!userReferral) {
      userReferral = await prisma.userReferral.create({
        data: {
          userId: session.user.id,
          referralCode: nanoid(8).toLowerCase(),
          referralCount: 0,
        },
        select: { referralCode: true, referralCount: true },
      });
    }

    // Fetch referred users via the referral table
    const referredUserRecords = await prisma.userReferral.findMany({
      where: { referrerId: session.user.id },
      select: {
        user: {
          select: { id: true, name: true, pseudo: true, image: true, class: true, progress: { select: { level: true } }, createdAt: true },
        },
      },
    });
    const referrals = referredUserRecords.map(r => r.user);

    return NextResponse.json({
      referralCode: userReferral.referralCode,
      referralCount: userReferral.referralCount,
      referrals,
    }, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (error: unknown) {
    return handleApiError(error, "REFERRAL_GET");
  }
}
