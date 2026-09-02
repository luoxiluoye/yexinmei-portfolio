# YEXINMEI LUO — Pixel RPG Portfolio

Next.js + React + TypeScript + Tailwind CSS v4 portfolio implementation prepared for **UI Final v1.1**.

## Routes

```text
/
/player
/quests
/quests/[slug]
/inventory
/journal
/contact
```

A shared App Router `not-found.tsx` covers the approved 404 state.

## Run

```bash
npm install
npm run dev
```

## Asset integration status

The project is now delivered with the **full 42-file official asset pack already integrated** under `public/assets/`.

Integrated categories:

- `character` — 4 PNGs
- `cat` — 8 PNGs
- `items` — 9 PNGs
- `ui` — 9 PNGs
- `world` — 12 PNGs
- `projects` — reserved for future real case-study imagery

The central asset registry is defined in:

```text
lib/assets.ts
```

Verification script:

```bash
npm run assets:verify
```

See `ASSET_INTEGRATION.md` and `ASSET_INTEGRATION_STATUS.md` for details.

## Design system

Single-source tokens:

```text
styles/design-tokens.css
```

Shared UI implementation:

```text
components/ui/
```

No page should define alternate near-match colors, borders or heavy shadows.

## Project content

Quest data stays local in:

```text
data/quests.ts
```

Real case-study images can be placed under:

```text
public/assets/projects/<quest-slug>/
```

and connected through `images[].src` in the quest data.

## Handoff status

See `UI_FINAL_IMPLEMENTATION_REPORT.md` for the UI implementation summary.

## Content state — v1.3 NO MEDIA

Current formal content is connected from `YEXINMEI_CONTENT_MASTER_v1.3_NO_MEDIA`.
All six Quest entries currently use `gallery: []`; Gallery is fully hidden when empty and no image placeholder is rendered.
See `CONTENT_INTEGRATION_v1.3_NO_MEDIA.md` for the implementation rules and handoff notes.
