import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, create } from "@/lib/strapi/api";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const ALLOWED_TYPES = ["ui_bug", "audio_issue", "question_error", "content_mistake", "other"] as const;
const ALLOWED_IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DESCRIPTION_LEN = 5000;
const MAX_URL_LEN = 2000;
const MAX_MODULE_LEN = 50;

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const type = formData.get("type") as string | null;
  const description = formData.get("description") as string | null;
  const page_url = formData.get("page_url") as string | null;
  const module = formData.get("module") as string | null;
  const image = formData.get("image") as File | null;

  if (!type || !ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!description?.trim()) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }
  if (description.length > MAX_DESCRIPTION_LEN) {
    return NextResponse.json({ error: "Description too long" }, { status: 400 });
  }
  if (page_url && page_url.length > MAX_URL_LEN) {
    return NextResponse.json({ error: "page_url too long" }, { status: 400 });
  }
  if (module && module.length > MAX_MODULE_LEN) {
    return NextResponse.json({ error: "module too long" }, { status: 400 });
  }

  let imageId: number | null = null;

  if (image && image.size > 0) {
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_MIMES.has(image.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }

    const strapiForm = new FormData();
    strapiForm.append("files", image, image.name || "screenshot.png");

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
      body: strapiForm,
    });

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      imageId = data[0]?.id ?? null;
    }
  }

  const report = await create("issue-reports", {
    type,
    description: description.trim(),
    page_url: page_url || null,
    module: module || null,
    ...(imageId ? { image: imageId } : {}),
    user: user.id,
  });

  return NextResponse.json({ success: true, id: report?.documentId });
}
