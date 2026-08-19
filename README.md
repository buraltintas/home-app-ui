# Boşa Gezme! Web

The web experience for Boşa Gezme!: an anonymous-first Next.js application that helps people discover physical home and living stores through real visits, photography, and community reviews.

Canonical production URL: [https://bosagezme.com](https://bosagezme.com). The supplied logo is used without redrawing or recoloring; derived favicon and app-icon assets preserve the original artwork.

This repository currently contains the working frontend prototype, responsive design system, and browser-side API boundary.

## Current experience

- A live photography- and community-first home feed with loading, empty, and retryable error states
- Natural-language discovery and search
- Backend-authored home/living guidance for unrelated or unclear searches
- User-initiated current or manually chosen location for nearby discovery
- Results that keep Boşa Gezme! community data separate from Google data
- Server-rendered store, review, and user pages
- Foundations for favorites, profile, and review creation
- Contextual authentication with Google and passwordless email OTP
- Confirmed account deletion that clears the HTTP-only session and returns to anonymous mode
- Interface dictionaries for Turkish, English, German, and Russian
- A bottom-anchored, label-free, accessible glass navigation rail on mobile web
- Keyboard focus, semantic HTML, and reduced-motion support

## Design direction

Boşa Gezme! is a consumer social product for discovering physical stores. It is not ecommerce, a merchant dashboard, or a generic review directory.

The interface is warm, quiet, and editorial. Photography and authored content remain more prominent than interface chrome. The palette combines off-white surfaces, dark ink tones, and a restrained terracotta accent.

Responsive web uses two intentional compositions:

- Editorial content columns on wide screens, with a supporting side panel where useful
- A viewport-anchored glass navigation rail at 900 px and below
- Recognizable Lucide icons without visible labels on mobile, while accessible names remain available
- Material blur restricted to navigation rather than repeated across content

The canonical design authority lives in `.agents/skills/home-app-design/SKILL.md` in the Boşa Gezme! API repository.

## Brand assets

Web branding lives under `public/brand/`. The transparent logo is used in the header, the mascot artwork drives browser and PWA icons, and `social-share-banner.png` is the wide Open Graph/Twitter preview. Keep these role-specific files separate; do not substitute the full wordmark for small platform icons.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Lucide React
- Browser BFF through Next.js route handlers
- Source Sans 3 and Source Serif 4

## Routes

Every route below is also reachable under `/en`, `/de` and `/ru`. Turkish is served
unprefixed and is the canonical Turkish URL, so links written before locale routing
existed still resolve; `/tr/...` redirects to the unprefixed form so no page has two
addresses.

| Route | Purpose |
| --- | --- |
| `/` | Community home feed, server-rendered |
| `/discover` | Natural-language search and hybrid results |
| `/stores/[slug]` | Server-rendered store detail; a uuid URL redirects to the slug |
| `/reviews/[id]` | Public review detail |
| `/users/[id]` | Public user profile |
| `/favorites` | Saved stores (sign-in only, `noindex`) |
| `/create` | Visit-review creation (sign-in only, `noindex`) |
| `/profile` | Personal profile and language settings (sign-in only, `noindex`) |

Informational and legal routes, all server-rendered in four languages:

| Route | Purpose |
| --- | --- |
| `/about` | What the product is, and what it is not |
| `/contact` | Contact channels |
| `/legal` | Index of every legal document with version and date |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/kvkk/aydinlatma-metni` | KVKK disclosure, with the processing condition per activity |
| `/kvkk/basvuru` | KVKK data-subject application |
| `/cookies` | Cookie policy and the full cookie inventory |
| `/location-privacy` | How location is handled, behaviour by behaviour |
| `/account-deletion` | What deletion removes, anonymises and keeps |
| `/children-privacy` | Minimum age and data about children |
| `/commercial-communications` | Transactional versus marketing messages |
| `/report-content` | Reporting content that breaks the rules |

## Locale routing

`src/proxy.ts` resolves the locale once per request: an explicit URL prefix wins, then
the visitor's saved choice, then `Accept-Language`, then Turkish. An explicitly prefixed
URL is never renegotiated, because it is what was linked, shared or crawled. The resolved
value is passed down as a request header, so no page has to thread a param by hand.

Route handlers, build assets and the metadata files are excluded from the matcher, so the
BFF boundary, `robots.txt` and `sitemap.xml` are untouched.

Locale previously lived only in a cookie. Googlebot sends no cookies, so every crawl saw
Turkish and the English, German and Russian dictionaries were unreachable to search
engines regardless of how complete they were.

## SEO

- Every page states its own canonical. Metadata cascades in the App Router, so a canonical
  set once in the root layout is inherited by every page below it -- which previously told
  Google that every store, review and profile page was a duplicate of the homepage.
- Full `hreflang` set with `x-default` on the unprefixed Turkish address, in the markup and
  repeated in the sitemap.
- `sitemap.xml` enumerates stores from the backend catalogue index with their real
  `lastmod`, in every language. Sign-in-only routes are excluded and carry `noindex`.
- Structured data: `Organization` and `WebSite` on the homepage, `Store` with breadcrumbs
  on store pages, `Review` on review pages, `WebPage` on the legal documents.
- `AggregateRating` is built only from Boşa Gezme! community reviews. The Google-derived
  rating is deliberately excluded: republishing another site's ratings as your own is what
  Google's guidelines forbid. A store with no community reviews emits no rating at all
  rather than a fabricated zero.

## Setup

Requirements:

- Node.js 20 or a current LTS release
- A running Boşa Gezme! API instance

```bash
cp .env.example .env.local
npm install
npm run dev
```

The application opens at [http://localhost:3000](http://localhost:3000) by default.

### Environment variables

| Variable | Description |
| --- | --- |
| `API_ORIGIN` | The Boşa Gezme! API origin used by the Next.js server |
| `BFF_SECRET` | A server-only backend client credential |
| `NEXT_PUBLIC_SITE_URL` | The base URL for metadata and canonical URLs |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | The public Google Web OAuth client ID used by Google Identity Services |

Never expose `BFF_SECRET` through a `NEXT_PUBLIC_` variable. The browser communicates through `/api/proxy/*`; only the Next.js server injects this credential.

## API and authentication

Typed domain shapes follow `home-app-api/docs/openapi.yaml`. The BFF forwards locale, visitor session, bearer state, search attribution headers, `Retry-After`, and request identifiers. Current contracts distinguish `store_distance_meters` (viewer-to-store feed ordering) from `distance_meters` (visit verification), expose search `scope`, `store_name`, and optional localized `guidance`, and support private discovery-location persistence.

### Non-negotiable BFF boundary

The browser must never call the real backend origin directly.

```text
Browser UI → same-origin Next.js BFF → Boşa Gezme! API
```

- Client components call only same-origin endpoints such as `/api/auth/*` and `/api/proxy/*`.
- Server components and Next.js route handlers are the only web layers allowed to use `API_ORIGIN`.
- The BFF injects `BFF_SECRET`, forwards locale and attribution metadata, manages HTTP-only auth cookies, and shields backend topology from the browser.
- Do not add `NEXT_PUBLIC_API_ORIGIN`, expose the backend host in client code, or bypass the BFF for convenience.

The location flow follows the same boundary. Browser geolocation is requested only after an explicit user action, and coordinates are sent only to same-origin `/api/proxy/*` routes. Manual location search uses one human-readable text field. Candidate coordinates are transport-only and must never be rendered or used as visit evidence.

Access and rotating refresh tokens are stored in HTTP-only cookies. Anonymous browsing remains available. Contextual authentication opens only when a visitor attempts a protected action such as saving, liking, following, commenting, or sharing a visit.

Google Identity Services returns an ID token to the browser. The browser sends it only to `/api/auth/google`; that route forwards it through the BFF and stores the resulting Boşa Gezme! tokens in HTTP-only cookies. Configure the Google OAuth client with `http://localhost:3000` for local development and `https://bosagezme.com` for production under Authorized JavaScript origins.

The App Store review identity uses the ordinary email OTP screens; the UI must never expose a special reviewer branch, label, prefill, or code. `ACCOUNT_UNAVAILABLE` clears any local session. Account deletion is permanent for profile, content, history, and social data, even though a later verified login may reactivate the same account ID as a blank profile.

## Data and optimistic updates

The home feed, discovery search, store, review and profile pages all read live data from the API through the same-origin BFF. The home feed is read on the server, so the first response carries real reviews rather than an empty shell. Fixture imagery stays in the presentation layer and is never added to API DTOs.

Feed likes and store favorites update only after the BFF confirms the backend mutation; authentication failures open contextual sign-in without changing counts. Other unfinished prototype surfaces must follow the same rule as they are integrated: commit UI state only after success, or roll back an optimistic update when the request fails.

## Project structure

```text
src/
  app/[locale]/ Locale-scoped App Router pages
  app/api/      BFF route handlers, the only code that talks to the Go API
  components/   Feed, authentication, search, store and legal-document components
  content/      Legal and informational copy, held as data in four languages
  i18n/         Turkish, English, German, and Russian dictionaries
  lib/          Typed API, URL and structured-data helpers, legal facts
  proxy.ts      Locale resolution
public/
  brand/        Role-specific logo, app icon, and social sharing artwork
  images/       Development presentation imagery
```

## Legal and company facts

`src/lib/legal-facts.ts` is the single source for company and contact details. Unknown
values are `null` and are never rendered as placeholder text; documents that cannot be
honest without the controller's identity are gated behind `legalDocumentsArePublishable`
and stay out of the search index until it exists.

Legal copy lives in `src/content/legal/` as data rather than markup, so all four languages
fill the same sections in the same order. A translation that quietly gains or loses a
clause is a different contract, not a different wording.

Outstanding questions for counsel are tracked in [docs/LEGAL_REVIEW_REQUIRED.md](docs/LEGAL_REVIEW_REQUIRED.md).

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Related repositories

- API: [buraltintas/home-app-api](https://github.com/buraltintas/home-app-api)
- Mobile: [buraltintas/home-app-mobile](https://github.com/buraltintas/home-app-mobile)
