import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

const API_BASE = "https://api.otaboyev-prep.uz/api/listenings";

// All single-section listening test IDs
const SINGLE_SECTION_IDS = [
  877, 876, 874, 873, 872, 871, 870, 869, 868, 867, 993,
  994, 357, 995, 358, 385, 225, 289,
];

const QUESTION_TYPE_MAP: Record<string, string> = {
  TRUE_FALSE_NOT_GIVEN: "tfng",
  YES_NO_NOT_GIVEN: "tfng",
  MULTIPLE_CHOICE: "mcq_single",
  MULTIPLE_ANSWER: "mcq_multiple",
  GAP_FILL: "gap_fill",
  SHORT_ANSWER: "short_answer",
  SENTENCE_COMPLETION: "gap_fill",
  NOTE_COMPLETION: "gap_fill",
  TABLE_COMPLETION: "gap_fill",
  FLOW_CHART_COMPLETION: "gap_fill",
  DIAGRAM_LABEL_COMPLETION: "gap_fill",
  MAP_LABELLING: "gap_fill",
  PLAN_MAP_DIAGRAM_LABELLING: "gap_fill",
  SUMMARY_COMPLETION: "summary_completion",
  SUMMARY_COMPLETION_DRAG_DROP: "summary_completion",
  MATCHING_HEADINGS: "matching_headings",
  MATCHING_INFORMATION: "matching_info",
  MATCHING_FEATURES: "matching_info",
  MATCHING_NAMES: "matching_info",
  MATCHING_SENTENCE_ENDINGS: "matching_info",
};

interface SubmitResponse {
  questionResults: {
    questionNumber: number;
    correctAnswer: string;
  }[];
}

function parseArgs(): { token: string; ids?: number[] } {
  const args = process.argv.slice(2);
  let token = "";
  let ids: number[] | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--token" && args[i + 1]) token = args[++i];
    else if (args[i] === "--ids" && args[i + 1]) {
      ids = args[++i].split(",").map((s) => parseInt(s.trim()));
    }
  }

  if (!token) {
    console.error(
      "Usage: npx tsx scripts/batch-import-listening.ts --token <bearer_token> [--ids 289,357,...]",
    );
    console.error("If --ids is omitted, all single-section tests are processed.");
    process.exit(1);
  }

  return { token, ids };
}

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

function mapQuestionType(apiType: string): string {
  const mapped = QUESTION_TYPE_MAP[apiType];
  if (!mapped) {
    console.warn(`  Warning: Unknown question type "${apiType}", defaulting to "gap_fill"`);
    return "gap_fill";
  }
  return mapped;
}

function mapDifficulty(apiDifficulty: string): "easy" | "medium" | "hard" {
  const d = apiDifficulty.toLowerCase();
  if (d === "easy") return "easy";
  if (d === "hard") return "hard";
  return "medium";
}

async function fetchTestData(apiId: number, token: string): Promise<any> {
  const url = `${API_BASE}/${apiId}?authorization=Bearer ${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed for ${apiId}: ${res.status}`);
  return res.json();
}

function getQuestionNumbers(data: any): number[] {
  const numbers: number[] = [];
  for (const partKey of ["part1", "part2", "part3", "part4"]) {
    const part = data[partKey];
    if (!part) continue;
    for (const group of part.questions || []) {
      for (const q of group.questions || []) {
        numbers.push(q.questionNumber);
      }
    }
  }
  return numbers.sort((a, b) => a - b);
}

async function submitForAnswers(apiId: number, token: string, questionNumbers: number[]): Promise<Record<string, string>> {
  const url = `${API_BASE}/${apiId}/submit-by-number`;
  const answersBody = questionNumbers.map((qn) => ({
    questionNumber: qn,
    answerText: null,
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ listeningId: apiId, answers: answersBody }),
  });

  if (!res.ok) {
    throw new Error(`Submit failed for ${apiId}: ${res.status} ${await res.text()}`);
  }

  const data: SubmitResponse = await res.json();
  const answers: Record<string, string> = {};

  for (const q of data.questionResults) {
    if (q.correctAnswer) {
      answers[String(q.questionNumber)] = q.correctAnswer;
    }
  }

  return answers;
}

