/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { runtime: "edge" },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
module.exports = nextConfig;
