import fs from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const outRoot = path.resolve("public/assets/player");
const archivePath = path.resolve("asset-delivery/player-page-pixel-assets-18.zip");

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

function findEocd(buffer) {
  const signature = 0x06054b50;
  const minOffset = Math.max(0, buffer.length - 65557);

  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === signature) return offset;
  }

  throw new Error("PLAYER asset archive is not a valid ZIP: EOCD not found");
}

function readZipEntries(zipPath) {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`PLAYER asset archive is missing: ${zipPath}`);
  }

  const archive = fs.readFileSync(zipPath);
  const eocd = findEocd(archive);
  const entryCount = archive.readUInt16LE(eocd + 10);
  let offset = archive.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`PLAYER asset archive central directory is invalid at entry ${index + 1}`);
    }

    const method = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localHeaderOffset = archive.readUInt32LE(offset + 42);
    const fileName = archive
      .subarray(offset + 46, offset + 46 + fileNameLength)
      .toString("utf8");

    offset += 46 + fileNameLength + extraLength + commentLength;

    if (fileName.endsWith("/")) continue;
    if (archive.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
      throw new Error(`PLAYER asset archive local header is invalid: ${fileName}`);
    }

    const localNameLength = archive.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = archive.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = archive.subarray(dataStart, dataStart + compressedSize);

    let data;
    if (method === 0) {
      data = Buffer.from(compressed);
    } else if (method === 8) {
      data = inflateRawSync(compressed);
    } else {
      throw new Error(`Unsupported ZIP compression method ${method}: ${fileName}`);
    }

    if (data.length !== uncompressedSize) {
      throw new Error(`PLAYER asset archive size mismatch: ${fileName}`);
    }

    entries.set(path.basename(fileName), data);
  }

  return entries;
}

function install() {
  fs.mkdirSync(outRoot, { recursive: true });

  const missing = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (missing.length === 0) {
    console.log(`PLAYER assets verified: ${expected.length}/${expected.length}`);
    return;
  }

  console.log(`PLAYER assets missing locally: ${missing.length}. Restoring from repository archive.`);
  const entries = readZipEntries(archivePath);

  for (const file of missing) {
    const buffer = entries.get(file);
    if (!buffer) {
      throw new Error(`PLAYER asset is missing from repository archive: ${file}`);
    }
    if (buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) {
      throw new Error(`PLAYER asset in repository archive is not a valid PNG: ${file}`);
    }

    fs.writeFileSync(path.join(outRoot, file), buffer);
  }

  const invalid = expected.filter((file) => !validPng(path.join(outRoot, file)));
  if (invalid.length > 0) {
    throw new Error(`PLAYER asset verification failed: ${invalid.join(", ")}`);
  }

  console.log(`PLAYER assets restored from repository archive: ${expected.length}/${expected.length}`);
}

install();
