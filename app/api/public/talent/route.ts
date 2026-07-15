import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profile = searchParams.get("profile")
  const country = searchParams.get("country")
  const minLevel = searchParams.get("minLevel")

  const where: Record<string, unknown> = {
    class: { not: null },
    pseudo: { not: null },
    talentVisible: true,
    missionsCompletedCount: { gte: 1 },
  }

  if (profile && ["builder", "creator", "strategist", "catalyst"].includes(profile)) {
    where.class = profile
  }

  if (country) {
    where.country = country
  }

  if (minLevel) {
    const level = parseInt(minLevel, 10)
    if (!isNaN(level)) {
      where.progress = { level: { gte: level } }
    }
  }

  const users = await prisma.user.findMany({
    where: where as any,
    select: {
      pseudo: true,
      class: true,
      country: true,
      city: true,
      bio: true,
      tools: true,
      socials: { select: { githubUrl: true, portfolioUrl: true, linkedinUrl: true } },
      progress: { select: { level: true, missionsCompletedCount: true } },
    },
    orderBy: [{ progress: { missionsCompletedCount: "desc" } }, { progress: { level: "desc" } }],
    take: 50,
  })

  const talents = users.map((u) => ({
    pseudo: u.pseudo,
    class: u.class,
    country: u.country,
    city: u.city,
    bio: u.bio,
    tools: u.tools ?? [],
    level: u.progress?.level ?? 1,
    missionsCompleted: u.progress?.missionsCompletedCount ?? 0,
    githubUrl: u.socials?.githubUrl ?? null,
    portfolioUrl: u.socials?.portfolioUrl ?? null,
    linkedinUrl: u.socials?.linkedinUrl ?? null,
  }))

  return NextResponse.json(talents, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  })
}
