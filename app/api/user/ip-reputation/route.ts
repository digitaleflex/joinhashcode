export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/api-error-handler"
import { checkIpReputation } from "@/lib/ip-reputation"
import { addFraudSignal } from "@/lib/fraud-score"
import { getClientIp } from "@/lib/utils"

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const ip = getClientIp({ headers: await headers() } as any)
    if (!ip) return NextResponse.json({ checked: false, reason: "IP non identifiable" })

    const result = await checkIpReputation(ip)
    if (!result) return NextResponse.json({ checked: false, reason: "Service indisponible" })

    if (result.vpn || result.proxy || result.tor || result.datacenter) {
      const points = result.tor ? 25 : result.vpn ? 20 : result.proxy ? 20 : 15
      const flags: string[] = []
      if (result.vpn) flags.push("VPN")
      if (result.proxy) flags.push("PROXY")
      if (result.tor) flags.push("TOR")
      if (result.datacenter) flags.push("DATACENTER")

      await addFraudSignal(
        session.user.id,
        {
          name: flags.length > 1 ? "MULTIPLE_RISK_FLAGS" : `${flags[0]}_DETECTED`,
          points,
          details: `IP ${ip}: ${flags.join(", ")} (ISP: ${result.isp}, score: ${result.score})`,
        },
        { ip, visitorId: undefined }
      )
    }

    return NextResponse.json({
      checked: true,
      fraudScore: result.score,
      vpn: result.vpn,
      proxy: result.proxy,
      tor: result.tor,
      datacenter: result.datacenter,
      countryCode: result.countryCode,
      isp: result.isp,
    })
  } catch (error: unknown) {
    return handleApiError(error, "IP_REPUTATION_CHECK")
  }
}
