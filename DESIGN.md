# City Print — the visual world of Boşa Gezme!

One world, applied everywhere. Read this before changing any screen, token, or component.
It records what the product already commits to; it is not a menu of options.

## Why it exists

The product carried two visual systems at once. `globals.css` held a warm, rounded,
beige-and-terracotta system, and `city-print.css` layered City Print on top of the
surfaces it happened to reach. Everything built after that layer — profile, favourites,
the ten legal routes, comments, the review composer, the footer, admin — was written
against the older system and never received the world. Half the product looked like a
different, blander product. That is the incoherence, and this document is the fix:
one token layer, one type system, one set of primitives.

## Thesis

A city print: warm paper, cobalt ink, vermilion and sun for emphasis. Editorial, printed,
confident, physical. Real photographs and authored reviews carry the interface; the
chrome is rules, type, and space. Nothing is soft, glassy, or generic.

The one exception to "nothing floats" is the mobile navigation rail, which uses real
material blur because it must separate from scrolling content.

## Tokens

Defined once, in `src/app/globals.css` `:root`. Never hard-code a hex outside that block.

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#f3ebdd` | page ground |
| `--surface` | `#fff9ee` | raised paper: panels, sheets, cards |
| `--muted` | `#e3dccd` | inert fills, media placeholders |
| `--ink` | `#171a1f` | body text |
| `--ink-muted` | `#5f5a51` | secondary text |
| `--cobalt` | `#172a54` | rules, primary surfaces, primary buttons |
| `--line` | = cobalt | every structural rule |
| `--accent` | `#c83c32` | vermilion: emphasis, ratings, live values |
| `--accent-strong` | `#9e2825` | pressed/hover of accent |
| `--sun` | `#f2b735` | highlight, selection, focus, secondary buttons |
| `--forest` | `#183f38` | rare third colour |
| `--success` | `#216344` | verified visit |
| `--error` | `#a22c2c` | destructive and error states |

Contrast: sun and surface never carry light text; cobalt and forest never carry dark text.
Check every pairing at AA before shipping it.

## Type

- Display: **Unbounded** via `--font-display` (`--font-serif` is an alias kept for older
  rules). Headings only, weight 700–750, `letter-spacing:-.035em`, `line-height` ≈ 1.
- UI and body: **Onest** via `--font-sans`, `letter-spacing:-.01em`.
- Both are loaded with Latin and Cyrillic subsets. Any replacement must cover Turkish,
  German, English, and Russian before it is considered.
- Scale: 11–12 meta (uppercase, `letter-spacing:.12em`), 13–14 secondary, 16–17 body,
  25 card title, 28 section, `clamp(42px,6.1vw,84px)` page display.
- Eyebrows are sans, 11px, `.13em` tracking, vermilion.

## Primitives

- **Radius: 0.** Avatars, the mobile rail, and true capsules are the only exceptions.
- **Rules, not boxes.** Separate with a 2px cobalt rule; 1px for secondary divisions.
  A border exists to divide, not to wrap. No card inside a card.
- **Elevation:** none, except a hard offset shadow (`7px 7px 0 var(--accent)`) used as a
  print effect, and one soft shadow under the mobile rail.
- **Inset sun bar:** `box-shadow:inset 0 -7px var(--sun)` marks an active or important
  surface. This is the world's signature; use it sparingly.
- **Focus:** `outline:3px solid var(--sun); outline-offset:4px; box-shadow:0 0 0 6px var(--cobalt)`.
  Deliberately loud. Keep it on controls; do not let it wrap a whole row.
- **Motion:** 140–220 ms ease-out for feedback. `ink-in` for a page's leading block only.
  Everything stops under `prefers-reduced-motion`.
- **Targets:** 44×44 minimum, always.

## Composition

- Editorial asymmetry over centred columns. A page states its subject large, then rules
  below it.
- Content pages: `max-width:1240px`, `padding:54px 40px 110px`. Full-bleed heroes go to
  1440.
- Reading and settings surfaces: a single measure of 620–720px, left-aligned, never
  centred text.
- Lists are rows separated by rules, not stacks of bordered cards.
- Photography leads: 4:3 search and store rows, 4:5 feed primary, 16:9 or asymmetric
  store hero on desktop. Always an explicit ratio and a calm fallback.

## Surfaces

Each screen states its mode before it is designed. Persuade for the marketing surfaces,
Operate for anything with a task in it, Read for the legal and help routes.

Anything not in City Print yet is a defect, not a variant.

## Checks before shipping a screen

Beyond the product gate in the `home-app-design` skill:

1. Is every colour a token?
2. Is every heading Unbounded, every body Onest?
3. Is any radius present that is not an avatar or the rail?
4. Does the screen divide with rules rather than wrap in boxes?
5. Does it hold at 375, 768, and 1280, in `tr`, `en`, `de`, and `ru`?
6. Does the focus state land on the control, visibly, without swallowing the row?
