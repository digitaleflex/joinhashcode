export interface IpReputationResult {
  score: number
  vpn: boolean
  proxy: boolean
  tor: boolean
  datacenter: boolean
  mobile: boolean
  isp: string
  org: string
  countryCode: string
  region: string
  city: string
  error?: string
}

// ProxyD response types
interface ProxyDFlags {
  anonblock: boolean
  proxy: boolean
  vpn: boolean
  cdn: boolean
  public_wifi: boolean
  rangeblock: boolean
  school_block: boolean
  tor: boolean
  webhost: boolean
}

interface ProxyDResponse {
  found: boolean
  query: string
  flags: ProxyDFlags
}

const PROXYD_URL = process.env.PROXYD_URL ?? "http://127.0.0.1:7891"
const PROXYD_ENABLED = !!process.env.PROXYD_URL || process.env.NODE_ENV !== "production"

export async function checkIpReputation(ip: string): Promise<IpReputationResult | null> {
  if (!PROXYD_ENABLED) return null
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) return null

  try {
    const res = await fetch(`${PROXYD_URL}/v1/ip/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) {
      console.warn("[IP_REPUTATION] ProxyD error:", res.status)
      return null
    }

    const data: ProxyDResponse = await res.json()

    return {
      score: data.found ? 85 : 0,
      vpn: data.flags.vpn ?? false,
      proxy: data.flags.proxy ?? false,
      tor: data.flags.tor ?? false,
      datacenter: data.flags.webhost ?? false,
      mobile: false,
      isp: "",
      org: "",
      countryCode: "",
      region: "",
      city: "",
    }
  } catch (err) {
    console.warn("[IP_REPUTATION] ProxyD unreachable:", err)
    return null
  }
}
