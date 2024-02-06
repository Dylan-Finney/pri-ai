/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    MY_SECRET: "TESTING123",
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
