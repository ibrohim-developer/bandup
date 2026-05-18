/**
 * Generate sentence-level transcript cues for IELTS listening sections.
 *
 * Pipeline:
 *   1. Download audio from test.audio_url to a temp file.
 *   2. Run whisper.cpp locally with word-level segmentation (-ml 1 -sow -oj).
 *   3. Parse the JSON output → array of {word, startSec, endSec}.
 *   4. Tokenize each section's official transcript into sentences.
 *   5. Align the Whisper word stream to the official transcript sentences.
 *   6. PATCH each section's transcript_cues field in Strapi.
 *
 * Fully local — no API calls, no GCS, no Vertex AI for this script.
 *
 * Usage:
 *   node scripts/generate-transcript-cues.mjs                    # all listening tests missing cues
 *   node scripts/generate-transcript-cues.mjs --test-id=<docId>  # one test
 *   node scripts/generate-transcript-cues.mjs --dry-run          # don't write
 *   node scripts/generate-transcript-cues.mjs --force            # regenerate even if cues exist
 *
 * Required env (auto-loaded from frontend/.env.local):
 *   STRAPI_API_TOKEN, STRAPI_URL (or NEXT_PUBLIC_STRAPI_URL)
 *   WHISPER_CLI    — path to whisper-cli.exe
 *                    default: C:\Users\User\whisper-cpp\Release\whisper-cli.exe
 *   WHISPER_MODEL  — path to ggml model file
 *                    default: C:\Users\User\whisper-cpp\ggml-medium.en.bin
 */

import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, "..", ".env.local"));
loadEnvFile(path.join(__dirname, "..", ".env"));

const STRAPI_URL =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const WHISPER_CLI =
  process.env.WHISPER_CLI || "C:\\Users\\User\\whisper-cpp\\Release\\whisper-cli.exe";
const WHISPER_MODEL =
  process.env.WHISPER_MODEL || "C:\\Users\\User\\whisper-cpp\\ggml-medium.en.bin";
const WHISPER_VAD_MODEL =
  process.env.WHISPER_VAD_MODEL || "C:\\Users\\User\\whisper-cpp\\ggml-silero-v5.1.2.bin";
const WHISPER_THREADS = Number(process.env.WHISPER_THREADS || Math.max(4, os.cpus().length - 1));

if (!STRAPI_TOKEN) {
  console.error("STRAPI_API_TOKEN env var is required");
  process.exit(1);
}
if (!fs.existsSync(WHISPER_CLI)) {
  console.error(`whisper-cli not found at ${WHISPER_CLI}. Set WHISPER_CLI env var.`);
  process.exit(1);
}
if (!fs.existsSync(WHISPER_MODEL)) {
  console.error(`whisper model not found at ${WHISPER_MODEL}. Set WHISPER_MODEL env var.`);
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const flagValue = (name) => {
  const a = flag(name);
  if (!a) return undefined;
  const eq = a.indexOf("=");
  return eq >= 0 ? a.slice(eq + 1) : true;
};

const ONLY_TEST_ID = flagValue("test-id");
const DRY_RUN = !!flagValue("dry-run");
const FORCE = !!flagValue("force");

// ───────────────────────────────────────────────────────────────────────────
// Strapi helpers
// ───────────────────────────────────────────────────────────────────────────

async function strapiFind(collection, params = {}) {
  const qs = new URLSearchParams();
  const flatten = (obj, prefix) => {
    for (const [key, val] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}[${key}]` : key;
      if (val !== null && typeof val === "object" && !Array.isArray(val)) {
        flatten(val, newKey);
      } else if (Array.isArray(val)) {
        val.forEach((v, i) => qs.append(`${newKey}[${i}]`, String(v)));
      } else {
        qs.append(newKey, String(val));
      }
    }
  };
  flatten(params, "");
  const res = await fetch(`${STRAPI_URL}/api/${collection}?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });
  const json = await res.json();
  if (json.error) throw new Error(`Strapi find failed: ${json.error.message}`);
  return json.data || [];
}

