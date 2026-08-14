# Home App Web

The web experience for Home App: an anonymous-first Next.js application that helps people discover physical home and living stores through real visits, photography, and community reviews.

This repository currently contains the working frontend prototype, responsive design system, and browser-side API boundary.

## Current experience

- A photography- and community-first home feed
- Natural-language discovery and search
- Results that keep Home App community data separate from Google data
- Server-rendered store, review, and user pages
- Foundations for favorites, profile, and review creation
- Contextual authentication with Google and passwordless email OTP
- Interface dictionaries for Turkish, English, German, and Russian
- A bottom-anchored, label-free, accessible glass navigation rail on mobile web
- Keyboard focus, semantic HTML, and reduced-motion support

## Design direction

Home App is a consumer social product for discovering physical stores. It is not ecommerce, a merchant dashboard, or a generic review directory.

The interface is warm, quiet, and editorial. Photography and authored content remain more prominent than interface chrome. The palette combines off-white surfaces, dark ink tones, and a restrained terracotta accent.

Responsive web uses two intentional compositions:

- Editorial content columns on wide screens, with a supporting side panel where useful
- A viewport-anchored glass navigation rail at 900 px and below
- Recognizable Lucide icons without visible labels on mobile, while accessible names remain available
- Material blur restricted to navigation rather than repeated across content

The canonical design authority lives in `.agents/skills/home-app-design/SKILL.md` in the Home App API repository.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Lucide React
- Browser BFF through Next.js route handlers
- Source Sans 3 and Source Serif 4

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Community home feed |
| `/discover` | Natural-language search and hybrid results |
| `/stores/[id]` | Server-rendered store detail |
| `/reviews/[id]` | Public review detail |
| `/users/[id]` | Public user profile |
| `/favorites` | Favorites foundation |
| `/create` | Visit-review creation foundation |
| `/profile` | Personal profile and language settings |

## Setup

Requirements:

- Node.js 20 or a current LTS release
- A running Home App API instance

```bash
cp .env.example .env.local
npm install
npm run dev
```

The application opens at [http://localhost:3000](http://localhost:3000) by default.

### Environment variables

| Variable | Description |
| --- | --- |
| `API_ORIGIN` | The Home App API origin used by the Next.js server |
| `BFF_SECRET` | A server-only backend client credential |
| `NEXT_PUBLIC_SITE_URL` | The base URL for metadata and canonical URLs |

Never expose `BFF_SECRET` through a `NEXT_PUBLIC_` variable. The browser communicates through `/api/proxy/*`; only the Next.js server injects this credential.

## API and authentication

Typed domain shapes follow `home-app-api/docs/openapi.yaml`. The BFF forwards locale, visitor session, bearer state, search attribution headers, `Retry-After`, and request identifiers.

### Non-negotiable BFF boundary

The browser must never call the real backend origin directly.

```text
Browser UI → same-origin Next.js BFF → Home App API
```

- Client components call only same-origin endpoints such as `/api/auth/*` and `/api/proxy/*`.
- Server components and Next.js route handlers are the only web layers allowed to use `API_ORIGIN`.
- The BFF injects `BFF_SECRET`, forwards locale and attribution metadata, manages HTTP-only auth cookies, and shields backend topology from the browser.
- Do not add `NEXT_PUBLIC_API_ORIGIN`, expose the backend host in client code, or bypass the BFF for convenience.

Access and rotating refresh tokens are stored in HTTP-only cookies. Anonymous browsing remains available. Contextual authentication opens only when a visitor attempts a protected action such as saving, liking, following, commenting, or sharing a visit.

## Fixtures and prototype behavior

Canonical fixtures keep the interface usable while the backend is unavailable. Development photography stays in a presentation adapter and does not add fields to API DTOs.

Some interactions are still prototypes. For example, a like or favorite count may change in local state without representing a successful API mutation. Production integration must commit UI state only after a successful response, or roll back an optimistic update when the request fails.

## Project structure

```text
src/
  app/          App Router pages and API route handlers
  components/   Feed, authentication, search, and store components
  i18n/         Turkish, English, German, and Russian dictionaries
  lib/          Typed API, fixtures, and server utilities
public/
  images/       Development presentation imagery
```

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
