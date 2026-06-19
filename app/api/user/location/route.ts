export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { headers as nextHeaders } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/api-error-handler"
import { saveUserLocation } from "@/lib/location"
import { getClientIp } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await nextHeaders() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const body = await req.json()
    const { latitude, longitude, accuracy } = body

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json({ message: "latitude et longitude requis (numbers)" }, { status: 400 })
    }

    const requestHeaders = await nextHeaders()
    const ip = getClientIp(requestHeaders)
    await saveUserLocation(session.user.id, { latitude, longitude, accuracy: accuracy ?? 0 }, ip)

    return NextResponse.json({ saved: true })
  } catch (error: unknown) {
    return handleApiError(error, "LOCATION_SAVE")
  }
}