async function strapiUpdate(collection, documentId, data) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`Strapi update failed: ${json.error.message}`);
  return json.data;
}

// ───────────────────────────────────────────────────────────────────────────
// Audio download
// ───────────────────────────────────────────────────────────────────────────

function extFromUrl(url) {
  const u = url.toLowerCase().split("?")[0];
  const m = u.match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "mp3";
}

async function downloadAudioToTemp(url) {
  const absolute = /^https?:\/\//i.test(url)
    ? url
    : `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  console.log(`    fetching audio: ${absolute}`);
  let res;
  try {
    res = await fetch(absolute);
  } catch (e) {
    throw new Error(`fetch threw for ${absolute}: ${e.cause?.code || e.code || e.message}`);
  }
  if (!res.ok) throw new Error(`Audio download failed (${res.status} ${res.statusText}): ${absolute}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extFromUrl(absolute);
  const tmpPath = path.join(os.tmpdir(), `bandup-cues-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`);
  fs.writeFileSync(tmpPath, buf);
  return { tmpPath, sizeMB: buf.length / (1024 * 1024) };
}

// ───────────────────────────────────────────────────────────────────────────
// Whisper.cpp invocation
// ───────────────────────────────────────────────────────────────────────────

function runWhisper(audioPath, outputPrefix) {
  const useVad = fs.existsSync(WHISPER_VAD_MODEL);
  const cliArgs = [
    "-m", WHISPER_MODEL,
    "-f", audioPath,
    "-l", "en",
    "-ml", "1",
    "-sow",
    "-oj",
    "-of", outputPrefix,
    "-t", String(WHISPER_THREADS),
    "--suppress-nst",
    "--no-prints",
  ];
  if (useVad) {
    cliArgs.push("--vad", "-vm", WHISPER_VAD_MODEL);
  }
  return new Promise((resolve, reject) => {
    const proc = spawn(WHISPER_CLI, cliArgs, { stdio: ["ignore", "pipe", "pipe"] });

    let stderr = "";
    proc.stdout.on("data", () => {}); // discard
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`whisper-cli exited ${code}\n${stderr}`));
    });
  });
}

function parseWhisperJson(jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const words = [];
  for (const seg of raw.transcription ?? []) {
    const text = (seg.text ?? "").trim();
    if (!text) continue;
    const fromMs = seg.offsets?.from ?? 0;
    const toMs = seg.offsets?.to ?? fromMs;
    words.push({
      word: text,
      startSec: fromMs / 1000,
      endSec: toMs / 1000,
    });
  }
  return words;
}

