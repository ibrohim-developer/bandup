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

export async function evaluateEssay(
  taskPrompt: string,
  taskType: string | null,
  essayContent: string,
  minWords: number
): Promise<EssayEvaluation | null> {
  try {
    // Map DB task types to IELTS task type and module
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

    const systemPrompt = `You are an IELTS Writing examiner. You grade fairly and realistically.

You MUST follow official IELTS band descriptors style:
- Give criterion scores (Band 1–9) and an Overall Band (rounded to nearest 0.5).
- Provide specific, actionable feedback with examples from the candidate's writing.
- Be consistent: do not inflate scores.
- If the writing is under the minimum word count, clearly note that it will be penalized.

You must output ONLY valid JSON that matches the requested schema. No markdown.`;

    const userPrompt = `TASK_TYPE: ${ieltsTaskType}
MODULE: ${ieltsModule}

PROMPT / QUESTION:
${taskPrompt}

CANDIDATE RESPONSE:
${essayContent}

Now evaluate using the correct IELTS criteria:

If TASK_TYPE = "task1":
- If MODULE = "academic": use Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar Range & Accuracy.
- If MODULE = "general": use Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar Range & Accuracy, and also comment on tone/formality and letter conventions.
- Minimum word count is ${minWords}. If under ${minWords}, mention penalty risk.

If TASK_TYPE = "task2":
- Use Task Response, Coherence & Cohesion, Lexical Resource, Grammar Range & Accuracy.
- Minimum word count is ${minWords}. If under ${minWords}, mention penalty risk.

OUTPUT REQUIREMENTS:
Return ONLY JSON with this exact schema:

{
  "task_type": "task1|task2",
  "module": "academic|general|unknown",
  "word_count": number,
  "under_word_limit": boolean,
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
    {
      "original": string,
      "better": string,
      "reason": string
    }
  ],
  "cohesion_improvements": [
    {
      "problem": string,
      "fix": string
    }
  ],
  "task_specific_notes": [string, string],
  "top_5_actions": [string, string, string, string, string]
}

RULES:
- Calculate word_count from CANDIDATE RESPONSE.
- overall_band = average of the four criterion scores, rounded to nearest 0.5.
- evidence_quotes must be short exact phrases (max ~12 words each) taken from the candidate response.
- grammar_corrections: provide 5–10 items (fewer if the writing is very clean).
- Be concise: avoid long paragraphs inside JSON strings.
- If TASK_TYPE or MODULE is unclear, set "module":"unknown" but still grade using the closest match based on content (letter vs report vs essay).
Return ONLY JSON.`;

    const result = await geminiFlash.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { role: "model", parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const content = result.response.text();
    if (!content) return null;

    const parsed = JSON.parse(content);

    const scores = parsed.criterion_scores;
    const taskAchievementScore = Number(scores?.task_achievement_or_response) || 0;
    const coherenceScore = Number(scores?.coherence_and_cohesion) || 0;
    const lexicalScore = Number(scores?.lexical_resource) || 0;
    const grammarScore = Number(scores?.grammatical_range_and_accuracy) || 0;

    const overallBandScore = Number(parsed.overall_band) || roundToNearestHalf(
      (taskAchievementScore + coherenceScore + lexicalScore + grammarScore) / 4
    );

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
