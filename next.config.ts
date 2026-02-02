import type { NextConfig } from "next";

const API = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API}/api/:path*`, // ← REQUIRED
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
