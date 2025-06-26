/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xcwrhyjbfgzsaslstssc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.mubicdn.net",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54338",
      },
    ],
  },
};

export default nextConfig;
