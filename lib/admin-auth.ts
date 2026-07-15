import { auth } from "./auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

type AdminHandler = (req: Request, admin: { userId: string; role: string }) => Promise<NextResponse>

export function withAdminAuth(handler: AdminHandler) {
  return async (req: Request, _context?: unknown): Promise<NextResponse> => {
    try {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
      return handler(req, { userId: session.user.id, role: session.user.role })
    } catch {
      return NextResponse.json({ error: "Erreur d'authentification" }, { status: 500 })
    }
  }
}
