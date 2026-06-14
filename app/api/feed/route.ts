export const dynamic = 'force-dynamic'
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

  if (diffMinutes < 1) return `maintenant`
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}j`
}

export async function GET() {
  try {
    // Fetch latest relevant activity logs
    const logs = await prisma.activityLog.findMany({
      where: {
        action: {
          in: ["USER_SIGNUP", "MISSION_APPROVED", "SQUAD_CREATED"]
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            pseudo: true,
            image: true,
            class: true,
            level: true
          }
        }
      }
    })

    const events: NeuralEvent[] = logs.map((log) => {
      let type: NeuralEvent["type"] = "USER_JOINED"
      let meta = ""

      if (log.action === "MISSION_APPROVED") {
        type = "MISSION_SUBMISSION"
        meta = (log.metadata as any)?.missionId || "une mission"
      } else if (log.action === "SQUAD_CREATED") {
        type = "SQUAD_CREATED"
        meta = (log.metadata as any)?.name || "une nouvelle unité"
      }

      return {
        id: log.id,
        type,
        user: {
          name: log.user?.pseudo ?? log.user?.name ?? "Agent",
          avatar: log.user?.image,
          class: log.user?.class,
        },
        meta,
        timestamp: formatRelativeTime(log.createdAt),
      }
    })

    // Also inject some "Level Up" events if not in logs (or fetch them from XP updates)
    // For now, we take the top 5 most recent from the filtered logs
    const finalEvents = events.slice(0, 5)

    return NextResponse.json({ events: finalEvents }, {
      headers: { "Cache-Control": "private, no-cache" },
    })
  } catch (_) {
    console.error("[FEED_GET]", error)
    return NextResponse.json({ events: [] }, { status: 500, headers: { "Cache-Control": "private, no-cache" } })
  }
}
