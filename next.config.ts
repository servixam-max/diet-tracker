import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Tailscale access in development
  allowedDevOrigins: ['100.126.164.101', 'localhost'],
  
  // Enable static exports for PWA
  output: 'standalone',
};

export default nextConfig;
