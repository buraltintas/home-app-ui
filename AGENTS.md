<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Boşa Gezme! web contribution rules

Before changing screens, tokens, navigation, content, responsive behavior, or accessibility, use the shared `$impeccable` foundation and then the `$home-app-design` authority from `../home-app-api/.agents/skills/`. The Boşa Gezme!-specific skill wins if they conflict.

## Product invariants

- Treat Boşa Gezme! as a consumer social product for discovering physical home/living stores.
- Keep photography, real visits, store identity, and authored reviews more prominent than UI chrome.
- Never present the product as ecommerce, a merchant dashboard, or a generic review directory.
- Never invent backend DTO fields, store details, product catalogues, phone numbers, hours, or URLs.
- Keep Boşa Gezme! community metrics and Google-derived data visibly separate.
- Browsing remains anonymous; protected actions open contextual auth and preserve intent.

## Web implementation invariants

- Write READMEs, contributor documentation, developer-facing explanations, and code comments in English only. Localized product UI and locale fixtures are exempt.
- Use semantic HTML, logical headings, keyboard navigation, visible focus, and WCAG AA contrast.
- Keep all UI strings in the `tr`, `en`, `de`, and `ru` dictionaries.
- Keep user-authored content untranslated.
- Preserve the browser BFF boundary as a non-negotiable architecture rule.
- Browser code must call only same-origin Next.js BFF routes and must never call the real backend origin.
- Only server components, route handlers, and other trusted server-side code may read `API_ORIGIN` or call the backend.
- Never introduce `NEXT_PUBLIC_API_ORIGIN` or expose `BFF_SECRET` to client bundles.
- Keep fixture imagery in the presentation layer rather than adding image fields to API DTOs.
- A local optimistic state change is not backend success. Commit mutations after a successful response or roll them back on failure.
- At 900 px and below, primary navigation belongs at the viewport bottom.
- Mobile-web navigation is label-free visually but must retain accessible names and 44 px targets.
- Restrict material blur/glass to the floating navigation; do not spread glassmorphism across content.
- Respect `prefers-reduced-motion`.

## Required checks

Run before committing:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
