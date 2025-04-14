/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        port: "54331",
      },
    ],
  },
};

export default nextConfig;
