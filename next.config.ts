// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // or false, depending on your preference
  images: {
    remotePatterns: [
      {
        protocol: 'https', // The protocol (http or https)
        hostname: '*', // Changed to allow ANY hostname (use with caution)
        port: '', // Leave empty unless a specific port is used
        pathname: '/**', // Allow any path on any hostname
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;