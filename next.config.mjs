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
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.joinhashcode.com" }],
        destination: "https://joinhashcode.com/:path*",
        permanent: false,
      },
    ];
  },
}

export default nextConfig
