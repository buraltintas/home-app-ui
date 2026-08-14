<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. Heed deprecation notices.

This block is written and re-added by `next dev`. Committing it keeps the worktree clean.

<!-- END:nextjs-agent-rules -->

# Home App web contribution rules

Before changing screens, tokens, navigation, content, responsive behavior, or accessibility, read the shared `$home-app-design` authority from the Home App API repository.

## Product invariants

- Treat Home App as a consumer social product for discovering physical home/living stores.
- Keep photography, real visits, store identity, and authored reviews more prominent than UI chrome.
- Never present the product as ecommerce, a merchant dashboard, or a generic review directory.
- Never invent backend DTO fields, store details, product catalogues, phone numbers, hours, or URLs.
- Keep Home App community metrics and Google-derived data visibly separate.
- Browsing remains anonymous; protected actions open contextual auth and preserve intent.

## Web implementation invariants

- Use semantic HTML, logical headings, keyboard navigation, visible focus, and WCAG AA contrast.
- Keep all UI strings in the `tr`, `en`, `de`, and `ru` dictionaries.
- Keep user-authored content untranslated.
- Preserve the browser BFF boundary; never expose `BFF_SECRET` to client bundles.
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

