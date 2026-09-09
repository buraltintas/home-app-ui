import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // The default bottom-left corner is where the mobile navigation lives, so the
  // development indicator covers the first item and makes the bar untestable.
  devIndicators: { position: "top-right" },
  // Google account pictures. Somebody who signs in with Google arrives with the avatar
  // they already use, and the host it is served from has to be named before a browser
  // will be pointed at it. Nothing else is allowed through.
  images: { remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }] },
};

export default nextConfig;
