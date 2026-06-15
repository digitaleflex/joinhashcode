export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

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
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)))
    const skip = (page - 1) * limit
    const search = searchParams.get("search")?.trim() ?? ""
    const role = searchParams.get("role") ?? ""
    const status = searchParams.get("status") ?? ""
    const fraudLevel = searchParams.get("fraudLevel") ?? ""

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { pseudo: { contains: search, mode: "insensitive" } },
      ]
    }

    if (role && role !== "ALL") {
      where.role = role
    }

    if (status === "BANNED") {
      where.banned = true
    } else if (status === "ACTIVE") {
      where.banned = { not: true }
    }

    if (fraudLevel === "NORMAL") {
      where.fraudRiskScore = { lte: 30 }
    } else if (fraudLevel === "SURVEILLANCE") {
      where.fraudRiskScore = { gte: 31, lte: 60 }
    } else if (fraudLevel === "MANUAL_REVIEW") {
      where.fraudRiskScore = { gte: 61, lte: 80 }
    } else if (fraudLevel === "BLOCKED") {
      where.fraudRiskScore = { gte: 81 }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          pseudo: true,
          role: true,
          level: true,
          banned: true,
          createdAt: true,
          fraudRiskScore: true,
          experience: true,
          image: true,
          class: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, limit })
  } catch (error: unknown) {
    console.error("[ADMIN_USERS_GET]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
