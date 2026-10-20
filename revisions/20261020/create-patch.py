#!/usr/bin/env python3
"""Package only the approved 2026-10-20 edits for an inherited Vercel build.

This generator performs no network, Git, deployment, or environment operations.
Run it after all approved files are complete.  Missing files are errors, never
placeholders.  The emitted CommonJS script is self-contained and runs the
existing `npm run build` only after checking the original deployment identity.
Its only downloads are the two approved new WebP assets, fetched from the same
immutable GitHub revision as the script and verified before any source is written.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path, PurePosixPath


WORKSPACE = Path(__file__).resolve().parent
SITE = WORKSPACE.parents[1]
SOURCE_MANIFEST = WORKSPACE / "original-source-manifest.json"
OUTPUT = SITE / "revisions/20261020/apply.cjs"
BASE_DEPLOYMENT = "dpl_9rpmmsW9wSMz5r376WsNQo75U36Z"
OLD_ROUTES = '["/portfolio", "/inventory", "/journal"]'
NEW_ROUTES = '["/portfolio"]'
ASSET_TARGETS = (
    "public/assets/profile-20261020/editorial-study.webp",
    "public/assets/profile-20261020/editorial-light.webp",
)
MAX_ASSET_BYTES = 8 * 1024 * 1024

APP_TARGETS = (
    "app/page.tsx",
    "app/player/page.tsx",
    "app/quests/page.tsx",
    "app/quests/[slug]/page.tsx",
    "app/quests/[slug]/not-found.tsx",
    "app/quests/red-leaf/page.tsx",
    "app/contact/page.tsx",
    "app/inventory/page.tsx",
    "app/journal/page.tsx",
    "app/journal/[slug]/page.tsx",
    "app/player/layout.tsx",
    "app/quests/layout.tsx",
    "app/contact/layout.tsx",
    "app/inventory/layout.tsx",
    "app/journal/layout.tsx",
)
COMPONENT_STEMS = (
    "approved-home",
    "approved-contact",
    "approved-profile",
    "approved-experience",
    "practice-details",
    "resume-content",
    "support-pages",
    "legacy-practice",
)
SHARED_TARGETS = (
    "components/layout/site-chrome.tsx",
    "components/layout/site-frame.tsx",
)
IDENTITY_ANCHORS = (
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "vercel.json",
    "app/layout.tsx",
    "app/globals.css",
    "app/portfolio/page.tsx",
    "components/layout/portfolio-header.tsx",
    "data/profile.ts",
    "data/quests.ts",
    "data/photography.json",
    "data/writing-works.json",
    "lib/real-assets.json",
    "lib/navigation.ts",
    "styles/approved-site.css",
    "styles/professional-site.css",
)


def digest(data: bytes, algorithm: str = "sha256") -> str:
    return hashlib.new(algorithm, data).hexdigest()


def validate_relative_path(value: str) -> str:
    if not isinstance(value, str):
        raise ValueError("Source path must be a string")
    parts = value.split("/")
    if (
        not value
        or value.startswith("/")
        or "\\" in value
        or any(ord(c) < 32 for c in value)
        or any(part in {"", ".", ".."} for part in parts)
        or PurePosixPath(value).as_posix() != value
    ):
        raise ValueError(f"Unsafe relative path: {value!r}")
    return value


def checked_local_file(relative: str) -> Path:
    validate_relative_path(relative)
    candidate = SITE
    for part in relative.split("/"):
        candidate = candidate / part
        if candidate.is_symlink():
            raise ValueError(f"Refusing symlink in approved path: {relative}")
    if not candidate.is_file():
        raise ValueError(f"Approved file is missing or is not a regular file: {relative}")
    return candidate


def read_source_manifest() -> tuple[dict[str, str], bytes]:
    raw = SOURCE_MANIFEST.read_bytes()
    records = json.loads(raw)
    if not isinstance(records, list):
        raise ValueError("source-files.json must contain a list of path/uid objects")
    originals: dict[str, str] = {}
    for record in records:
        api_path = record.get("path", "")
        sha1 = record.get("uid", "")
        if not api_path.startswith("src/"):
            raise ValueError(f"Unexpected Vercel source-tree prefix: {api_path!r}")
        # `src/` is the API's virtual source root, not a local source directory.
        relative = validate_relative_path(api_path.removeprefix("src/"))
        if not isinstance(sha1, str) or not re.fullmatch(r"[0-9a-f]{40}", sha1):
            raise ValueError(f"Missing full original SHA1 for {relative}")
        if relative in originals:
            raise ValueError(f"Duplicate source manifest path: {relative}")
        originals[relative] = sha1
    return originals, raw


def collect_targets() -> list[str]:
    targets = list(APP_TARGETS)
    problems: list[str] = []
    for stem in COMPONENT_STEMS:
        choices = [
            f"components/professional/{stem}.tsx",
            f"components/professional/{stem}.ts",
        ]
        found = [candidate for candidate in choices if (SITE / candidate).exists()]
        if len(found) != 1:
            detail = "missing" if not found else "ambiguous: both extensions exist"
            problems.append(f"  {stem}: {detail}; expected exactly one of {', '.join(choices)}")
        else:
            targets.append(found[0])
    targets.append("components/professional/resume.module.css")
    for relative in targets:
        try:
            checked_local_file(relative)
        except ValueError as error:
            problems.append(f"  {error}")
    if problems:
        raise ValueError(
            "Approved source files are not ready. No patch was written and no placeholders were created.\n"
            + "\n".join(problems)
        )
    if len(targets) != 24 or len(set(targets)) != len(targets):
        raise ValueError("Expected exactly 24 unique approved source files")
    return sorted(targets)


def collect_assets(originals: dict[str, str]) -> list[dict]:
    assets = []
    problems: list[str] = []
    for relative in ASSET_TARGETS:
        try:
            if relative in originals:
                raise ValueError(f"New asset overlaps an original source manifest path: {relative}")
            file = checked_local_file(relative)
            size = file.stat().st_size
            if not 20 <= size <= MAX_ASSET_BYTES:
                raise ValueError(f"Approved WebP must be between 20 bytes and 8 MiB: {relative}")
            raw = file.read_bytes()
            if (
                raw[:4] != b"RIFF"
                or raw[8:12] != b"WEBP"
                or int.from_bytes(raw[4:8], "little") + 8 != len(raw)
            ):
                raise ValueError(f"Approved asset is not a complete RIFF WebP file: {relative}")
            assets.append({"path": relative, "size": len(raw), "sha256": digest(raw)})
        except (OSError, ValueError) as error:
            problems.append(f"  {error}")
    if problems:
        raise ValueError(
            "Approved new image assets are not ready. No patch was written and no images were created.\n"
            + "\n".join(problems)
        )
    return sorted(assets, key=lambda item: item["path"])


RUNTIME = r'''
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

function fail(message) {
  throw new Error(`[profile-preview] ${message}`);
}

function hashBuffer(buffer, algorithm = "sha256") {
  return crypto.createHash(algorithm).update(buffer).digest("hex");
}

function assertRelative(relative) {
  if (typeof relative !== "string" || !relative || relative.startsWith("/") ||
      relative.includes("\\") || /[\x00-\x1f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) {
    fail("Invalid relative source path");
  }
  return relative;
}

function locate(root, relative, { allowMissing = false, file = true } = {}) {
  assertRelative(relative);
  let current = root;
  const parts = relative.split("/");
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT" && allowMissing) return current + parts.slice(index + 1).map(part => path.sep + part).join("");
      fail(`Required source path is unavailable: ${relative}`);
    }
    if (stat.isSymbolicLink()) fail(`Source symlink is not permitted: ${relative}`);
    if (index < parts.length - 1 && !stat.isDirectory()) fail(`Source ancestor is not a directory: ${relative}`);
    if (index === parts.length - 1 && file && !stat.isFile()) fail(`Source path is not a regular file: ${relative}`);
  }
  return current;
}

function hashFile(root, relative, algorithm = "sha256") {
  const absolute = locate(root, relative);
  const hash = crypto.createHash(algorithm);
  const descriptor = fs.openSync(absolute, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    for (;;) {
      const count = fs.readSync(descriptor, buffer, 0, buffer.length, null);
      if (!count) break;
      hash.update(buffer.subarray(0, count));
    }
  } finally {
    fs.closeSync(descriptor);
  }
  return hash.digest("hex");
}

function validateEmbedded() {
  if (spec.baseDeployment !== "dpl_9rpmmsW9wSMz5r376WsNQo75U36Z") fail("Unexpected base deployment");
  const approved = new Set(spec.approvedWrites);
  if (approved.size !== 24 || spec.files.length !== 24) fail("Approved payload must contain exactly 24 files");
  const seen = new Set();
  for (const item of spec.files) {
    assertRelative(item.path);
    if (!approved.has(item.path) || seen.has(item.path)) fail(`Unexpected or duplicate payload: ${item.path}`);
    if (item.path.startsWith("app/portfolio/") || item.path.startsWith("public/")) fail("Payload overlaps a protected portfolio or asset path");
    if (typeof item.content !== "string" || !/^[0-9a-f]{64}$/.test(item.sha256) ||
        hashBuffer(Buffer.from(item.content, "utf8")) !== item.sha256) fail(`Embedded payload checksum mismatch: ${item.path}`);
    seen.add(item.path);
  }
  const expectedAssets = [
    "public/assets/profile-20261020/editorial-light.webp",
    "public/assets/profile-20261020/editorial-study.webp",
  ];
  if (!Array.isArray(spec.assets) || spec.assets.length !== 2 ||
      JSON.stringify(spec.assets.map(item => item.path).sort()) !== JSON.stringify(expectedAssets)) {
    fail("Only the two approved namespaced image additions are allowed");
  }
  for (const asset of spec.assets) {
    assertRelative(asset.path);
    if (!/^[0-9a-f]{64}$/.test(asset.sha256) || !Number.isSafeInteger(asset.size) ||
        asset.size < 20 || asset.size > 8 * 1024 * 1024 || approved.has(asset.path) ||
        Object.hasOwn(spec.originalSha1, asset.path) || !spec.mustBeAbsent.includes(asset.path)) {
      fail(`Invalid new image manifest: ${asset.path}`);
    }
  }
  if (spec.sharedPatches.length !== 2 || spec.oldRoutes !== '["/portfolio", "/inventory", "/journal"]' ||
      spec.newRoutes !== '["/portfolio"]') fail("Unexpected shared route patch");
  const expectedShared = ["components/layout/site-chrome.tsx", "components/layout/site-frame.tsx"];
  if (JSON.stringify([...spec.sharedPatches].sort()) !== JSON.stringify(expectedShared)) fail("Unexpected shared source targets");
  for (const relative of [...spec.protectedRoots, ...spec.protectedRootFiles, ...Object.keys(spec.originalSha1)]) assertRelative(relative);
}

function verifyVercelConfig(root, expectedSha1, revision) {
  const raw = fs.readFileSync(locate(root, "vercel.json"));
  if (hashBuffer(raw, "sha1") === expectedSha1) return;
  let config;
  try { config = JSON.parse(raw.toString("utf8")); }
  catch { fail("The build-time vercel.json is not valid JSON"); }
  if (!config || Array.isArray(config) || typeof config !== "object") fail("Unexpected build-time Vercel config");
  const keys = Object.keys(config).sort();
  const schemaMatches = config.$schema === "https://openapi.vercel.sh/vercel.json";
  const aliasMatches = JSON.stringify(config.alias) === JSON.stringify(["luoyexinmei.top"]);
  const nameMatches = !Object.hasOwn(config, "name") || config.name === "yexinmei-portfolio";
  const expectedCommand = revision ? `curl -fsSL https://raw.githubusercontent.com/luoxiluoye/yexinmei-portfolio/${revision}/revisions/20261020/apply.cjs -o /tmp/profile-patch.cjs && node /tmp/profile-patch.cjs ${revision}` : null;
  const commandMatches = !Object.hasOwn(config, "buildCommand") || (expectedCommand && config.buildCommand === expectedCommand);
  const keysMatch = keys.every(key => ["$schema", "alias", "buildCommand", "name"].includes(key));
  if (!keysMatch || !schemaMatches || !aliasMatches || !commandMatches || !nameMatches) {
    fail(`Build-time vercel.json differs beyond the verified build normalization: keys=${JSON.stringify(keys)}; schemaMatches=${schemaMatches}; aliasMatches=${aliasMatches}; nameMatches=${nameMatches}; commandMatches=${Boolean(commandMatches)}; sha1=${hashBuffer(raw, "sha1")}`);
  }
  console.log(`[profile-preview] Vercel config normalization verified; original schema and alias unchanged; project name=${Object.hasOwn(config, "name")}; authorized command=${Object.hasOwn(config, "buildCommand")}`);
}

function preflight(root, revision) {
  const rootStat = fs.lstatSync(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) fail("Build root must be a regular directory");
  // The materialized source starts at app/, components/, etc., never src/app/.
  for (const relative of ["app", "components", "data", "public"]) {
    const absolute = locate(root, relative, { file: false });
    if (!fs.lstatSync(absolute).isDirectory()) fail(`Required source directory is unavailable: ${relative}`);
  }
  for (const [relative, expected] of Object.entries(spec.originalSha1)) {
    if (relative === "vercel.json") verifyVercelConfig(root, expected, revision);
    else if (hashFile(root, relative, "sha1") !== expected) fail(`Original deployment SHA1 mismatch: ${relative}`);
  }
  for (const relative of spec.mustBeAbsent) {
    const absolute = locate(root, relative, { allowMissing: true });
    if (fs.existsSync(absolute)) fail(`New approved file would overwrite an existing file: ${relative}`);
  }
  for (const relative of spec.approvedWrites) {
    // Known original files were required and hashed above. Other approved
    // routes may be new; do not invent a baseline SHA for the truncated tree.
    locate(root, relative, { allowMissing: true });
  }
  console.log(`[profile-preview] Original deployment verified: ${spec.baseDeployment}; ${Object.keys(spec.originalSha1).length} SHA1 anchors`);
}

function validateAssetBuffer(asset, buffer) {
  const approved = spec.assets.find(item => item.path === asset.path);
  if (!approved || approved.sha256 !== asset.sha256 || approved.size !== asset.size) fail("Unapproved new image descriptor");
  if (!Buffer.isBuffer(buffer) || buffer.length !== asset.size ||
      buffer.subarray(0, 4).toString("ascii") !== "RIFF" ||
      buffer.subarray(8, 12).toString("ascii") !== "WEBP" ||
      buffer.readUInt32LE(4) + 8 !== buffer.length || hashBuffer(buffer) !== asset.sha256) {
    fail(`New image content or SHA256 mismatch: ${asset.path}`);
  }
}

async function downloadAsset(asset, revision) {
  if (!/^[0-9a-f]{40}$/.test(revision || "")) fail("New images require the pinned 40-character revision SHA");
  const approved = spec.assets.find(item => item.path === asset.path);
  if (!approved || approved.sha256 !== asset.sha256 || approved.size !== asset.size) fail("Unapproved image download");
  const url = `https://raw.githubusercontent.com/luoxiluoye/yexinmei-portfolio/${revision}/${asset.path}`;
  let response;
  try {
    response = await fetch(url, {
      redirect: "error",
      credentials: "omit",
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    fail(`Unable to download pinned image: ${asset.path}`);
  }
  if (response.status !== 200 || !response.body) fail(`Pinned image request failed (${response.status}): ${asset.path}`);
  const chunks = [];
  let received = 0;
  try {
    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      received += buffer.length;
      if (received > asset.size) fail(`Pinned image exceeds its approved size: ${asset.path}`);
      chunks.push(buffer);
    }
  } catch {
    fail(`Pinned image stream failed or exceeded its approved size: ${asset.path}`);
  }
  const buffer = Buffer.concat(chunks, received);
  validateAssetBuffer(asset, buffer);
  return buffer;
}

function writeNewAsset(root, asset, buffer) {
  validateAssetBuffer(asset, buffer);
  const absolute = locate(root, asset.path, { allowMissing: true });
  // Recheck at write time. O_EXCL makes the no-overwrite requirement atomic,
  // unlike renaming a temporary file over an existing destination.
  if (fs.existsSync(absolute)) fail(`Refusing to replace an existing asset: ${asset.path}`);
  let ancestor = root;
  for (const segment of asset.path.split("/").slice(0, -1)) {
    ancestor = path.join(ancestor, segment);
    if (!fs.existsSync(ancestor)) fs.mkdirSync(ancestor, { mode: 0o755 });
    const stat = fs.lstatSync(ancestor);
    if (stat.isSymbolicLink() || !stat.isDirectory()) fail(`Unsafe new image ancestor: ${asset.path}`);
  }
  locate(root, asset.path, { allowMissing: true });
  const descriptor = fs.openSync(absolute,
    fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o644);
  try {
    fs.writeFileSync(descriptor, buffer);
  } finally {
    fs.closeSync(descriptor);
  }
  if (hashFile(root, asset.path) !== asset.sha256) fail(`New image failed its post-write checksum: ${asset.path}`);
}

function transformShared(original, relative) {
  const text = original.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(original)) fail(`Shared file is not valid UTF-8: ${relative}`);
  if (hashBuffer(original, "sha1") !== spec.originalSha1[relative]) fail(`Shared original SHA1 mismatch: ${relative}`);
  const first = text.indexOf(spec.oldRoutes);
  if (first === -1 || text.indexOf(spec.oldRoutes, first + spec.oldRoutes.length) !== -1) {
    fail(`Expected exactly one original creative-route array: ${relative}`);
  }
  // Nothing before or after the one array changes; /portfolio remains the sole
  // creative route, with its existing equality/prefix predicate left intact.
  return Buffer.from(text.slice(0, first) + spec.newRoutes + text.slice(first + spec.oldRoutes.length), "utf8");
}

function snapshotProtected(root, excluded) {
  const entries = [];
  function visit(relative) {
    const absolute = locate(root, relative, { file: false });
    const stat = fs.lstatSync(absolute);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(absolute).sort()) visit(`${relative}/${child}`);
    } else if (stat.isFile()) {
      if (!excluded.has(relative)) {
        entries.push({ path: relative, size: stat.size, mode: stat.mode & 0o777, sha256: hashFile(root, relative) });
      }
    } else {
      fail(`Unsupported entry in protected source: ${relative}`);
    }
  }
  // These roots come from the original Vercel source manifest. Every original
  // descendant of public/ is hashed. Only the two approved additions, required
  // to be absent in preflight, are checked separately against their pinned SHA256.
  // Build directories and environment/credential files are not inspected.
  for (const relative of spec.protectedRoots) visit(relative);
  for (const relative of spec.protectedRootFiles) visit(relative);
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return { entries, digest: hashBuffer(Buffer.from(JSON.stringify(entries), "utf8")) };
}

function assertSameSnapshot(before, after, phase) {
  if (before.digest === after.digest && before.entries.length === after.entries.length) return;
  const old = new Map(before.entries.map(item => [item.path, item]));
  const current = new Map(after.entries.map(item => [item.path, item]));
  const changed = [];
  for (const [relative, entry] of old) {
    if (!current.has(relative)) changed.push(`removed ${relative}`);
    else if (JSON.stringify(entry) !== JSON.stringify(current.get(relative))) changed.push(`changed ${relative}`);
  }
  for (const relative of current.keys()) if (!old.has(relative)) changed.push(`added ${relative}`);
  fail(`Protected source changed ${phase}: ${changed.slice(0, 16).join("; ")}${changed.length > 16 ? `; and ${changed.length - 16} more` : ""}`);
}

function writeAtomic(root, relative, content, counter) {
  const absolute = locate(root, relative, { allowMissing: true });
  const parentRelative = relative.split("/").slice(0, -1).join("/");
  let ancestor = root;
  for (const segment of parentRelative.split("/")) {
    ancestor = path.join(ancestor, segment);
    if (!fs.existsSync(ancestor)) fs.mkdirSync(ancestor, { mode: 0o755 });
    const stat = fs.lstatSync(ancestor);
    if (stat.isSymbolicLink() || !stat.isDirectory()) fail(`Unsafe approved source parent: ${parentRelative}`);
  }
  const parent = locate(root, parentRelative, { file: false });
  if (!fs.lstatSync(parent).isDirectory()) fail(`Missing approved source parent: ${parentRelative}`);
  // Rename prevents a hard-linked destination from altering another source file.
  const temporary = path.join(parent, `.profile-preview-${process.pid}-${counter}.tmp`);
  let descriptor;
  let ownedTemporary = false;
  const mode = fs.existsSync(absolute) ? fs.lstatSync(absolute).mode & 0o777 : 0o644;
  try {
    descriptor = fs.openSync(temporary, "wx", 0o600);
    ownedTemporary = true;
    fs.writeFileSync(descriptor, content);
    fs.fchmodSync(descriptor, mode);
    fs.closeSync(descriptor);
    descriptor = undefined;
    // Check again immediately before replacing, including all ancestors.
    locate(root, relative, { allowMissing: true });
    fs.renameSync(temporary, absolute);
    ownedTemporary = false;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (ownedTemporary) fs.unlinkSync(temporary);
  }
}

function verifyWritten(root, writes) {
  for (const [relative, buffer] of writes) {
    if (hashFile(root, relative) !== hashBuffer(buffer)) fail(`Approved output changed unexpectedly: ${relative}`);
  }
}

async function main() {
  const arguments_ = process.argv.slice(2);
  if (arguments_.length > 1 || (arguments_.length && arguments_[0] !== "--verify-only" && !/^[0-9a-f]{40}$/.test(arguments_[0]))) fail("Only --verify-only or the pinned revision SHA is supported");
  const revision = /^[0-9a-f]{40}$/.test(arguments_[0] || "") ? arguments_[0] : null;
  validateEmbedded();
  const root = process.cwd();
  preflight(root, revision);
  const excluded = new Set([...spec.approvedWrites, ...spec.sharedPatches, ...spec.assets.map(asset => asset.path)]);
  const writes = spec.files.map(item => [item.path, Buffer.from(item.content, "utf8")]);
  for (const relative of spec.sharedPatches) {
    writes.push([relative, transformShared(fs.readFileSync(locate(root, relative)), relative)]);
  }
  const before = snapshotProtected(root, excluded);
  console.log(`[profile-preview] Protected baseline: ${before.entries.length} files; SHA256 ${before.digest}`);
  if (arguments_[0] === "--verify-only") {
    console.log(`[profile-preview] Verification complete; ${writes.length} approved source writes and ${spec.assets.length} new images planned; no download, no files changed, no build run`);
    return;
  }
  if (!revision) fail("Applying a patch with new images requires its pinned revision SHA");
  // Fetch and validate both images before writing any source. URLs are fixed to
  // this repository and immutable revision, with no credentials or redirects.
  const downloaded = await Promise.all(spec.assets.map(async asset => ({ asset, buffer: await downloadAsset(asset, revision) })));
  writes.forEach(([relative, buffer], index) => writeAtomic(root, relative, buffer, index));
  for (const { asset, buffer } of downloaded) {
    writeNewAsset(root, asset, buffer);
    writes.push([asset.path, buffer]);
  }
  verifyWritten(root, writes);
  const afterPatch = snapshotProtected(root, excluded);
  assertSameSnapshot(before, afterPatch, "after patch");
  console.log(`[profile-preview] Patch verified: ${writes.length} approved files; protected ${afterPatch.entries.length} files; SHA256 ${afterPatch.digest}`);
  console.log("[profile-preview] Running the existing npm run build");
  // Deliberately inherit the existing build environment without reading,
  // printing, modifying, or transmitting its variables. No shell interpolation.
  const result = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit", shell: false });
  verifyWritten(root, writes);
  const afterBuild = snapshotProtected(root, excluded);
  assertSameSnapshot(before, afterBuild, "after npm run build");
  console.log(`[profile-preview] Post-build protection verified: ${afterBuild.entries.length} files; SHA256 ${afterBuild.digest}`);
  if (result.error) fail(`Build process failed to start (${result.error.code || "unknown error"})`);
  if (result.signal) fail(`Build terminated by ${result.signal}`);
  if (result.status !== 0) fail(`npm run build failed with exit status ${result.status}`);
  console.log(`[profile-preview] Build succeeded; portfolio source, protected source, data, and every original public asset are unchanged; ${spec.assets.length} approved new images verified`);
}

if (require.main === module) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : "[profile-preview] Build patch failed");
    process.exitCode = 1;
  });
}

// Imports never run main. Guard helpers support isolated temporary-directory tests.
module.exports = { validateEmbedded, assertRelative, transformShared, snapshotProtected, assertSameSnapshot, validateAssetBuffer, downloadAsset, writeNewAsset };
'''


def build_script() -> tuple[str, dict]:
    originals, raw_manifest = read_source_manifest()
    targets = collect_targets()
    assets = collect_assets(originals)
    anchor_paths = set(IDENTITY_ANCHORS) | set(SHARED_TARGETS)
    anchor_paths.update(path for path in targets if path in originals)
    anchor_paths.update(path for path in originals if path.startswith("components/portfolio/"))
    missing_anchors = sorted(anchor_paths - originals.keys())
    if missing_anchors:
        raise ValueError("Original SHA1 anchors missing from source-files.json: " + ", ".join(missing_anchors))

    # An independently recovered complete shared file confirms that UID means
    # raw-content SHA1 and that the intended byte-exact replacement exists.
    recovered_frame = WORKSPACE / "original-site-frame.txt"
    recovered = recovered_frame.read_bytes()
    if digest(recovered, "sha1") != originals["components/layout/site-frame.tsx"]:
        raise ValueError("Recovered live site-frame.tsx does not match its original SHA1")
    if recovered.count(OLD_ROUTES.encode()) != 1:
        raise ValueError("Recovered site-frame.tsx must contain exactly one original route array")

    files = []
    for relative in targets:
        raw = checked_local_file(relative).read_bytes()
        if not raw:
            raise ValueError(f"Approved file is empty: {relative}")
        content = raw.decode("utf-8", errors="strict")
        if "\x00" in content:
            raise ValueError(f"Approved file contains a NUL byte: {relative}")
        files.append({"path": relative, "sha256": digest(raw), "content": content})
    # Concurrent contributors may still be editing. Never package a mixed read.
    for item in files:
        if digest(checked_local_file(item["path"]).read_bytes()) != item["sha256"]:
            raise ValueError(f"Approved file changed during packaging; retry after edits finish: {item['path']}")
    for asset in assets:
        if digest(checked_local_file(asset["path"]).read_bytes()) != asset["sha256"]:
            raise ValueError(f"Approved image changed during packaging; retry after edits finish: {asset['path']}")

    protected_roots = sorted({relative.split("/")[0] for relative in originals if "/" in relative})
    expected_roots = {"app", "components", "data", "lib", "public", "scripts", "styles", "types"}
    if set(protected_roots) != expected_roots:
        raise ValueError("Original source roots changed; review the protection scope before generating")
    root_files = sorted(relative for relative in originals if "/" not in relative)
    must_be_absent = sorted(
        relative for relative in targets
        if relative.startswith("components/professional/") and relative not in originals
    )
    must_be_absent.extend(asset["path"] for asset in assets)
    # A stale sibling module with the other extension can alter TS resolution.
    for relative in targets:
        if relative.startswith("components/professional/") and relative.endswith((".ts", ".tsx")):
            sibling = relative[:-4] + ".ts" if relative.endswith(".tsx") else relative[:-3] + ".tsx"
            if sibling not in originals:
                must_be_absent.append(sibling)
    spec = {
        "baseDeployment": BASE_DEPLOYMENT,
        "sourceManifestSha256": digest(raw_manifest),
        "approvedWrites": targets,
        "sharedPatches": list(SHARED_TARGETS),
        "oldRoutes": OLD_ROUTES,
        "newRoutes": NEW_ROUTES,
        "originalSha1": {relative: originals[relative] for relative in sorted(anchor_paths)},
        "mustBeAbsent": sorted(set(must_be_absent)),
        "protectedRoots": protected_roots,
        "protectedRootFiles": root_files,
        "files": files,
        "assets": assets,
    }
    script = (
        '// Generated by revisions/20261020/create-patch.py; applies only to the pinned original deployment.\n'
        '// Source files are embedded; only two new images are fetched from the pinned GitHub revision.\n'
        '"use strict";\n\nconst spec = '
        + json.dumps(spec, ensure_ascii=False, indent=2)
        + ";\n"
        + RUNTIME
    )
    return script, spec


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="validate all inputs without writing apply.cjs")
    args = parser.parse_args()
    try:
        script, spec = build_script()
        encoded = script.encode("utf-8")
        if not args.check:
            if SITE.is_symlink() or OUTPUT.is_symlink():
                raise ValueError("Refusing a symlinked patch output")
            for directory in (OUTPUT.parent.parent, OUTPUT.parent):
                if directory.is_symlink():
                    raise ValueError("Refusing a symlinked patch output directory")
                directory.mkdir(exist_ok=True)
            OUTPUT.write_bytes(encoded)
        print(f"{'Validated' if args.check else 'Generated'} {len(spec['files'])} approved files + 2 exact shared route edits + {len(spec['assets'])} new pinned images")
        print(f"Original SHA1 anchors: {len(spec['originalSha1'])}; protected roots: {', '.join(spec['protectedRoots'])}")
        print(f"Patch bytes: {len(encoded)}; SHA256: {digest(encoded)}")
        if not args.check:
            print(f"Output: {OUTPUT}")
        return 0
    except (OSError, ValueError, KeyError, TypeError, UnicodeError) as error:
        print(f"Cannot generate preview patch: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
