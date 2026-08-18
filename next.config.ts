import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // The default bottom-left corner is where the mobile navigation lives, so the
  // development indicator covers the first item and makes the bar untestable.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
