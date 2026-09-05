import fs from "node:fs";
import path from "node:path";

const outRoot = path.resolve("public/assets/player");
const baseUrl = (process.env.PLAYER_ASSET_BASE_URL || "https://yexinmei-portfolio.vercel.app/assets/player").replace(/\/$/, "");

const expected = [
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

async function install() {
  fs.mkdirSync(outRoot, { recursive: true });

  const missing = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (missing.length === 0) {
    console.log(`PLAYER assets verified: ${expected.length}/${expected.length}`);
    return;
  }

  console.log(`PLAYER assets missing locally: ${missing.length}. Restoring from last production.`);

  for (const file of missing) {
    const response = await fetch(`${baseUrl}/${file}`);
    if (!response.ok) {
      throw new Error(`Failed to restore PLAYER asset ${file}: HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) {
      throw new Error(`Restored PLAYER asset is not a valid PNG: ${file}`);
    }

    fs.writeFileSync(path.join(outRoot, file), buffer);
  }

  const invalid = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (invalid.length > 0) {
    throw new Error(`PLAYER asset verification failed: ${invalid.join(", ")}`);
  }

  console.log(`PLAYER assets restored: ${expected.length}/${expected.length}`);
}

await install();
