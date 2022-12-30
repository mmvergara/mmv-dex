/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "uihtchzqrnrbhgykntqe.supabase.co"],
    remotePatterns: [
      { hostname: "i.ibb.co", protocol: "https" },
      { hostname: "uihtchzqrnrbhgykntqe.supabase.co", protocol: "https" },
    ],
  },
};

module.exports = nextConfig;
