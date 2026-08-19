# Daylight — the visual world of Boşa Gezme!

One world, applied everywhere. Read this before changing any screen, token, or component.

## Why this world

The product's own thesis is light entering a home and making things clearer. The previous
world, City Print, expressed confidence through weight: cobalt rules everywhere, zero
radius, hard offset shadows, a display face with strong personality. It read well on the
editorial surfaces — feed, store detail — and turned harsh everywhere a person has work to
do. A settings form, a review composer, and an admin table do not want to be a poster.

Daylight keeps what was true about the product and drops what was true only about the
poster: a bright warm ground, one family, generous space, soft geometry, and colour used in
large calm areas rather than in lines. Photography and authored reviews carry the interface;
the chrome gets out of the way.

## Tokens

Defined once, in `src/app/globals.css` `:root`. Never hard-code a colour outside that block.

### Ground and ink

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#faf8f4` | page ground, warm off-white |
| `--surface` | `#ffffff` | raised: panels, cards, sheets, fields |
| `--muted` | `#f1eee7` | inert fills, media placeholders, disabled |
| `--ink` | `#16140f` | body text, primary buttons |
| `--ink-muted` | `#6b6559` | secondary text, meta |
| `--line` | `#e4e0d7` | hairline divisions |
| `--line-strong` | `#cdc7b9` | a division that must be seen |

The neutrals are warm on purpose: they sit under photographs of real rooms, and a cold grey
makes every one of those photographs look wrong.

### Colour

| Token | Value | Use |
|---|---|---|
| `--accent` | `#eda92b` | honey. The brand's own colour, from the mascot |
| `--accent-wash` | `#fdf1d7` | large calm areas: bands, active states, highlights |
| `--accent-ink` | `#8a5d05` | honey text on a light ground, where contrast demands it |
| `--clay` | `#c2452d` | emphasis and live values: ratings, promoted, counts |
| `--success` | `#2e6a4f` | verified visit |
| `--error` | `#b3372b` | destructive and failed states |

One accent, used in area rather than in line — a honey wash behind a whole section reads
calm, a honey border reads busy. Clay is for the few values that must be read first.
Never put light text on honey; `--accent-wash` always carries `--ink`.

## Type

**Onest** for everything, at four weights: 400 body, 500 emphasis, 600 headings, 700 display.
It carries Latin, Latin Extended and Cyrillic, which the four shipped locales require. A
replacement must be verified for Turkish, German, English and Russian before it is
considered — Satoshi, for instance, has no Cyrillic and is therefore not an option.

There is no second family. Hierarchy comes from size, weight and space.

| Role | Size / line | Weight | Tracking |
|---|---|---|---|
| Page display | `clamp(38px,5.4vw,60px)` / 1.02 | 700 | `-.035em` |
| Section | 34px / 1.1 | 600 | `-.03em` |
| Card title | 24px / 1.2 | 600 | `-.02em` |
| Title | 20px / 1.3 | 600 | `-.015em` |
| Body | 18px / 1.6 | 400 | `-.005em` |
| Secondary | 15px / 1.5 | 400 | 0 |
| Meta / label | 13px / 1.4 | 600 uppercase | `.08em` |

Body is 18px, not 16. This is a product people read on a phone while standing in a street.

## Primitives

- **Radius:** `--r-lg: 20px` for media, panels and sheets; `--r-md: 12px` for controls,
  fields and buttons; `--r-sm: 8px` for small chips; `999px` for avatars and true pills.
  Nothing is square, and nothing is a bubble.
- **Division:** whitespace first. A hairline `--line` second. A `--line-strong` rule only
  where two kinds of content must not be confused. Never a border drawn just to wrap.
- **Elevation:** flat by default. One soft shadow, `0 8px 24px rgba(22,20,15,.08)`, for
  things that genuinely float: the mobile rail, dialogs, sheets, menus.
- **Bands:** a full-width `--accent-wash` band is how a major zone is separated. This is the
  world's signature move and it replaces the rules the old world drew everywhere.
- **Primary action:** `--ink` ground, `--surface` text, `--r-md`. It works on every ground
  and never has a contrast problem. Secondary is `--surface` with a `--line-strong` border.
- **Focus:** `outline: 3px solid var(--accent); outline-offset: 2px`. Visible, not violent.
- **Motion:** 140–220 ms ease-out for feedback. No decorative loops. Everything stops under
  `prefers-reduced-motion`.
- **Targets:** 44×44 minimum, always.

## Composition

- Content column `max-width: 1200px`, page padding `56px 32px 110px`; prose holds to 68ch.
- Left-aligned. Centre only a true empty state, never a page of content.
- Lists are rows with hairline divisions and real padding, not stacks of bordered cards.
- Photography leads and gets `--r-lg`: 4:3 search and store rows, 4:5 feed primary,
  16:9 or asymmetric store hero on desktop. Always an explicit ratio and a calm fallback.
- Section rhythm: band, then content, then band. Not rule, rule, rule.

## Not supported yet

Dark mode. The tokens are structured so it can be added in one block, but no surface has
been designed for it; do not ship a half-dark screen.

## Checks before shipping a screen

Beyond the product gate in the `home-app-design` skill:

1. Is every colour a token?
2. Is everything Onest, at one of the four weights?
3. Is body text 18px, and does prose stop around 68 characters?
4. Does the screen separate with space and bands rather than lines everywhere?
5. Is honey used as an area, never as text on light or as a lone border?
6. Does it hold at 375, 768 and 1280, in `tr`, `en`, `de` and `ru`?
7. Does focus land on the control, visibly, without swallowing the row?
