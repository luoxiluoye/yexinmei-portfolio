import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const zipArg = process.argv[2];
if (!zipArg) {
  console.error('Usage: npm run assets:install -- "/path/to/web-asset-pack-delivery-qa.zip"');
  process.exit(1);
}

const zipPath = path.resolve(zipArg);
if (!fs.existsSync(zipPath)) {
  console.error(`Asset ZIP not found: ${zipPath}`);
  process.exit(1);
}

const expectedFolders = ["character", "cat", "world", "ui", "items"];
const outRoot = path.resolve(process.cwd(), "public/assets");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "yexinmei-assets-"));

function findFolder(root, folderName) {
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const next = path.join(current, entry.name);
      if (entry.name === folderName) return next;
      stack.push(next);
    }
  }
  return null;
}

try {
  execFileSync("unzip", ["-q", zipPath, "-d", tempRoot], { stdio: "inherit" });

  for (const folder of expectedFolders) {
    const source = findFolder(tempRoot, folder);
    if (!source) {
      throw new Error(`Could not locate ${folder}/ inside the asset ZIP.`);
    }

    const target = path.join(outRoot, folder);
    fs.mkdirSync(target, { recursive: true });

    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".png")) continue;
      fs.copyFileSync(path.join(source, entry.name), path.join(target, entry.name));
    }
  }

  console.log("Official asset folders copied into public/assets/.");
  execFileSync(process.execPath, [path.resolve("scripts/verify-assets.mjs")], {
    stdio: "inherit",
  });
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
