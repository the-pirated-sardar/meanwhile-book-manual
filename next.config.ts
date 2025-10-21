import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // let Vercel/CI build even if ESLint errors exist
  },
};

export default nextConfig;
