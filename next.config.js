/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      `${process.env.REACT_APP_AWS_IMAGES_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com`,
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    MY_ACCESS_KEY: process.env.REACT_APP_MY_ACCESS_KEY,
    MY_SECRET_KEY: process.env.REACT_APP_MY_SECRET_KEY,
    NEXT_PUBLIC_USER_ID: process.env.REACT_APP_USER_ID,
    MY_REGION: process.env.REACT_APP_MY_REGION,
    AI_BUCKET: process.env.REACT_APP_AI_BUCKET,
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
