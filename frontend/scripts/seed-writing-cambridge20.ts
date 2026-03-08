/**
 * Seed Cambridge IELTS 20 Writing Tests (Task 2) into Strapi
 *
 * Usage: npx tsx scripts/seed-writing-cambridge20.ts
 *
 * Requires NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN env vars
 * (reads from frontend/.env.local)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
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

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("STRAPI_API_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function createEntry(collection: string, data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(`Failed to create ${collection}: ${json.error.message}`);
  }
  return json.data;
}

interface WritingTestInput {
  title: string;
  description: string;
  difficulty: string;
  prompt: string;
}

const tests: WritingTestInput[] = [
  {
    title: "Cambridge IELTS 20 Academic Writing Test 1 (Task 2)",
    description:
      "Access to clean water as a basic human right — agree or disagree essay",
    difficulty: "medium",
    prompt: `You should spend about 40 minutes on this task. Write at least 250 words.

Access to clean water is a basic human right. Therefore, every home should have a water supply that is provided free of charge.

Do you agree or disagree?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
  {
    title: "Cambridge IELTS 20 Academic Writing Test 2 (Task 2)",
    description:
      "Long school holidays — value and arguments for shorter holidays",
    difficulty: "medium",
    prompt: `You should spend about 40 minutes on this task. Write about the following topic:

In many countries, primary and secondary schools close for two months or more in the summer holidays. What is the value of long school holidays? What are the arguments in favour of shorter school holidays?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
  {
    title: "Cambridge IELTS 20 Academic Writing Test 3 (Task 2)",
    description:
      "Reducing flying — environmental benefits vs disadvantages for individuals and businesses",
    difficulty: "medium",
    prompt: `You should spend about 40 minutes on this task. Write about the following topic:

Some people have decided to reduce the number of times they fly every year or to stop flying altogether. Do you think the environmental benefits of this development outweigh the disadvantages for individuals and businesses?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
  {
    title: "Cambridge IELTS 20 Academic Writing Test 4 (Task 2)",
    description:
      "Global fashion trends — influence on people's lives, positive or negative",
    difficulty: "medium",
    prompt: `You should spend about 40 minutes on this task. Write at least 250 words. Write about the following topic:

Many aspects of the way people dress today are influenced by global fashion trends. How has global fashion become such a strong influence on people's lives? Do you think this is a positive or negative development?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
  },
];

async function main() {
  console.log(`Seeding ${tests.length} writing tests into Strapi at ${STRAPI_URL}...\n`);

  for (const t of tests) {
    // 1. Create the test
    const test = await createEntry("tests", {
      title: t.title,
      description: t.description,
      difficulty_level: t.difficulty,
      is_published: true,
    });
    console.log(`✓ Created test: ${t.title} (${test.documentId})`);

    // 2. Create the writing task linked to the test
    await createEntry("writing-tasks", {
      test: test.documentId,
      task_number: 1,
      task_type: "essay",
      prompt: t.prompt,
      min_words: 250,
      time_limit: 2400,
    });
    console.log(`  ✓ Created writing task (Task 2 essay)\n`);
  }

  console.log("Done! All tests seeded successfully.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
