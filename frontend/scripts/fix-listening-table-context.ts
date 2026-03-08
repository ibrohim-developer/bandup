/**
 * Fix missing table context for listening question groups.
 *
 * Re-fetches test data from the external API and updates question groups
 * of type "table_completion" that have null context with the proper table HTML.
 *
 * Usage:
 *   npx tsx scripts/fix-listening-table-context.ts --token <bearer_token> [--strapi-token <strapi_api_token>] [--dry-run]
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const EXTERNAL_API = "https://api.otaboyev-prep.uz/api/listenings";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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

// ── Convert tableData to HTML ───────────────────────────────────────────────

function tableDataToHtml(tableData: any): string | null {
  if (!tableData || !tableData.columns || !tableData.rows) return null;
  const cols = tableData.columns as { header: string; width?: number }[];
  const rows = tableData.rows as { cells: string[] }[];

  let html = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">';
  html += '<thead><tr>';
  for (const col of cols) {
    html += `<th style="text-align:left;font-weight:bold">${col.header || ''}</th>`;
  }
  html += '</tr></thead>';
  html += '<tbody>';
  for (const row of rows) {
    html += '<tr>';
    for (let i = 0; i < cols.length; i++) {
      const cell = row.cells[i] || '';
      html += `<td>${cell}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

// ── CLI args ────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let token = "";
  let strapiToken = process.env.STRAPI_API_TOKEN || "";
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--token" && args[i + 1]) token = args[++i];
    else if (args[i] === "--strapi-token" && args[i + 1]) strapiToken = args[++i];
    else if (args[i] === "--dry-run") dryRun = true;
  }

  if (!token) {
    console.error("Usage: npx tsx scripts/fix-listening-table-context.ts --token <bearer_token> [--strapi-token <token>] [--dry-run]");
    process.exit(1);
  }
  if (!strapiToken) {
    console.error("Error: No Strapi API token.");
    process.exit(1);
  }

  return { token, strapiToken, dryRun };
}

// ── Strapi helpers ──────────────────────────────────────────────────────────

async function strapiUpdate(endpoint: string, documentId: string, body: any, strapiToken: string): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${strapiToken}`,
    },
    body: JSON.stringify({ data: body }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi update ${endpoint}/${documentId} failed: ${res.status} — ${text}`);
  }
  return (await res.json()).data;
}

// ── Strapi fetch with populate ───────────────────────────────────────────────

async function strapiFindPopulated(endpoint: string, populate: string, strapiToken: string, pageSize = 100): Promise<any[]> {
  const results: any[] = [];
  let page = 1;
  let pageCount = 1;

  while (page <= pageCount) {
    const url = `${STRAPI_URL}/api/${endpoint}?${populate}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });
    if (!res.ok) throw new Error(`Strapi find ${endpoint} failed: ${res.status}`);
    const data = await res.json();
    results.push(...(data.data || []));
    pageCount = data.meta?.pagination?.pageCount || 1;
    page++;
  }
  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const { token, strapiToken, dryRun } = parseArgs();

  // 1. Fetch all Strapi listening sections with their questions and question groups
  console.log("Fetching Strapi listening sections with questions...");
  const sections = await strapiFindPopulated(
    "listening-sections",
    "populate[test][fields]=title&populate[questions][fields]=question_number,question_type&populate[questions][populate][question_group][fields]=question_type,context,instruction",
    strapiToken,
  );
  console.log(`Found ${sections.length} listening sections in Strapi.`);

  // 2. Build a map: group documentId -> { testTitle, questionNumbers, context }
  const groupMap = new Map<string, { testTitle: string; questionNumbers: number[]; context: string | null }>();
  for (const section of sections) {
    const testTitle = section.test?.title || "";
    for (const q of section.questions || []) {
      const g = q.question_group;
      if (!g || g.question_type !== "table_completion") continue;
      if (!groupMap.has(g.documentId)) {
        groupMap.set(g.documentId, { testTitle, questionNumbers: [], context: g.context });
      }
      groupMap.get(g.documentId)!.questionNumbers.push(q.question_number);
    }
  }

  // Filter to groups with no context
  const emptyGroups = [...groupMap.entries()].filter(([, v]) => !v.context);
  console.log(`Found ${emptyGroups.length} table_completion groups without context (out of ${groupMap.size} total).`);

  if (emptyGroups.length === 0) {
    console.log("Nothing to fix!");
    return;
  }

  // 3. Get all listening tests from external API
  console.log("Fetching test list from external API...");
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
  console.log(`Found ${allTests.length} tests in external API.`);

  // 4. For each external test, fetch detail and build tableData map by title + question numbers
  const tableDataMap = new Map<string, string>(); // "testTitle|qNums" -> tableHtml
  for (const test of allTests) {
    const url = `${EXTERNAL_API}/${test.id}?authorization=Bearer ${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  Skipping test ${test.id}: fetch failed ${res.status}`);
      continue;
    }
    const testData = await res.json();

    for (const partKey of ["part1", "part2", "part3", "part4"]) {
      const part = testData[partKey];
      if (!part) continue;

      for (const group of part.questions || []) {
        if (group.type !== "TABLE_COMPLETION" || !group.tableData) continue;

        const tableHtml = tableDataToHtml(group.tableData);
        if (!tableHtml) continue;

        const qNums = (group.questions || []).map((q: any) => q.questionNumber).sort((a: number, b: number) => a - b);
        // Normalize test title for matching (trim, lowercase)
        const key = `${test.title.trim().toLowerCase()}|${qNums.join(',')}`;
        tableDataMap.set(key, tableHtml);
      }
    }
  }
  console.log(`Found ${tableDataMap.size} table completions with tableData in external API.\n`);

  // 5. Match and update
  let fixedCount = 0;
  for (const [groupDocId, info] of emptyGroups) {
    const qNums = info.questionNumbers.sort((a, b) => a - b);
    const key = `${info.testTitle.trim().toLowerCase()}|${qNums.join(',')}`;
    const tableHtml = tableDataMap.get(key);

    if (tableHtml) {
      console.log(`  Fixing group ${groupDocId} (test: "${info.testTitle}", questions: ${qNums.join(',')})`);
      if (!dryRun) {
        await strapiUpdate("question-groups", groupDocId, { context: tableHtml }, strapiToken);
      }
      fixedCount++;
    } else {
      console.log(`  No match for group ${groupDocId} (test: "${info.testTitle}", questions: ${qNums.join(',')})`);
    }
  }

  console.log(`\n${dryRun ? '[DRY RUN] Would fix' : 'Fixed'} ${fixedCount} out of ${emptyGroups.length} groups.`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