async function transcribeWithTimestamps(audioPath) {
  const outputPrefix = path.join(
    os.tmpdir(),
    `bandup-cues-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
  );
  const jsonPath = `${outputPrefix}.json`;
  const vadOn = fs.existsSync(WHISPER_VAD_MODEL);
  console.log(`    running whisper.cpp (${WHISPER_THREADS} threads, VAD=${vadOn ? "on" : "off"})...`);
  const t0 = Date.now();
  try {
    await runWhisper(audioPath, outputPrefix);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`    whisper done in ${elapsed}s`);
    return parseWhisperJson(jsonPath);
  } finally {
    try { fs.unlinkSync(jsonPath); } catch {}
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Duration / time helpers (kept for compatibility — whisper.cpp uses ms in offsets)
// ───────────────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────────────
// Sentence splitting + alignment
// ───────────────────────────────────────────────────────────────────────────

function splitSentences(transcript) {
  if (!transcript) return [];
  const trimmed = transcript.replace(/\s+/g, " ").trim();
  const parts = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [trimmed];
  return parts.map((s) => s.trim()).filter(Boolean);
}

function normalizeWord(w) {
  return w.toLowerCase().replace(/[^a-z0-9']/g, "");
}

// Strip leading speaker labels like "Speaker 1:", "Tutor:", "Tom:", "Dr. Smith:"
// from a sentence — these tokens don't appear in the audio and would poison
// the alignment probe. The original sentence text (with the label) is still
// stored in the cue; this only affects matching.
function stripSpeakerLabel(sentence) {
  return sentence.replace(/^[A-Za-z][A-Za-z\s'\-\.]{0,40}\d{0,3}\s*[:\-–—]\s*/, "");
}

function tokenizeSentence(sentence) {
  return stripSpeakerLabel(sentence)
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
}

/**
 * Needleman-Wunsch sequence alignment between two token streams.
 * Returns an Int32Array `alignment` of length transcriptTokens.length where
 * alignment[i] is the index into sttTokens for transcript token i, or -1 if
 * that transcript token was not aligned to any STT word (insertion/deletion).
 */
function dpAlign(transcriptTokens, sttTokens) {
  const m = transcriptTokens.length;
  const n = sttTokens.length;
  const W = n + 1;
  const MATCH = 2;
  const MISMATCH = -1;
  const GAP = -0.5;

  const score = new Float32Array((m + 1) * W);
  const arrow = new Uint8Array((m + 1) * W);

  for (let i = 0; i <= m; i++) score[i * W] = i * GAP;
  for (let j = 0; j <= n; j++) score[j] = j * GAP;

  for (let i = 1; i <= m; i++) {
    const tiTok = transcriptTokens[i - 1];
    const iW = i * W;
    const iPrevW = (i - 1) * W;
    for (let j = 1; j <= n; j++) {
      const matchVal = tiTok === sttTokens[j - 1] ? MATCH : MISMATCH;
      const diag = score[iPrevW + (j - 1)] + matchVal;
      const up = score[iPrevW + j] + GAP;
      const left = score[iW + (j - 1)] + GAP;
      let best = diag, dir = 0;
      if (up > best) { best = up; dir = 1; }
      if (left > best) { best = left; dir = 2; }
      score[iW + j] = best;
      arrow[iW + j] = dir;
    }
  }

  const alignment = new Int32Array(m).fill(-1);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    const dir = arrow[i * W + j];
    if (dir === 0) {
      if (transcriptTokens[i - 1] === sttTokens[j - 1]) alignment[i - 1] = j - 1;
      i--; j--;
    } else if (dir === 1) {
      i--;
    } else {
      j--;
    }
  }
  return alignment;
}

function alignSentencesToWords(sentences, sttWords) {
  const sttNorm = sttWords.map((w) => normalizeWord(w.word));

  // Flatten the transcript into a single token stream, remembering which
  // sentence each token belongs to, so we can run one global DP.
  const transcriptTokens = [];
  const tokenSentence = []; // parallel: which sentence index each token belongs to
  const sentenceTokenRange = sentences.map(() => ({ start: -1, end: -1 }));

  for (let si = 0; si < sentences.length; si++) {
    const toks = tokenizeSentence(sentences[si]);
    if (toks.length === 0) continue;
    sentenceTokenRange[si].start = transcriptTokens.length;
    for (const t of toks) {
      transcriptTokens.push(t);
      tokenSentence.push(si);
    }
    sentenceTokenRange[si].end = transcriptTokens.length - 1;
  }

  // Run DP alignment once for the whole audio.
  const alignment = transcriptTokens.length && sttNorm.length
    ? dpAlign(transcriptTokens, sttNorm)
    : new Int32Array(transcriptTokens.length).fill(-1);

  // For each sentence, find its earliest aligned STT word.
  const matches = [];
  let matchedCount = 0;
  for (let si = 0; si < sentences.length; si++) {
    const range = sentenceTokenRange[si];
    const text = sentences[si].trim();
    if (range.start < 0) {
      matches.push({ text, startSec: null });
      continue;
    }
    let sttIdx = -1;
    for (let ti = range.start; ti <= range.end; ti++) {
      if (alignment[ti] >= 0) { sttIdx = alignment[ti]; break; }
    }
    if (sttIdx >= 0) {
      matches.push({ text, startSec: sttWords[sttIdx].startSec });
      matchedCount++;
    } else {
      matches.push({ text, startSec: null });
    }
  }

  const sttStart = sttWords[0]?.startSec ?? 0;
  const sttEnd = sttWords[sttWords.length - 1]?.endSec ?? sttStart;

  // Build "speech intervals" from Whisper word stream: contiguous runs of words
  // with no inter-word gap larger than `silenceThreshold`. Cues will only be
  // placed inside these intervals, so silent stretches don't get interpolated
  // sentences moving through them.
  const SILENCE_THRESHOLD_SEC = 1.5;
  const speechIntervals = [];
  if (sttWords.length > 0) {
    let segStart = sttWords[0].startSec;
    let segLastEnd = sttWords[0].endSec;
    for (let i = 1; i < sttWords.length; i++) {
      const w = sttWords[i];
      if (w.startSec - segLastEnd > SILENCE_THRESHOLD_SEC) {
        speechIntervals.push([segStart, segLastEnd]);
        segStart = w.startSec;
      }
      segLastEnd = w.endSec;
    }
    speechIntervals.push([segStart, segLastEnd]);
  }

  // Place `count` interpolated cues into the speech-time between tA and tB,
  // skipping any silent gaps. Falls back to linear if no speech overlaps.
  function interpolateRange(tA, tB, count) {
    if (count <= 0) return [];
    const clipped = [];
    for (const [a, b] of speechIntervals) {
      const lo = Math.max(a, tA);
      const hi = Math.min(b, tB);
      if (hi > lo) clipped.push([lo, hi]);
    }
    const total = clipped.reduce((s, [a, b]) => s + (b - a), 0);
    if (total === 0) {
      const step = (tB - tA) / (count + 1);
      return Array.from({ length: count }, (_, k) => tA + step * (k + 1));
    }
    const stepSpeech = total / (count + 1);
    const out = [];
    for (let k = 0; k < count; k++) {
      let target = stepSpeech * (k + 1);
      for (let ci = 0; ci < clipped.length; ci++) {
        const dur = clipped[ci][1] - clipped[ci][0];
        if (target <= dur) {
          out.push(clipped[ci][0] + target);
          break;
        }
        target -= dur;
        if (ci === clipped.length - 1) {
          out.push(clipped[ci][1]);
        }
      }
    }
    return out;
  }

  const firstMatched = matches.findIndex((m) => m.startSec !== null);
  const lastMatched = (() => {
    for (let i = matches.length - 1; i >= 0; i--) if (matches[i].startSec !== null) return i;
    return -1;
  })();

  if (firstMatched < 0) {
    const times = interpolateRange(sttStart, sttEnd, matches.length);
    matches.forEach((m, i) => { m.startSec = times[i]; });
  } else {
    if (firstMatched > 0) {
      const times = interpolateRange(sttStart, matches[firstMatched].startSec, firstMatched);
      for (let i = 0; i < firstMatched; i++) matches[i].startSec = times[i];
    }
    if (lastMatched < matches.length - 1) {
      const remaining = matches.length - 1 - lastMatched;
      const times = interpolateRange(matches[lastMatched].startSec, sttEnd, remaining);
      for (let i = 0; i < remaining; i++) matches[lastMatched + 1 + i].startSec = times[i];
    }
    let anchor = firstMatched;
    for (let i = firstMatched + 1; i <= lastMatched; i++) {
      if (matches[i].startSec !== null) {
        const gap = i - anchor;
        if (gap > 1) {
          const times = interpolateRange(matches[anchor].startSec, matches[i].startSec, gap - 1);
          for (let j = 1; j < gap; j++) matches[anchor + j].startSec = times[j - 1];
        }
        anchor = i;
      }
    }
  }

  for (let i = 1; i < matches.length; i++) {
    if (matches[i].startSec < matches[i - 1].startSec) {
      matches[i].startSec = matches[i - 1].startSec;
    }
  }

  const cues = matches.map((m) => ({
    text: m.text,
    startSec: Number(m.startSec.toFixed(3)),
  }));
  for (let i = 0; i < cues.length; i++) {
    cues[i].endSec = Number(
      (i + 1 < cues.length ? cues[i + 1].startSec : sttEnd).toFixed(3),
    );
  }

  return { cues, matchedCount };
}

// ───────────────────────────────────────────────────────────────────────────
// Main per-test flow
// ───────────────────────────────────────────────────────────────────────────

async function processTest(test) {
  const sections = (test.listening_sections ?? []).filter((s) => s.transcript);
  if (sections.length === 0) {
    console.log(`  skip: test ${test.documentId} has no sections with transcripts`);
    return;
  }
  if (!test.audio_url) {
    console.log(`  skip: test ${test.documentId} has no audio_url`);
    return;
  }
  const targetSections = sections.filter(
    (s) =>
      FORCE ||
      !s.transcript_cues ||
      (Array.isArray(s.transcript_cues) && s.transcript_cues.length === 0),
  );
  if (targetSections.length === 0) {
    console.log(`  skip: test ${test.documentId} already has cues (use --force to regenerate)`);
    return;
  }

  console.log(`  test ${test.documentId} (${test.title ?? "untitled"}): ${sections.length} sections`);
  const { tmpPath, sizeMB } = await downloadAudioToTemp(test.audio_url);
  console.log(`    audio: ${sizeMB.toFixed(1)} MB at ${tmpPath}`);

  let sttWords = [];
  try {
    sttWords = await transcribeWithTimestamps(tmpPath);
    console.log(`    whisper returned ${sttWords.length} words (last endSec=${sttWords.at(-1)?.endSec?.toFixed(1) ?? "?"}s)`);
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }

  if (sttWords.length === 0) {
    console.log(`    no words recognized — skipping all sections`);
    return;
  }

  // Quick silence stat for visibility (uses same 1.5s threshold as the aligner).
  let silenceCount = 0;
  let silenceTotal = 0;
  for (let i = 1; i < sttWords.length; i++) {
    const gap = sttWords[i].startSec - sttWords[i - 1].endSec;
    if (gap > 1.5) { silenceCount++; silenceTotal += gap; }
  }
  if (silenceCount > 0) {
    console.log(`    detected ${silenceCount} silence(s) totaling ${silenceTotal.toFixed(1)}s`);
  }

  for (const section of targetSections) {
    const sentences = splitSentences(section.transcript);
    const { cues, matchedCount } = alignSentencesToWords(sentences, sttWords);

    if (cues.length === 0) {
      console.log(`    section ${section.section_number}: no sentences; skipping`);
      continue;
    }

    const firstSec = cues[0].startSec.toFixed(1);
    const lastSec = cues.at(-1).startSec.toFixed(1);
    const matchPct = ((matchedCount / sentences.length) * 100).toFixed(0);
    console.log(
      `    section ${section.section_number}: ${cues.length} cues (${matchedCount}/${sentences.length} whisper-aligned = ${matchPct}%, rest interpolated), ${firstSec}s → ${lastSec}s`,
    );

    if (DRY_RUN) {
      console.log(`      (dry-run) first cue: "${cues[0].text.slice(0, 80)}..." @ ${firstSec}s`);
      continue;
    }

    await strapiUpdate("listening-sections", section.documentId, { transcript_cues: cues });
    console.log(`      written.`);
  }
}

async function main() {
  console.log(`Using local whisper.cpp (${path.basename(WHISPER_MODEL)})${DRY_RUN ? " (dry-run)" : ""}`);

  const filters = { module_type: { $eq: "listening" } };
  if (ONLY_TEST_ID && typeof ONLY_TEST_ID === "string") {
    filters.documentId = { $eq: ONLY_TEST_ID };
  }

  let page = 1;
  let totalProcessed = 0;
  while (true) {
    const tests = await strapiFind("tests", {
      filters,
      pagination: { page, pageSize: 20 },
      populate: { listening_sections: { sort: ["section_number"] } },
      fields: ["title", "audio_url"],
    });
    if (tests.length === 0) break;
    for (const test of tests) {
      try {
        await processTest(test);
        totalProcessed++;
      } catch (e) {
        console.error(`  ERROR on test ${test.documentId}:`, e.message);
      }
    }
    if (tests.length < 20) break;
    page++;
  }

  console.log(`\nDone. Processed ${totalProcessed} test(s).${DRY_RUN ? " (dry-run, no writes)" : ""}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
