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
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralCount: true, referrals: { select: { id: true, name: true, pseudo: true, image: true, class: true, level: true, createdAt: true } } },
    });

    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Generate referral code on first access
    if (!user.referralCode) {
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: nanoid(8).toLowerCase() },
        select: { referralCode: true, referralCount: true, referrals: { select: { id: true, name: true, pseudo: true, image: true, class: true, level: true, createdAt: true } } },
      });
    }

    return NextResponse.json({
      referralCode: user!.referralCode,
      referralCount: user!.referralCount,
      referrals: user!.referrals,
    });
  } catch (_) {
    return handleApiError(error, "REFERRAL_GET");
  }
}
