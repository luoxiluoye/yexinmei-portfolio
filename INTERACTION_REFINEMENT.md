# Interaction refinement · 2026-09-21

The RPG characters, compact project board, original media, routes, and factual project content remain. This pass addresses ambiguous controls: static information must not promise a click; real actions must have a visible result.

## GitHub references reviewed

Patterns were studied from original repositories and implemented independently, without copying their templates or artwork.

- [Anthony Fu: project list](https://github.com/antfu/antfu.me/blob/e3ff0442327a24b1f389982a19ec8aca704d9245/src/components/ListProjects.vue): compact linked rows, restrained hover background. Applied the principle of reserving interaction feedback for actual links.
- [Brittany Chiang v4: link and button styles](https://github.com/bchiang7/v4/blob/539cef0bf60cad438499a69d76dba2c27cc16c9a/src/styles/mixins.js), [experience tabs](https://github.com/bchiang7/v4/blob/539cef0bf60cad438499a69d76dba2c27cc16c9a/src/components/sections/jobs.js): different visual roles for buttons, inline links, and content; active tabs associated with their panels and keyboard controls.
- [Lee Robinson's Next.js MDX blog template](https://github.com/leerob/next-mdx-blog/blob/fd03371e3c90481a8447904e1b548e4c0327b7db/mdx-components.tsx): predictable internal links, anchors, and external links. This is currently a blog template, not a claim about Lee's current personal homepage.

## Changes

- Inventory: one capability workbench, four compact tabs directly above the content. Arrow keys wrap; Home/End select the boundary tabs; Tab reaches the visible panel. Real project links are explicitly underlined and marked with an arrow.
- Software tools: a semantic definition list with verified proficiency text. Removed unrelated pixel icons, separate button-like frames, and implementation-oriented copy.
- Shared PixelPanel: removed fake ellipsis menus and whole-panel click/hover feedback. Removed corresponding inactive hover effects from the Player snapshot, personal facts, Red Leaf metrics and workflow.
- Shared buttons: hover changes color/border only on precise pointers; press movement reduced to 1px. Visible keyboard focus remains.
- Contact and system menu: action labels say what they actually do. Copy has pending, success, and failure feedback. Failure provides a selectable WeChat field; status is announced to assistive technology. Closing the menu invalidates pending copy feedback.
- Inventory's real mystery chest remains interactive; its revealed content is now associated with the trigger and announced on updates.

No image replacement, new image compression, data invention, domain change, or Cloudflare operation was part of this pass.

## Verification

- `npm install`: succeeded; no reported vulnerabilities.
- `npm run assets:verify`: 60/60 pixel assets and 41/41 original real assets pass; no legacy screenshot references.
- `npm run build`: TypeScript passes; all 21 pages generated.
- Browser checks: 8 routes × 5 widths (1440, 1200, 1024, 768, 390), no page overflow, broken real images, real-image pixelation, or enlargement beyond source width.
- Interaction checks: all four ability tabs at all five widths; ArrowLeft/Right, Home/End, Tab to active panel; related project navigation; noninteractive toolbox; chest feedback; static panel hover; contact copy success/rejection/missing API and manual selection; system menu success/missing API, visible feedback at 390×700, close/reopen state reset. Clipboard branches were exercised with controlled browser API stubs.
- Visual review also corrected status items disappearing off-screen on mobile (now a compact 2×2 grid) and aligned contact card buttons around their reserved feedback space.
- Photography regression: all 16 curated photographs remain reachable across five categories; keyboard category navigation, lightbox switch/ESC/focus restoration, chapter anchor and mobile menu passed.
- Final visual checks: home/inventory/contact at 1440 and 390 have no overflow or clipped status items; all four desktop contact actions align at the same vertical position.
