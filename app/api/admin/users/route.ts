export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)))
    const skip = (page - 1) * limit
    const search = searchParams.get("search")?.trim() ?? ""
    const role = searchParams.get("role") ?? ""
    const status = searchParams.get("status") ?? ""

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

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          pseudo: true,
          role: true,
          class: true,
          level: true,
          experience: true,
          banned: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, limit })
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
