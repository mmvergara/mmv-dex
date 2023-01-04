/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "gzqicwnrxaguhmzvujut.supabase.co", protocol: "https" }],
  },
};

module.exports = nextConfig;
