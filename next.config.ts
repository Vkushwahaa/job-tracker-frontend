import type { NextConfig } from "next";
const proxy = process.env.NEXT_PUBLIC_API_URL || "";
const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: proxy,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
