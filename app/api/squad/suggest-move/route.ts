export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

const CLASS_LABELS: Record<string, string> = {
  builder: "Builder",
  creator: "Créateur",
  strategist: "Stratège",
  catalyst: "Catalyseur",
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { targetUserId } = await req.json()
    if (!targetUserId) return NextResponse.json({ message: "targetUserId manquant" }, { status: 400 })

    // Verify caller is leader of a squad
    const leaderMember = await prisma.member.findFirst({
      where: { userId: session.user.id, role: "owner" },
      include: { organization: { select: { id: true, name: true } } },
    })

    if (!leaderMember) {
      return NextResponse.json({ message: "Seul le leader peut envoyer cette suggestion." }, { status: 403 })
    }

    // Verify target is in the same squad
    const targetMember = await prisma.member.findFirst({
      where: { userId: targetUserId, organizationId: leaderMember.organizationId },
      include: { user: { select: { class: true } } },
    })

    if (!targetMember) {
      return NextResponse.json({ message: "Ce membre ne fait pas partie de ton escouade." }, { status: 404 })
    }

    if (targetMember.role === "owner") {
      return NextResponse.json({ message: "Impossible d'envoyer cette suggestion au leader." }, { status: 400 })
    }

    const squadName = leaderMember.organization.name
    const profileLabel = CLASS_LABELS[targetMember.user.class?.toLowerCase() ?? ""] ?? targetMember.user.class ?? "ton profil"

    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "SQUAD_REBALANCE_SUGGESTION",
        title: "Ton escouade te suggère d'explorer",
        message: `${squadName} a déjà plusieurs ${profileLabel}s. Tu pourrais avoir plus d'impact dans une équipe qui manque de ce profil. Explore les escouades disponibles !`,
        link: "/squad/leaderboard",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("[SQUAD_SUGGEST_MOVE]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
