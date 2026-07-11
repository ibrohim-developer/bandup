import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { format } from "date-fns";
import { find, findOne } from "@/lib/strapi/api";
import { getCurrentUser } from "@/lib/strapi/server";
import { rawToBand, roundToHalf } from "@/lib/band-score";
import {
  CriteriaCard,
  MockCard,
  ModuleCard,
  type CardFooter,
  type CardTheme,
} from "./card";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CANVAS = { width: 1080, height: 1920 };
// Private: the card contains personal scores. 60s lets the dialog's preview
// <img> warm the browser cache so the Share fetch right after is instant.
const CACHE_HEADERS = { "Cache-Control": "private, max-age=60" };

// Module accent dots on the full-mock card (from the Clean Editorial design).
const MODULE_ACCENTS: Record<string, string> = {
  listening: "#4C8DFF",
  reading: "#22C58B",
  writing: "#9B6BFF",
  speaking: "#F5A623",
};

const QUOTES = {
  module: "Every score is a starting line, not a verdict.",
  speaking: "Clear ideas, growing fluency — keep talking it out.",
  writing: "Every draft sharpens the craft — keep writing.",
};

// ── Font loading (Poppins for Satori) ───────────────────────────────────────
// Fetched once per server process from Google Fonts and memoized. Satori cannot
// read woff2, so an old User-Agent forces Google to serve ttf/woff. On any
// failure the card falls back to Satori's default font rather than 500-ing.

type SatoriFont = { name: string; data: ArrayBuffer; weight: 500 | 600 | 700 | 800; style: "normal" };
let fontsPromise: Promise<SatoriFont[]> | null = null;

async function loadGoogleFont(weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}`;
  const css = await (
    await fetch(url, {
      headers: {
        // Old Firefox → Google serves ttf/woff (Satori-compatible), not woff2.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0",
      },
    })
  ).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/);
  if (!match) throw new Error("Poppins src not found");
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`font fetch ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts(): Promise<SatoriFont[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      ([500, 600, 700, 800] as const).map(async (weight) => ({
        name: "Poppins",
        data: await loadGoogleFont(weight),
        weight,
        style: "normal" as const,
      })),
    );
  }
  try {
    return await fontsPromise;
  } catch {
    fontsPromise = null; // allow a later retry
    return [];
  }
}

