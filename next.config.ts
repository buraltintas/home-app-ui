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
  // The sitemap is an index over several files now, and Next reserves the name
  // /sitemap.xml for its own metadata route while generating nothing there. That address
  // is the one Search Console holds and the one robots.txt has advertised since the site
  // launched, so it is kept working rather than allowed to become a 404.
  async redirects() {
    return [{ source: "/sitemap.xml", destination: "/sitemap-index.xml", permanent: true }];
  },
};

export default nextConfig;
