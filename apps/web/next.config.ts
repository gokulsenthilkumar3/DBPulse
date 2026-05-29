import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@dbpulse/shared', '@dbpulse/diff-engine'],
};

export default nextConfig;
