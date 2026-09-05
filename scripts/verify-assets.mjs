import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const officialExpected = {
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

const playerExpected = [
  "achievement-badge.png",
  "fact-camera-kit.png",
  "fact-cat-npc.png",
  "fact-ccd.png",
  "fact-content-spark.png",
  "fact-notes.png",
  "inspect-eye.png",
  "journey-community.png",
  "journey-content.png",
  "journey-film.png",
  "journey-global.png",
  "journey-media.png",
  "journey-now.png",
  "journey-sidequest.png",
  "memory-archive.png",
  "memory-arrow-left.png",
  "memory-arrow-right.png",
  "memory-locked.png",
];

const root = path.resolve(process.cwd(), "public/assets");
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function validPng(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const fd = fs.openSync(filePath, "r");
  const header = Buffer.alloc(8);
  try {
    fs.readSync(fd, header, 0, 8, 0);
  } finally {
    fs.closeSync(fd);
  }
  return header.equals(pngSignature);
}

function checkFiles(entries) {
  const missing = [];
  let found = 0;

  for (const [folder, names] of entries) {
    for (const name of names) {
      const target = path.join(root, folder, name);
      if (validPng(target)) found += 1;
      else missing.push(path.relative(process.cwd(), target));
    }
  }

  return { found, missing };
}

const officialEntries = Object.entries(officialExpected);
const officialTotal = officialEntries.reduce((total, [, names]) => total + names.length, 0);
const officialResult = checkFiles(officialEntries);
const playerResult = checkFiles([["player", playerExpected]]);

console.log(`Official Asset QA: ${officialResult.found}/${officialTotal} PNG files present.`);
console.log(`PLAYER Asset QA: ${playerResult.found}/${playerExpected.length} PNG files present.`);

const missing = [...officialResult.missing, ...playerResult.missing];
if (missing.length) {
  console.error("Missing or invalid PNG assets:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Asset QA Total: ${officialResult.found + playerResult.found}/${officialTotal + playerExpected.length} PASS.`);
