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

    // Allowlist CSP (#442). Chaque domaine externe correspond à un usage réel :
    // - Pyodide (worker du playground Python, public/playground/worker.js) :
    //   chargé depuis jsDelivr, limité au chemin de la version épinglée.
    // - CodeMirror 5 (public/playground/index.html) : cdnjs, limité à la version.
    // - Google Fonts : polices Inter / JetBrains Mono du playground.
    //   (L'app principale passe par next/font, auto-hébergé.)
    // - Cloudflare Web Analytics : beacon injecté par le proxy Cloudflare.
    // - Images distantes : avatars OAuth (Google, GitHub) et QR codes,
    //   identiques à images.remotePatterns ci-dessus.
    // Les intégrations externes (LLM, sandbox, calendrier) passent par le serveur :
    // aucun domaine tiers dans connect-src, aucun iframe tiers dans frame-src.
    const PYODIDE_CDN = "https://cdn.jsdelivr.net/npm/pyodide@0.26.4/"
    const CODEMIRROR_CDN = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/"
    const REMOTE_IMAGE_HOSTS = nextConfig.images.remotePatterns
      .map(({ protocol, hostname }) => `${protocol}://${hostname}`)
      .join(" ")

    htmlHeaders.push({
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        // 'unsafe-inline' : scripts inline de Next sans nonce. 'unsafe-eval' : Pyodide (WebAssembly + FFI).
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com ${PYODIDE_CDN} ${CODEMIRROR_CDN}`,
        `style-src 'self' 'unsafe-inline' ${CODEMIRROR_CDN} https://fonts.googleapis.com`,
        `img-src 'self' data: blob: ${REMOTE_IMAGE_HOSTS}`,
        "font-src 'self' data: https://fonts.gstatic.com",
        `connect-src 'self' https://cloudflareinsights.com ${PYODIDE_CDN}`,
        "worker-src 'self' blob:",
        "object-src 'none'",
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