async function downloadAudio(audioUrl: string, outputPath: string): Promise<void> {
  if (existsSync(outputPath)) {
    console.log(`  Audio already downloaded: ${outputPath}`);
    return;
  }

  console.log(`  Downloading audio...`);
  const res = await fetch(audioUrl);
  if (!res.ok) throw new Error(`Audio download failed: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`  Saved audio: ${outputPath} (${sizeMB}MB)`);
}

function generateSQL(
  testData: any,
  part: any,
  partKey: string,
  answers: Record<string, string>,
  audioUrl: string,
): string {
  const testId = randomUUID();
  const sectionId = randomUUID();
  const sectionNumber = parseInt(partKey.replace("part", ""));
  const testTitle = testData.title;

  let sql = `-- ============================================\n`;
  sql += `-- ${testTitle} (Section ${sectionNumber})\n`;
  sql += `-- ============================================\n\n`;

  // Insert test
  sql += `INSERT INTO public.tests (id, title, description, difficulty_level, is_published)\n`;
  sql += `VALUES (\n`;
  sql += `    '${testId}',\n`;
  sql += `    '${escapeSQL(testTitle)}',\n`;
  sql += `    '${escapeSQL(`IELTS Listening - ${testTitle}`)}',\n`;
  sql += `    '${mapDifficulty(testData.difficulty || "MEDIUM")}',\n`;
  sql += `    true\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;

  // Insert listening section
  sql += `INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds)\n`;
  sql += `VALUES (\n`;
  sql += `    '${sectionId}',\n`;
  sql += `    '${testId}',\n`;
  sql += `    ${sectionNumber},\n`;
  sql += `    '${escapeSQL(audioUrl)}',\n`;
  sql += `    ${testData.audioDurationSeconds || 0}\n`;
  sql += `);\n\n`;

  // Insert questions
  for (const group of part.questions) {
    const questionType = mapQuestionType(group.type);

    const options = group.options && group.options.length > 0
      ? group.options
          .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
          .map((o: any) => o.optionText)
      : null;

    const optionsJSON = options ? `'${escapeSQL(JSON.stringify(options))}'::jsonb` : "NULL";

    for (const subQ of group.questions) {
      const answerKey = String(subQ.questionNumber);
      const correctAnswer = answers[answerKey];

      if (!correctAnswer) {
        sql += `-- WARNING: No answer for question ${subQ.questionNumber}, skipping\n`;
        continue;
      }

      const metadata: Record<string, unknown> = {};
      if (subQ.explanation) metadata.explanation = subQ.explanation;
      if (group.instruction) metadata.instruction = group.instruction;
      if (group.questionText && group.questionText !== "----") {
        metadata.context = group.questionText;
      }

      const metadataJSON = Object.keys(metadata).length > 0
        ? `'${escapeSQL(JSON.stringify(metadata))}'::jsonb`
        : "NULL";

      const questionText = subQ.questionText || `Question ${subQ.questionNumber}`;
      const explanation = subQ.explanation ? `'${escapeSQL(subQ.explanation)}'` : "NULL";

      sql += `INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata)\n`;
      sql += `VALUES (\n`;
      sql += `    '${randomUUID()}',\n`;
      sql += `    'listening',\n`;
      sql += `    '${sectionId}',\n`;
      sql += `    ${subQ.questionNumber},\n`;
      sql += `    '${questionType}',\n`;
      sql += `    '${escapeSQL(questionText)}',\n`;
      sql += `    ${optionsJSON},\n`;
      sql += `    '${escapeSQL(correctAnswer)}',\n`;
      sql += `    ${explanation},\n`;
      sql += `    ${subQ.points || 1},\n`;
      sql += `    ${metadataJSON}\n`;
      sql += `);\n\n`;
    }
  }

  return sql;
}

async function main() {
  const { token, ids } = parseArgs();
  const testIds = ids || SINGLE_SECTION_IDS;

  const answersDir = resolve(__dirname, "answers/listening");
  const audioDir = resolve(__dirname, "audio");
  if (!existsSync(answersDir)) mkdirSync(answersDir, { recursive: true });
  if (!existsSync(audioDir)) mkdirSync(audioDir, { recursive: true });

  console.log(`\nProcessing ${testIds.length} single-section listening tests...\n`);

  const failed: { id: number; error: string }[] = [];
  const succeeded: number[] = [];

  for (const apiId of testIds) {
    console.log(`\n=== Test ${apiId} ===`);

    try {
      // 1. Fetch test data
      const testData = await fetchTestData(apiId, token);
      console.log(`  Title: ${testData.title}`);

      // Find the single part
      const partKeys = ["part1", "part2", "part3", "part4"].filter(
        (k) => testData[k] !== null,
      );
      if (partKeys.length !== 1) {
        console.log(`  Skipping: has ${partKeys.length} parts (not single-section)`);
        continue;
      }
      const partKey = partKeys[0];
      const part = testData[partKey];

      // 2. Get answers
      const answersPath = resolve(answersDir, `${apiId}.json`);
      let answers: Record<string, string>;

      if (existsSync(answersPath)) {
        console.log(`  Answers already exist, loading from file...`);
        answers = JSON.parse(readFileSync(answersPath, "utf-8"));
      } else {
        const questionNumbers = getQuestionNumbers(testData);
        console.log(`  Found ${questionNumbers.length} questions, submitting for answers...`);
        answers = await submitForAnswers(apiId, token, questionNumbers);
        writeFileSync(answersPath, JSON.stringify(answers, null, 2), "utf-8");
        console.log(`  Saved ${Object.keys(answers).length} answers`);
      }

      // 3. Download audio
      const ext = testData.audioUrl?.includes(".mp3") ? "mp3" : "m4a";
      const safeTitle = testData.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().replace(/-+/g, "-");
      const audioFileName = `${apiId}-${safeTitle}.${ext}`;
      const audioPath = resolve(audioDir, audioFileName);
      await downloadAudio(testData.audioUrl, audioPath);

      // 4. Generate SQL (use the external API audio URL for now, can be replaced with Supabase URL later)
      const audioUrl = testData.audioUrl;
      const sql = generateSQL(testData, part, partKey, answers, audioUrl);

      let fullSQL = `-- ============================================\n`;
      fullSQL += `-- Auto-generated seed for: ${testData.title}\n`;
      fullSQL += `-- Source API ID: ${apiId}\n`;
      fullSQL += `-- Generated: ${new Date().toISOString()}\n`;
      fullSQL += `-- ============================================\n\n`;
      fullSQL += sql;

      const sqlPath = resolve(__dirname, `seed-listening-${apiId}.sql`);
      writeFileSync(sqlPath, fullSQL, "utf-8");
      console.log(`  SQL written to: ${sqlPath}`);

      succeeded.push(apiId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAILED: ${msg}`);
      failed.push({ id: apiId, error: msg });
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
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

  // Combine all SQL files into one
  if (succeeded.length > 0) {
    let combinedSQL = `-- ============================================\n`;
    combinedSQL += `-- Combined Listening single-section seed\n`;
    combinedSQL += `-- Tests: ${succeeded.join(", ")}\n`;
    combinedSQL += `-- Generated: ${new Date().toISOString()}\n`;
    combinedSQL += `-- ============================================\n\n`;

    for (const apiId of succeeded) {
      const sqlPath = resolve(__dirname, `seed-listening-${apiId}.sql`);
      if (existsSync(sqlPath)) {
        combinedSQL += readFileSync(sqlPath, "utf-8");
        combinedSQL += "\n";
      }
    }

    const combinedPath = resolve(__dirname, "seed-listening-singles-all.sql");
    writeFileSync(combinedPath, combinedSQL, "utf-8");
    console.log(`\nCombined SQL written to: ${combinedPath}`);

    // Audio summary
    const audioFiles = succeeded.map((id) => {
      const files = require("fs").readdirSync(audioDir).filter((f: string) => f.startsWith(`${id}-`));
      return files[0] || "missing";
    });
    console.log(`\nAudio files downloaded to: ${audioDir}/`);
    console.log(`Total audio files: ${audioFiles.filter((f: string) => f !== "missing").length}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
