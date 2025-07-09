import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_GAME_NAME: process.env.NEXT_PUBLIC_GAME_NAME,
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.citypng.com",
        port: "", // Leave this blank unless you're using a non-default port
        pathname: "/public/uploads/preview/**",
      },
      {
        protocol: "https",
        hostname: "token.ex.pro",
        port: "",
        pathname: "/**", // Allow all paths under token.ex.pro
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
