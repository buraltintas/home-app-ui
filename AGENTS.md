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

## Rules are general, or they are not rules

A rule that names a store, a city or a brand is not a rule, it is a patch. This product
covers every city in Turkey; nobody can maintain a list of the cases that need special
handling, and the attempt fails quietly — whatever nobody thought to add stays broken.

A rule has to hold for a store nobody has looked at, in a city nobody has visited. Prefer,
in order: the provider's own data, because it is complete; words the whole trade uses,
because every business of that kind uses them; and nothing else. Not a brand list, not a
per-store exception, not a fix for the one example in the bug report.

When a report names one case, fix the class it belongs to, then look for the rest of the
class — there is always more than the one reported.

## Keep the log

Every change that a person would want explained later goes in `docs/CHANGELOG.md`, newest
first, in the same commit as the change itself. Not a list of files touched — what changed,
and why it was worth changing. A defect entry says what was actually broken, because "fixed
the search" tells the next person nothing and "the same query returned different stores
because the classifier ran at the default temperature" tells them everything.

The other documents are load-bearing too, and stale ones are worse than missing ones:

- `DESIGN.md` — tokens, type, primitives. Changing a colour or a radius without changing
  this leaves the file lying to whoever reads it next.
- `PRODUCT.md` — what the product is and refuses to be.
- `AGENTS.md` (this file) — a rule that had to be learned the hard way belongs here, so it
  is learned once.
- `docs/LEGAL_REVIEW_REQUIRED.md` — anything published that makes a claim we have to keep.

**No secrets in any of them.** Describe a security-relevant change by its effect, never by
repeating the value involved.

## Required checks

Run before committing:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
