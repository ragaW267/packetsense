import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@packetsense/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
