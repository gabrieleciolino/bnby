import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xvjeccwizteesiefjzaf.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.muscache.com",
      },
    ],
  },
};

export default nextConfig;
