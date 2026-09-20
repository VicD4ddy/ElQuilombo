import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @ts-ignore - Next.js 16 internal flag to disable root agent files generation
  agentRules: false,
};

export default nextConfig;
