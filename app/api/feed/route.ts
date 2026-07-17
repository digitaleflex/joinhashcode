export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { formatShortRelativeTime } from "@/lib/dates"

interface NeuralEvent {
  id: string
  type: "MISSION_SUBMISSION" | "LEVEL_UP" | "SQUAD_CREATED" | "USER_JOINED"
  user: { name: string; avatar?: string | null; class?: string | null }
  meta?: string
  timestamp: string
}



export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

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
            progress: { select: { level: true } },
          }
        }
      }
    })

    const events: NeuralEvent[] = logs.map((log) => {
      let type: NeuralEvent["type"] = "USER_JOINED"
      let meta = ""

      if (log.action === "MISSION_APPROVED") {
        type = "MISSION_SUBMISSION"
        meta = (log.metadata as Record<string, unknown>)?.missionId as string || "une mission"
      } else if (log.action === "SQUAD_CREATED") {
        type = "SQUAD_CREATED"
        meta = (log.metadata as Record<string, unknown>)?.name as string || "une nouvelle unité"
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
        timestamp: formatShortRelativeTime(new Date(log.createdAt)),
      }
    })

    // Also inject some "Level Up" events if not in logs (or fetch them from XP updates)
    // For now, we take the top 5 most recent from the filtered logs
    const finalEvents = events.slice(0, 5)

    return NextResponse.json({ events: finalEvents }, {
      headers: { "Cache-Control": "private, no-cache" },
    })
  } catch (error: unknown) {
    console.error("[FEED_GET]", error)
    return NextResponse.json({ events: [] }, { status: 500, headers: { "Cache-Control": "private, no-cache" } })
  }
}
