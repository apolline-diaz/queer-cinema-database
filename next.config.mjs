/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "media.themoviedb.org",
        },
        {
          protocol: "https",
          hostname: "xcwrhyjbfgzsaslstssc.supabase.co",
        },
      ],
    },
  };
  
  export default nextConfig;
  