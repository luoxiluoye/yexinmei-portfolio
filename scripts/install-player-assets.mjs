import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const zipPath = path.resolve("asset-delivery/player-page-pixel-assets-18.zip");
const outRoot = path.resolve("public/assets/player");
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

if (!fs.existsSync(zipPath)) {
  throw new Error(`PLAYER asset ZIP not found: ${zipPath}`);
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "yexinmei-player-assets-"));

try {
  execFileSync("unzip", ["-q", "-o", zipPath, "-d", tempRoot], { stdio: "inherit" });
  fs.mkdirSync(outRoot, { recursive: true });

  for (const file of expected) {
    const source = path.join(tempRoot, file);
    if (!fs.existsSync(source)) {
      throw new Error(`Missing PLAYER asset in ZIP: ${file}`);
    }
    fs.copyFileSync(source, path.join(outRoot, file));
  }

  console.log(`PLAYER assets installed: ${expected.length}/${expected.length}`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
