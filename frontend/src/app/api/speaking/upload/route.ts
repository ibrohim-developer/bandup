import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/strapi/api";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reject oversized uploads up-front, before buffering the whole body into
  // memory. 3 MB audio cap + multipart overhead → a 4 MB ceiling on the raw
  // request. (The exact file.size check below remains the authoritative limit.)
  const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "Recording too large. Speaking answers must be under 2 minutes." },
      { status: 413 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size < 5000) {
    return NextResponse.json({ error: "Recording too short or silent" }, { status: 400 });
  }

  // 3 MB is ~3× the size of a 2-minute opus webm at typical bitrate.
  // Tight enough to block "upload an hour of audio" abuse, loose enough to never reject a legit IELTS recording.
  const MAX_AUDIO_BYTES = 3 * 1024 * 1024;
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Recording too large. Speaking answers must be under 2 minutes." }, { status: 400 });
  }

  const ALLOWED_AUDIO_MIMES = new Set([
    "audio/webm",
    "audio/ogg",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
  ]);
  // MediaRecorder emits types with codec params (e.g. "audio/webm;codecs=opus",
  // "audio/mp4;codecs=mp4a.40.2"). Match on the base MIME, not the full string.
  const baseMime = file.type.split(";")[0].trim().toLowerCase();
  if (!baseMime || !ALLOWED_AUDIO_MIMES.has(baseMime)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 400 });
  }

  // Forward the upload to Strapi's upload API
  const strapiForm = new FormData();
  strapiForm.append("files", file, file.name || "recording.webm");

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: strapiForm,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[speaking/upload] Strapi upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const data = await res.json();
  const uploaded = data[0];

  return NextResponse.json({
    url: uploaded.url,
    id: uploaded.id,
  });
}
