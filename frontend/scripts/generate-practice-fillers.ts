/**
 * Generates the short "filler" reaction clips for speaking practice, ONCE, into
 * frontend/public/practice-fillers/. Commit the output — they ship as static
 * files so playing one costs nothing at runtime.
 *
 * The clips mask the turn round-trip: the moment the learner stops talking, a
 * filler plays instantly while the real Flash call + TTS are still in flight.
 * They must be short (≤ ~1.5s), neutral (safe even when the turn comes back
 * noSpeech), and voiced by the same voice as the partner (Aoede, via tts.ts)
 * so the seam is inaudible.
 *
 *   npx tsx scripts/generate-practice-fillers.ts
 *
 * Needs the Vertex env (GOOGLE_CLOUD_PROJECT etc) from frontend/.env.local.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

config({ path: resolve(__dirname, "../.env.local") });

// Neutral acknowledgements only — nothing that asserts the learner said
// something intelligible ("Good point!" after silence would be absurd).
const FILLERS = [
  "Mm-hmm…",
  "Okay…",
  "Right…",
  "Let me think…",
  "Interesting…",
  "Got it.",
  "I see…",
  "Hmm, okay…",
];

const OUT_DIR = resolve(__dirname, "../public/practice-fillers");

async function main() {
  // Imported lazily so the dotenv config above runs before the Vertex client
  // is constructed.
  const { synthesizeSpeech } = await import("../src/lib/tts");

  mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  for (let i = 0; i < FILLERS.length; i++) {
    const text = FILLERS[i];
    const speech = await synthesizeSpeech(text);
    if (!speech) {
      console.error(`✗ TTS failed for "${text}" — rerun for this one`);
      continue;
    }
    const base64 = speech.dataUri.split(",")[1];
    const extension = speech.mimeType.split("/")[1] ?? "wav";
    const file = resolve(OUT_DIR, `filler-${String(i + 1).padStart(2, "0")}.${extension}`);
    writeFileSync(file, Buffer.from(base64, "base64"));
    ok++;
    console.log(`♪ ${file.split(/[\\/]/).pop()}  "${text}"`);
  }

  console.log(`\nDone. ${ok}/${FILLERS.length} clips written to public/practice-fillers/.`);
  if (ok < FILLERS.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
