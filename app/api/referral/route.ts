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

    const currentReferral = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralCount: true },
    });

    if (!currentReferral) {
      const newCode = nanoid(8).toLowerCase();
      const created = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: newCode },
        select: { referralCode: true, referralCount: true },
      });
      return NextResponse.json(created, { headers: { "Cache-Control": "private, no-cache" } });
    }

    // Fetch referred users via referrerId
    const referredUserRecords = await prisma.user.findMany({
      where: { referrerId: session.user.id },
      select: {
        id: true,
        name: true,
        pseudo: true,
        image: true,
        class: true,
        level: true,
        createdAt: true,
      },
    });
    const referrals = referredUserRecords;

    return NextResponse.json({
      referralCode: currentReferral.referralCode,
      referralCount: currentReferral.referralCount,
      referrals,
    }, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (error: unknown) {
    return handleApiError(error, "REFERRAL_GET");
  }
}
