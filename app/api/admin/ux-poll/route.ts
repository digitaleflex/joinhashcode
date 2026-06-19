import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getUxPollStats } from "@/lib/admin/ux-poll-stats"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const stats = await getUxPollStats()
    return NextResponse.json(stats)
  } catch (error: unknown) {
    console.error("[ADMIN_UX_POLL_ERROR]", error)
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 })
  }
}
