/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // Génère un serveur Node.js autonome (image Docker légère)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // HEF module illustrations are local SVGs served through next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async headers() {
    // Static assets have content-hashed filenames — cache forever, never revalidate
    const staticHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ]

    // HTML pages must never be cached so a deployed build's HTML always matches
    // its chunk hashes. Otherwise a cached HTML page references old chunk URLs → 404.
    const htmlHeaders = [
      {
        key: "Cache-Control",
        value: "private, no-cache, no-store, must-revalidate",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
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
        value: "camera=(), microphone=()",
      },
    ]

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
    const isLocal = appUrl.includes("localhost") || appUrl.includes("127.0.0.1") || process.env.NODE_ENV !== "production"

    htmlHeaders.push({
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        "img-src 'self' data: blob: lh3.googleusercontent.com avatars.githubusercontent.com api.qrserver.com",
        "font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com",
        "connect-src 'self' https://cloudflareinsights.com https://cdn.jsdelivr.net https://*.pyodide.org https://pypi.org",
        "worker-src 'self' blob:",
        "frame-src 'self'",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    })

    if (!isLocal) {
      htmlHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      })
    }

    return [
      {
        source: "/_next/static/(.*)",
        headers: staticHeaders,
      },
      {
        source: "/(.*)",
        headers: htmlHeaders,
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
      {
        source: "/talent",
        destination: "/talents",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
