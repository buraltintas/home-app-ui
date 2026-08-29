# Published analyses

Strategy and architecture notes that live as published pages rather than in this repository,
because they are written for people who do not read code and are updated as the numbers move.

Each is private to the account that published it: a link alone is not access. They contain no
keys, credentials or deployment values, in keeping with the rule in `AGENTS.md`.

| Page | What it answers | Last revised |
|---|---|---|
| [Growth ve katalog stratejisi](https://claude.ai/code/artifact/acda8ccb-82ea-4968-89b0-3f561871d352) | Where growth is actually blocked, what the catalogue looks like city by city, what the provider really costs and why, and the thirty/sixty/ninety day order of work. | 2026-08-29 |
| [Arama akışı ve yedek kararı](https://claude.ai/code/artifact/d81f0153-156d-4535-a6b5-f855cd4b492c) | How a search runs today, step by step; why the provider is called on every one of them; and the smallest change that makes it a fallback. | 2026-08-29 |

## What belongs here and what does not

These pages carry the reasoning behind a decision -- the measurements, the options weighed, the
ones rejected and why. The decision's *effect* still belongs in `docs/CHANGELOG.md` next to the
commit that made it, and a rule learned the hard way still belongs in `AGENTS.md`. A page here is
never the only record of something that changed.

Both pages mark every figure as either **measured** (read from the live database, Search Console
or Cloud Billing on the date shown) or **assumed** (a proposal awaiting real data). Keep that
distinction when revising them; it is what makes them worth trusting.
