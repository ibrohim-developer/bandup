import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/strapi/api";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
