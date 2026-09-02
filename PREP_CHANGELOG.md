# Preparation Changelog

This pass is code preparation only. No new site features, routes, or information architecture were added.

## Completed
- Centralized current colors, spacing, borders, shadows, typography, and pixel scale in `styles/design-tokens.css`.
- Kept existing routes unchanged.
- Consolidated reusable UI under `components/ui/`.
- Added reusable `PixelIcon`, `QuestCard`, and `PlayerCard`.
- Kept a compatibility re-export for the previous QuestCard location.
- Refactored the home mini player card to consume the shared PlayerCard without changing its content hierarchy.
- Created the final asset folder skeleton under `public/assets/`.
- Added `lib/assets.ts` as the only production asset path registry.
- Left `ASSET_REGISTRY` empty until approved assets arrive.
- Removed the previous empty placeholder asset folders to prevent parallel asset conventions.
- Replaced reusable hard-coded shadow/color values with design token references where applicable.

## Explicitly not done
- No UI Final recreation.
- No new page or route.
- No new feature.
- No mockup-as-background implementation.
- No guessed asset filenames.
- No guessed final dimensions, colors, or spacing beyond extracting the current development values into tokens.
