import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const API_BASE = "https://api.otaboyev-prep.uz/api/readings";

// All Reading Challenge test IDs
const READING_CHALLENGE_IDS = [
  1313, 1354, 1358, 1419, 1544, 1555, 1574, 1665,
  1762, 1764, 1771, 1794, 1795, 1796, 1797, 1800,
  1801, 1802, 1804, 1862,
];

interface SubmitResponse {
  attemptId: number;
  readingId: number;
  totalQuestions: number;
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
      "Usage: npx tsx scripts/batch-import-reading.ts --token <bearer_token> [--ids 1313,1354,...]",
    );
    console.error("If --ids is omitted, all Reading Challenge tests are processed.");
    process.exit(1);
  }

  return { token, ids };
}

async function getQuestionNumbers(apiId: number, token: string): Promise<number[]> {
  const url = `${API_BASE}/${apiId}?authorization=Bearer ${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed for ${apiId}: ${res.status}`);
  const data = await res.json();
  const numbers: number[] = [];
  for (const partKey of ["part1", "part2", "part3"]) {
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

async function submitForAnswers(apiId: number, token: string): Promise<Record<string, string>> {
  // First fetch question numbers
  const questionNumbers = await getQuestionNumbers(apiId, token);
  console.log(`  Found ${questionNumbers.length} questions, submitting...`);

  const url = `${API_BASE}/${apiId}/submit-by-number`;
  // Send only actual question numbers with null answerText
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
    body: JSON.stringify({ readingId: apiId, answers: answersBody }),
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

async function generateSQLForTest(apiId: number, token: string, answersDir: string): Promise<string | null> {
  // 1. Check if answer file already exists
  const answersPath = resolve(answersDir, `${apiId}.json`);
  let answers: Record<string, string>;

  if (existsSync(answersPath)) {
    console.log(`  Answers already exist for ${apiId}, loading from file...`);
    answers = JSON.parse(readFileSync(answersPath, "utf-8"));
  } else {
    // 2. Submit to get answers
    answers = await submitForAnswers(apiId, token);
    writeFileSync(answersPath, JSON.stringify(answers, null, 2), "utf-8");
    console.log(`  Saved ${Object.keys(answers).length} answers to ${answersPath}`);
  }

  // 3. Generate SQL using the existing import script
  // We'll shell out to the import script
  return answersPath;
}

async function main() {
  const { token, ids } = parseArgs();
  const testIds = ids || READING_CHALLENGE_IDS;

  const answersDir = resolve(__dirname, "answers");
  if (!existsSync(answersDir)) mkdirSync(answersDir, { recursive: true });

  console.log(`\nProcessing ${testIds.length} Reading Challenge tests...\n`);

  const failed: { id: number; error: string }[] = [];
  const succeeded: number[] = [];

  for (const apiId of testIds) {
    console.log(`\n=== Test ${apiId} ===`);

    try {
      const answersPath = await generateSQLForTest(apiId, token, answersDir);
      if (!answersPath) continue;

      // Run import script in SQL mode
      const { execSync } = await import("child_process");
      execSync(
        `npx tsx scripts/import-reading-test.ts --apiId ${apiId} --answers "${answersPath}" --token "${token}" --sql`,
        { cwd: resolve(__dirname, ".."), stdio: "inherit" },
      );

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
    combinedSQL += `-- Combined Reading Challenge seed\n`;
    combinedSQL += `-- Tests: ${succeeded.join(", ")}\n`;
    combinedSQL += `-- Generated: ${new Date().toISOString()}\n`;
    combinedSQL += `-- ============================================\n\n`;

    for (const apiId of succeeded) {
      const sqlPath = resolve(__dirname, `seed-reading-${apiId}.sql`);
      if (existsSync(sqlPath)) {
        combinedSQL += readFileSync(sqlPath, "utf-8");
        combinedSQL += "\n";
      }
    }

    const combinedPath = resolve(__dirname, "seed-reading-challenge-all.sql");
    writeFileSync(combinedPath, combinedSQL, "utf-8");
    console.log(`\nCombined SQL written to: ${combinedPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
