export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getCachedUser } from "@/lib/user-cache";
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

    // Utilise le cache Redis pour éviter le hit DB sur chaque page chargée
    let user;
    try {
      user = await getCachedUser(session.user.id);
    } catch {
      console.error("🟢 [Middleware Session API] getCachedUser failed, returning basic session");
      return NextResponse.json({
        session,
        user: {
          id: session.user.id,
          banned: false,
          banExpires: null,
          betaKeyId: null,
          currentSituation: null,
          class: null,
          role: "MEMBER",
          primaryDomain: null,
          deactivatedAt: null,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ session: null, user: null });
    }

    const safeUser: Record<string, unknown> = {
      id: user.id,
      banned: user.banned ?? false,
      banExpires: user.banExpires,
      deactivatedAt: user.deactivatedAt ?? null,
      betaKeyId: user.betaKeyId ?? null,
      currentSituation: user.currentSituation,
      class: user.class,
      primaryDomain: user.primaryDomain ?? null,
      role: user.role,
    };

    return NextResponse.json({
      session,
      user: safeUser,
    });

  } catch (error: unknown) {
    console.error("🟢 [Middleware Session API] Error getting unified session/user:", error);
    return NextResponse.json({ session: null, user: null, error: "Erreur interne du serveur" }, { status: 500 });
  }
}
