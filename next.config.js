/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "wujacgzqqczonhruxjan.supabase.co"],
    remotePatterns: [
      { hostname: "i.ibb.co", protocol: "https" },
      { hostname: "wujacgzqqczonhruxjan.supabase.co", protocol: "https" },
    ],
  },
};

module.exports = nextConfig;
