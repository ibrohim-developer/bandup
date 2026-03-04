export const QUESTION_TYPE_INSTRUCTIONS: Record<string, string> = {
  tfng: "Do the following statements agree with the information given in the reading passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.",
  ynng: "Do the following statements agree with the claims of the writer? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.",
  mcq_single: "Choose the correct letter, A, B, C or D.",
  mcq_multiple: "Choose TWO correct letters.",
  gap_fill:
    "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  matching_headings:
    "Choose the correct heading for each paragraph from the list of headings below.",
  matching_info:
    "Which paragraph contains the following information?",
  summary_completion:
    "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  short_answer:
    "Answer the questions below. Choose NO MORE THAN THREE WORDS from the passage for each answer.",
};

export function getTypeInstruction(type: string): string {
  return QUESTION_TYPE_INSTRUCTIONS[type] ?? "";
}
