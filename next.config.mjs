/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live https://*.vercel.live;
              style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live;
              img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.qrserver.com https://vercel.live https://*.vercel.live https://vercel.com;
              font-src 'self' data: https://vercel.live https://*.vercel.live;
              connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel.live;
              frame-src 'self' https://vercel.live https://*.vercel.live;
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
