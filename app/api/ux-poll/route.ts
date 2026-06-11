import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Save UX Research Poll Response
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return new NextResponse("Non autorisé", { status: 401 });

    const { prefersDarkMode, modernityRating, readabilityIssues } = await req.json();

    if (modernityRating === undefined) {
      return NextResponse.json({ error: "Note de modernité manquante" }, { status: 400 });
    }

    // Upsert poll response
    await prisma.uXPollResponse.upsert({
      where: { userId: session.user.id },
      update: {
        prefersDarkMode: prefersDarkMode === true,
        modernityRating: parseInt(modernityRating),
        readabilityIssues
      },
      create: {
        userId: session.user.id,
        prefersDarkMode: prefersDarkMode === true,
        modernityRating: parseInt(modernityRating),
        readabilityIssues
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UX_POLL_ERROR]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

/**
 * Check if user has already answered
 */
export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return NextResponse.json({ hasAnswered: true });

        const response = await prisma.uXPollResponse.findUnique({
            where: { userId: session.user.id }
        });

        return NextResponse.json({ hasAnswered: !!response });
    } catch (error) {
        return NextResponse.json({ hasAnswered: false });
    }
}
