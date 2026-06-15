export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/api-error-handler"
import { addFraudSignal, checkFingerprintShared } from "@/lib/fraud-score"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { visitorId } = await req.json()
    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json({ message: "visitorId requis" }, { status: 400 })
    }

    // Check if this fingerprint is shared with another user
    const shared = await checkFingerprintShared(visitorId, session.user.id)

    // Update user's visitorId
    await prisma.user.update({
      where: { id: session.user.id },
      data: { visitorId },
    })

    // Flag if shared
    if (shared) {
      await addFraudSignal(
        session.user.id,
        {
          name: "FINGERPRINT_SHARED",
          points: 40,
          details: `visitorId ${visitorId} partagé avec un autre compte`,
        },
        { visitorId }
      )
    }

    return NextResponse.json({
      registered: true,
      shared,
      fraudRiskScore: shared ? 40 : 0,
    })
  } catch (error: unknown) {
    return handleApiError(error, "FINGERPRINT_REGISTER")
  }
}
