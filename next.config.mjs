/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    const canonicalUrl = process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com";
    const canonicalHost = new URL(canonicalUrl).host;
    const wwwHost = canonicalHost.startsWith("www.") ? canonicalHost : `www.${canonicalHost}`;
    return [
      // Redirect www → non-www (canonical matches BETTER_AUTH_URL / NEXT_PUBLIC_APP_URL)
      {
        source: "/:path*",
        has: [{ type: "host", value: wwwHost }],
        destination: `${canonicalUrl}/:path*`,
        permanent: true,
      },
    ];
  },
}

export default nextConfig
