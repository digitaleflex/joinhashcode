/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect www → non-www (canonical = joinhashcode.com, matching BETTER_AUTH_URL)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.joinhashcode.com" }],
        destination: "https://joinhashcode.com/:path*",
        permanent: true,
      },
    ];
  },
}

export default nextConfig
