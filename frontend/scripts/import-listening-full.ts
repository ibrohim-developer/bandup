/**
 * Import full IELTS listening tests (4 parts each) from external API into Strapi.
 *
 * Usage:
 *   npx tsx scripts/import-listening-full.ts --token <bearer_token> [--ids 1333,1329,...] [--strapi-token <strapi_api_token>]
 *
 * If --ids is omitted, fetches the full test list from the external API.
 * If --strapi-token is omitted, uses STRAPI_API_TOKEN from .env.local.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const EXTERNAL_API = "https://api.otaboyev-prep.uz/api/listenings";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const QUESTION_TYPE_MAP: Record<string, string> = {
  NOTE_COMPLETION: "note_completion",
  TABLE_COMPLETION: "table_completion",
  FLOW_CHART_COMPLETION: "flow_chart_completion",
  SENTENCE_COMPLETION: "sentence_completion",
  SUMMARY_COMPLETION: "summary_completion",
  SUMMARY_COMPLETION_DRAG_DROP: "summary_completion_drag_drop",
  MULTIPLE_CHOICE: "mcq_single",
  MULTIPLE_ANSWER: "mcq_multiple",
  MATCHING_FEATURES: "matching_info",
  MATCHING_INFORMATION: "matching_info",
  MATCHING_HEADINGS: "matching_headings",
  MATCHING_NAMES: "matching_names",
  MATCHING_SENTENCE_ENDINGS: "matching_sentence_endings",
  GAP_FILL: "gap_fill",
  SHORT_ANSWER: "short_answer",
  TRUE_FALSE_NOT_GIVEN: "tfng",
  YES_NO_NOT_GIVEN: "tfng",
  DIAGRAM_LABEL_COMPLETION: "gap_fill",
  MAP_LABELLING: "gap_fill",
  PLAN_MAP_DIAGRAM_LABELLING: "gap_fill",
  FORM_COMPLETION: "gap_fill",
};

const TRANSCRIPT_KEYS = ["transcript", "transcript2", "transcript3", "transcript4"];

// ── Load env ────────────────────────────────────────────────────────────────

function loadEnvFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local not found
  }
}

loadEnvFile(resolve(__dirname, "../.env.local"));

// ── CLI args ────────────────────────────────────────────────────────────────

function parseArgs(): { token: string; ids?: number[]; strapiToken: string } {
  const args = process.argv.slice(2);
  let token = "";
  let ids: number[] | undefined;
  let strapiToken = process.env.STRAPI_API_TOKEN || "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--token" && args[i + 1]) token = args[++i];
    else if (args[i] === "--ids" && args[i + 1]) {
      ids = args[++i].split(",").map((s) => parseInt(s.trim()));
    } else if (args[i] === "--strapi-token" && args[i + 1]) {
      strapiToken = args[++i];
    }
  }

  if (!token) {
    console.error(
      "Usage: npx tsx scripts/import-listening-full.ts --token <bearer_token> [--ids 1333,1329,...] [--strapi-token <token>]"
    );
    process.exit(1);
  }

  if (!strapiToken) {
    console.error("Error: No Strapi API token. Set STRAPI_API_TOKEN in .env.local or use --strapi-token.");
    process.exit(1);
  }

  return { token, ids, strapiToken };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function mapQuestionType(apiType: string): string {
  const mapped = QUESTION_TYPE_MAP[apiType];
  if (!mapped) {
    console.warn(`  Warning: Unknown question type "${apiType}", defaulting to "gap_fill"`);
    return "gap_fill";
  }
  return mapped;
}

function mapDifficulty(d: string): "easy" | "medium" | "hard" {
  const lower = d.toLowerCase();
  if (lower === "easy") return "easy";
  if (lower === "hard") return "hard";
  return "medium";
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── External API calls ──────────────────────────────────────────────────────

async function fetchTestList(token: string): Promise<{ id: number; title: string }[]> {
  const allTests: { id: number; title: string }[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const url = `${EXTERNAL_API}?isPremium=false&isGold=false&page=${page}&size=40`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`List fetch failed: ${res.status}`);
    const data = await res.json();
    totalPages = data.totalPages;
    for (const item of data.content) {
      allTests.push({ id: item.id, title: item.title });
    }
    page++;
  }

  return allTests;
}

async function fetchTestDetail(apiId: number, token: string): Promise<any> {
  const url = `${EXTERNAL_API}/${apiId}?authorization=Bearer ${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Detail fetch failed for ${apiId}: ${res.status}`);
  return res.json();
}

async function fetchAnswers(apiId: number, token: string, questionNumbers: number[]): Promise<any> {
  const url = `${EXTERNAL_API}/${apiId}/submit-by-number`;
  const body = {
    listeningId: apiId,
    answers: questionNumbers.map((qn) => ({ questionNumber: qn, answerText: null })),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Submit failed for ${apiId}: ${res.status}`);
  return res.json();
}

// ── Audio download & Strapi upload ──────────────────────────────────────────

async function downloadAndUploadAudio(
  audioUrl: string,
  fileName: string,
  strapiToken: string,
  cacheDir: string,
): Promise<string> {
  // Check local cache first
  const cachePath = resolve(cacheDir, fileName);

  let audioBuffer: Buffer;
  if (existsSync(cachePath)) {
    console.log(`  Audio cached: ${fileName}`);
    audioBuffer = readFileSync(cachePath) as unknown as Buffer;
  } else {
    console.log(`  Downloading audio: ${fileName}...`);
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error(`Audio download failed: ${res.status}`);
    audioBuffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(cachePath, audioBuffer);
    console.log(`  Saved to cache (${(audioBuffer.length / 1024 / 1024).toFixed(1)}MB)`);
  }

  // Upload to Strapi media library
  console.log(`  Uploading to Strapi media library...`);
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
  formData.append("files", blob, fileName);

  const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${strapiToken}` },
    body: formData,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Strapi upload failed: ${uploadRes.status} ${errText}`);
  }

  const uploaded = await uploadRes.json();
  const strapiUrl = uploaded[0]?.url;
  if (!strapiUrl) throw new Error("No URL returned from Strapi upload");

  console.log(`  Uploaded: ${strapiUrl}`);
  return strapiUrl;
}

// ── Strapi create helpers ───────────────────────────────────────────────────

async function strapiCreate(collection: string, data: Record<string, any>, token: string): Promise<any> {
  const url = `${STRAPI_URL}/api/${collection}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });

  const json = await res.json();
  if (json.error) {
    throw new Error(`Strapi create ${collection} failed: ${json.error.message}`);
  }
  return json.data;
}

async function strapiFind(collection: string, filters: Record<string, any>, token: string): Promise<any[]> {
  const params = new URLSearchParams();

  // Build filter query string for Strapi
  function addFilters(obj: any, prefix: string) {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        addFilters(val, `${prefix}[${key}]`);
      } else {
        params.set(`${prefix}[${key}]`, String(val));
      }
    }
  }
  addFilters(filters, "filters");

  const url = `${STRAPI_URL}/api/${collection}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.data || [];
}

// ── Extract question numbers from test data ─────────────────────────────────

function getQuestionNumbers(testData: any): number[] {
  const numbers: number[] = [];
  for (const partKey of ["part1", "part2", "part3", "part4"]) {
    const part = testData[partKey];
    if (!part) continue;
    for (const group of part.questions || []) {
      // Some parent questions have nested questions
      if (group.questions && group.questions.length > 0) {
        for (const q of group.questions) {
          numbers.push(q.questionNumber);
        }
      } else {
        // Parent question IS the question (no nested children)
        numbers.push(group.questionNumber);
      }
    }
  }
  return numbers.sort((a, b) => a - b);
}

// ── Import a single test ────────────────────────────────────────────────────

async function importTest(
  apiId: number,
  token: string,
  strapiToken: string,
  cacheDir: string,
  answersDir: string,
): Promise<void> {
  // 1. Fetch test detail
  const testData = await fetchTestDetail(apiId, token);
  console.log(`  Title: ${testData.title}`);

  // Check if already imported
  const existing = await strapiFind("tests", { title: { $eq: testData.title } }, strapiToken);
  if (existing.length > 0) {
    console.log(`  Already exists in Strapi, skipping.`);
    return;
  }

  // 2. Get answers (cached)
  const answersPath = resolve(answersDir, `${apiId}.json`);
  let submitData: any;

  if (existsSync(answersPath)) {
    console.log(`  Loading cached answers...`);
    submitData = JSON.parse(readFileSync(answersPath, "utf-8"));
  } else {
    const questionNumbers = getQuestionNumbers(testData);
    console.log(`  Fetching answers for ${questionNumbers.length} questions...`);
    submitData = await fetchAnswers(apiId, token, questionNumbers);
    writeFileSync(answersPath, JSON.stringify(submitData, null, 2), "utf-8");
  }

  // Build answers map: questionNumber -> result
  const answersMap: Record<number, any> = {};
  for (const qr of submitData.questionResults || []) {
    answersMap[qr.questionNumber] = qr;
  }

  // 3. Download and upload audio
  const safeTitle = testData.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().replace(/-+/g, "-");
  const audioFileName = `listening-${apiId}-${safeTitle}.mp3`;
  let strapiAudioUrl: string;

  if (testData.audioUrl) {
    strapiAudioUrl = await downloadAndUploadAudio(testData.audioUrl, audioFileName, strapiToken, cacheDir);
  } else {
    console.warn(`  No audio URL found, using placeholder.`);
    strapiAudioUrl = "";
  }

  // 4. Create test in Strapi
  const strapiTest = await strapiCreate("tests", {
    title: testData.title,
    description: `IELTS Listening - ${testData.title}`,
    difficulty_level: mapDifficulty(testData.difficulty || "MEDIUM"),
    is_published: true,
  }, strapiToken);

  const testDocumentId = strapiTest.documentId;
  console.log(`  Created test: ${testDocumentId}`);

  // 5. Create listening sections (one per part)
  for (let partIdx = 0; partIdx < 4; partIdx++) {
    const partKey = `part${partIdx + 1}`;
    const part = testData[partKey];
    if (!part) continue;

    const sectionNumber = partIdx + 1;

    // Get transcript for this section from submit response
    const transcriptKey = TRANSCRIPT_KEYS[partIdx];
    const transcript = submitData[transcriptKey] || null;

    const strapiSection = await strapiCreate("listening-sections", {
      test: testDocumentId,
      section_number: sectionNumber,
      audio_url: strapiAudioUrl,
      audio_duration_seconds: testData.audioDurationSeconds || null,
      transcript: transcript,
    }, strapiToken);

    const sectionDocumentId = strapiSection.documentId;
    console.log(`  Created section ${sectionNumber}: ${sectionDocumentId}`);

    // 6. Create question groups and questions for this section
    let groupNumber = 0;
    for (const group of part.questions || []) {
      groupNumber++;
      const questionType = mapQuestionType(group.type);

      // Build group options
      const groupOptions = group.options && group.options.length > 0
        ? group.options
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
            .map((o: any) => ({ key: o.optionKey, text: o.optionText }))
        : null;

      // Build group metadata
      const groupMetadata: Record<string, unknown> = {};
      if (group.diagramData) groupMetadata.diagramData = group.diagramData;
      if (group.diagramQuestions) groupMetadata.diagramQuestions = group.diagramQuestions;
      if (group.imageUrl) groupMetadata.imageUrl = group.imageUrl;

      // Create question group
      const strapiGroup = await strapiCreate("question-groups", {
        group_number: groupNumber,
        question_type: questionType,
        instruction: group.instruction || null,
        context: group.questionText && group.questionText !== "----" ? group.questionText : null,
        options: groupOptions,
        metadata: Object.keys(groupMetadata).length > 0 ? groupMetadata : null,
      }, strapiToken);

      const groupDocumentId = strapiGroup.documentId;

      // Determine leaf questions
      const leafQuestions = group.questions && group.questions.length > 0
        ? group.questions
        : [group]; // Parent is the question itself

      for (const subQ of leafQuestions) {
        const qNum = subQ.questionNumber;
        const answerData = answersMap[qNum];
        const correctAnswer = answerData?.correctAnswer || "";
        const explanation = answerData?.explanation || null;

        // Build per-question options (for MCQ where options are on the nested question)
        const qOptions = subQ.options && subQ.options.length > 0
          ? subQ.options
              .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
              .map((o: any) => ({ key: o.optionKey, text: o.optionText }))
          : null;

        // Build question metadata
        const qMetadata: Record<string, unknown> = {};
        if (answerData?.fromPassage) qMetadata.fromPassage = answerData.fromPassage;
        if (answerData?.correctAnswers) qMetadata.correctAnswers = answerData.correctAnswers;

        await strapiCreate("questions", {
          module_type: "listening",
          listening_section: sectionDocumentId,
          question_group: groupDocumentId,
          question_number: qNum,
          question_type: questionType,
          question_text: subQ.questionText || `Question ${qNum}`,
          options: qOptions || groupOptions,
          correct_answer: correctAnswer,
          explanation: explanation,
          points: subQ.points || 1,
          metadata: Object.keys(qMetadata).length > 0 ? qMetadata : null,
        }, strapiToken);
      }

      console.log(`    Group ${groupNumber} (${questionType}): ${leafQuestions.length} questions`);
    }
  }

  console.log(`  Done importing test ${apiId}.`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const { token, ids, strapiToken } = parseArgs();

  // Ensure cache directories exist
  const cacheDir = resolve(__dirname, "cache/audio");
  const answersDir = resolve(__dirname, "cache/answers-listening");
  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(answersDir, { recursive: true });

  // Determine which tests to import
  let testIds: number[];
  if (ids) {
    testIds = ids;
  } else {
    console.log("Fetching test list from external API...");
    const testList = await fetchTestList(token);
    testIds = testList.map((t) => t.id);
    console.log(`Found ${testIds.length} tests.`);
  }

  console.log(`\nImporting ${testIds.length} listening tests into Strapi...\n`);

  const failed: { id: number; error: string }[] = [];
  const succeeded: number[] = [];

  for (const apiId of testIds) {
    console.log(`\n=== Test ${apiId} ===`);

    try {
      await importTest(apiId, token, strapiToken, cacheDir, answersDir);
      succeeded.push(apiId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAILED: ${msg}`);
      failed.push({ id: apiId, error: msg });
    }

    // Rate limit: wait between tests
    await delay(1000);
  }

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`DONE: ${succeeded.length} succeeded, ${failed.length} failed`);

  if (failed.length > 0) {
    console.log("\nFailed tests:");
    for (const f of failed) {
      console.log(`  - ${f.id}: ${f.error}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
