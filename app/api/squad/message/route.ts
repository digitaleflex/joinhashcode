export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const organizationId = searchParams.get("organizationId")
  if (!organizationId) return NextResponse.json({ error: "organizationId requis" }, { status: 400 })

  const membership = await prisma.member.findUnique({
    where: { userId: session.user.id },
  })
  if (!membership || membership.organizationId !== organizationId) {
    return NextResponse.json({ error: "Tu n'es pas membre de cette escouade" }, { status: 403 })
  }

  const cursor = searchParams.get("cursor")
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100)

  const messages = await prisma.squadMessage.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      user: { select: { id: true, name: true, image: true, pseudo: true } },
    },
  })

  const hasMore = messages.length > limit
  if (hasMore) messages.pop()

  return NextResponse.json({
    messages: messages.reverse(),
    nextCursor: hasMore ? messages[0]?.id : null,
  })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { content, organizationId } = await req.json()
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Contenu requis" }, { status: 400 })
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "Message trop long (max 2000 caractères)" }, { status: 400 })
  }

  if (!organizationId || typeof organizationId !== "string") {
    return NextResponse.json({ error: "organizationId requis" }, { status: 400 })
  }

  const membership = await prisma.member.findUnique({
    where: { userId: session.user.id },
  })
  if (!membership || membership.organizationId !== organizationId) {
    return NextResponse.json({ error: "Tu n'es pas membre de cette escouade" }, { status: 403 })
  }

  const message = await prisma.squadMessage.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      organizationId,
    },
    include: {
      user: { select: { id: true, name: true, image: true, pseudo: true } },
    },
  })

  return NextResponse.json({ message })
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const messageId = searchParams.get("id")
  if (!messageId) return NextResponse.json({ error: "id requis" }, { status: 400 })

  const msg = await prisma.squadMessage.findUnique({
    where: { id: messageId },
    include: {
      organization: {
        select: {
          members: {
            where: { userId: session.user.id },
            select: { role: true },
          },
        },
      },
    },
  })

  if (!msg) return NextResponse.json({ error: "Message introuvable" }, { status: 404 })

  const viewerRole = msg.organization.members[0]?.role
  const isAuthor = msg.userId === session.user.id
  const isModerator = viewerRole === "owner" || viewerRole === "admin"

  if (!isAuthor && !isModerator) {
    return NextResponse.json({ error: "Seul l'auteur ou un admin peut supprimer ce message" }, { status: 403 })
  }

  await prisma.squadMessage.delete({ where: { id: messageId } })
  return NextResponse.json({ success: true })
}
