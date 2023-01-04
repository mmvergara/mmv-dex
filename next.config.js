/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "gzqicwnrxaguhmzvujut.supabase.co", protocol: "https" }],
    minimumCacheTTL:60
  },
};

module.exports = nextConfig;
