/**
 * Answer matching for auto-graded reading & listening questions.
 *
 * IMPORTANT: only `mcq_multiple` answers are sets of letters where order is
 * irrelevant ("C,E" === "E,C"). Every other question type is free text and must
 * NOT be comma-split — splitting mangles numbers with thousands separators
 * ("60,000" would normalize to "000,60") and marks correct answers wrong.
 */

// Canonicalize common British spellings to their American form so either is
// accepted. Curated word list (NOT regex patterns — "-our"→"-or" would mangle
// "four"→"for", etc.). This only ever makes equivalent answers match; it never
// merges genuinely different answers, so it can't turn a wrong answer correct.
const BRITISH_TO_AMERICAN: Record<string, string> = {
  colour: "color", colours: "colors", favour: "favor", favourite: "favorite",
  behaviour: "behavior", neighbour: "neighbor", neighbours: "neighbors",
  labour: "labor", honour: "honor", harbour: "harbor", flavour: "flavor",
  humour: "humor", odour: "odor", vapour: "vapor", rumour: "rumor",
  organise: "organize", organisation: "organization", organised: "organized",
  realise: "realize", recognise: "recognize", analyse: "analyze",
  emphasise: "emphasize", apologise: "apologize", specialise: "specialize",
  centre: "center", centres: "centers", metre: "meter", metres: "meters",
  litre: "liter", litres: "liters", theatre: "theater", fibre: "fiber",
  programme: "program", catalogue: "catalog", dialogue: "dialog",
  defence: "defense", licence: "license", offence: "offense",
  travelling: "traveling", travelled: "traveled", traveller: "traveler",
  cancelled: "canceled", labelled: "labeled", modelling: "modeling",
  jewellery: "jewelry", aeroplane: "airplane", grey: "gray", tyre: "tire",
  tyres: "tires", kerb: "curb", plough: "plow", mould: "mold",
  cheque: "check", storey: "story", storeys: "stories", aluminium: "aluminum",
  practise: "practice", enrol: "enroll", fulfil: "fulfill", sceptical: "skeptical",
  ageing: "aging", gramme: "gram", grammes: "grams", sulphur: "sulfur",
};

const normalizeText = (answer: string): string => {
  const base = (answer ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    // Strip thousands separators so "60,000" and "60000" are equivalent.
    // Only commas *between digits* are removed, leaving any other comma intact.
    .replace(/(?<=\d),(?=\d)/g, "")
    // Treat the percent sign and the words "per cent"/"percent" as equivalent,
    // so "20%", "20 %", "20 percent" and "20 per cent" all match.
    .replace(/\s*%/g, " percent")
    .replace(/per cent/g, "percent")
    .replace(/\s+/g, " ")
    .trim();
  // Canonicalize spelling word-by-word.
  return base
    .split(" ")
    .map((w) => BRITISH_TO_AMERICAN[w] ?? w)
    .join(" ");
};

const normalizeLetterSet = (answer: string): string =>
  (answer ?? "")
    .split(",")
    .map((s) => normalizeText(s))
    .filter(Boolean)
    .sort()
    .join(",");

// True/False/Not Given and Yes/No/Not Given are the same logical answer space:
// TRUE means "agrees" (= YES) and FALSE means "contradicts" (= NO). The UI label
// shown to the student depends on the question_type, but the answer key may be
// stored in either vocabulary, so grade them as equivalent. This never merges
// genuinely different answers (NOT GIVEN stays distinct), so it can't turn a
// wrong answer correct — it only fixes the TRUE-vs-YES mismatch.
const TFNG_EQUIVALENTS: Record<string, string> = {
  yes: "true",
  no: "false",
};

const normalizeTfng = (answer: string): string => {
  const base = normalizeText(answer);
  return TFNG_EQUIVALENTS[base] ?? base;
};

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
  if (questionType === "tfng" || questionType === "ynng") {
    const correct = normalizeTfng(correctAnswer ?? "");
    return correct !== "" && normalizeTfng(userAnswer ?? "") === correct;
  }
  const correct = normalizeText(correctAnswer ?? "");
  return correct !== "" && normalizeText(userAnswer ?? "") === correct;
}
