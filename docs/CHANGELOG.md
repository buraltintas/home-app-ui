# Changelog — web

What has changed and why, newest first. Written for whoever picks this up next.

**No secrets here.** No keys, addresses, codes or deployment values appear in this file.
Where a change was security-relevant it is described by its effect, never by repeating the
value involved.

---

## Taking the location permission away now means something

- Reported from the live site: revoke the permission, and the site still knows where you
  are. It was true. Nothing read the device again — the browser refuses — but two copies
  were kept in the visitor's own storage: the last fix, for six hours, and the chosen
  discovery location, indefinitely. We were answering from those.
- From the outside that is indistinguishable from continuing to track somebody who asked us
  to stop, and the only honest reading of a withdrawn permission is that we stop using what
  it gave us. Both device-derived copies are dropped the moment the permission goes,
  watched live through the Permissions API and checked again on load — a person may have
  revoked it in another tab, or yesterday.
- A place somebody typed themselves is left alone. That was never the device's to give, so
  revoking the device permission says nothing about it.


## A way through to Google, on purpose

- Store pages and result rows carry a **See on Google Maps** link beside the Google block.
  Deliberately a link of its own rather than making the rating clickable: a clickable rating
  gets pressed by accident, so somebody reading a number ends up on another site without
  meaning to. This gets pressed on purpose.
- No directions link on the result row. A list is where somebody is still choosing;
  directions belong on the page for the store they chose. The Google link is different — it
  answers "is this place real, is it open", which is a question people ask while deciding.


## The location error moved to where people look

- It used to sit at the bottom of the panel, under the button that had just appeared to do
  nothing. People pressed "use my location", saw no change, and never read the sentence
  explaining why. It leads the panel now, full width, and carries a **Try again** button —
  previously somebody who fixed their browser setting came back to the page with no way
  forward except guessing.
- When the browser has *blocked* location — the one case where "press Allow" is wrong
  advice, because it will never ask again — the box also shows where the address bar keeps
  its lock. Drawn rather than screenshotted: a screenshot of Chrome stops being true the
  next time Chrome moves something. Shown only in that case; offered when the browser
  simply has not asked yet, it sends somebody hunting for a lock that will do nothing.
- `npm run build` was failing on the type-check step with a heap exhaustion, before any of
  this and unrelated to it — the project has outgrown Node's default heap. Both `build` and
  `typecheck` now ask for more, so the check the contributing rules require can actually be
  run.


## Documentation rule

- `AGENTS.md` now states what this file is for and when it must be written: every change a
  person would want explained later, newest first, in the same commit as the change. Not a
  list of files touched — what changed and why it was worth changing, because "fixed the
  search" tells the next person nothing. The same rule is in the API and mobile
  repositories, each pointing at the documents that are load-bearing there.


## Admin panel, paid placement, contributor levels

- **Admin panel** at `/admin`, in its own route group with its own root layout — no site
  header, footer or locale provider, because administration is a different job from
  browsing and sharing the chrome makes it easy to forget which you are looking at. Tabs:
  overview, searches, stores, users, reviews, audit log.
- Kept out of search in three places, since one is easy to undo by accident: page metadata
  (`noindex`), a `robots.txt` disallow, and an exclusion in the proxy matcher so it is
  never locale-rewritten.
- Access is decided by the backend, not by hiding UI. A visitor without permission gets the
  same message whether they are signed out or simply not an administrator, because the API
  answers 404 rather than 403 and repeating that distinction here would give it away.
- **Paid placement** — promoted stores lead results in the searcher's own city and carry a
  visible "Öne çıkarılmış" label. The label is not decoration: `/about` and `/terms` state
  that paid placement is marked wherever it applies, and shipping the ranking without the
  badge would make a published document false.
- **Contributor levels** — five tiers by published review count, shown next to the author
  in the feed and on profiles. Level 0 renders nothing rather than announcing a demotion.

## Legal and trust pages

- Twelve documents in Turkish, English, German and Russian, plus a legal hub and a grouped
  footer. Content is held as data so all four languages fill the same sections in the same
  order; a translation that quietly gains or loses a clause is a different contract.
- `src/lib/legal-facts.ts` is the single source for company and contact details, with
  unknown values as `null` and no placeholder strings anywhere.
- The sign-in dialog separates contract acceptance from the privacy notice rather than
  merging them into "by continuing you agree to everything", and bundles no marketing
  consent.
- Three places where the honest text differs from a template: the location page does not
  claim precise coordinates go unstored, because a location you save is stored precisely;
  the deletion page states that the email address outlives deletion and why; the moderation
  text describes an inbox a person reads, because that is all that exists.

## SEO and locale routing

- Every page now states its own canonical. The root layout previously set `canonical:'/'`
  and, because metadata cascades, every store, review and profile page inherited it and
  declared itself a duplicate of the homepage.
- Locale moved from a cookie into the URL. Turkish stays unprefixed and canonical;
  `/en`, `/de`, `/ru` are real addresses. Googlebot sends no cookies, so previously every
  crawl saw Turkish and three finished translations were unreachable to search engines.
- Sitemap enumerates stores with real `lastmod` in every language; sign-in-only routes are
  excluded and carry `noindex`. It went from five URLs to several hundred.
- Structured data: `Organization`/`WebSite` on the homepage, `Store` with breadcrumbs on
  store pages, `Review` on reviews, `WebPage` on legal documents. `AggregateRating` is built
  only from community reviews — republishing another site's ratings as your own is what the
  guidelines forbid, and a store with no reviews emits no rating rather than a zero.
- Share previews: a purpose-built 1200×630 image at `/og`, and descriptions that end at a
  sentence instead of a raw character slice.
- The homepage feed is read on the server, so the first response carries real reviews.

## Interface fixes

- Profile and favourites showed the signed-out screen before the session resolved, so a
  signed-in visitor was briefly told they had no favourites. Both now show a loading state.
- The header treated any failed session read as being signed out, so one failure during a
  token refresh blanked the avatar until a full page reload. Only a definitive 401 counts
  now, and the session is re-read on navigation.
- The footer floated mid-page on short pages; the page column now fills the viewport.
- The review page's manual location panel had no CSS at all and rendered as unstyled text.

## Search

- Results are ordered near to far, so searching without a location now asks for one instead
  of running a query that cannot tell a nearby store from a distant one.

---

## Known follow-ups

- Store slugs created before Turkish letters were folded are still mangled; they resolve
  correctly but do not read well. A backfill would change those URLs.
- ISR is not enabled on store pages: they carry per-viewer state (favourites, likes), so
  caching them would show one visitor another's state.