async function toImage(node: React.ReactElement) {
  const fonts = await loadFonts();
  return new ImageResponse(node, {
    ...CANVAS,
    headers: CACHE_HEADERS,
    ...(fonts.length ? { fonts } : {}),
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function notFound() {
  return new Response("Not found", { status: 404 });
}

function isAdminUser(user: any): boolean {
  return user?.role?.type === "admin" || user?.role?.name === "Admin";
}

function footerFor(owner: any, dateStr?: string | null): CardFooter {
  const name = owner?.full_name || owner?.username || null;
  const date = dateStr ? format(new Date(dateStr), "d MMM yyyy") : null;
  if (name && date) return { left: `${name} · ${date}` };
  return { left: name || date || "bandup.uz" };
}

function levelFor(pct: number): string {
  if (pct >= 75) return "Advanced";
  if (pct >= 50) return "Intermediate";
  return "Beginner";
}

/** Average a submission score field over evaluated submissions, IELTS-rounded. */
function avgScore(submissions: any[], field: string): number {
  const scored = submissions.filter((s) => s.overall_band_score !== null);
  if (scored.length === 0) return 0;
  return roundToHalf(scored.reduce((sum, s) => sum + (s[field] || 0), 0) / scored.length);
}

/** Count a test's questions the same way the results page does (deduped). */
async function countQuestions(
  testDocId: string,
  moduleType: "reading" | "listening",
): Promise<number> {
  const ids = new Set<string>();
  if (moduleType === "reading") {
    const passages = await find("reading-passages", {
      filters: { test: { documentId: { $eq: testDocId } } },
      populate: {
        question_groups: { populate: { questions: { fields: ["id"] } } },
        questions: { fields: ["id"] },
      },
    });
    for (const p of passages ?? []) {
      for (const g of p.question_groups ?? []) {
        for (const q of g.questions ?? []) ids.add(q.documentId);
      }
      for (const q of p.questions ?? []) ids.add(q.documentId);
    }
  } else {
    const sections = await find("listening-sections", {
      filters: { test: { documentId: { $eq: testDocId } } },
      populate: { questions: { fields: ["id"] } },
    });
    for (const s of sections ?? []) {
      for (const q of s.questions ?? []) ids.add(q.documentId);
    }
  }
  return ids.size;
}

// ── Renderers ───────────────────────────────────────────────────────────────

async function renderMockCard(attemptId: string, user: any, theme: CardTheme) {
  // Full-mock results require login + owner/admin (same as the results page).
  if (!user) return notFound();

  const session = await findOne("full-mock-test-attempts", attemptId, {
    populate: {
      test: { fields: ["title"] },
      user: { fields: ["id", "full_name", "username"] },
      test_attempts: {
        fields: ["module_type", "raw_score", "band_score", "status", "createdAt"],
      },
    },
  });
  if (!session) return notFound();
  if (!isAdminUser(user) && session.user?.id !== user.id) return notFound();

  const byModule: Record<string, any> = {};
  for (const a of session.test_attempts ?? []) {
    const m = a.module_type;
    if (!byModule[m] || new Date(a.createdAt) > new Date(byModule[m].createdAt)) {
      byModule[m] = a;
    }
  }

  // L/R count as evaluated once attempted; W/S only once AI scoring completed
  // (same rule as the results page). null = pending, rendered as "—".
  const listeningBand = byModule.listening ? rawToBand(byModule.listening.raw_score ?? 0) : null;
  const readingBand = byModule.reading ? rawToBand(byModule.reading.raw_score ?? 0) : null;
  const writingBand =
    byModule.writing?.status === "completed" ? (byModule.writing.band_score ?? 0) : null;
  const speakingBand =
    byModule.speaking?.status === "completed" ? (byModule.speaking.band_score ?? 0) : null;

  const bands = [listeningBand, readingBand, writingBand, speakingBand].filter(
    (b): b is number => b !== null,
  );
  const overallBand =
    session.overall_band_score ??
    (bands.length ? roundToHalf(bands.reduce((a, b) => a + b, 0) / bands.length) : 0);

  return toImage(
    <MockCard
      theme={theme}
      title={session.test?.title || "Full Mock Test"}
      overallBand={overallBand}
      modules={[
        { label: "Listening", color: MODULE_ACCENTS.listening, band: listeningBand },
        { label: "Reading", color: MODULE_ACCENTS.reading, band: readingBand },
        { label: "Writing", color: MODULE_ACCENTS.writing, band: writingBand },
        { label: "Speaking", color: MODULE_ACCENTS.speaking, band: speakingBand },
      ]}
      footer={footerFor(session.user, session.createdAt)}
    />,
  );
}

async function renderModuleCard(attemptId: string, user: any, theme: CardTheme) {
  const attempts = await find("test-attempts", {
    filters: { documentId: { $eq: attemptId } },
    populate: {
      test: { fields: ["title"] },
      user: { fields: ["id", "full_name", "username"] },
    },
  });
  const attempt = attempts?.[0];
  if (!attempt) return notFound();

  // Same rule as the result pages: owned attempts are private (owner/admin
  // only, including for anonymous visitors); unowned guest attempts stay
  // accessible by link.
  const isOwned = !!attempt.user?.id;
  const isOwner = !!user && attempt.user?.id === user.id;
  if (isOwned && !isOwner && !isAdminUser(user)) return notFound();

  const moduleType = attempt.module_type as string;
  if (!(moduleType in MODULE_ACCENTS)) return notFound();
  const date = attempt.completed_at ?? attempt.createdAt;
  const footer = footerFor(attempt.user, date);

  if (moduleType === "writing" || moduleType === "speaking") {
    if (attempt.status !== "completed" || attempt.band_score == null) return notFound();

    const collection = moduleType === "writing" ? "writing-submissions" : "speaking-submissions";
    const submissions =
      (await find(collection, {
        filters: { test_attempt: { documentId: { $eq: attemptId } } },
      })) ?? [];

    const criteria =
      moduleType === "writing"
        ? [
            { name: "Task Achievement", score: avgScore(submissions, "task_achievement_score") },
            { name: "Coherence & Cohesion", score: avgScore(submissions, "coherence_score") },
            { name: "Lexical Resource", score: avgScore(submissions, "lexical_score") },
            { name: "Grammatical Range", score: avgScore(submissions, "grammar_score") },
          ]
        : [
            { name: "Fluency & Coherence", score: avgScore(submissions, "fluency_score") },
            { name: "Lexical Resource", score: avgScore(submissions, "lexical_score") },
            { name: "Grammatical Range", score: avgScore(submissions, "grammar_score") },
            { name: "Pronunciation", score: avgScore(submissions, "pronunciation_score") },
          ];

    const isWriting = moduleType === "writing";
    const fallbackTitle = isWriting ? "Writing Test" : "Speaking Practice";
    return toImage(
      <CriteriaCard
        theme={theme}
        moduleLabel={isWriting ? "Writing" : "Speaking"}
        title={attempt.test?.title || fallbackTitle}
        band={attempt.band_score}
        criteria={criteria}
        quote={isWriting ? QUOTES.writing : QUOTES.speaking}
        footer={footer}
      />,
    );
  }

  // reading | listening
  const raw = attempt.raw_score ?? 0;
  const counted = attempt.test?.documentId
    ? await countQuestions(attempt.test.documentId, moduleType as "reading" | "listening")
    : 0;
  const total = counted || 40;
  const pct = total > 0 ? Math.round((raw / total) * 100) : 0;

  const moduleLabel = moduleType === "reading" ? "Reading" : "Listening";
  return toImage(
    <ModuleCard
      theme={theme}
      moduleLabel={moduleLabel}
      title={attempt.test?.title || `${moduleLabel} Test`}
      raw={raw}
      total={total}
      level={levelFor(pct)}
      pct={pct}
      quote={QUOTES.module}
      footer={footer}
    />,
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await params;
  const isMock = request.nextUrl.searchParams.get("type") === "mock";
  const theme: CardTheme =
    request.nextUrl.searchParams.get("theme") === "dark" ? "dark" : "light";

  try {
    const user = await getCurrentUser();
    return isMock
      ? await renderMockCard(attemptId, user, theme)
      : await renderModuleCard(attemptId, user, theme);
  } catch (error) {
    console.error("share-card generation failed:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
