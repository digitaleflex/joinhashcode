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

    // Retourne uniquement les champs nécessaires au middleware pour rester léger et type-safe
    const safeUser: Record<string, unknown> = {
      id: user.id,
      banned: user.banned,
      banExpires: user.banExpires,
      currentSituation: user.currentSituation,
      class: user.class,
      role: user.role,
    };

    return NextResponse.json({
      session,
      user: safeUser,
    });
  } catch (error) {
    console.error("🟢 [Middleware Session API] Error getting unified session/user:", error);
    return NextResponse.json({ session: null, user: null, error: "Internal Server Error" }, { status: 500 });
  }
}
