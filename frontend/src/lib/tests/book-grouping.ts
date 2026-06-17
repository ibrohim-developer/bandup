/**
 * Shared helpers for grouping module tests (reading, listening, …) into "books"
 * and splitting them across the Cambridge / Practice Tests tabs.
 *
 * A test title like "Cambridge 20 Test 2" (or "Cambridge 20_Test 3") is parsed
 * into a book ("Cambridge 20") and a test number (2). Tests sharing a book are
 * bucketed into one card; titles that don't match fall back to a single-test
 * book keyed on the full title.
 */

export interface BookTestMember {
  id: string;
  slug: string;
  title: string;
  testLabel: string;
  testNumber: number;
  difficulty: string;
  /** Per-test summary line, e.g. "13 questions" or "2 tasks". */
  metric: string;
  isCompleted: boolean;
}

export interface BookGroup {
  id: string;
  bookTitle: string;
  type: string;
  tests: BookTestMember[];
}

export interface FlatTest {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  /** Per-test summary line, e.g. "13 questions" or "2 tasks". */
  metric: string;
  type: string;
  isCompleted: boolean;
}

export interface BookTabResult {
  items: BookGroup[];
  counts: { cambridge: number; practice: number };
  totalCount: number;
  hasMore: boolean;
}

function parseBook(title: string): {
  book: string;
  label: string;
  testNumber: number;
} {
  const match = title.match(/^(.+?)[\s_]+test[\s_]*0*(\d+)\b/i);
  if (match) {
    const book = match[1].trim().replace(/[\s_]+/g, " ");
    const testNumber = parseInt(match[2], 10);
    return { book, label: `Test ${testNumber}`, testNumber };
  }
  const book = title.trim();
  return { book, label: book, testNumber: Number.MAX_SAFE_INTEGER };
}

/**
 * Groups already-filtered flat tests into books, splits them into the Cambridge
 * and Practice Tests tabs, and paginates the active tab.
 */
export function buildBookTabResult(
  tests: FlatTest[],
  tab: string | undefined,
  page: number,
  pageSize: number,
): BookTabResult {
  const groupsMap = new Map<string, BookGroup>();
  for (const test of tests) {
    const { book, label, testNumber } = parseBook(test.title);
    const key = book.toLowerCase();
    let group = groupsMap.get(key);
    if (!group) {
      group = {
        id: key.replace(/\s+/g, "-"),
        bookTitle: book,
        type: test.type,
        tests: [],
      };
      groupsMap.set(key, group);
    }
    group.tests.push({
      id: test.id,
      slug: test.slug,
      title: test.title,
      testLabel: label,
      testNumber,
      difficulty: test.difficulty,
      metric: test.metric,
      isCompleted: test.isCompleted,
    });
  }

  const groups = [...groupsMap.values()];
  for (const group of groups) {
    group.tests.sort((a, b) => a.testNumber - b.testNumber);
  }

  const isCambridge = (g: BookGroup) => /^cambridge\b/i.test(g.bookTitle);
  const countTests = (gs: BookGroup[]) =>
    gs.reduce((sum, g) => sum + g.tests.length, 0);

  const cambridgeGroups = groups.filter(isCambridge);
  const practiceGroups = groups.filter((g) => !isCambridge(g));
  const counts = {
    cambridge: countTests(cambridgeGroups),
    practice: countTests(practiceGroups),
  };

  const activeTab = tab === "practice" ? "practice" : "cambridge";
  const activeGroups =
    activeTab === "practice" ? practiceGroups : cambridgeGroups;

  const start = page * pageSize;
  const items = activeGroups.slice(start, start + pageSize);

  return {
    items,
    counts,
    totalCount: countTests(activeGroups),
    hasMore: start + pageSize < activeGroups.length,
  };
}
