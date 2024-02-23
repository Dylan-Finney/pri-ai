/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      `${process.env.AWS_IMAGES_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MY_ACCESS_KEY: process.env.MY_ACCESS_KEY,
    MY_SECRET_KEY: process.env.MY_SECRET_KEY,
    NEXT_PUBLIC_USER_ID: process.env.NEXT_PUBLIC_USER_ID,
    MY_REGION: process.env.MY_REGION,
    AI_BUCKET: process.env.AI_BUCKET,
  },
  reactStrictMode: true,
  serverRuntimeConfig: {
    MY_SECRET: "TESTING123",
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
