# Custom UI artwork integration

The user approved the generated brick-red, cream, charcoal-green and gold artwork. This revision replaces the mixed emoji and line icons on the non-portfolio pages with isolated tiles from those images. Contact retains its compact address card and loses its redundant decorative header photograph. No factual resume content, contact data, portfolio code, original public image, or dependency is changed.

## Build the complete current site

Do not deploy this branch checkout directly: the authoritative complete portfolio remains in original Vercel deployment `dpl_9rpmmsW9wSMz5r376WsNQo75U36Z`. Redeploy that deployment to PREVIEW using `revisions/20261021/apply.cjs` at this revision's immutable commit SHA. Pass the same SHA as the script's only argument. No production aliases are changed.

The wrapper retrieves and verifies the preceding guard script at immutable commit `c21e958d033c7dcb3fd512f9677ce47accaaa430` (Git blob `795844f350866d3817253e62a191e33e4f344371`), applies the seven exact replacements in `changes.json`, replaces `editorial-ui.tsx`, and appends `ui-assets.css` to its scoped CSS module. It retains the complete 442-file integrity checks before patching, after patching and after the original npm build. Clipboard logic is checked to remain byte-for-byte unchanged.

## Artwork

The generated sheets were cropped into 24 individual assets, with their transparent edges cleaned and normalized to 96px tiles. The compact web delivery uses a 6x4, 576x384 atlas, palette-reduced to 64 colors and losslessly WebP encoded. No full sprite sheet is displayed in a webpage. Each visible icon selects a single tile; all button and heading labels remain HTML text.

The three files `assets/ui-atlas.0.bin`, `.1.bin`, `.2.bin` are consecutive binary segments of the atlas, not individual images. Concatenation in numeric order reconstructs exactly 25,242 bytes, SHA256 `29bdf172739394cdcfd4ae8d6c190e26e6eb9b46d9655aaa99101e2165316146`. The wrapper verifies each Git blob, the complete image checksum and its WebP header before passing it to the original no-overwrite asset writer. The deployed resource is `/assets/profile-20261021/ui-atlas.webp`.

Tile order: mail, phone, message, pin, calendar, document; briefcase, graduation, award, camera, pen, book; link, copy, check, plus, minus, arrow; sparkle, leaf, bookmark, quote, seal, corner. Collaboration aliases link; project-folder aliases briefcase.

## Validation

Local wrapper syntax, exact-replacement guards and three binary-part checksums verified. The prepared icons were visually reviewed on warm-white backgrounds at large and small sizes. The build starts the actual Next.js server after a successful guarded build and checks eight main/detail routes, five isolated portfolio routes, the absence of the removed emoji and the served artwork checksum. These response checks do not claim to replace browser interaction or mobile visual testing.
