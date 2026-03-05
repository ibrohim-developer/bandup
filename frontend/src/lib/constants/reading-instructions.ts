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
  summary_completion_drag_drop:
    "Complete the summary below. Choose your answers from the list of words provided.",
  short_answer:
    "Answer the questions below. Choose NO MORE THAN THREE WORDS from the passage for each answer.",
  note_completion:
    "Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  table_completion:
    "Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  sentence_completion:
    "Complete each sentence with the correct ending.",
  flow_chart_completion:
    "Complete the flow chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  matching_names:
    "Look at the following statements and the list of people/names. Match each statement with the correct person/name.",
  matching_sentence_endings:
    "Complete each sentence with the correct ending, A-G, from the box below.",
};

export function getTypeInstruction(type: string): string {
  return QUESTION_TYPE_INSTRUCTIONS[type] ?? "";
}
