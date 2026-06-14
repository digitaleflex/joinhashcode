import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";

/**
 * Save UX Research Poll Response
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de requêtes. Réessaie dans une minute." }, { status: 429 });

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
  } catch (error: unknown) {
    console.error("[UX_POLL_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
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
    } catch (error: unknown) {
        return NextResponse.json({ hasAnswered: false });
    }
}
