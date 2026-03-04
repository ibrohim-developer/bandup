import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

// Load .env.local manually (no dotenv dependency needed)
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
    // .env.local not found, rely on existing env vars
  }
}

loadEnvFile(resolve(__dirname, "../.env.local"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== "your_service_role_key_from_supabase_dashboard"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const API_BASE = "https://api.otaboyev-prep.uz/api/readings";

// Question type mapping: external API type → our DB question_type
const QUESTION_TYPE_MAP: Record<string, string> = {
  TRUE_FALSE_NOT_GIVEN: "tfng",
  YES_NO_NOT_GIVEN: "tfng",
  SUMMARY_COMPLETION_DRAG_DROP: "summary_completion",
  SUMMARY_COMPLETION: "summary_completion",
  MATCHING_HEADINGS: "matching_headings",
  MATCHING_INFORMATION: "matching_info",
  MATCHING_FEATURES: "matching_info",
  MATCHING_NAMES: "matching_info",
  MATCHING_SENTENCE_ENDINGS: "matching_info",
  MULTIPLE_CHOICE: "mcq_single",
  GAP_FILL: "gap_fill",
  SHORT_ANSWER: "short_answer",
  SENTENCE_COMPLETION: "gap_fill",
  NOTE_COMPLETION: "gap_fill",
  TABLE_COMPLETION: "gap_fill",
  FLOW_CHART_COMPLETION: "gap_fill",
  DIAGRAM_LABEL_COMPLETION: "gap_fill",
  MULTIPLE_ANSWER: "mcq_multiple",
  MAP_LABELLING: "gap_fill",
  PLAN_MAP_DIAGRAM_LABELLING: "gap_fill",
  FORM_COMPLETION: "gap_fill",
};

interface ApiQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  points: number;
  correctAnswer: string | null;
  explanation: string | null;
  fromPassage: string | null;
}

interface ApiOption {
  id: number;
  optionKey: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

interface ApiQuestionGroup {
  id: number;
  questionNumber: number;
  type: string;
  questionText: string;
  instruction: string | null;
  context: string | null;
  questions: ApiQuestion[];
  options: ApiOption[];
  points: number;
}

interface ApiPart {
  id: number;
  title: string;
  timeLimitMinutes: number;
  difficulty: string;
  isActive: boolean;
  totalQuestions: number;
  part: number;
  content: string;
  questions: ApiQuestionGroup[];
}

interface ApiResponse {
  globalTitle: string;
  part1?: ApiPart;
  part2?: ApiPart;
  part3?: ApiPart;
}

function parseArgs(): { apiId: string; answersPath: string; token?: string } {
  const args = process.argv.slice(2);
  let apiId = "";
  let answersPath = "";
  let token = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--apiId" && args[i + 1]) apiId = args[++i];
    else if (args[i] === "--answers" && args[i + 1]) answersPath = args[++i];
    else if (args[i] === "--token" && args[i + 1]) token = args[++i];
  }

  if (!apiId || !answersPath) {
    console.error("Usage: npx tsx scripts/import-reading-test.ts --apiId <id> --answers <path> [--token <bearer_token>]");
    process.exit(1);
  }

  return { apiId, answersPath, token: token || undefined };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function mapDifficulty(apiDifficulty: string): "easy" | "medium" | "hard" {
  const d = apiDifficulty.toLowerCase();
  if (d === "easy") return "easy";
  if (d === "hard") return "hard";
  return "medium";
}

function mapQuestionType(apiType: string): string {
  const mapped = QUESTION_TYPE_MAP[apiType];
  if (!mapped) {
    console.warn(`  Warning: Unknown question type "${apiType}", defaulting to "gap_fill"`);
    return "gap_fill";
  }
  return mapped;
}

async function fetchTestData(apiId: string, token?: string): Promise<ApiResponse> {
  const url = token
    ? `${API_BASE}/${apiId}?authorization=Bearer ${token}`
    : `${API_BASE}/${apiId}`;

  console.log(`Fetching test data from: ${API_BASE}/${apiId}`);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API returned ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

function loadAnswers(answersPath: string): Record<string, string> {
  const fullPath = resolve(answersPath);
  console.log(`Loading answers from: ${fullPath}`);
  const raw = readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

async function importPart(
  supabase: ReturnType<typeof createClient>,
  globalTitle: string,
  part: ApiPart,
  answers: Record<string, string>,
) {
  const testTitle = `${globalTitle} - Part ${part.part}: ${part.title}`;
  console.log(`\n--- Importing: ${testTitle} ---`);

  // Check if test already exists
  const { data: existing } = await supabase
    .from("tests")
    .select("id")
    .eq("title", testTitle)
    .single();

  if (existing) {
    console.log(`  Test "${testTitle}" already exists (id: ${existing.id}), skipping.`);
    return;
  }

  // 1. Insert test
  const testId = randomUUID();
  const { error: testError } = await supabase.from("tests").insert({
    id: testId,
    title: testTitle,
    description: `Cambridge IELTS - ${part.title}`,
    difficulty_level: mapDifficulty(part.difficulty),
    is_published: true,
  });

  if (testError) {
    console.error(`  Failed to insert test: ${testError.message}`);
    return;
  }
  console.log(`  Created test: ${testId}`);

  // 2. Insert reading passage
  const passageId = randomUUID();
  const wordCount = countWords(part.content);
  const timeLimitSeconds = part.timeLimitMinutes * 60;

  const { error: passageError } = await supabase.from("reading_passages").insert({
    id: passageId,
    test_id: testId,
    passage_number: 1,
    title: part.title,
    content: part.content,
    word_count: wordCount,
    time_limit: timeLimitSeconds,
  });

  if (passageError) {
    console.error(`  Failed to insert passage: ${passageError.message}`);
    return;
  }
  console.log(`  Created passage: ${passageId} (${wordCount} words, ${part.timeLimitMinutes}min)`);

  // 3. Insert questions
  let questionCount = 0;
  let missingAnswers: number[] = [];

  for (const group of part.questions) {
    const questionType = mapQuestionType(group.type);

    // Build options array from group options
    const options = group.options.length > 0
      ? group.options
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((o) => o.optionText)
      : null;

    for (const subQ of group.questions) {
      const answerKey = String(subQ.questionNumber);
      const correctAnswer = answers[answerKey];

      if (!correctAnswer) {
        missingAnswers.push(subQ.questionNumber);
        continue;
      }

      const metadata: Record<string, unknown> = {};
      if (subQ.explanation) metadata.explanation = subQ.explanation;
      if (subQ.fromPassage) metadata.fromPassage = subQ.fromPassage;
      if (group.instruction) metadata.instruction = group.instruction;
      if (group.questionText && group.questionText !== "----") {
        metadata.context = group.questionText;
      }

      const { error: qError } = await supabase.from("questions").insert({
        id: randomUUID(),
        module_type: "reading",
        section_id: passageId,
        question_number: subQ.questionNumber,
        question_type: questionType,
        question_text: subQ.questionText || `Question ${subQ.questionNumber}`,
        options: options,
        correct_answer: correctAnswer,
        explanation: subQ.explanation,
        points: subQ.points || 1,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      });

      if (qError) {
        console.error(`  Failed to insert question ${subQ.questionNumber}: ${qError.message}`);
      } else {
        questionCount++;
      }
    }
  }

  console.log(`  Created ${questionCount} questions`);
  if (missingAnswers.length > 0) {
    console.warn(`  Warning: Missing answers for questions: ${missingAnswers.join(", ")}`);
  }
}

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

function generateSQL(
  globalTitle: string,
  part: ApiPart,
  answers: Record<string, string>,
): string {
  const testId = randomUUID();
  const passageId = randomUUID();
  const testTitle = `${globalTitle} - Part ${part.part}: ${part.title}`;
  const wordCount = countWords(part.content);
  const timeLimitSeconds = part.timeLimitMinutes * 60;

  let sql = `-- ============================================\n`;
  sql += `-- ${testTitle}\n`;
  sql += `-- ============================================\n\n`;

  // Insert test
  sql += `INSERT INTO public.tests (id, title, description, difficulty_level, is_published)\n`;
  sql += `VALUES (\n`;
  sql += `    '${testId}',\n`;
  sql += `    '${escapeSQL(testTitle)}',\n`;
  sql += `    '${escapeSQL(`Cambridge IELTS - ${part.title}`)}',\n`;
  sql += `    '${mapDifficulty(part.difficulty)}',\n`;
  sql += `    true\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;

  // Insert passage
  sql += `INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count, time_limit)\n`;
  sql += `VALUES (\n`;
  sql += `    '${passageId}',\n`;
  sql += `    '${testId}',\n`;
  sql += `    1,\n`;
  sql += `    '${escapeSQL(part.title)}',\n`;
  sql += `    '${escapeSQL(part.content)}',\n`;
  sql += `    ${wordCount},\n`;
  sql += `    ${timeLimitSeconds}\n`;
  sql += `);\n\n`;

  // Insert questions
  for (const group of part.questions) {
    const questionType = mapQuestionType(group.type);

    const options = group.options.length > 0
      ? group.options
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((o) => o.optionText)
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
      if (subQ.fromPassage) metadata.fromPassage = subQ.fromPassage;
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
      sql += `    'reading',\n`;
      sql += `    '${passageId}',\n`;
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
  const { apiId, answersPath, token } = parseArgs();

  const args = process.argv.slice(2);
  const outputMode = args.includes("--sql") ? "sql" : "supabase";

  const answers = loadAnswers(answersPath);
  const testData = await fetchTestData(apiId, token);

  const parts = [testData.part1, testData.part2, testData.part3].filter(
    (p): p is ApiPart => p !== undefined && p !== null,
  );

  if (outputMode === "sql") {
    // Generate SQL file
    let fullSQL = `-- ============================================\n`;
    fullSQL += `-- Auto-generated seed for: ${testData.globalTitle}\n`;
    fullSQL += `-- Source API ID: ${apiId}\n`;
    fullSQL += `-- Generated: ${new Date().toISOString()}\n`;
    fullSQL += `-- ============================================\n\n`;

    for (const part of parts) {
      fullSQL += generateSQL(testData.globalTitle, part, answers);
    }

    // Write to file
    const outputPath = resolve(__dirname, `seed-reading-${apiId}.sql`);
    const { writeFileSync } = await import("fs");
    writeFileSync(outputPath, fullSQL, "utf-8");
    console.log(`SQL written to: ${outputPath}`);
    console.log(`Parts: ${parts.length}, Answers used: ${Object.keys(answers).length}`);
    return;
  }

  // Supabase direct insert mode
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(`\nTest: "${testData.globalTitle}"`);
  console.log(`Answers loaded: ${Object.keys(answers).length} entries`);
  console.log(`Parts found: ${parts.length}`);

  for (const part of parts) {
    await importPart(supabase, testData.globalTitle, part, answers);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
