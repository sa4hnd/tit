/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the experimental section as it's no longer needed

  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
