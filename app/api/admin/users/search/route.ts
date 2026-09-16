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
    const q = searchParams.get("q")?.trim() ?? ""
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10))

    if (!q || q.length < 2) {
      return NextResponse.json({ users: [], total: 0 })
    }

    const where = {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { pseudo: { contains: q, mode: "insensitive" as const } },
        { email: { contains: q, mode: "insensitive" as const } },
        { class: { contains: q, mode: "insensitive" as const } },
        { country: { contains: q, mode: "insensitive" as const } },
      ],
    }

    const [rawUsers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          pseudo: true,
          class: true,
          country: true,
          createdAt: true,
          currentStreak: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ])

    const users = rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      pseudo: u.pseudo,
      class: u.class,
      country: u.country,
      createdAt: u.createdAt,
      currentStreak: u.currentStreak ?? 0,
    }))

    return NextResponse.json({ users, total })
  } catch (error: unknown) {
    console.error("[ADMIN_USERS_SEARCH_GET]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}