import { NextRequest } from "next/server";
import { resolveSafeAudioUrl } from "@/lib/safe-audio-url";
import { PRACTICE_ENABLED } from "@/lib/feature-flags";

/**
 * Re-serves a pre-generated practice audio file from Strapi with a
 * browser-friendly Content-Type.
 *
 * Strapi serves WAV uploads as `audio/wave` with `X-Content-Type-Options:
 * nosniff`, which Chrome refuses to play (NotSupportedError) — it only accepts
 * `audio/wav`/`audio/x-wav` and won't sniff past the header. Proxying the file
 * same-origin with a corrected type fixes playback and lets the browser cache
 * it across sessions. `resolveSafeAudioUrl` restricts the target to trusted
 * Strapi uploads, so this can't be turned into an open proxy / SSRF vector.
 */
export async function GET(request: NextRequest) {
  if (!PRACTICE_ENABLED) {
    return new Response("Not found", { status: 404 });
  }
  const path = request.nextUrl.searchParams.get("path");
  const safeUrl = resolveSafeAudioUrl(path);
  if (!safeUrl) {
    return new Response("Bad audio path", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(safeUrl);
  } catch {
    return new Response("Audio unavailable", { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response("Audio not found", { status: 502 });
  }

  const contentType = safeUrl.toLowerCase().endsWith(".mp3") ? "audio/mpeg" : "audio/wav";
  const contentLength = upstream.headers.get("content-length");

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, immutable",
      ...(contentLength ? { "Content-Length": contentLength } : {}),
    },
  });
}
