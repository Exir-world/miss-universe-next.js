import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_GAME_NAME: process.env.NEXT_PUBLIC_GAME_NAME,
    NEXT_GAME_NAME: process.env.NEXT_GAME_NAME,
    NEXT_REFERRAL_URL: process.env.NEXT_REFERRAL_URL,
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["token.ex.pro"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
