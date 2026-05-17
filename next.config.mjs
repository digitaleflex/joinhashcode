/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    const raw = process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com";
    const parsed = new URL(raw);
    // Always strip www — canonical is always non-www
    const nonWwwHost = parsed.host.replace(/^www\./, "");
    const nonWwwBase = `${parsed.protocol}//${nonWwwHost}`;
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${nonWwwHost}` }],
        destination: `${nonWwwBase}/:path*`,
        permanent: true,
      },
    ];
  },
}

export default nextConfig
