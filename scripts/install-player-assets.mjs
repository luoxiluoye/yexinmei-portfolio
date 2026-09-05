import fs from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const outRoot = path.resolve("public/assets/player");
const archivePath = path.resolve("asset-delivery/player-page-pixel-assets-18.zip");
const base64Dir = path.resolve("asset-delivery/player-b64");
const remoteBaseUrl = (process.env.PLAYER_ASSET_BASE_URL || "https://yexinmei-portfolio.vercel.app/assets/player").replace(/\/$/, "");

const expected = [
  "achievement-badge.png", "fact-camera-kit.png", "fact-cat-npc.png", "fact-ccd.png",
  "fact-content-spark.png", "fact-notes.png", "inspect-eye.png", "journey-community.png",
  "journey-content.png", "journey-film.png", "journey-global.png", "journey-media.png",
  "journey-now.png", "journey-sidequest.png", "memory-archive.png", "memory-arrow-left.png",
  "memory-arrow-right.png", "memory-locked.png",
];

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const localZipSignature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

function validPng(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const fd = fs.openSync(filePath, "r");
  const header = Buffer.alloc(8);
  try { fs.readSync(fd, header, 0, 8, 0); } finally { fs.closeSync(fd); }
  return header.equals(pngSignature);
}

function findEocd(buffer) {
  if (buffer.length < 22) return -1;
  const signature = 0x06054b50;
  const minOffset = Math.max(0, buffer.length - 65557);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === signature) return offset;
  }
  return -1;
}

function decodeZipEntry(method, compressed, uncompressedSize, fileName) {
  let data;
  if (method === 0) data = Buffer.from(compressed);
  else if (method === 8) data = inflateRawSync(compressed);
  else throw new Error(`unsupported compression method ${method}: ${fileName}`);
  if (data.length !== uncompressedSize) throw new Error(`size mismatch: ${fileName}`);
  return data;
}

function readZipEntriesFromLocalHeaders(archive) {
  const entries = new Map();
  let offset = 0;

  while (offset + 30 <= archive.length) {
    const headerOffset = archive.indexOf(localZipSignature, offset);
    if (headerOffset < 0 || headerOffset + 30 > archive.length) break;

    const flags = archive.readUInt16LE(headerOffset + 6);
    const method = archive.readUInt16LE(headerOffset + 8);
    const compressedSize = archive.readUInt32LE(headerOffset + 18);
    const uncompressedSize = archive.readUInt32LE(headerOffset + 22);
    const fileNameLength = archive.readUInt16LE(headerOffset + 26);
    const extraLength = archive.readUInt16LE(headerOffset + 28);

    if ((flags & 0x0008) || fileNameLength === 0 || fileNameLength > 512 || extraLength > 4096) {
      offset = headerOffset + 4;
      continue;
    }

    const nameStart = headerOffset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataStart > archive.length || dataEnd > archive.length) {
      offset = headerOffset + 4;
      continue;
    }

    const fileName = archive.subarray(nameStart, nameStart + fileNameLength).toString("utf8");
    const baseName = path.basename(fileName);

    if (expected.includes(baseName)) {
      try {
        const compressed = archive.subarray(dataStart, dataEnd);
        entries.set(baseName, decodeZipEntry(method, compressed, uncompressedSize, fileName));
      } catch {
        // Keep scanning; another intact copy may exist later in the concatenated bundle.
      }
    }

    offset = Math.max(dataEnd, headerOffset + 4);
  }

  if (entries.size === 0) throw new Error("no recoverable local ZIP entries found");
  console.warn(`PLAYER ZIP central directory unavailable; recovered ${entries.size} expected entries from local headers.`);
  return entries;
}

function readZipEntriesFromBuffer(archive) {
  const eocd = findEocd(archive);
  if (eocd < 0) return readZipEntriesFromLocalHeaders(archive);

  const entryCount = archive.readUInt16LE(eocd + 10);
  let offset = archive.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) throw new Error(`central directory invalid at entry ${index + 1}`);
    const method = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localHeaderOffset = archive.readUInt32LE(offset + 42);
    const fileName = archive.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");
    offset += 46 + fileNameLength + extraLength + commentLength;
    if (fileName.endsWith("/")) continue;
    if (archive.readUInt32LE(localHeaderOffset) !== 0x04034b50) throw new Error(`local header invalid: ${fileName}`);
    const localNameLength = archive.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = archive.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = archive.subarray(dataStart, dataStart + compressedSize);
    entries.set(path.basename(fileName), decodeZipEntry(method, compressed, uncompressedSize, fileName));
  }
  return entries;
}

function tryRepositoryEntries() {
  const candidates = [];
  if (fs.existsSync(archivePath)) candidates.push({ label: "repository ZIP", buffer: fs.readFileSync(archivePath) });

  if (fs.existsSync(base64Dir)) {
    const parts = fs.readdirSync(base64Dir).filter((name) => name.startsWith("player-assets.b64.")).sort();
    if (parts.length > 0) {
      const encoded = parts.map((name) => fs.readFileSync(path.join(base64Dir, name), "utf8")).join("").replace(/\s+/g, "");
      candidates.push({ label: `repository base64 bundle (${parts.length} parts)`, buffer: Buffer.from(encoded, "base64") });
    }
  }

  for (const candidate of candidates) {
    try {
      const entries = readZipEntriesFromBuffer(candidate.buffer);
      const missing = expected.filter((file) => !entries.has(file));
      if (missing.length > 0) throw new Error(`missing ${missing.length} expected files`);
      console.log(`PLAYER asset source: ${candidate.label}`);
      return entries;
    } catch (error) {
      console.warn(`PLAYER asset source skipped (${candidate.label}): ${error.message}`);
    }
  }
  return null;
}

async function restoreFromRemote(files) {
  console.warn("PLAYER repository bundle unavailable; using production asset fallback.");
  for (const file of files) {
    const response = await fetch(`${remoteBaseUrl}/${file}`);
    if (!response.ok) throw new Error(`Failed to restore PLAYER asset ${file}: HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) throw new Error(`Restored PLAYER asset is not a valid PNG: ${file}`);
    fs.writeFileSync(path.join(outRoot, file), buffer);
  }
}

async function install() {
  fs.mkdirSync(outRoot, { recursive: true });
  const missing = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (missing.length === 0) {
    console.log(`PLAYER assets verified: ${expected.length}/${expected.length}`);
    return;
  }

  console.log(`PLAYER assets missing locally: ${missing.length}.`);
  const entries = tryRepositoryEntries();
  if (entries) {
    for (const file of missing) {
      const buffer = entries.get(file);
      if (!buffer || buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) throw new Error(`PLAYER asset in repository bundle is not a valid PNG: ${file}`);
      fs.writeFileSync(path.join(outRoot, file), buffer);
    }
  } else {
    await restoreFromRemote(missing);
  }

  const invalid = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (invalid.length > 0) throw new Error(`PLAYER asset verification failed: ${invalid.join(", ")}`);
  console.log(`PLAYER assets restored: ${expected.length}/${expected.length}`);
}

await install();
