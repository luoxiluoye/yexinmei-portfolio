import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const expected = {
  character: [
    "player-full-body.png",
    "player-idle.png",
    "player-wave.png",
    "player-avatar.png",
  ],
  cat: [
    "cat-sit.png",
    "cat-stand.png",
    "cat-wave.png",
    "cat-sleep.png",
    "cat-peek.png",
    "cat-love.png",
    "cat-happy.png",
    "cat-head.png",
  ],
  world: [
    "cloud-large.png",
    "cloud-medium.png",
    "cloud-small.png",
    "grass-platform-long.png",
    "grass-platform-short.png",
    "tree.png",
    "pine-tree.png",
    "bush.png",
    "flower.png",
    "fence.png",
    "castle.png",
    "wooden-sign.png",
  ],
  ui: [
    "heart.png",
    "empty-heart.png",
    "star.png",
    "empty-star.png",
    "sparkle.png",
    "arrow.png",
    "cursor.png",
    "exclamation.png",
    "speech-bubble.png",
  ],
  items: [
    "camera.png",
    "notebook.png",
    "laptop.png",
    "mail.png",
    "sword.png",
    "shield.png",
    "potion.png",
    "chest.png",
    "key.png",
  ],
};

const root = path.resolve(process.cwd(), "public/assets");
const missing = [];
let found = 0;

for (const [folder, names] of Object.entries(expected)) {
  for (const name of names) {
    const target = path.join(root, folder, name);
    if (fs.existsSync(target)) found += 1;
    else missing.push(path.relative(process.cwd(), target));
  }
}

console.log(`Asset QA: ${found}/42 official PNG files present.`);

if (missing.length) {
  console.error("Missing official assets:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log("All 42 official assets are present and match the registry file names.");
