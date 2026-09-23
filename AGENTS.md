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

## Removing something from a page removes it from the index too

A page is read by people and by crawlers, and the second reader is invisible while you
work. Taking a block off a page can therefore cost something nobody in the room mentions:

- **Internal links.** A block that linked to store pages was passing the home page's own
  standing to them. The sitemap still gets them crawled; it does not carry that standing.
- **Unique text.** Two URLs holding the same words are one page as far as an index is
  concerned, and which one survives is not our choice. Content shown in two places should
  live in one and be linked from the other.
- **Freshness.** Content that changes on its own says the site is alive. A block of fixed
  copy does not.

So: when a change removes content, links, or headings from a page that is indexed, say so
in the same breath as delivering it -- on the task, in plain language, with what was lost
and what would restore it. The person who asked for the change is entitled to weigh that
before it ships, and they cannot weigh what they are not told.

## Reproduce it where it happens, or you are measuring something else

A location button was reported broken five times and measured working five times. Both were
true. The defect only exists in a browser that raises a permission dialog, and every
measurement was made in one where the permission was already granted -- so the dialog never
appeared, and the ten-second deadline that was expiring while a person read it never expired.

A report that survives several fixes is rarely several mistakes. It is a sign that what is
being measured is not what is being reported. Phone browsers, permission prompts, keyboards
and system text sizes are all things a desktop browser cannot show you; when a report involves
one of them, reproduce it on a device that has it. The iOS simulator runs real Mobile Safari
and takes a simulated location (`xcrun simctl location <udid> set <lat>,<lon>`), which is
enough for most of them.

## Check both breakpoints, or you are checking one

The results list spent a fortnight broken on every wide screen: a store's name squeezed into
a 20px column while the chain's mark took the whole row. A third child had been added to a
two-column grid, and the phone breakpoint -- which has a template of its own -- was fine.
Every check made during those two weeks, including the ones reported back, was made at phone
width.

A layout rule that only one breakpoint gets wrong is invisible to anyone testing at the
other. When a change touches a grid, a flex row or anything that a media query redefines,
look at it at both sizes before calling it done.

## A failing build looks exactly like a fix that did not work

The site stays up on the last image that built, so a broken deploy has no symptom of its
own. The only thing anybody sees is that shipped work has not appeared -- which reads as a
bug in the work, and sends the next hour into debugging code that is correct and not
running. Six consecutive builds failed once and four finished changes were reported back as
"still broken" while the repository said they were done.

So before concluding that a change did not take, check that it deployed:

```bash
gcloud builds list --limit=5 --format="value(status,createTime,substitutions.SHORT_SHA)"
```

And keep the build able to run without the backend. It is built in a container with no route
to the API, so anything that reads the catalogue at build time -- `generateStaticParams`,
`generateSitemaps`, a prerendered route -- either fails the build or bakes in an empty
answer. Read the catalogue per request.

## A route's `revalidate` is a ceiling, not a setting

The store page was told to cache for a day and kept caching for an hour. Next gives a route
the *shortest* revalidate of everything rendered into it, and three reads on that page were
still asking for the default hour -- so the declaration on the route did nothing and the
work looked done.

It says so out loud, which is the only reason this was caught:

```bash
curl -s -o /dev/null -D - https://bosagezme.com/stores/<slug> | grep -i cache-control
# s-maxage=<the number actually in force>
```

Check that header after changing a cache lifetime. And when a page declares its own life,
pass it to the fetches it makes rather than leaving them on the shared default -- one read
on the shortest default silently sets the lifetime for the whole page.

A second half to the same rule: a long lifetime is only honest if everything that changes
the page drops it. Before lengthening one, list the things that can change what the page
says and check each of them actually invalidates. The hour was hiding a deleted review that
stayed on a shop's public page, because deleting one never dropped anything.

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
