import { geminiFlash } from "./gemini";

export interface SpeakingEvaluation {
  transcript: string;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallBandScore: number;
  feedback: Record<string, unknown>;
}

function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export async function evaluateSpeaking(
  questionText: string,
  topicName: string,
  partNumber: number,
  audioBuffer: Buffer
): Promise<SpeakingEvaluation | null> {
  try {
    const base64Audio = audioBuffer.toString("base64");

    const systemPrompt = `You are an IELTS Speaking examiner. You will receive an audio recording of a candidate answering an IELTS Speaking question.

Your tasks:
1. Transcribe the audio accurately.
2. Evaluate using the four official IELTS Speaking criteria:
   - Fluency and Coherence
   - Lexical Resource
   - Grammatical Range and Accuracy
   - Pronunciation
3. Give band scores (1-9) for each criterion and an overall band (rounded to nearest 0.5).
4. Provide specific, actionable feedback with examples from the candidate's speech.

Be fair and realistic — do not inflate scores. If audio is silent or unintelligible, give band 0 and note the issue.

Output ONLY valid JSON matching the requested schema. No markdown.`;

    const userPrompt = `IELTS SPEAKING PART ${partNumber}
TOPIC: ${topicName}
QUESTION: ${questionText}

Listen to the audio recording and evaluate.

OUTPUT JSON SCHEMA:
{
  "transcript": "full transcription of the candidate's speech",
  "word_count": number,
  "overall_band": number,
  "criterion_scores": {
    "fluency_and_coherence": number,
    "lexical_resource": number,
    "grammatical_range_and_accuracy": number,
    "pronunciation": number
  },
  "summary": {
    "strengths": [string, string, string],
    "weaknesses": [string, string, string]
  },
  "criterion_feedback": {
    "fluency_and_coherence": {
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
    },
    "pronunciation": {
      "band": number,
      "feedback": [string, string],
      "evidence_quotes": [string, string]
    }
  },
  "grammar_corrections": [
    { "original": string, "corrected": string, "explanation": string }
  ],
  "vocabulary_improvements": [
    { "original": string, "better": string, "reason": string }
  ],
  "pronunciation_notes": [
    { "word": string, "issue": string, "suggestion": string }
  ],
  "top_5_actions": [string, string, string, string, string]
}

RULES:
- Transcribe the audio as accurately as possible.
- overall_band = average of 4 criterion scores, rounded to nearest 0.5.
- evidence_quotes must be short exact phrases from the transcript.
- grammar_corrections: 3-8 items.
- Be concise.
Return ONLY JSON.`;

    const result = await geminiFlash.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "audio/webm",
                data: base64Audio,
              },
            },
            { text: userPrompt },
          ],
        },
      ],
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
    const fluencyScore = Number(scores?.fluency_and_coherence) || 0;
    const lexicalScore = Number(scores?.lexical_resource) || 0;
    const grammarScore = Number(scores?.grammatical_range_and_accuracy) || 0;
    const pronunciationScore = Number(scores?.pronunciation) || 0;

    const overallBandScore =
      Number(parsed.overall_band) ||
      roundToNearestHalf(
        (fluencyScore + lexicalScore + grammarScore + pronunciationScore) / 4
      );

    return {
      transcript: parsed.transcript || "",
      fluencyScore,
      lexicalScore,
      grammarScore,
      pronunciationScore,
      overallBandScore,
      feedback: parsed,
    };
  } catch (error) {
    console.error("Speaking evaluation failed:", error);
    return null;
  }
}
