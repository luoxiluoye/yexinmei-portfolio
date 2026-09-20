# Real media integration

Base: main `53e533ee7c26e8a85821bff4295c7e34565621a4`.

41 originals imported unchanged from the supplied ZIP; 24 unique images selected for the site. Full dimensions, categories and byte counts live in `lib/real-assets.json`; curated groups live in `lib/real-assets.ts`. Pixel illustrations remain in `lib/assets.ts`.

## Blur audit

- Red Leaf still referenced 900px-wide library/story-modal/gameplay WebP files. The full-width gameplay frame could exceed its source width, while Next/Image applied default quality 75.
- Legacy social previews were only 500px wide; the current account cards had no image. Both now use the original 2048px PNGs.
- Real photos were not globally pixelated. Pixel CSS is confined to illustration components; every new real image explicitly uses normal rendering.
- All new screenshots and photography are served unoptimized from original PNG/JPEG files, with intrinsic dimensions, source-width caps and contain-based screenshot frames. Cropping is limited to tiny photography evidence thumbnails.
- Old WebP files retained, with no remaining component references. Dormant flagship component also updated so it cannot reintroduce old screenshots.

## Selected groups

- Red Leaf: all 5 PNGs, entrance beside the introduction followed by a 2×2 grid. Shared 5-image lightbox.
- Side channels: both account PNGs, compact thumbnails with existing verified metrics and profile links.
- Photography: 16 images, grouped as PORTRAIT / COMMERCIAL / CAMPAIGN / STAGE / LIVE. Original proportions, three or four compact frames per category.
- Player: 1 personal portrait plus 4 portrait-photography samples, explicitly distinguished from self-portraits; mobile horizontal contact sheet.
- Home: 2 small evidence entries inside the existing Quest Log (Red Leaf and photography). Hero, Player, Inventory and Status Bar retained.

## Reserved originals (17)

- Portrait 02, 03, 04, 05, 07, 08, 09, 11: similar poses/scenes; keep the contact sheet selective and respect 324–432px source widths.
- Commercial 01, 04: additional angles of the same service.
- Campaign 03, 04, 05: alternate billboard views.
- Stage 03: alternate scene.
- Live 01, 02, 05: QR-code event entry, poster, and another similar two-person photo. These are not mislabelled as stage-performance photographs.

No new performance numbers were inferred from photography. The supplied archive does not contain a visible 19.59万 analytics record, so that figure was not added.

## Verification

`assets:verify` checks all 41 original signatures, dimensions and byte counts and rejects legacy screenshot references. Browser QA covers 1440/1200/1024/768/390px, seven required routes, image loading, overflow and lightbox interaction. No gallery dependency added.
