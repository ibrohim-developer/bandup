import { geminiFlash } from "./gemini";

export interface EssayEvaluation {
  taskAchievementScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  overallBandScore: number;
  feedback: string;
}

function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const BAND_DESCRIPTORS = `
OFFICIAL IELTS WRITING BAND DESCRIPTORS (condensed, public).
Use these as your scoring anchors. Do NOT default to Band 6-7 — calibrate carefully.

=== TASK ACHIEVEMENT / TASK RESPONSE ===
Band 9: Fully addresses all parts. Fully developed position with relevant, well-supported, fully extended ideas.
Band 8: Sufficiently addresses all parts. Well-developed response with relevant, extended, supported ideas.
Band 7: Addresses all parts though some more fully than others. Clear position throughout. Main ideas extended and supported but may over-generalise or lack focus.
Band 6: Addresses all parts but some more fully than others. Relevant position though conclusions may be unclear/repetitive. Main ideas relevant but some insufficiently developed or unclear.
Band 5: Addresses task only partially. Format may be inappropriate. Expresses position but development not always clear. Some main ideas but limited, not sufficiently developed, or irrelevant detail.
Band 4: Responds to task only minimally / tangentially. Format inappropriate. Position discernible but unclear. Main ideas difficult to identify; may be irrelevant, repetitive, or inaccurate.
Band 3: Does not adequately address any part. Does not express clear position. Few ideas, largely undeveloped or irrelevant.
Band 2: Barely responds to task. No clear position. Very few ideas, largely undeveloped.

=== COHERENCE AND COHESION ===
Band 9: Skilful paragraphing. Cohesion attracts no attention.
Band 8: Sequences information logically. All aspects of cohesion well-managed. Paragraphing used sufficiently and appropriately.
Band 7: Logically organises ideas with clear progression. Range of cohesive devices used appropriately, though may be over/under-use. Clear central topic in each paragraph.
Band 6: Arranges information coherently with clear overall progression. Cohesive devices used effectively but may be faulty or mechanical. Referencing may not always be clear. Paragraphing may not always be logical.
Band 5: Some organisation but lacks overall progression. Inadequate, inaccurate, or over-use of cohesive devices. Repetitive due to lack of referencing/substitution. Paragraphing inadequate or missing.
Band 4: Information not arranged coherently; no clear progression. Some basic cohesive devices used but inaccurately or repetitively. May not write in paragraphs or paragraphing confusing.
Band 3: Does not organise ideas logically. Very limited range of cohesive devices, often inaccurate.

=== LEXICAL RESOURCE ===
Band 9: Wide range, very natural, sophisticated control. Rare minor errors only as slips.
Band 8: Wide resource used fluently and flexibly. Uses uncommon items skilfully though with occasional inaccuracy. Rare errors in spelling/word formation.
Band 7: Sufficient range allowing flexibility and precision. Uses less common vocabulary with awareness of style and collocation. Occasional errors in word choice/collocation/spelling.
Band 6: Adequate range. Attempts less common vocabulary but with some inaccuracy. Some errors in spelling/word formation but they do not impede communication.
Band 5: Limited range but minimally adequate. Noticeable errors in spelling/word formation that may cause difficulty for the reader.
Band 4: Basic vocabulary which may be repetitive or inappropriate. Limited control of word formation/spelling — errors may cause strain.
Band 3: Very limited resource. Essentially no control of word formation/spelling.

=== GRAMMATICAL RANGE AND ACCURACY ===
Band 9: Wide range, full flexibility and accuracy. Rare slips only.
Band 8: Wide range. Majority of sentences error-free. Occasional non-systematic errors or inappropriacies.
Band 7: Variety of complex structures. Frequent error-free sentences. Good control though some errors persist.
Band 6: Mix of simple and complex sentence forms. Some errors in grammar/punctuation but rarely reduce communication.
Band 5: Limited range. Attempts complex sentences but tend to be less accurate than simple ones. Frequent grammatical errors that may cause some difficulty for reader. Punctuation may be faulty.
Band 4: Very limited range. Rarely uses subordinate clauses. Some accurate structures but errors predominate. Punctuation often faulty.
Band 3: Tries sentence forms but errors in grammar/punctuation predominate and distort meaning.

=== CRITICAL SCORING RULES ===
- Off-topic responses (the candidate writes about something other than the prompt) must be capped at Band 3 for Task Response, regardless of how good the English is.
- Memorised/template responses with no genuine engagement: cap Lexical Resource at Band 5.
- Do NOT inflate. If you find yourself wanting to give Band 7 across the board, ask: does this writing actually demonstrate "frequent error-free sentences" and "less common vocabulary used with awareness of collocation"? If not, it is Band 6.
- Bands 8-9 require near-native fluency. Be very strict.
- Score each criterion INDEPENDENTLY based on its own descriptor. Do not anchor all four to the same band.
`.trim();

