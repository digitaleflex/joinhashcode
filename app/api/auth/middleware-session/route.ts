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
    const user = await getCachedUser(session.user.id);

    if (!user) {
      return NextResponse.json({ session: null, user: null });
    }

    const safeUser: Record<string, unknown> = {
      id: user.id,
      banned: user.security?.banned ?? false,
      banExpires: user.banExpires,
      betaKeyId: user.beta?.betaKeyId ?? null,
      currentSituation: user.currentSituation,
      class: user.class,
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
