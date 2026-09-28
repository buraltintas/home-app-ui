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
  // The site answered with no security headers at all, measured against the live domain.
  // Two of the six below are not theoretical here: the page could be framed, and it holds
  // one-tap actions behind a session; and this product asks for the visitor's location, so
  // saying who may ask for it is our business rather than a formality.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/sitemap/:id.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // geolocation is (self), not (): the product's own reason for existing is to
          // list what is near you. What this refuses is anything embedded asking on our
          // behalf.
          { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()" },
          // Reporting first, enforcing later, and deliberately so: Next emits inline
          // script and style, so an enforcing policy needs a nonce on every one of them
          // and a policy written wrong breaks the site silently. This one blocks nothing
          // and names what would be blocked, in the browser's console, under real traffic.
          //
          // The list is short because it was measured rather than guessed: typefaces are
          // served from our own origin by next/font, and the only thing loaded from
          // anywhere else is Google's sign-in script.
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://accounts.google.com",
              // accounts.google.com for the sign-in widget's own stylesheet, which the
              // report-only run caught on its first day: enforcing the policy without it
              // would have shipped an unstyled Google button and nothing would have said why.
              "style-src 'self' 'unsafe-inline' https://accounts.google.com",
              "img-src 'self' data: blob: https://lh3.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' https://accounts.google.com",
              "frame-src https://accounts.google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
