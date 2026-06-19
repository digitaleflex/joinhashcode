/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // Génère un serveur Node.js autonome (image Docker légère)
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async headers() {
    const headers = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate, no-cache",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      // SEC-010: CSP is now set dynamically per-request in middleware.ts (with nonce).
      // Static CSP here would override the nonce-based one from middleware for matched routes.
      // Public routes (/, /signin, /invite/*) are covered by the middleware matcher expansion below.
    ]

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
    const isLocal = appUrl.includes("localhost") || appUrl.includes("127.0.0.1") || process.env.NODE_ENV !== "production"
    if (!isLocal) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      })
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/cgu",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/mentions-legales",
        destination: "/legal",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
