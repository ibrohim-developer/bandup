import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { table, record } = await request.json();

  if (table === "tests" || table === "reading_passages" || table === "questions") {
    revalidatePath("/dashboard/reading");
    if (record?.test_id) {
      revalidatePath(`/dashboard/reading/${record.test_id}`);
    }
  }

  if (table === "tests" || table === "listening_sections") {
    revalidatePath("/dashboard/listening");
    if (record?.test_id) {
      revalidatePath(`/dashboard/listening/${record.test_id}`);
    }
  }

  if (table === "tests" || table === "writing_tasks") {
    revalidatePath("/dashboard/writing");
    if (record?.test_id) {
      revalidatePath(`/dashboard/writing/${record.test_id}`);
    }
  }

  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true });
}
