/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // Génère un serveur Node.js autonome (image Docker légère)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    const headers = [
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
      {
        key: "Content-Security-Policy",
        value: `
          default-src 'self';
          script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live https://*.vercel.live https://static.cloudflareinsights.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://*.vercel.live;
          img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.qrserver.com https://vercel.live https://*.vercel.live https://vercel.com;
          font-src 'self' data: https://fonts.gstatic.com https://vercel.live https://*.vercel.live;
          connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel.live;
          frame-src 'self' https://vercel.live https://*.vercel.live;
          frame-ancestors 'none';
          upgrade-insecure-requests;
        `.replace(/\s{2,}/g, " ").trim(),
      },
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
}

export default nextConfig
