import fs from "node:fs";
import path from "node:path";

const sourceUrl = "https://raw.githubusercontent.com/luoxiluoye/yexinmei-portfolio/2feef31e0647628ba668426a4cb2d02d215c0b0a/public/assets/player/snapshot/portrait-hq.webp";
const outPath = path.resolve("public/assets/player/snapshot/portrait-900x675-v2.webp");

function isValidWebp(buffer) {
  if (buffer.length < 100000) return false;
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF") return false;
  if (buffer.subarray(8, 12).toString("ascii") !== "WEBP") return false;

  if (buffer.subarray(12, 16).toString("ascii") === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return width === 900 && height === 675;
  }

  return true;
}

async function installPortrait() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  if (fs.existsSync(outPath)) {
    const existing = fs.readFileSync(outPath);
    if (isValidWebp(existing)) {
      console.log(`PLAYER portrait verified: ${existing.length} bytes`);
      return;
    }
  }

  console.log("PLAYER portrait missing or truncated; fetching immutable 900x675 source...");
  const response = await fetch(sourceUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to fetch PLAYER portrait: HTTP ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!isValidWebp(buffer)) {
    throw new Error(`PLAYER portrait validation failed: ${buffer.length} bytes`);
  }

  fs.writeFileSync(outPath, buffer);
  console.log(`PLAYER portrait restored: ${buffer.length} bytes -> ${outPath}`);
}

await installPortrait();
