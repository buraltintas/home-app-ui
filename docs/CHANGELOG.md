# Changelog — web

What has changed and why, newest first. Written for whoever picks this up next.

**No secrets here.** No keys, addresses, codes or deployment values appear in this file.
Where a change was security-relevant it is described by its effect, never by repeating the
value involved.

---

## Google worked the first time and never again

- Reported: sign-in works once or twice, then the button stops arriving and the dialog sits
  on "Google hazırlanıyor…" until it gives up. It looked like the provider throttling us.
  It was not. It was ours.
- `next/script` keeps a cache of the scripts it has already loaded, keyed by the `id` given
  to it. On a second mount it finds the id, bails out of loading, and **does not call
  `onLoad` again** -- which the source documents in as many words. The dialog unmounts when
  it closes, taking with it the only state that recorded whether the script was ready, so
  every open after the first waited for a callback that was never going to fire.
- `onReady` is the callback `next/script` documents for exactly this case and it fires on
  both paths, so it is now listened for as well. The dialog also starts ready when the
  script's object is already on the page, so the answer no longer depends on any one
  framework callback.
- Measured before and after, four opens in a single page without reloading: before, the
  first open produced the button and the second, third and fourth produced a spinner that
  never resolved; after, all four produced the button.

---

## The footer's empty space was a link

- Reported from a phone, with the blue line drawn in the empty space to the right of "Boşa
  Gezme! nedir?": pressing there navigates as though the words had been pressed.
- A footer link is a flex box inside a grid column, so it stretched to the whole column
  while its words took a third of it. Measured on the live site: the box ends at 372px and
  the text at 154px, and everything between them was the link. On a phone the column is the
  width of the screen, so most of a footer row was a target nobody could see.
- The 44px height is the touch target and stays; the width now fits the words. Verified
  against the live markup: past the text the point belongs to the list item, not the link,
  and the height is unchanged.
- An earlier fix corrected the same defect in the legal pages' table of contents. This one
  is the footer -- the same mistake in a second place, which is worth saying plainly
  because the first fix was reported as not working, and it had worked; it was simply not
  where the reader was pointing.

---

## Waiting for Google had no end

- Reported after the previous fix: the placeholder appeared and then stayed, spinning. The
  placeholder was honest about what it was doing and dishonest about how long it would do
  it -- Google's script can fail in ways that never report themselves, and the spinner said
  "still coming" for as long as the dialog stayed open.
- Measured, with the script blocked and with the script left hanging. Blocked produced both
  messages at once, "Google hazırlanıyor…" spinning underneath "Google ile giriş şu anda
  kullanılamıyor", which tells a reader nothing except that we do not know either. Hanging
  produced the spinner and nothing else, for ever.
- Waiting now ends after ten seconds and says plainly that Google is unavailable, with the
  email button already underneath it. Only one of the three states is ever on screen. A
  late arrival still wins: if the script turns up after the deadline the real button
  replaces the message.

---

## A heading that changed by itself

- Reported: the line under the search bar is sometimes "Yakınında şunlar aranmış" and
  sometimes "Bu mevsim akla gelenler" -- which is right?
- Both are. The heading names where the phrases beneath it came from: the reader's own last
  searches, then what the neighbourhood has been searching, then the season. The three
  sources are right; the timing was not. Two of them arrive over the network and the
  seasonal list does not, so the heading was chosen before the other two had answered --
  the season appeared first and was then swapped out under the reader, with nothing they
  did to cause it.
- The strip now waits until both sources have answered, counting a refusal as an answer,
  and shows a placeholder until then. The heading is chosen once and does not move.

---

## Closed stores carry the provider warning wherever they appear

- Search results and store details now read Google's explicit business status and show a
  restrained but prominent warning for a temporary or permanent closure. The warning
  points back to Google Maps before somebody travels instead of presenting an old review
  date as proof that a quiet store has closed.
- The signal travels in the same Google block on both surfaces, so a store cannot be
  flagged in a list and lose the warning when opened.

## Legal pages keep their reading size and honest link targets

- Long legal documents now state their body and list size explicitly instead of inheriting
  a smaller surrounding scale on some routes. Privacy, disclosure and the rest of the
  shared legal-document family therefore keep the same readable body rhythm.
- A table-of-contents row no longer stretches across the empty width of its grid. Only the
  visible linked heading is clickable, so pressing blank space beside it does not navigate
  unexpectedly.

## Three returned cards needed the last decision, not a new design

- The visit-distance rejection now explains both blocked outcomes—visit verification and
  review creation—and states the live configured maximum distance. The copy deliberately
  says **at most**, because saying **at least** would tell people to move farther away from
  the store while the verifier requires the opposite.
- Monthly standout stores no longer bury the review count inside the address. The selected
  quiet treatment gives the monthly count its own clay-weighted line below the place, so it
  reads as the reason for the recommendation without covering the photograph or crowding
  the mobile row.
- The location-explanation heading is a question and now carries its missing question mark.

## The Google button that was not a button yet

- Reported: "continue with Google" does nothing on the first attempt, and reloading once
  fixes it. It was not Google and it was not the browser. While Google's script is on its
  way there is no button to press, and what stood in its place was a disabled copy of the
  real one carrying the real label. On a cold cache that copy is on screen for about two
  seconds: people saw "Google ile devam et", pressed it, nothing happened. A reload hits
  the cached script, the real button is there immediately, and it works -- which is the
  whole of "it only fails the first time".
