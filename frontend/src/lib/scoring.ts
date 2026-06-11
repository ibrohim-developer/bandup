/**
 * Answer matching for auto-graded reading & listening questions.
 *
 * IMPORTANT: only `mcq_multiple` answers are sets of letters where order is
 * irrelevant ("C,E" === "E,C"). Every other question type is free text and must
 * NOT be comma-split — splitting mangles numbers with thousands separators
 * ("60,000" would normalize to "000,60") and marks correct answers wrong.
 */

const normalizeText = (answer: string): string =>
  (answer ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    // Strip thousands separators so "60,000" and "60000" are equivalent.
    // Only commas *between digits* are removed, leaving any other comma intact.
    .replace(/(?<=\d),(?=\d)/g, "")
    .replace(/\s+/g, " ");

const normalizeLetterSet = (answer: string): string =>
  (answer ?? "")
    .split(",")
    .map((s) => normalizeText(s))
    .filter(Boolean)
    .sort()
    .join(",");

export function isAnswerCorrect(
  questionType: string | undefined,
  userAnswer: string | undefined,
  correctAnswer: string | undefined,
): boolean {
  if (questionType === "mcq_multiple") {
    const correct = normalizeLetterSet(correctAnswer ?? "");
    // A blank/missing correct answer is a data error — never auto-pass it
    // (previously an empty user answer matched an empty key and scored a point).
    return correct !== "" && normalizeLetterSet(userAnswer ?? "") === correct;
  }
  const correct = normalizeText(correctAnswer ?? "");
  return correct !== "" && normalizeText(userAnswer ?? "") === correct;
}
