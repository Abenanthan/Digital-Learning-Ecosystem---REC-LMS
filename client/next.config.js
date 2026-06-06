/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable experimental features
  experimental: {
    // Type-safe server actions
  },
};

module.exports = nextConfig;
