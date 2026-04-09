import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    domains: ['toonsutra-assets-cdn.toonsutra.com'],
  },
};

export default nextConfig;
