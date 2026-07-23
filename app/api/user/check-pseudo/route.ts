import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionSafe } from "@/lib/get-session-safe"

export async function GET(request: NextRequest) {
  const session = await getSessionSafe()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pseudo = request.nextUrl.searchParams.get("pseudo")
  if (!pseudo || pseudo.length < 3) {
    return NextResponse.json({ available: false }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: { pseudo },
    select: { id: true },
  })

  return NextResponse.json({ available: !existing })
}
