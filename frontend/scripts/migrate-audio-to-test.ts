/**
 * Migrate audio_url from listening_sections to tests table.
 * Reads directly from SQLite DB, updates via Strapi API.
 *
 * Usage: npx tsx scripts/migrate-audio-to-test.ts
 */

import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env.local") });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN!;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require("better-sqlite3");

async function main() {
  console.log("=== Migrate audio_url from listening_sections to tests ===\n");

  const dbPath = resolve(__dirname, "../../backend/.tmp/data.db");
  const db = new Database(dbPath, { readonly: true });

  // Get unique test -> audio_url mapping from SQLite
  const rows = db.prepare(`
    SELECT DISTINCT t.id, t.document_id, t.title, ls.audio_url
    FROM tests t
    JOIN listening_sections_test_lnk lnk ON lnk.test_id = t.id
    JOIN listening_sections ls ON ls.id = lnk.listening_section_id
    WHERE t.module_type = 'listening'
      AND ls.section_number = 1
    ORDER BY t.id
  `).all();

  console.log(`Found ${rows.length} listening tests with audio\n`);

  let updated = 0;
  for (const row of rows) {
    const { document_id, title, audio_url } = row;
    if (!audio_url) {
      console.log(`  SKIP: ${title} — no audio_url`);
      continue;
    }

    const res = await fetch(`${STRAPI_URL}/api/tests/${document_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: { audio_url } }),
    });

    if (res.ok) {
      console.log(`  OK: ${title} -> ${audio_url}`);
      updated++;
    } else {
      const err = await res.text();
      console.error(`  FAIL: ${title}: ${err}`);
    }
  }

  db.close();
  console.log(`\nDone! Updated ${updated} tests with audio_url.`);
}

main().catch(console.error);
