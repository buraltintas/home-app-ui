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
  // The sitemap parts are dynamic routes, because the catalogue cannot be reached from the
  // container the site is built in. Dynamic also means Next sends them with no shared cache,
  // so every read walks eleven thousand shops again -- and a crawler reading six parts asks
  // for that six times. The documents change once an hour at most, so they are cached at the
  // edge for an hour and served stale for a day while the next one is built. The index
  // already had this; the parts lost it when they were made dynamic.
  async headers() {
    return [{
      source: "/sitemap/:id.xml",
      headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" }],
    }];
  },
};

export default nextConfig;
