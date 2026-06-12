export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ session: null, user: null });
    }

    // Récupère l'utilisateur en BDD de manière fraîche pour bypasser le cache JWT stale
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        banned: true,
        banExpires: true,
        currentSituation: true,
        class: true,
        role: true,
      },
    });

    return NextResponse.json({
      session,
      user,
    });
  } catch (error) {
    console.error("🟢 [Middleware Session API] Error getting unified session/user:", error);
    return NextResponse.json({ session: null, user: null, error: "Internal Server Error" }, { status: 500 });
  }
}
