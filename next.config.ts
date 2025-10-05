import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-df8554bc8acd468e9312f01236ca95f5.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.wafipix.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
