import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)))
    const skip = (page - 1) * limit
    const status = searchParams.get("status") ?? ""
    const squadId = searchParams.get("squadId") ?? ""
    const dateFrom = searchParams.get("dateFrom") ?? ""
    const dateTo = searchParams.get("dateTo") ?? ""

    const where: Record<string, unknown> = {}

    if (status && status !== "ALL") {
      where.status = status
    }

    if (squadId) {
      where.organizationId = squadId
    }

    if (dateFrom || dateTo) {
      const createdAtFilter: Record<string, Date> = {}
      if (dateFrom) createdAtFilter.gte = new Date(dateFrom)
      if (dateTo) createdAtFilter.lte = new Date(dateTo)
      where.createdAt = createdAtFilter
    }

    const [rawRequests, total] = await Promise.all([
      prisma.joinRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              pseudo: true,
              email: true,
              class: true,
              image: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.joinRequest.count({ where }),
    ])

    const requests = rawRequests.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.createdAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        pseudo: r.user.pseudo,
        email: r.user.email,
        class: r.user.class,
        image: r.user.image,
      },
      squad: {
        id: r.organization.id,
        name: r.organization.name,
        slug: r.organization.slug,
      },
    }))

    return NextResponse.json({ requests, total, page, limit })
  } catch (error: unknown) {
    console.error("[ADMIN_SQUADS_JOIN_REQUESTS_GET]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    const body = await req.json()
    const { requestIds, action } = body

    if (!Array.isArray(requestIds) || requestIds.length === 0) {
      return NextResponse.json({ message: "requestIds requis (tableau non vide)" }, { status: 400 })
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ message: "action doit être 'accept' ou 'reject'" }, { status: 400 })
    }

    const requests = await prisma.joinRequest.findMany({
      where: { id: { in: requestIds }, status: "PENDING" },
      include: { organization: { include: { _count: { select: { members: true } } } } },
    })

    if (requests.length === 0) {
      return NextResponse.json({ message: "Aucune demande en attente trouvée" }, { status: 404 })
    }

    const results = await prisma.$transaction(async (tx) => {
      const processed = []

      for (const request of requests) {
        if (action === "accept") {
          if (request.organization._count.members >= 5) {
            processed.push({ id: request.id, success: false, error: "Escouade complète (5/5)" })
            continue
          }

          const existingMember = await tx.member.findFirst({
            where: { userId: request.userId },
          })
          if (existingMember) {
            processed.push({ id: request.id, success: false, error: "Utilisateur déjà dans une escouade" })
            continue
          }

          await tx.$transaction([
            tx.joinRequest.update({ where: { id: request.id }, data: { status: "ACCEPTED" } }),
            tx.member.create({
              data: {
                id: crypto.randomUUID(),
                userId: request.userId,
                organizationId: request.organizationId,
                role: "member",
                createdAt: new Date(),
              },
            }),
          ])
          processed.push({ id: request.id, success: true })
        } else {
          await tx.joinRequest.update({ where: { id: request.id }, data: { status: "REJECTED" } })
          processed.push({ id: request.id, success: true })
        }
      }

      return processed
    })

    return NextResponse.json({ results })
  } catch (error: unknown) {
    console.error("[ADMIN_SQUADS_JOIN_REQUESTS_PATCH]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}