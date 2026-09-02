# Official Asset Integration — UI Final v1.1

This codebase is wired to the approved **42-file asset naming scheme** through `lib/assets.ts`.
No page component should hard-code `/assets/...` paths directly.

## Asset root

```text
public/assets/
├── character/
├── cat/
├── world/
├── ui/
├── items/
└── projects/   # reserved for real project/gallery images supplied later
```

## Integrated now

The supplied formal asset pack has already been copied into `public/assets/`.
The included verification script confirms the complete set:

```bash
npm run assets:verify
```

Expected total: **42 / 42 official PNG files present**.

## Registry rule

All UI code must resolve official assets through:

```ts
import { getAsset } from "@/lib/assets";
```

or the shared:

```tsx
<PixelIcon assetId="cat.sit" />
```

Do not redraw the character, mascot, or icons in CSS. Do not crop them from mockups.

## Re-install from ZIP if needed

If assets ever need to be re-copied from the original delivery ZIP:

```bash
npm run assets:install -- "/absolute/path/to/web-asset-pack-delivery-qa.zip"
```

The installer searches recursively for the five official folders, copies PNGs into `public/assets/`, then runs the 42-file verification.

## Real project images

Project screenshots/photos are intentionally separate from the 42 thematic PNGs. Put future real case-study assets under:

```text
public/assets/projects/<quest-slug>/...
```

and reference them from `data/quests.ts` via `images[].src`.
