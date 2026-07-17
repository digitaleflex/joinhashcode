import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { uxPollSchema } from "@/lib/validation";

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
    if (limited) return NextResponse.json({ message: "Ton avis compte, mais laisse le système respirer. Réessaie dans une minute." }, { status: 429 });

    const body = await req.json();
    const parsed = uxPollSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const { prefersDarkMode, modernityRating, readabilityIssues } = parsed.data;

    if (modernityRating === undefined) {
      return NextResponse.json({ error: "Note de modernité manquante" }, { status: 400 });
    }

    const readabilityText = readabilityIssues ? readabilityIssues.join("; ") : null;

    // Upsert poll response
    await prisma.uXPollResponse.upsert({
      where: { userId: session.user.id },
      update: {
        prefersDarkMode: prefersDarkMode === true,
        modernityRating,
        readabilityIssues: readabilityText
      },
      create: {
        userId: session.user.id,
        prefersDarkMode: prefersDarkMode === true,
        modernityRating,
        readabilityIssues: readabilityText
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
