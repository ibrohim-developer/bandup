/**
 * Backfill `slug` for every test that doesn't have one yet.
 *
 * Usage: npx tsx scripts/backfill-test-slugs.ts
 *
 * Requires NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN env vars
 * (reads from frontend/.env.local)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("STRAPI_API_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "test";
}

interface StrapiTest {
  documentId: string;
  title: string;
  slug?: string | null;
}

async function fetchAllTests(): Promise<StrapiTest[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/tests?fields[0]=title&fields[1]=slug&pagination[pageSize]=1000`,
    { headers, cache: "no-store" },
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`fetch tests failed: ${JSON.stringify(json)}`);
  }
  return json.data ?? [];
}

async function setSlug(documentId: string, slug: string) {
  const res = await fetch(`${STRAPI_URL}/api/tests/${documentId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { slug } }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `update test ${documentId} failed: ${JSON.stringify(json)}`,
    );
  }
}

async function main() {
  const tests = await fetchAllTests();
  console.log(`Found ${tests.length} tests`);

  const taken = new Set<string>(
    tests.map((t) => t.slug).filter((s): s is string => !!s),
  );

  let updated = 0;
  for (const test of tests) {
    if (test.slug) continue;
    const base = slugify(test.title || test.documentId);
    let candidate = base;
    let n = 1;
    while (taken.has(candidate)) {
      n += 1;
      candidate = `${base}-${n}`;
    }
    taken.add(candidate);

    await setSlug(test.documentId, candidate);
    updated += 1;
    console.log(`  ${test.documentId} → ${candidate} (${test.title})`);
  }

  console.log(`\nDone. Backfilled ${updated} tests.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
