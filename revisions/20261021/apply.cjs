// Applies the approved custom artwork to the complete original deployed source.
// The previous patch's 442-file preservation checks are retained in full.
"use strict";
const fs = require("node:fs");
const crypto = require("node:crypto");
const { spawn, spawnSync } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");
const REPO = "https://raw.githubusercontent.com/luoxiluoye/yexinmei-portfolio/";
const BASE = "c21e958d033c7dcb3fd512f9677ce47accaaa430";
const BASE_BLOB = "795844f350866d3817253e62a191e33e4f344371";
const ATLAS_PATH = "public/assets/profile-20261021/ui-atlas.webp";
const ATLAS_SHA = "29bdf172739394cdcfd4ae8d6c190e26e6eb9b46d9655aaa99101e2165316146";
const PARTS = [
  [8415, "f3fc052351fa004ef8dbb67082b873e0fd576ff8"],
  [8415, "72f3023220ca365f20e8a6bdb649c474624a5623"],
  [8412, "b6ade2a21c09f150ab0ac389802d74b9eed65027"],
];
const EDITABLE = new Set([
  "components/professional/editorial-ui.tsx",
  "components/professional/resume.module.css",
  "components/professional/approved-home.tsx",
  "components/professional/approved-contact.tsx",
  "components/professional/approved-profile.tsx",
  "components/professional/support-pages.tsx",
]);
function fail(message) { throw new Error(`[custom-ui] ${message}`); }
function sha(buffer, algorithm = "sha256") { return crypto.createHash(algorithm).update(buffer).digest("hex"); }
function gitBlob(buffer) { return sha(Buffer.concat([Buffer.from(`blob ${buffer.length}\0`), buffer]), "sha1"); }
async function readPinned(revision, relative, maxBytes) {
  if (!/^[a-f0-9]{40}$/.test(revision) || !/^[a-zA-Z0-9/_.-]+$/.test(relative) || relative.includes("..")) fail("Invalid pinned resource");
  const response = await fetch(REPO + revision + "/" + relative, { redirect: "error", credentials: "omit", signal: AbortSignal.timeout(30000) });
  if (response.status !== 200 || !response.body) fail(`Resource unavailable: ${relative} (${response.status})`);
  let size = 0; const chunks = [];
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > maxBytes) fail(`Resource too large: ${relative}`);
    chunks.push(Buffer.from(chunk));
  }
  if (!size) fail(`Empty resource: ${relative}`);
  return Buffer.concat(chunks);
}
function replaceExact(text, from, to, count = 1) {
  if (typeof from !== "string" || !from || typeof to !== "string" || !Number.isInteger(count) || count < 1) fail("Invalid replacement");
  const parts = text.split(from);
  if (parts.length - 1 !== count) fail(`Source differs from approved base near ${from.slice(0, 100)}`);
  return parts.join(to);
}
async function smokeTest() {
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3187", "-H", "127.0.0.1"], { cwd: process.cwd(), stdio: ["ignore", "ignore", "pipe"], shell: false });
  let bootError = "";
  server.stderr.on("data", chunk => { if (bootError.length < 2000) bootError += chunk.toString(); });
  const origin = "http://127.0.0.1:3187";
  try {
    let started = false;
    for (let i = 0; i < 40; i++) {
      if (server.exitCode !== null) fail(`Preview server exited: ${bootError}`);
      try { const res = await fetch(origin, { signal: AbortSignal.timeout(1000) }); if (res.ok) { started = true; break; } } catch {}
      await delay(250);
    }
    if (!started) fail(`Preview server did not start: ${bootError}`);
    const routes = ["/", "/contact", "/player", "/quests", "/inventory", "/journal", "/journal/what-a-camera-keeps", "/quests/campus-publicity"];
    for (const route of routes) {
      const res = await fetch(origin + route, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) fail(`Page failed: ${route} (${res.status})`);
      const html = await res.text();
      const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
      if (!main) fail(`Missing page content: ${route}`);
      if (/[👋🌿📷]|✍️|⚙️/u.test(main)) fail(`Old emoji remains: ${route}`);
      const count = (main.match(/data-ui-asset=/g) || []).length;
      if (route !== "/quests/campus-publicity" && count === 0) fail(`Custom artwork missing: ${route}`);
      if (route === "/contact") {
        for (const name of ["mail", "message", "phone", "copy", "leaf"]) if (!main.includes(`data-ui-asset="${name}"`)) fail(`Missing contact icon: ${name}`);
        if (!main.includes('aria-label="复制邮箱"') || !main.includes('aria-label="复制微信号"')) fail("Copy controls were lost");
      }
      console.log(`[custom-ui] Route ${route}: 200; ${count} isolated artwork elements; no old emoji`);
    }
    const image = await fetch(origin + ATLAS_PATH.replace(/^public/, ""));
    const bytes = Buffer.from(await image.arrayBuffer());
    if (!image.ok || bytes.length !== 25242 || sha(bytes) !== ATLAS_SHA) fail("Served artwork does not match the approved image");
    for (const route of ["/portfolio", "/portfolio/photography", "/portfolio/writing", "/portfolio/aigc", "/portfolio/video"]) {
      const res = await fetch(origin + route, { signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      if (!res.ok || html.includes("data-ui-asset=")) fail(`Portfolio isolation failed: ${route}`);
      console.log(`[custom-ui] Portfolio isolation ${route}: 200; no custom-profile artwork injected`);
    }
    console.log("[custom-ui] PASS: eight page responses, five unchanged portfolio routes, and the exact 25242-byte artwork resource");
  } finally {
    server.kill("SIGTERM");
  }
}
async function main() {
  const revision = process.argv[2];
  if (process.argv.length !== 3 || !/^[a-f0-9]{40}$/.test(revision || "")) fail("A pinned commit SHA is required");
  const [parent, ui, css, changesBytes, ...parts] = await Promise.all([
    readPinned(BASE, "revisions/20261020/apply.cjs", 300000),
    readPinned(revision, "components/professional/editorial-ui.tsx", 15000),
    readPinned(revision, "revisions/20261021/ui-assets.css", 20000),
    readPinned(revision, "revisions/20261021/changes.json", 15000),
    ...PARTS.map((part, i) => readPinned(revision, `revisions/20261021/assets/ui-atlas.${i}.bin`, part[0])),
  ]);
  if (gitBlob(parent) !== BASE_BLOB) fail("Parent guard script changed");
  parts.forEach((part, i) => { if (part.length !== PARTS[i][0] || gitBlob(part) !== PARTS[i][1]) fail(`Artwork part ${i} changed`); });
  const atlas = Buffer.concat(parts);
  if (atlas.length !== 25242 || sha(atlas) !== ATLAS_SHA || atlas.toString("ascii", 0, 4) !== "RIFF" || atlas.toString("ascii", 8, 12) !== "WEBP" || atlas.readUInt32LE(4) + 8 !== atlas.length) fail("Artwork integrity failed");
  const source = parent.toString("utf8");
  const marker = ';\n\nconst fs = require("node:fs");';
  const start = source.indexOf("const spec = ");
  const end = source.indexOf(marker, start);
  if (start < 0 || end < 0) fail("Parent script format changed");
  const spec = JSON.parse(source.slice(start + "const spec = ".length, end));
  if (spec.baseDeployment !== "dpl_9rpmmsW9wSMz5r376WsNQo75U36Z" || spec.files.length !== 25 || spec.assets.length !== 2) fail("Parent protection scope changed");
  for (const file of spec.files) if (sha(Buffer.from(file.content)) !== file.sha256) fail(`Original embedded source corrupt: ${file.path}`);
  const originalFiles = new Map(spec.files.map(file => [file.path, file.content]));
  function setFile(relative, content) {
    if (!EDITABLE.has(relative)) fail(`Unapproved source write: ${relative}`);
    const file = spec.files.find(item => item.path === relative);
    if (!file || typeof content !== "string" || !content.length) fail(`Unknown or empty source: ${relative}`);
    file.content = content; file.sha256 = sha(Buffer.from(content));
  }
  const changes = JSON.parse(changesBytes.toString("utf8"));
  if (!Array.isArray(changes) || changes.length !== 7) fail("Unexpected change manifest");
  for (const item of changes) {
    const file = spec.files.find(file => file.path === item.path);
    if (!file) fail(`Unknown patch source: ${item.path}`);
    setFile(item.path, replaceExact(file.content, item.from, item.to, item.count));
  }
  setFile("components/professional/editorial-ui.tsx", ui.toString("utf8"));
  setFile("components/professional/resume.module.css", originalFiles.get("components/professional/resume.module.css") + "\n" + css.toString("utf8"));
  const copyStart = "  async function copy(";
  const copyEnd = "\n  return (";
  const oldContact = originalFiles.get("components/professional/approved-contact.tsx");
  const newContact = spec.files.find(file => file.path === "components/professional/approved-contact.tsx").content;
  const copyBlock = text => text.slice(text.indexOf(copyStart), text.indexOf(copyEnd));
  if (!oldContact.includes(copyStart) || copyBlock(oldContact) !== copyBlock(newContact)) fail("Clipboard logic changed unexpectedly");
  spec.assets.push({ path: ATLAS_PATH, size: atlas.length, sha256: ATLAS_SHA, base64: atlas.toString("base64") });
  spec.mustBeAbsent.push(ATLAS_PATH);
  let runtime = source.slice(end + 2);
  runtime = replaceExact(runtime,
    '    "public/assets/profile-20261020/editorial-study.webp",\n  ];',
    '    "public/assets/profile-20261020/editorial-study.webp",\n    "public/assets/profile-20261021/ui-atlas.webp",\n  ];');
  runtime = replaceExact(runtime, "spec.assets.length !== 2", "spec.assets.length !== 3");
  runtime = replaceExact(runtime, "async function downloadAsset(asset, revision) {", `async function downloadAsset(asset, revision) {\n  if (asset.path === "${ATLAS_PATH}") {\n    const buffer = Buffer.from(asset.base64, "base64");\n    validateAssetBuffer(asset, buffer);\n    return buffer;\n  }`);
  runtime = replaceExact(runtime, "${revision}/revisions/20261020/apply.cjs", "${revision}/revisions/20261021/apply.cjs");
  const temporary = "/tmp/profile-assets-assembled.cjs";
  fs.writeFileSync(temporary, '"use strict";\nconst spec = ' + JSON.stringify(spec) + ";\n" + runtime, { mode: 0o600 });
  console.log("[custom-ui] Verified generated artwork: 24 isolated tiles, 576x384, 25242 bytes");
  console.log("[custom-ui] Six non-portfolio sources updated; original clipboard behavior and 442-file guard retained");
  const build = spawnSync(process.execPath, [temporary, revision], { cwd: process.cwd(), stdio: "inherit", shell: false });
  if (build.error || build.signal || build.status !== 0) fail(`Guarded build failed (${build.status ?? build.signal ?? "start error"})`);
  await smokeTest();
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { replaceExact, sha, gitBlob };
