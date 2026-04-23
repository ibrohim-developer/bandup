import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ word: string }> },
) {
  const { word } = await params;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { next: { revalidate: 86400 } },
    );

    if (!res.ok) {
      return NextResponse.json({ phonetic: null, audioUrl: null }, { status: 404 });
    }

    const data = await res.json();
    const entry = data[0];

    const phonetic: string | null =
      entry?.phonetic ??
      entry?.phonetics?.find((p: { text?: string }) => p.text)?.text ??
      null;

    const audioUrl: string | null =
      entry?.phonetics?.find((p: { audio?: string }) => p.audio)?.audio ?? null;

    return NextResponse.json({ phonetic, audioUrl });
  } catch {
    return NextResponse.json({ phonetic: null, audioUrl: null }, { status: 500 });
  }
}
