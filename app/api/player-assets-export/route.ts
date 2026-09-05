import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const files = [
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
] as const;

export async function GET(request: NextRequest) {
  const chunkParam = Number.parseInt(request.nextUrl.searchParams.get("chunk") ?? "0", 10);
  const chunk = Number.isFinite(chunkParam) ? Math.min(5, Math.max(0, chunkParam)) : 0;
  const selected = files.slice(chunk * 3, chunk * 3 + 3);
  const output: Record<string, string> = {};

  for (const file of selected) {
    const url = new URL(`/assets/player/${file}`, request.nextUrl.origin);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to read ${file}`, status: response.status }, { status: 500 });
    }
    output[file] = Buffer.from(await response.arrayBuffer()).toString("base64");
  }

  return NextResponse.json(output, {
    headers: { "Cache-Control": "no-store" },
  });
}