const SYSTEM_PROMPT = `You are a certified IELTS Writing examiner with 10+ years of experience. You grade strictly and accurately following the official IELTS public band descriptors.

${BAND_DESCRIPTORS}

You MUST output ONLY valid JSON matching the requested schema. No markdown, no commentary outside JSON.`;

export async function evaluateEssay(
  taskPrompt: string,
  taskType: string | null,
  essayContent: string,
  minWords: number
): Promise<EssayEvaluation | null> {
  try {
    let ieltsTaskType: string;
    let ieltsModule: string;

    if (taskType === "report" || taskType === "academic_task1") {
      ieltsTaskType = "task1";
      ieltsModule = "academic";
    } else if (taskType === "letter" || taskType === "general_task1") {
      ieltsTaskType = "task1";
      ieltsModule = "general";
    } else {
      ieltsTaskType = "task2";
      ieltsModule = "academic";
    }

    const wordCount = countWords(essayContent);
    const underWordLimit = wordCount < minWords;

    const taskGuidance =
      ieltsTaskType === "task1"
        ? ieltsModule === "academic"
          ? `This is ACADEMIC TASK 1 (report describing visual data).
- Use criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- Candidate must summarise the main features, make comparisons, and identify trends. They should NOT include opinions.
- Recommended length: 150+ words. Time: 20 min.`
          : `This is GENERAL TRAINING TASK 1 (letter).
- Use criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- Candidate must address all bullet points, use appropriate tone (formal/semi-formal/informal as required), and use proper letter conventions (greeting, sign-off).
- Recommended length: 150+ words. Time: 20 min.`
        : `This is TASK 2 (essay).
- Use criteria: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- Candidate must present a clear position, develop main ideas with examples/reasons, and write a conclusion.
- Recommended length: 250+ words. Time: 40 min.`;

    const userPrompt = `TASK_TYPE: ${ieltsTaskType}
MODULE: ${ieltsModule}
WORD_COUNT: ${wordCount} (already counted, use this — do not recount)
MIN_WORDS: ${minWords}
UNDER_WORD_LIMIT: ${underWordLimit}

${taskGuidance}

PROMPT / QUESTION:
${taskPrompt}

CANDIDATE RESPONSE:
${essayContent}

EVALUATE NOW.

Step 1: Check if the response is on-topic. If clearly off-topic, set task_response.band ≤ 3 and explain in feedback.
Step 2: Score each of the 4 criteria INDEPENDENTLY using the band descriptors. Do not anchor all four to the same band.
Step 3: For each criterion, quote 2 short evidence phrases from the candidate's actual text.
Step 4: Compute overall_band as the arithmetic mean of the 4 criterion scores, rounded to the nearest 0.5.

OUTPUT REQUIREMENTS:
Return ONLY JSON with this exact schema:

{
  "task_type": "task1|task2",
  "module": "academic|general",
  "on_topic": boolean,
  "overall_band": number,
  "criterion_scores": {
    "task_achievement_or_response": number,
    "coherence_and_cohesion": number,
    "lexical_resource": number,
    "grammatical_range_and_accuracy": number
  },
  "summary": {
    "strengths": [string, string, string],
    "weaknesses": [string, string, string]
  },
  "criterion_feedback": {
    "task_achievement_or_response": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "coherence_and_cohesion": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "lexical_resource": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    },
    "grammatical_range_and_accuracy": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    }
  },
  "grammar_corrections": [
    {
      "original": string,
      "corrected": string,
      "issue": "article|preposition|tense|agreement|word_form|punctuation|sentence_structure|other",
      "explanation": string
    }
  ],
  "vocabulary_improvements": [
    { "original": string, "better": string, "reason": string }
  ],
  "cohesion_improvements": [
    { "problem": string, "fix": string }
  ],
  "vocabulary_complexity": {
    "cefr_level": "A1|A2|B1|B2|C1|C2",
    "label": "Basic|Elementary|Intermediate|Upper-Intermediate|Advanced|Intricate",
    "advice": string
  },
  "vocabulary_repetition": {
    "has_repetition": boolean,
    "message": string
  },
  "grammar_mistakes_count": number,
  "task_specific_notes": [string, string],
  "top_5_actions": [string, string, string, string, string]
}

ADDITIONAL RULES:
- evidence_quotes must be exact phrases from the candidate response, max 12 words each.
- grammar_corrections: 5-10 items unless the writing is exceptionally clean.
- vocabulary_complexity.label must match cefr_level (A1=Basic, A2=Elementary, B1=Intermediate, B2=Upper-Intermediate, C1=Advanced, C2=Intricate).
- vocabulary_repetition.message: one sentence, e.g. "No noticeable repetition" or "The word 'important' appears 7 times — try synonyms like 'crucial' or 'essential'."
- top_5_actions: concrete, actionable items the candidate can practise to raise their score.
- Be concise inside JSON strings — no long paragraphs.

Return ONLY JSON.`;

    const result = await geminiFlash.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const content = result.response.text();
    if (!content) return null;

    const parsed = JSON.parse(content);

    let taskAchievementScore = Number(parsed.criterion_scores?.task_achievement_or_response) || 0;
    let coherenceScore = Number(parsed.criterion_scores?.coherence_and_cohesion) || 0;
    let lexicalScore = Number(parsed.criterion_scores?.lexical_resource) || 0;
    let grammarScore = Number(parsed.criterion_scores?.grammatical_range_and_accuracy) || 0;

    // Enforce official IELTS under-length penalty in code:
    // Under the minimum word count, Task Achievement/Response cannot exceed Band 5.
    if (underWordLimit) {
      if (taskAchievementScore > 5) {
        taskAchievementScore = 5;
        if (parsed.criterion_feedback?.task_achievement_or_response) {
          parsed.criterion_feedback.task_achievement_or_response.band = 5;
          const note = `Response is under the ${minWords}-word minimum (${wordCount} words) — Task ${ieltsTaskType === "task1" ? "Achievement" : "Response"} capped at Band 5 per official IELTS rules.`;
          parsed.criterion_feedback.task_achievement_or_response.feedback = [
            note,
            ...(parsed.criterion_feedback.task_achievement_or_response.feedback || []).slice(0, 1),
          ];
        }
      }
      parsed.under_word_limit = true;
    }

    // Recompute overall band from (possibly capped) criterion scores.
    const overallBandScore = roundToNearestHalf(
      (taskAchievementScore + coherenceScore + lexicalScore + grammarScore) / 4
    );

    parsed.criterion_scores = {
      task_achievement_or_response: taskAchievementScore,
      coherence_and_cohesion: coherenceScore,
      lexical_resource: lexicalScore,
      grammatical_range_and_accuracy: grammarScore,
    };
    parsed.overall_band = overallBandScore;
    parsed.word_count = wordCount;

    return {
      taskAchievementScore,
      coherenceScore,
      lexicalScore,
      grammarScore,
      overallBandScore,
      feedback: JSON.stringify(parsed),
    };
  } catch (error) {
    console.error("Essay evaluation failed:", error);
    return null;
  }
}
