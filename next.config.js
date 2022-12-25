/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co"],
    remotePatterns: [{ hostname: "i.ibb.co", protocol: "https" }],
  },
};

module.exports = nextConfig;
