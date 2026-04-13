import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
