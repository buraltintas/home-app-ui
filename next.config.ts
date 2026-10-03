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
  // The sitemap is an index over several files (app/sitemap-index.xml naming the parts that
  // app/sitemap/[part] writes). /sitemap.xml is the address Search Console holds and the one
  // robots.txt advertised when the site launched, so it redirects to the index rather than
  // becoming a 404 -- to an absolute address, so that on www it is one hop and not two.
  async redirects() {
    return [
      { source: "/sitemap.xml", destination: "https://bosagezme.com/sitemap-index.xml", permanent: true },
      // One host. www.bosagezme.com was answering every page itself, with a canonical
      // pointing at the bare domain: Search Console listed it as an alternate page and
      // Googlebot spent 233 requests on it in three months. A permanent redirect says the
      // same thing once, for every path, before anything is rendered.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bosagezme.com" }],
        destination: "https://bosagezme.com/:path*",
        permanent: true,
      },
    ];
  },
  // The sitemap parts are dynamic routes, because the catalogue cannot be reached from the
  // container the site is built in. Their shared cache (an hour, a day stale) is set by the
  // route that writes them, app/sitemap/[part], beside the compression it also does.
  //
  // The site answered with no security headers at all, measured against the live domain,
  // and announced what it runs on besides. Two of the six added below are not theoretical
  // here: the page could be framed while holding one-tap actions behind a session, and
  // this product asks for the visitor's location, so saying who may ask for it is our
  // business rather than a formality.
  poweredByHeader: false,
  async headers() {
    // One policy, written once, sent as the rule and named in the report address. Two
    // copies of a list this long drift, and a report about a directive the live policy no
    // longer carries is worse than no report.
    // Development needs one thing production does not. React's dev build calls eval() to
    // rebuild callstacks for its error overlay, and Next's dev bundler serves modules the
    // same way; enforcing without it leaves a developer with a broken overlay and a
    // console message about a header they did not know was there. Production never does
    // this, and the shipped policy is the one without it.
    const evalForDev = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const policy = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${evalForDev} https://accounts.google.com`,
      "style-src 'self' 'unsafe-inline' https://accounts.google.com",
      "img-src 'self' data: blob: https://lh3.googleusercontent.com",
      "font-src 'self'",
      "connect-src 'self' https://accounts.google.com",
      "frame-src https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      // Where a violation goes. Without this the browser writes it to the console of
      // whoever it happened to and nowhere else, which is how a day of report-only
      // produced exactly one finding -- the one somebody was watching for.
      //
      // Both spellings, because browsers disagree about which one exists: report-uri is
      // the one Firefox implements and Chrome still honours, report-to is the one Chrome
      // prefers and needs the Reporting-Endpoints header below. Either arriving is enough.
      "report-uri /api/csp-report",
      "report-to csp-endpoint",
    ].join("; ");
    return [
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
          // Names the address "report-to" above refers to. Relative, so it resolves against
          // whichever host served the page rather than pinning one.
          { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
          // Now enforcing, and the list is short because it was measured rather than
          // guessed: typefaces are served from our own origin by next/font, and the only
          // thing loaded from anywhere else is Google's sign-in script and the stylesheet
          // that widget fetches beside it -- which report-only caught on its first day, and
          // which enforcing without would have shipped an unstyled Google button with
          // nothing anywhere saying why.
          //
          // 'unsafe-inline' stays, and that is a decision rather than an oversight. Next
          // emits inline script and style on every page; removing it needs a nonce, a
          // nonce has to differ per request, and a page carrying one cannot be served from
          // cache -- which would turn every statically served page on this site dynamic to
          // buy one directive. What is bought without it is still most of the value:
          // nothing may be framed, no base tag may be rewritten, no form may post
          // elsewhere, no plugin may load, and no script, style, image, font or connection
          // may come from an origin not named here. The nonce is a separate piece of work,
          // and the reports below are what will say whether it is worth its cost.
          {
            key: "Content-Security-Policy",
            value: policy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
