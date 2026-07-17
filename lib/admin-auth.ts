import { auth } from "./auth"
import { prisma } from "./prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { adminOpsLimiter, checkRateLimit } from "./ratelimit"

type AdminHandler = (req: Request, admin: { userId: string; role: string }) => Promise<NextResponse>

export function withAdminAuth(handler: AdminHandler) {
  return async (req: Request, _context?: unknown): Promise<NextResponse> => {
    try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
      const { limited } = await checkRateLimit(adminOpsLimiter, session.user.id)
      if (limited) return NextResponse.json({ error: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 })
      return handler(req, { userId: session.user.id, role: session.user.role })
    } catch {
      return NextResponse.json({ error: "Erreur d'authentification" }, { status: 500 })
    }
  }
}

export async function checkAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user || !["ADMIN", "MODERATOR"].includes(user.role)) return null

  return session.user
}
