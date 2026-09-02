export const ASSET_DIRECTORIES = {
  character: "/assets/character",
  cat: "/assets/cat",
  world: "/assets/world",
  ui: "/assets/ui",
  items: "/assets/items",
  projects: "/assets/projects",
} as const;

export type AssetCategory = keyof typeof ASSET_DIRECTORIES;

export const ASSET_REGISTRY = {
  // Character
  "character.fullBody": `${ASSET_DIRECTORIES.character}/player-full-body.png`,
  "character.idle": `${ASSET_DIRECTORIES.character}/player-idle.png`,
  "character.wave": `${ASSET_DIRECTORIES.character}/player-wave.png`,
  "character.avatar": `${ASSET_DIRECTORIES.character}/player-avatar.png`,

  // Cat mascot
  "cat.sit": `${ASSET_DIRECTORIES.cat}/cat-sit.png`,
  "cat.stand": `${ASSET_DIRECTORIES.cat}/cat-stand.png`,
  "cat.wave": `${ASSET_DIRECTORIES.cat}/cat-wave.png`,
  "cat.sleep": `${ASSET_DIRECTORIES.cat}/cat-sleep.png`,
  "cat.peek": `${ASSET_DIRECTORIES.cat}/cat-peek.png`,
  "cat.love": `${ASSET_DIRECTORIES.cat}/cat-love.png`,
  "cat.happy": `${ASSET_DIRECTORIES.cat}/cat-happy.png`,
  "cat.head": `${ASSET_DIRECTORIES.cat}/cat-head.png`,

  // World
  "world.cloudLarge": `${ASSET_DIRECTORIES.world}/cloud-large.png`,
  "world.cloudMedium": `${ASSET_DIRECTORIES.world}/cloud-medium.png`,
  "world.cloudSmall": `${ASSET_DIRECTORIES.world}/cloud-small.png`,
  "world.grassLong": `${ASSET_DIRECTORIES.world}/grass-platform-long.png`,
  "world.grassShort": `${ASSET_DIRECTORIES.world}/grass-platform-short.png`,
  "world.tree": `${ASSET_DIRECTORIES.world}/tree.png`,
  "world.pineTree": `${ASSET_DIRECTORIES.world}/pine-tree.png`,
  "world.bush": `${ASSET_DIRECTORIES.world}/bush.png`,
  "world.flower": `${ASSET_DIRECTORIES.world}/flower.png`,
  "world.fence": `${ASSET_DIRECTORIES.world}/fence.png`,
  "world.castle": `${ASSET_DIRECTORIES.world}/castle.png`,
  "world.woodenSign": `${ASSET_DIRECTORIES.world}/wooden-sign.png`,

  // UI
  "ui.heart": `${ASSET_DIRECTORIES.ui}/heart.png`,
  "ui.emptyHeart": `${ASSET_DIRECTORIES.ui}/empty-heart.png`,
  "ui.star": `${ASSET_DIRECTORIES.ui}/star.png`,
  "ui.emptyStar": `${ASSET_DIRECTORIES.ui}/empty-star.png`,
  "ui.sparkle": `${ASSET_DIRECTORIES.ui}/sparkle.png`,
  "ui.arrow": `${ASSET_DIRECTORIES.ui}/arrow.png`,
  "ui.cursor": `${ASSET_DIRECTORIES.ui}/cursor.png`,
  "ui.exclamation": `${ASSET_DIRECTORIES.ui}/exclamation.png`,
  "ui.speechBubble": `${ASSET_DIRECTORIES.ui}/speech-bubble.png`,

  // Items
  "items.camera": `${ASSET_DIRECTORIES.items}/camera.png`,
  "items.notebook": `${ASSET_DIRECTORIES.items}/notebook.png`,
  "items.laptop": `${ASSET_DIRECTORIES.items}/laptop.png`,
  "items.mail": `${ASSET_DIRECTORIES.items}/mail.png`,
  "items.sword": `${ASSET_DIRECTORIES.items}/sword.png`,
  "items.shield": `${ASSET_DIRECTORIES.items}/shield.png`,
  "items.potion": `${ASSET_DIRECTORIES.items}/potion.png`,
  "items.chest": `${ASSET_DIRECTORIES.items}/chest.png`,
  "items.key": `${ASSET_DIRECTORIES.items}/key.png`,
} as const;

export type AssetId = keyof typeof ASSET_REGISTRY;

export function getAsset(assetId: AssetId): string {
  return ASSET_REGISTRY[assetId];
}
