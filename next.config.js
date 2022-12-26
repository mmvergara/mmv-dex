/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "zquulcqpnkkwckvbxnmr.supabase.co"],
    remotePatterns: [
      { hostname: "i.ibb.co", protocol: "https" },
      { hostname: "zquulcqpnkkwckvbxnmr.supabase.co", protocol: "https" },
    ],
  },
};

module.exports = nextConfig;
