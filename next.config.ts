import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "cross-origin-isolated=*",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.PREVIEW_URL as string,
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: process.env.PREVIEW_ENVIRONMENT === "true",
  },
  images: {
    domains: ["images.pexels.com", "www.pexels.com"],
  },
  output: "standalone",
};

export default nextConfig;
