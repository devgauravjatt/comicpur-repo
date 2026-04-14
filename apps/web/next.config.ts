import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.1.104'],
};

export default nextConfig;