- A disabled control that is indistinguishable from a working one is worse than no control:
  it gives no cursor, no message and no reason. The placeholder now reads as work in
  progress -- muted, a spinner, no border, nothing to aim at -- and says what it is waiting
  for. It vacates the moment the real button exists rather than when the script merely
  reports itself loaded.
- It is also a sibling of Google's container now instead of a child of it. Google replaces
  the contents of that node, and React must not be holding anything inside it.

## A standout store was a name and a number

- The two monthly standouts were the only place a store appeared without its photograph.
  Read as a name and a metric they were a statistic; with the store's own picture they are
  a place somebody could walk into, which is the whole premise of the product.
- The same photograph, chosen the same way as in the result list, with the store's initial
  standing in for one that has none. The heading lost "bu ay" -- the month is already in
  the metric beside it, and saying it twice made the card read like a report.

## Back did not mean "the previous step" on the review page

- Reported from Safari: pressing back on the review page did not return to the previous
  page. The four steps of the review wizard were component state, so the browser had no
  record that a person had moved through them at all. Back was therefore answered by the
  only entry that existed, and the half-written review went with it.
- The step now lives in the address and every forward move pushes a history entry, so the
  back button and the iOS edge swipe walk the wizard backwards one step at a time and only
  leave the flow from the first step. The in-page **Geri** buttons go through history too,
  so both kinds of back agree instead of disagreeing.
- Evidence of the visit is what unlocks the rest of the flow, so a step claimed by the URL
  is honoured only once that evidence exists; a reload or a shared link is repaired back to
  the first step on entry. Step one gained a **Devam** button, because back can now land
  there after the visit has already been verified.
- Not yet confirmed as the whole of the report: the exact case was not reproducible in the
  Safari engine while signed out, from the store page, on desktop and iPhone viewports,
  with and without a locale prefix, and opening the link directly. What is fixed here is
  the defect that is provable.

## A position outlived the device that produced it

- Reported: the phone's location services are off, the browser permission is still granted,
  and the site keeps finding you. It did, and the reason was a single ignored error. The
  background watch that refreshes the position had `()=>undefined` as its failure handler,
  so every failed read was discarded and the saved copy went on answering as though the
  device were still vouching for it.
- A refusal or an unavailable device now clears the saved position and tells the screen,
  which drops what it is showing. **A timeout does not** — a fix indoors can simply take too
  long, and treating slowness as withdrawal would throw away a perfectly good location every
  time somebody walks into a shop.
- Both directions are checked: device off clears it, timeout keeps it.


## The store's own website, and a button that sits in its frame

- Store pages show the shop's website where Google publishes one. Not a social account:
  Google has no such field — checked, asking for one is a 400 — and guessing a handle from
  a shop's name would put somebody else's Instagram on the page. There are seven different
  businesses called "Taç" in this catalogue.
- **`.button` had no vertical centring.** On a `<button>` the browser does it; on an
  `<a class="button">` it does not, so the label sat high in a 48px box. Reported on the new
  "add the first one" link, and it would have happened to every future link styled as a
  button. Fixed on the class rather than the instance.
- Google sign-in is set to use FedCM. Nothing in this code changed and it stopped working,
  which points at the browser: Chrome's removal of third-party cookies breaks the old popup
  credential flow, and FedCM is Google's replacement. Stated plainly because it could not be
  verified from here — the button renders inside Google's own iframe and its popup does not
  open in an embedded browser.


## Consent is checked where the location is used, not where it changes

- Third attempt at the same report, and the first two were the same mistake in different
  shapes: the check lived in a watcher on one screen. A permission revoked while that screen
  was closed produced no event to hear, so a saved copy was still served — reported as
  "close it, open it, close it again, and it still finds me".
- The gate now sits in `requestPosition`, which everything that needs a position goes
  through, so it covers every screen including ones written later. The saved discovery
  location is re-checked on mount as well, because a permission taken away while the app was
  closed leaves no event behind either.
- A `prompt` state clears the saved copy but does **not** refuse the request. Resetting a
  site's permission leaves it there, and the browser is saying it will ask again — refusing
  would answer a question the person was never given the chance to answer. Only `denied`
  produces the blocked guidance.


## A store with no photograph now asks for one

- Roughly one store in twelve has none, and not because the fetch failed. Checked against
  Google directly, through both Place Details and Text Search: for these places the Places
  API returns zero photos. Google Maps shows pictures from sources it does not license out
  through the API, so there is nothing on our side left to try.
- What was there was a full-width grey block with the store's initial and the words "no
  photo" — stating the problem and doing nothing about it, at the top of the page. It now
  says no photograph exists yet and offers the one thing that fixes it: a link straight into
  writing a review of that store, which is where a photograph comes from.
- Forty pages that were dead space are now forty invitations, and the mechanism is the one
  already built — a community photograph outranks the provider's.


## Two fixes that had not actually been verified

- **The Google Maps link did not work.** It used `place/?q=place_id:…`, which is the tidy
  form and answers "no results found" often enough to be useless. It is Google's documented
  `search/?api=1&query=<lat,lng>&query_place_id=<id>` now, with the coordinates carrying the
  link when the id cannot. Shipped the first time on a reading of the markup rather than a
  click; this one was opened and checked.
- **Removing the location permission still did not forget the location.** The previous fix
  watched for the permission becoming `denied`. Resetting a site's permission in Chrome puts
  it back to `ask` — `prompt`, not `denied` — so the ordinary way of withdrawing access went
  unnoticed. Anything other than `granted` now counts as withdrawn. Verified in both states.


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
