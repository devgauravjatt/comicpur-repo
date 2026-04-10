import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    // domains: ['toonsutra-assets-cdn.toonsutra.com'], i.ibb.co, https://iili.io/BEx8hCJ.jpg
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
      {
        protocol: 'https',
        hostname: 'toonsutra-assets-cdn.toonsutra.com',
      },
    ],
  },
};

export default nextConfig;
