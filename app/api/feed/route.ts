import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface NeuralEvent {
  id: string
  type: "MISSION_SUBMISSION" | "LEVEL_UP" | "SQUAD_CREATED" | "USER_JOINED"
  user: { name: string; avatar?: string | null; class?: string | null }
  meta?: string
  timestamp: string
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}j`
}

export async function GET() {
  try {
    const [submissions, users] = await Promise.all([
      prisma.missionSubmission.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          missionId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              pseudo: true,
              image: true,
              class: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          pseudo: true,
          image: true,
          class: true,
          createdAt: true,
        },
      }),
    ])

    const submissionEvents: NeuralEvent[] = submissions.map((s) => ({
      id: `sub_${s.id}`,
      type: "MISSION_SUBMISSION",
      user: {
        name: s.user.pseudo ?? s.user.name,
        avatar: s.user.image,
        class: s.user.class,
      },
      meta: s.missionId,
      timestamp: formatRelativeTime(s.createdAt),
    }))

    const userEvents: NeuralEvent[] = users.map((u) => ({
      id: `usr_${u.id}`,
      type: "USER_JOINED",
      user: {
        name: u.pseudo ?? u.name,
        avatar: u.image,
        class: u.class,
      },
      timestamp: formatRelativeTime(u.createdAt),
    }))

    // Merge, sort by createdAt desc (we need dates for sorting then discard)
    const allWithDate = [
      ...submissions.map((s) => ({ event: submissionEvents.find((e) => e.id === `sub_${s.id}`)!, date: s.createdAt })),
      ...users.map((u) => ({ event: userEvents.find((e) => e.id === `usr_${u.id}`)!, date: u.createdAt })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map(({ event }) => event)

    return NextResponse.json({ events: allWithDate })
  } catch (error) {
    console.error("[FEED_GET]", error)
    return NextResponse.json({ events: [] }, { status: 500 })
  }
}
